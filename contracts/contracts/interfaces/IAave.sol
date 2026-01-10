// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IAave
 * @notice Interface for Aave V3 Pool (simplified for NUNGGU use case)
 * @dev Used for yield stacking - depositing collateral to earn interest while waiting
 */
interface IAave {
    /**
     * @notice Supply assets to the Aave pool
     * @param asset The address of the underlying asset to supply
     * @param amount The amount to be supplied
     * @param onBehalfOf The address that will receive the aTokens
     * @param referralCode Code used to register the integrator (use 0 if none)
     */
    function supply(
        address asset,
        uint256 amount,
        address onBehalfOf,
        uint16 referralCode
    ) external;

    /**
     * @notice Withdraw assets from the Aave pool
     * @param asset The address of the underlying asset to withdraw
     * @param amount The amount to be withdrawn (use type(uint256).max for full balance)
     * @param to The address that will receive the underlying
     * @return The final amount withdrawn
     */
    function withdraw(
        address asset,
        uint256 amount,
        address to
    ) external returns (uint256);

    /**
     * @notice Get the reserve data for an asset
     * @param asset The address of the underlying asset
     */
    function getReserveData(address asset)
        external
        view
        returns (
            uint256 configuration,
            uint128 liquidityIndex,
            uint128 currentLiquidityRate,
            uint128 variableBorrowIndex,
            uint128 currentVariableBorrowRate,
            uint128 currentStableBorrowRate,
            uint40 lastUpdateTimestamp,
            uint16 id,
            address aTokenAddress,
            address stableDebtTokenAddress,
            address variableDebtTokenAddress,
            address interestRateStrategyAddress,
            uint128 accruedToTreasury,
            uint128 unbacked,
            uint128 isolationModeTotalDebt
        );
}

/**
 * @title IAToken
 * @notice Interface for Aave aToken (interest-bearing token)
 */
interface IAToken {
    /**
     * @notice Get the balance of aTokens for an address
     * @param user The address to query
     * @return The aToken balance
     */
    function balanceOf(address user) external view returns (uint256);

    /**
     * @notice Transfer aTokens
     * @param recipient The recipient address
     * @param amount The amount to transfer
     * @return True if successful
     */
    function transfer(address recipient, uint256 amount)
        external
        returns (bool);
}
