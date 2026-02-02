// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IOptionBook.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title MockOptionBook
 * @notice Mock implementation of Thetanuts V4 OptionBook for testing
 * @dev Always accepts fillOrder calls and returns a mock option address
 * 
 * This allows the full KITAVault flow to work on testnet without real
 * Thetanuts market maker orders.
 */
contract MockOptionBook is IOptionBook {
    using SafeERC20 for IERC20;

    // Counter for generating unique option addresses
    uint256 private _optionCounter;

    // Track all filled orders
    mapping(address => uint256) public filledOrderCount;
    
    // Referrer fees (for testing claimFees)
    mapping(address => mapping(address => uint256)) private _fees;

    // Events for debugging
    event MockOrderFilled(
        address indexed taker,
        address indexed maker,
        address optionAddress,
        uint256 numContracts,
        uint256 collateralUsed
    );

    /**
     * @notice Fill an order (mock implementation)
     * @dev Always succeeds and returns a deterministic "option address"
     * @param order The order struct (we just read values for events)
     * @param signature Ignored in mock
     * @param referrer Recorded for fee tracking
     * @return optionAddress A mock option address based on counter
     */
    function fillOrder(
        Order calldata order,
        bytes calldata signature,
        address referrer
    ) external override returns (address optionAddress) {
        // Silence unused variable warning
        signature;
        
        // Calculate collateral required (price * numContracts, scaled)
        // In real Thetanuts: collateral = (price * numContracts) / 1e8
        uint256 collateralRequired = (order.price * order.numContracts) / 1e8;
        
        // Transfer collateral from taker to this contract (simulates real behavior)
        if (collateralRequired > 0) {
            IERC20(order.collateral).safeTransferFrom(
                msg.sender, 
                address(this), 
                collateralRequired
            );
        }

        // Generate a deterministic mock option address
        _optionCounter++;
        optionAddress = address(uint160(uint256(keccak256(abi.encodePacked(
            block.timestamp,
            msg.sender,
            _optionCounter
        )))));

        // Track stats
        filledOrderCount[msg.sender]++;
        
        // Add referrer fee (1% of collateral for testing)
        if (referrer != address(0)) {
            _fees[order.collateral][referrer] += collateralRequired / 100;
        }

        // Emit events
        emit MockOrderFilled(
            msg.sender,
            order.maker,
            optionAddress,
            order.numContracts,
            collateralRequired
        );

        emit OrderFilled(
            msg.sender,
            order.maker,
            optionAddress,
            referrer,
            order.numContracts,
            collateralRequired
        );

        return optionAddress;
    }

    /**
     * @notice Get accumulated fees for a referrer
     */
    function fees(address token, address referrer) external view override returns (uint256) {
        return _fees[token][referrer];
    }

    /**
     * @notice Claim accumulated referral fees
     */
    function claimFees(address token) external override {
        uint256 amount = _fees[token][msg.sender];
        require(amount > 0, "No fees to claim");
        _fees[token][msg.sender] = 0;
        IERC20(token).safeTransfer(msg.sender, amount);
    }

    /**
     * @notice Get the current option counter
     */
    function optionCounter() external view returns (uint256) {
        return _optionCounter;
    }

    /**
     * @notice Withdraw stuck tokens (for testing)
     */
    function withdrawToken(address token, address to, uint256 amount) external {
        IERC20(token).safeTransfer(to, amount);
    }
}
