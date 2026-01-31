'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { CONTRACTS, API_URL, USDC_DECIMALS } from '@/lib/config';
import { KITA_VAULT_ABI } from '@/lib/abi';

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

            // For demo: directly call contract
            // In production: call backend API first to prepare transaction
            const collateralAmount = parseUnits(order.collateralRequired || order.premium, USDC_DECIMALS);
            const expectedPremium = parseUnits(order.premium, USDC_DECIMALS);

            // Simplified order structure for demo
            const orderData = {
                maker: order.maker || address,
                asset: (order.asset === 'BTC' ? '0x0000000000000000000000000000000000000001' : '0x0000000000000000000000000000000000000002') as `0x${string}`,
                strikePrice: parseUnits(order.strikePrice, 8), // 8 decimals for price
                expiry: BigInt(order.expiry),
                premium: expectedPremium,
                isCall: order.isCall || false,
                isLong: order.isLong || false,
            };

            writeContract({
                address: CONTRACTS.KITA_VAULT,
                abi: KITA_VAULT_ABI,
                functionName: 'executeOrder',
                args: [
                    orderData,
                    '0x' as `0x${string}`, // Signature (empty for demo)
                    collateralAmount,
                    expectedPremium,
                ],
            }, {
                onSuccess: (hash) => {
                    setTxHash(hash);
                    setStatus('success');
                },
                onError: (error) => {
                    setStatus('error');
                    setErrorMessage(error.message || 'Transaction failed');
                },
            });

            return true;
        } catch (error: any) {
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
