// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IThetanutsRFQ
 * @notice Interface for Thetanuts V4 RFQ (Request for Quote) system
 * @dev Used to request and execute options trading quotes from market makers
 */
interface IThetanutsRFQ {
    /**
     * @notice Request a quote for selling a put option
     * @param underlying The underlying asset (e.g., ETH address)
     * @param strike The strike price in collateral currency units
     * @param expiry The expiration timestamp
     * @param size The size of the position (collateral amount)
     * @return quoteId Unique identifier for the quote
     */
    function requestQuote(
        address underlying,
        uint256 strike,
        uint256 expiry,
        uint256 size
    ) external returns (bytes32 quoteId);

    /**
     * @notice Execute a previously requested quote
     * @param quoteId The unique quote identifier
     * @return premium The premium amount received
     */
    function executeQuote(bytes32 quoteId) external returns (uint256 premium);

    /**
     * @notice Cancel a quote that hasn't been executed
     * @param quoteId The unique quote identifier
     */
    function cancelQuote(bytes32 quoteId) external;

    /**
     * @notice Get quote details
     * @param quoteId The unique quote identifier
     * @return underlying The underlying asset address
     * @return strike The strike price
     * @return expiry The expiration timestamp
     * @return premium The premium amount
     * @return isValid Whether the quote is still valid
     */
    function getQuote(bytes32 quoteId)
        external
        view
        returns (
            address underlying,
            uint256 strike,
            uint256 expiry,
            uint256 premium,
            bool isValid
        );

    /**
     * @notice Event emitted when a quote is requested
     */
    event QuoteRequested(
        bytes32 indexed quoteId,
        address indexed requester,
        address underlying,
        uint256 strike,
        uint256 expiry,
        uint256 size
    );

    /**
     * @notice Event emitted when a quote is executed
     */
    event QuoteExecuted(
        bytes32 indexed quoteId,
        address indexed executor,
        uint256 premium
    );

    /**
     * @notice Event emitted when a quote is cancelled
     */
    event QuoteCancelled(bytes32 indexed quoteId, address indexed canceller);
}
