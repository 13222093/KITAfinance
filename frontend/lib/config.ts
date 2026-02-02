import { baseSepolia } from 'viem/chains';
import type { Chain } from 'viem';

export const SUPPORTED_CHAINS: [Chain, ...Chain[]] = [baseSepolia];

// Contract addresses (Base Sepolia testnet) - Deployed 2026-02-02
export const CONTRACTS = {
  // Deployed contract addresses from MockOptionBook flow
  KITA_VAULT: '0x2a26db6fa9488f600778de5a088bC4B7d0af25b8' as `0x${string}`,
  GROUP_VAULT: '0x263a3A64fbc581828a4f8F3A0ec30607d5700698' as `0x${string}`,
  USDC: '0xf8B8981ea1D4b4A0Eb8072139C14B3c534126A70' as `0x${string}`, // Mock USDC on Base Sepolia
  OPTION_BOOK: '0x5C8c3Fb2765BbcA94426ceb51F329b39cE255D6b' as `0x${string}`, // MockOptionBook

  // Legacy (for backwards compatibility)
  VAULT_ADDRESS: process.env.NEXT_PUBLIC_VAULT_ADDRESS as `0x${string}` || '0x2a26db6fa9488f600778de5a088bC4B7d0af25b8' as `0x${string}`,
  IDRX_ADDRESS: process.env.NEXT_PUBLIC_IDRX_ADDRESS as `0x${string}` || '0x',
};

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

// USDC decimals
export const USDC_DECIMALS = 6;

// USDC to IDR conversion rate (hardcoded for now)
export const USDC_TO_IDR = 15800;
