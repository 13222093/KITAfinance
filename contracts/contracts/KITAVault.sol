// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./interfaces/IOptionBook.sol";
import "./interfaces/IAave.sol";

/**
 * @title KITAVault
 * @notice Solo vault for KITA - "Kolektif Investasi Tanpa Ambyar"
 * @dev Integrates with Thetanuts V4 OptionBook for options trading
 * 
 * Core Feature: Cash-Secured Put ("Beli Murah Dapat Cashback")
 * - User deposits USDC and selects a PUT order from Thetanuts
 * - User receives premium instantly (cashback)
 * - Collateral deposited to Aave for additional yield
 * - Two outcomes:
 *   1. Price drops to strike → User buys asset at target price
 *   2. Price stays above → User keeps premium + yield
 */
contract KITAVault is ReentrancyGuard, Ownable, Pausable {
    using SafeERC20 for IERC20;

    // ============ Structs ============

    struct Position {
        address user;               // Position owner
        address optionContract;     // Deployed option contract from fillOrder
        uint256 collateralAmount;   // USDC amount deposited
        uint256 premiumReceived;    // Cashback received (in USDC, calculated off-chain)
        uint256 strikePrice;        // Strike price (8 decimals)
        uint256 expiry;             // Option expiry timestamp
        bool isCall;                // true = call, false = put
        bool isLong;                // true = buying, false = selling
        bool isActive;              // Position status
        uint256 aaveShares;         // Aave aToken balance (for yield tracking)
        uint256 createdAt;          // Position creation timestamp
    }

    // ============ State Variables ============

    // Thetanuts V4 OptionBook
    IOptionBook public immutable optionBook;
    
    // Collateral token (USDC on Base)
    IERC20 public immutable collateralToken;
    
    // Aave pool for yield stacking
    IAave public aavePool;
    
    // Platform referrer address (for fee tracking on Thetanuts)
    address public referrer;

    // User positions: user => positions[]
    mapping(address => Position[]) public userPositions;
    
    // Position count per option contract (for tracking)
    mapping(address => uint256) public optionPositionCount;

    // Global stats
    uint256 public totalPositionsCreated;
    uint256 public totalValueLocked;
    uint256 public totalPremiumDistributed;

    // Fee configuration (in basis points, 100 = 1%)
    uint256 public platformFee = 500; // 5% of premium
    uint256 public constant MAX_FEE = 2000; // Max 20%
    uint256 public collectedFees;

    // Minimum position parameters
    uint256 public minCollateral = 1e6; // 1 USDC minimum (6 decimals)

    // ============ Events ============

    event PositionCreated(
        address indexed user,
        uint256 indexed positionId,
        address optionContract,
        uint256 collateral,
        uint256 premium,
        uint256 strikePrice,
        uint256 expiry,
        bool isCall,
        bool isLong
    );

    event PositionClosed(
        address indexed user,
        uint256 indexed positionId,
        uint256 collateralReturned,
        uint256 yieldEarned
    );

    event PositionSettled(
        address indexed user,
        uint256 indexed positionId,
        uint256 payout
    );

    event FeeUpdated(uint256 newFee);
    event FeesWithdrawn(address indexed recipient, uint256 amount);
    event ReferrerUpdated(address indexed newReferrer);
    event AavePoolUpdated(address indexed newPool);

    // ============ Constructor ============

    /**
     * @notice Initialize the KITA Vault
     * @param _optionBook Thetanuts V4 OptionBook address
     * @param _collateralToken USDC token address
     * @param _aavePool Aave pool address
     * @param _referrer Platform referrer address for fee tracking
     */
    constructor(
        address _optionBook,
        address _collateralToken,
        address _aavePool,
        address _referrer
    ) Ownable(msg.sender) {
        require(_optionBook != address(0), "Invalid OptionBook");
        require(_collateralToken != address(0), "Invalid collateral token");
        
        optionBook = IOptionBook(_optionBook);
        collateralToken = IERC20(_collateralToken);
        aavePool = IAave(_aavePool);
        referrer = _referrer;
    }

    // ============ Main Functions ============

    /**
     * @notice Execute a Thetanuts order and create a position
     * @param order The order struct from Thetanuts API
     * @param signature The maker's EIP-712 signature
     * @param collateralAmount Amount of USDC to use
     * @param expectedPremium Expected premium (for slippage protection)
     * @return positionId The ID of the created position
     * 
     * @dev Flow:
     * 1. Transfer USDC from user
     * 2. Approve OptionBook to spend USDC
     * 3. Call fillOrder on OptionBook
     * 4. Calculate and distribute premium
     * 5. Deposit remaining to Aave for yield
     * 6. Create position record
     */
    function executeOrder(
        IOptionBook.Order calldata order,
        bytes calldata signature,
        uint256 collateralAmount,
        uint256 expectedPremium
    ) external nonReentrant whenNotPaused returns (uint256 positionId) {
        require(collateralAmount >= minCollateral, "Below minimum collateral");
        require(order.collateral == address(collateralToken), "Wrong collateral token");
        
        // Transfer collateral from user
        collateralToken.safeTransferFrom(msg.sender, address(this), collateralAmount);

        // Approve OptionBook to spend collateral
        collateralToken.approve(address(optionBook), collateralAmount);

        // IMPORTANT: Do NOT modify order fields - signature will break!
        // The order must be passed exactly as received from the API
        // numContracts should already be set correctly by the frontend
        
        // Execute on Thetanuts
        address optionContract = optionBook.fillOrder(order, signature, referrer);
        require(optionContract != address(0), "fillOrder failed");

        // Calculate premium (price per contract * num contracts / 1e8 for decimals)
        // Note: User PAYS this amount to buy the option (for long positions)
        // For short positions (selling puts), user RECEIVES this as premium
        uint256 grossPremium = (order.price * order.numContracts) / 1e8;
        
        // Slippage check
        require(grossPremium >= expectedPremium * 95 / 100, "Premium slippage too high");
        
        // Ensure collateral covers premium (Bug #1 fix)
        require(collateralAmount >= grossPremium, "Insufficient collateral for premium");

        // Platform fee
        uint256 fee = (grossPremium * platformFee) / 10000;
        uint256 netPremium = grossPremium - fee;
        collectedFees += fee;
        totalPremiumDistributed += netPremium;

        // Deposit remaining collateral to Aave for yield (if Aave is configured)
        uint256 aaveShares = 0;
        uint256 remainingCollateral = collateralAmount - grossPremium;
        if (address(aavePool) != address(0) && remainingCollateral > 0) {
            aaveShares = _depositToAave(remainingCollateral);
        }

        // Create position
        positionId = userPositions[msg.sender].length;
        userPositions[msg.sender].push(Position({
            user: msg.sender,
            optionContract: optionContract,
            collateralAmount: collateralAmount,
            premiumReceived: netPremium,
            strikePrice: order.strikes.length > 0 ? order.strikes[0] : 0,
            expiry: order.expiry,
            isCall: order.isCall,
            isLong: order.isLong,
            isActive: true,
            aaveShares: aaveShares,
            createdAt: block.timestamp
        }));

        // Update stats
        totalPositionsCreated++;
        totalValueLocked += collateralAmount;
        optionPositionCount[optionContract]++;

        // Send premium to user immediately (instant cashback!)
        if (netPremium > 0) {
            collateralToken.safeTransfer(msg.sender, netPremium);
        }

        emit PositionCreated(
            msg.sender,
            positionId,
            optionContract,
            collateralAmount,
            netPremium,
            order.strikes.length > 0 ? order.strikes[0] : 0,
            order.expiry,
            order.isCall,
            order.isLong
        );
    }

    /**
     * @notice Close a position after expiry
     * @param positionId The position index to close
     */
    function closePosition(uint256 positionId) external nonReentrant whenNotPaused {
        require(positionId < userPositions[msg.sender].length, "Invalid position");
        Position storage position = userPositions[msg.sender][positionId];
        
        require(position.isActive, "Position not active");
        require(position.user == msg.sender, "Not owner");
        require(block.timestamp >= position.expiry, "Not expired");

        // Withdraw from Aave
        uint256 withdrawn = 0;
        if (position.aaveShares > 0 && address(aavePool) != address(0)) {
            withdrawn = _withdrawFromAave(position.aaveShares);
        }

        uint256 yieldEarned = withdrawn > (position.collateralAmount - position.premiumReceived)
            ? withdrawn - (position.collateralAmount - position.premiumReceived)
            : 0;

        // Mark closed
        position.isActive = false;
        totalValueLocked -= position.collateralAmount;

        // Return funds
        if (withdrawn > 0) {
            collateralToken.safeTransfer(msg.sender, withdrawn);
        }

        emit PositionClosed(msg.sender, positionId, withdrawn, yieldEarned);
    }

    // ============ View Functions ============

    /**
     * @notice Get all positions for a user
     */
    function getUserPositions(address user) external view returns (Position[] memory) {
        return userPositions[user];
    }

    /**
     * @notice Get active positions for a user
     */
    function getActivePositions(address user) external view returns (Position[] memory) {
        Position[] memory all = userPositions[user];
        uint256 activeCount = 0;
        
        for (uint256 i = 0; i < all.length; i++) {
            if (all[i].isActive) activeCount++;
        }
        
        Position[] memory active = new Position[](activeCount);
        uint256 idx = 0;
        for (uint256 i = 0; i < all.length; i++) {
            if (all[i].isActive) {
                active[idx++] = all[i];
            }
        }
        return active;
    }

    /**
     * @notice Get total premium earned by a user
     */
    function getTotalPremiumEarned(address user) external view returns (uint256 total) {
        Position[] memory positions = userPositions[user];
        for (uint256 i = 0; i < positions.length; i++) {
            total += positions[i].premiumReceived;
        }
    }

    /**
     * @notice Get position count for a user
     */
    function getPositionCount(address user) external view returns (uint256) {
        return userPositions[user].length;
    }

    // ============ Internal Functions ============

    /**
     * @notice Calculate number of contracts based on collateral and price
     */
    function _calculateContracts(uint256 collateral, uint256 pricePerContract) 
        internal 
        pure 
        returns (uint256) 
    {
        // price is in 8 decimals, collateral in 6 decimals (USDC)
        // numContracts = collateral * 1e8 / price, then scale to 6 decimals
        return (collateral * 1e8) / pricePerContract;
    }

    /**
     * @notice Deposit to Aave for yield
     */
    function _depositToAave(uint256 amount) internal returns (uint256 shares) {
        collateralToken.approve(address(aavePool), amount);
        try aavePool.supply(address(collateralToken), amount, address(this), 0) {
            return amount; // Simplified - in production query aToken balance
        } catch {
            return 0; // If Aave fails, keep in vault
        }
    }

    /**
     * @notice Withdraw from Aave
     */
    function _withdrawFromAave(uint256 shares) internal returns (uint256 withdrawn) {
        try aavePool.withdraw(address(collateralToken), shares, address(this)) returns (uint256 amount) {
            return amount;
        } catch {
            return 0;
        }
    }

    // ============ Admin Functions ============

    function updateFee(uint256 newFee) external onlyOwner {
        require(newFee <= MAX_FEE, "Fee too high");
        platformFee = newFee;
        emit FeeUpdated(newFee);
    }

    function withdrawFees(address recipient) external onlyOwner {
        require(recipient != address(0), "Invalid recipient");
        uint256 amount = collectedFees;
        collectedFees = 0;
        collateralToken.safeTransfer(recipient, amount);
        emit FeesWithdrawn(recipient, amount);
    }

    function updateReferrer(address newReferrer) external onlyOwner {
        referrer = newReferrer;
        emit ReferrerUpdated(newReferrer);
    }

    function updateAavePool(address newPool) external onlyOwner {
        aavePool = IAave(newPool);
        emit AavePoolUpdated(newPool);
    }

    function updateMinCollateral(uint256 newMin) external onlyOwner {
        minCollateral = newMin;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Emergency withdraw (only if something goes wrong)
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).safeTransfer(owner(), amount);
    }

    /**
     * @notice Claim referral fees from Thetanuts
     */
    function claimThetanutsFees() external onlyOwner {
        optionBook.claimFees(address(collateralToken));
    }
}
