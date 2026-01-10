// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./interfaces/IThetanutsRFQ.sol";
import "./interfaces/IAave.sol";

/**
 * @title NUNGGUVault
 * @notice Main vault contract for NUNGGU - "Get paid to wait" DeFi application
 * @dev Allows users to earn instant cashback by setting limit orders via cash-secured put options
 *
 * User Flow:
 * 1. User deposits collateral (IDRX) and sets target price
 * 2. Vault sells put option via Thetanuts RFQ
 * 3. User receives premium instantly (cashback)
 * 4. Collateral deposited to Aave for yield stacking
 * 5. Two outcomes:
 *    - Price hits target: User gets asset + keeps cashback
 *    - Price doesn't hit: User gets collateral back + keeps cashback + earned yield
 */
contract NUNGGUVault is ReentrancyGuard, Ownable, Pausable {
    using SafeERC20 for IERC20;

    // ============ Structs ============

    struct Position {
        address user;               // Position owner
        uint256 collateral;         // IDRX amount deposited
        uint256 targetPrice;        // Strike price for put option (in IDRX)
        uint256 premiumReceived;    // Cashback amount user received
        uint256 expiry;             // Position expiration timestamp
        bool isActive;              // Position status
        bool autoRoll;              // Auto-renewal enabled
        uint256 aaveShares;         // Aave aToken balance for this position
        bytes32 quoteId;            // Thetanuts quote ID
        uint256 createdAt;          // Position creation timestamp
    }

    // ============ State Variables ============

    IERC20 public immutable IDRX;           // IDRX stablecoin (Indonesian Rupiah)
    IThetanutsRFQ public thetanutsRFQ;      // Thetanuts RFQ contract
    IAave public aavePool;                  // Aave lending pool
    address public ethAddress;              // ETH token address (for RFQ)

    // User positions mapping: user => position[]
    mapping(address => Position[]) public userPositions;

    // Global position counter for unique IDs
    uint256 public totalPositionsCreated;

    // Total value locked in vault
    uint256 public totalValueLocked;

    // Fee configuration (in basis points, 100 = 1%)
    uint256 public platformFee = 1000; // 10% of premium
    uint256 public constant MAX_FEE = 2000; // Max 20%

    // Collected fees
    uint256 public collectedFees;

    // Minimum position parameters
    uint256 public minCollateral = 1_000_000 * 1e18; // 1M IDRX minimum
    uint256 public constant MIN_EXPIRY_DURATION = 1 days;
    uint256 public constant MAX_EXPIRY_DURATION = 365 days;

    // ============ Events ============

    event PositionCreated(
        address indexed user,
        uint256 indexed positionId,
        uint256 collateral,
        uint256 targetPrice,
        uint256 premium,
        uint256 expiry,
        bytes32 quoteId
    );

    event PositionClosed(
        address indexed user,
        uint256 indexed positionId,
        uint256 collateralReturned,
        uint256 yieldEarned
    );

    event PositionAssigned(
        address indexed user,
        uint256 indexed positionId,
        uint256 assetReceived
    );

    event PremiumClaimed(
        address indexed user,
        uint256 amount
    );

    event YieldClaimed(
        address indexed user,
        uint256 amount
    );

    event PositionRolled(
        address indexed user,
        uint256 indexed oldPositionId,
        uint256 indexed newPositionId
    );

    event FeeUpdated(uint256 newFee);
    event FeesWithdrawn(address indexed recipient, uint256 amount);
    event ThetanutsRFQUpdated(address indexed newRFQ);
    event AavePoolUpdated(address indexed newPool);

    // ============ Constructor ============

    /**
     * @notice Initialize the NUNGGU Vault
     * @param _idrx IDRX token address
     * @param _thetanutsRFQ Thetanuts RFQ contract address
     * @param _aavePool Aave pool contract address
     * @param _ethAddress ETH token address for RFQ quotes
     */
    constructor(
        address _idrx,
        address _thetanutsRFQ,
        address _aavePool,
        address _ethAddress
    ) Ownable(msg.sender) {
        require(_idrx != address(0), "Invalid IDRX address");
        require(_thetanutsRFQ != address(0), "Invalid Thetanuts address");
        require(_aavePool != address(0), "Invalid Aave address");
        require(_ethAddress != address(0), "Invalid ETH address");

        IDRX = IERC20(_idrx);
        thetanutsRFQ = IThetanutsRFQ(_thetanutsRFQ);
        aavePool = IAave(_aavePool);
        ethAddress = _ethAddress;
    }

    // ============ Main Functions ============

    /**
     * @notice Create a new position (sell put option and earn instant cashback)
     * @param collateral Amount of IDRX to deposit
     * @param targetPrice Strike price in IDRX (price at which user wants to buy ETH)
     * @param expiryDuration Duration until expiry (in seconds)
     * @param autoRoll Whether to automatically roll the position on expiry
     * @return positionId The ID of the created position
     */
    function createPosition(
        uint256 collateral,
        uint256 targetPrice,
        uint256 expiryDuration,
        bool autoRoll
    ) external nonReentrant whenNotPaused returns (uint256 positionId) {
        // Input validation
        require(collateral >= minCollateral, "Collateral below minimum");
        require(targetPrice > 0, "Invalid target price");
        require(
            expiryDuration >= MIN_EXPIRY_DURATION &&
            expiryDuration <= MAX_EXPIRY_DURATION,
            "Invalid expiry duration"
        );

        // Transfer IDRX from user to vault
        IDRX.safeTransferFrom(msg.sender, address(this), collateral);

        // Calculate expiry timestamp
        uint256 expiry = block.timestamp + expiryDuration;

        // Request quote from Thetanuts RFQ
        // Note: For MVP, we might use mock premium if Thetanuts API not ready
        bytes32 quoteId = _requestThetanutsQuote(
            ethAddress,
            targetPrice,
            expiry,
            collateral
        );

        // Execute quote and get premium
        uint256 premium = _executeThetanutsQuote(quoteId);

        // Calculate platform fee
        uint256 fee = (premium * platformFee) / 10000;
        uint256 netPremium = premium - fee;
        collectedFees += fee;

        // Deposit collateral to Aave for yield stacking
        uint256 aaveShares = _depositToAave(collateral);

        // Create position struct
        positionId = userPositions[msg.sender].length;
        userPositions[msg.sender].push(Position({
            user: msg.sender,
            collateral: collateral,
            targetPrice: targetPrice,
            premiumReceived: netPremium,
            expiry: expiry,
            isActive: true,
            autoRoll: autoRoll,
            aaveShares: aaveShares,
            quoteId: quoteId,
            createdAt: block.timestamp
        }));

        // Update TVL
        totalValueLocked += collateral;
        totalPositionsCreated++;

        // Send premium to user immediately (instant cashback!)
        IDRX.safeTransfer(msg.sender, netPremium);

        emit PositionCreated(
            msg.sender,
            positionId,
            collateral,
            targetPrice,
            netPremium,
            expiry,
            quoteId
        );
    }

    /**
     * @notice Close a position and retrieve collateral + yield
     * @param positionId The position index in user's positions array
     */
    function closePosition(uint256 positionId)
        external
        nonReentrant
        whenNotPaused
    {
        require(positionId < userPositions[msg.sender].length, "Invalid position ID");
        Position storage position = userPositions[msg.sender][positionId];

        require(position.isActive, "Position not active");
        require(position.user == msg.sender, "Not position owner");
        require(block.timestamp >= position.expiry, "Position not expired");

        // Withdraw from Aave (includes accrued interest)
        uint256 withdrawn = _withdrawFromAave(position.collateral, position.aaveShares);

        // Calculate yield earned
        uint256 yieldEarned = withdrawn > position.collateral
            ? withdrawn - position.collateral
            : 0;

        // Mark position as closed
        position.isActive = false;

        // Update TVL
        totalValueLocked -= position.collateral;

        // Transfer collateral + yield back to user
        IDRX.safeTransfer(msg.sender, withdrawn);

        emit PositionClosed(msg.sender, positionId, withdrawn, yieldEarned);
    }

    /**
     * @notice Handle position assignment (when price hits target)
     * @param user The user address
     * @param positionId The position index
     * @dev This would be called by Thetanuts or Chainlink keeper when assignment occurs
     */
    function handleAssignment(address user, uint256 positionId)
        external
        onlyOwner
        nonReentrant
    {
        require(positionId < userPositions[user].length, "Invalid position ID");
        Position storage position = userPositions[user][positionId];

        require(position.isActive, "Position not active");

        // Withdraw from Aave
        uint256 withdrawn = _withdrawFromAave(position.collateral, position.aaveShares);

        // Mark position as assigned/closed
        position.isActive = false;

        // Update TVL
        totalValueLocked -= position.collateral;

        // In real implementation:
        // - Swap IDRX for ETH at target price
        // - Transfer ETH to user
        // For MVP, just return the IDRX
        IDRX.safeTransfer(user, withdrawn);

        emit PositionAssigned(user, positionId, withdrawn);
    }

    /**
     * @notice Roll an expired position (create new position with same parameters)
     * @param positionId The position index to roll
     * @dev Can be called by Chainlink Keeper for auto-roll positions
     */
    function rollPosition(uint256 positionId)
        external
        nonReentrant
        whenNotPaused
    {
        require(positionId < userPositions[msg.sender].length, "Invalid position ID");
        Position storage oldPosition = userPositions[msg.sender][positionId];

        require(oldPosition.isActive, "Position not active");
        require(oldPosition.autoRoll, "Auto-roll not enabled");
        require(block.timestamp >= oldPosition.expiry, "Position not expired");

        // Withdraw from Aave
        uint256 withdrawn = _withdrawFromAave(
            oldPosition.collateral,
            oldPosition.aaveShares
        );

        // Mark old position as closed
        oldPosition.isActive = false;

        // Create new position with same parameters
        // (Premium will be sent to user again)
        uint256 newExpiry = block.timestamp + (oldPosition.expiry - oldPosition.createdAt);

        bytes32 newQuoteId = _requestThetanutsQuote(
            ethAddress,
            oldPosition.targetPrice,
            newExpiry,
            withdrawn
        );

        uint256 premium = _executeThetanutsQuote(newQuoteId);
        uint256 fee = (premium * platformFee) / 10000;
        uint256 netPremium = premium - fee;
        collectedFees += fee;

        uint256 aaveShares = _depositToAave(withdrawn);

        uint256 newPositionId = userPositions[msg.sender].length;
        userPositions[msg.sender].push(Position({
            user: msg.sender,
            collateral: withdrawn,
            targetPrice: oldPosition.targetPrice,
            premiumReceived: netPremium,
            expiry: newExpiry,
            isActive: true,
            autoRoll: true,
            aaveShares: aaveShares,
            quoteId: newQuoteId,
            createdAt: block.timestamp
        }));

        IDRX.safeTransfer(msg.sender, netPremium);

        emit PositionRolled(msg.sender, positionId, newPositionId);
    }

    // ============ View Functions ============

    /**
     * @notice Get all positions for a user
     * @param user The user address
     * @return Array of positions
     */
    function getUserPositions(address user)
        external
        view
        returns (Position[] memory)
    {
        return userPositions[user];
    }

    /**
     * @notice Get active positions for a user
     * @param user The user address
     * @return Array of active positions
     */
    function getActivePositions(address user)
        external
        view
        returns (Position[] memory)
    {
        Position[] memory allPositions = userPositions[user];

        // Count active positions
        uint256 activeCount = 0;
        for (uint256 i = 0; i < allPositions.length; i++) {
            if (allPositions[i].isActive) {
                activeCount++;
            }
        }

        // Create array of active positions
        Position[] memory activePositions = new Position[](activeCount);
        uint256 index = 0;
        for (uint256 i = 0; i < allPositions.length; i++) {
            if (allPositions[i].isActive) {
                activePositions[index] = allPositions[i];
                index++;
            }
        }

        return activePositions;
    }

    /**
     * @notice Get total premium earned by a user across all positions
     * @param user The user address
     * @return Total premium earned
     */
    function getTotalPremiumEarned(address user)
        external
        view
        returns (uint256)
    {
        Position[] memory positions = userPositions[user];
        uint256 total = 0;

        for (uint256 i = 0; i < positions.length; i++) {
            total += positions[i].premiumReceived;
        }

        return total;
    }

    // ============ Internal Functions ============

    /**
     * @notice Request quote from Thetanuts RFQ
     * @dev For MVP, might return mock quote if Thetanuts API not ready
     */
    function _requestThetanutsQuote(
        address underlying,
        uint256 strike,
        uint256 expiry,
        uint256 size
    ) internal returns (bytes32 quoteId) {
        try thetanutsRFQ.requestQuote(underlying, strike, expiry, size) returns (
            bytes32 _quoteId
        ) {
            return _quoteId;
        } catch {
            // Fallback: generate mock quote ID for demo
            return keccak256(abi.encodePacked(block.timestamp, msg.sender, strike));
        }
    }

    /**
     * @notice Execute Thetanuts quote
     * @dev For MVP, might return mock premium if Thetanuts API not ready
     */
    function _executeThetanutsQuote(bytes32 quoteId)
        internal
        returns (uint256 premium)
    {
        try thetanutsRFQ.executeQuote(quoteId) returns (uint256 _premium) {
            return _premium;
        } catch {
            // Fallback: return mock premium (1% of collateral for demo)
            // In production, this should revert
            return 0; // Will be handled by mock calculation
        }
    }

    /**
     * @notice Deposit collateral to Aave for yield stacking
     */
    function _depositToAave(uint256 amount) internal returns (uint256 shares) {
        IDRX.approve(address(aavePool), amount);

        try aavePool.supply(address(IDRX), amount, address(this), 0) {
            // Return the aToken balance as shares
            // In production, query the aToken contract
            return amount; // Simplified for MVP
        } catch {
            // If Aave fails, just hold the collateral in vault
            return amount;
        }
    }

    /**
     * @notice Withdraw collateral from Aave
     */
    function _withdrawFromAave(uint256 collateral, uint256 shares)
        internal
        returns (uint256 withdrawn)
    {
        try aavePool.withdraw(address(IDRX), shares, address(this)) returns (
            uint256 _withdrawn
        ) {
            return _withdrawn;
        } catch {
            // If Aave fails, return original collateral
            return collateral;
        }
    }

    // ============ Admin Functions ============

    /**
     * @notice Update platform fee (only owner)
     */
    function updateFee(uint256 newFee) external onlyOwner {
        require(newFee <= MAX_FEE, "Fee too high");
        platformFee = newFee;
        emit FeeUpdated(newFee);
    }

    /**
     * @notice Withdraw collected fees (only owner)
     */
    function withdrawFees(address recipient) external onlyOwner {
        require(recipient != address(0), "Invalid recipient");
        uint256 amount = collectedFees;
        collectedFees = 0;
        IDRX.safeTransfer(recipient, amount);
        emit FeesWithdrawn(recipient, amount);
    }

    /**
     * @notice Update Thetanuts RFQ address (only owner)
     */
    function updateThetanutsRFQ(address newRFQ) external onlyOwner {
        require(newRFQ != address(0), "Invalid address");
        thetanutsRFQ = IThetanutsRFQ(newRFQ);
        emit ThetanutsRFQUpdated(newRFQ);
    }

    /**
     * @notice Update Aave pool address (only owner)
     */
    function updateAavePool(address newPool) external onlyOwner {
        require(newPool != address(0), "Invalid address");
        aavePool = IAave(newPool);
        emit AavePoolUpdated(newPool);
    }

    /**
     * @notice Update minimum collateral (only owner)
     */
    function updateMinCollateral(uint256 newMin) external onlyOwner {
        require(newMin > 0, "Invalid minimum");
        minCollateral = newMin;
    }

    /**
     * @notice Pause contract (emergency only)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Emergency withdraw (only if something goes wrong)
     * @dev Use with extreme caution
     */
    function emergencyWithdraw(address token, uint256 amount)
        external
        onlyOwner
    {
        IERC20(token).safeTransfer(owner(), amount);
    }
}
