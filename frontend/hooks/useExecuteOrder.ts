'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { CONTRACTS, USDC_DECIMALS } from '@/lib/config';
import { KITA_VAULT_ABI, type IOptionBookOrder } from '@/lib/abi';

/**
 * Hook to execute orders on KITAVault via MockOptionBook
 * 
 * This creates a proper IOptionBook.Order struct for the contract call.
 * In demo mode, we use hardcoded values that work with MockOptionBook.
 */
export function useExecuteOrder() {
    const { address, isConnected } = useAccount();
    const [status, setStatus] = useState<'idle' | 'approving' | 'executing' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [txHash, setTxHash] = useState<`0x${string}` | undefined>();

    const { writeContract, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash: txHash,
    });

    const executeOrder = async (order: any) => {
        if (!isConnected || !address) {
            setStatus('error');
            setErrorMessage('Please connect your wallet first');
            return false;
        }

        try {
            setStatus('executing');

            // Parse amounts with proper decimals
            const collateralAmount = parseUnits(
                String(order.collateralRequired || order.amount || '10'),
                USDC_DECIMALS
            );
            const expectedPremium = parseUnits(
                String(order.premium || '0.5'),
                USDC_DECIMALS
            );

            // Build the full IOptionBook.Order struct (13 fields)
            // For demo/testnet, we use mock values that work with MockOptionBook
            const orderData: IOptionBookOrder = {
                // Market maker - use a realistic-looking address for demo
                maker: (order.maker || '0x1234567890123456789012345678901234567890') as `0x${string}`,

                // Order expires in 1 hour from now
                orderExpiryTimestamp: BigInt(Math.floor(Date.now() / 1000) + 3600),

                // Collateral is our Mock USDC
                collateral: CONTRACTS.USDC,

                // Option type from order
                isCall: order.isCall ?? false,

                // Chainlink price feed (mock address for testnet)
                priceFeed: '0x0000000000000000000000000000000000000001' as `0x${string}`,

                // Strategy implementation (mock address for testnet)
                implementation: '0x0000000000000000000000000000000000000002' as `0x${string}`,

                // Long position = buying option, Short = selling
                isLong: order.isLong ?? false,

                // Max collateral maker is willing to use (high value for demo)
                maxCollateralUsable: parseUnits('1000000', USDC_DECIMALS),

                // Strike prices array (8 decimals - e.g., 95000 for BTC strike at $95,000)
                strikes: [parseUnits(String(order.strikePrice || '95000'), 8)],

                // Option expiry (30 days from now for demo)
                expiry: BigInt(Math.floor(Date.now() / 1000) + 30 * 24 * 3600),

                // Price per contract (8 decimals - e.g., 0.5 USDC)
                price: parseUnits(String(order.premium || '0.5'), 8),

                // Number of contracts - calculate from collateral and price
                numContracts: BigInt(1),

                // Extra option data (empty for demo)
                extraOptionData: '0x' as `0x${string}`,
            };

            // Call KITAVault.executeOrder
            writeContract({
                address: CONTRACTS.KITA_VAULT,
                abi: KITA_VAULT_ABI,
                functionName: 'executeOrder',
                args: [
                    orderData,
                    '0x' as `0x${string}`, // Empty signature (MockOptionBook doesn't verify)
                    collateralAmount,
                    expectedPremium,
                ],
            }, {
                onSuccess: (hash) => {
                    setTxHash(hash);
                    setStatus('success');
                },
                onError: (error) => {
                    console.error('Transaction error:', error);
                    setStatus('error');
                    setErrorMessage(error.message || 'Transaction failed');
                },
            });

            return true;
        } catch (error: any) {
            console.error('Execute order error:', error);
            setStatus('error');
            setErrorMessage(error.message || 'Failed to execute order');
            return false;
        }
    };

    const reset = () => {
        setStatus('idle');
        setErrorMessage('');
        setTxHash(undefined);
    };

    return {
        executeOrder,
        status,
        errorMessage,
        txHash,
        isPending,
        isConfirming,
        isSuccess,
        reset,
    };
}
