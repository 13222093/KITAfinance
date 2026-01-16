import { baseSepolia } from 'viem/chains';
import type { Chain } from 'viem';

export const SUPPORTED_CHAINS: [Chain, ...Chain[]] = [baseSepolia];

export const CONTRACTS = {
  VAULT_ADDRESS: process.env.NEXT_PUBLIC_VAULT_ADDRESS as `0x${string}` || '0x',
  IDRX_ADDRESS: process.env.NEXT_PUBLIC_IDRX_ADDRESS as `0x${string}` || '0x',
};

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';
