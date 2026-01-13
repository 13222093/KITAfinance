# KITA - Project Context

## Overview
KITA (Kolektif Investasi Tanpa Ambyar) is a DeFi application built for the Base Indonesia Hackathon (Thetanuts Track). It enables options trading through a user-friendly "Beli Murah Dapat Cashback" (Buy Cheap Get Cashback) experience.

- **Value Prop:** Users earn instant cashback (option premium) when setting limit orders, plus additional yield from Aave.
- **Target Audience:** Indonesian crypto users; mobile-first, social investing features.

## Technical Stack
- **Blockchain:** Base L2
- **Smart Contracts:** Solidity (Hardhat)
- **Frontend:** Next.js 14, Tailwind, OnchainKit (Coinbase Smart Wallet)
- **Backend:** Bun (TypeScript) using ElysiaJS
- **Integrations:**
    - **Thetanuts V4:** OptionBook contract with `fillOrder()` API
    - **Aave V3:** Yield generation on collateral
    - **Chainlink:** Price Feeds
    - **Paymaster:** Gasless transactions for users

## Architecture
- **`contracts/`**: Contains `KITAVault.sol` (solo investing) and `GroupVault.sol` (group investing with voting)
- **`backend/`**: Bun-based service for fetching Thetanuts orders, event listening, and AI optimization
- **`client/`**: Next.js SPA for the user interface
- **Documentation:** See `.claude/` directory for detailed specs, checklists, and guides

## Key Features
1. **Instant Cashback:** Immediate premium payout upon position creation
2. **Yield Stacking:** Collateral deposited to Aave for additional yield
3. **Nabung Bareng:** Group investing with voting (2-10 members)
4. **Gasless UX:** Paymaster integration removes gas fees
5. **USDC Collateral:** Uses USDC as collateral (Thetanuts requirement)

## Smart Contracts

| Contract | Purpose |
|----------|---------|
| `KITAVault.sol` | Solo investing - execute orders, manage positions |
| `GroupVault.sol` | Group investing with voting, profit sharing |
| `IOptionBook.sol` | Thetanuts V4 interface (fillOrder, fees, claimFees) |
| `IAave.sol` | Aave lending interface |

## Current Status (as of Jan 13, 2026)
- **Contracts:** `KITAVault.sol` and `GroupVault.sol` implemented (32 tests passing)
- **Integrations:**
    - Thetanuts V4 IOptionBook: ✅ Ready
    - Aave V3: ✅ Ready
    - OnchainKit: Ready
    - Paymaster: In Progress
- **Documentation:** Updated guides in `.claude/` and `contracts/`

## Important Workflows
```bash
# Frontend
cd client && npm run dev

# Contracts
cd contracts && npm install
npx hardhat compile
npx hardhat test
npx hardhat run scripts/deploy-kita.ts --network base

# Backend
cd backend && bun dev

# Fetch Thetanuts Orders
node contracts/scripts/thetanuts-v4/fetchOrders.js
```

## Contract Addresses (Base Mainnet)
| Contract | Address |
|----------|---------|
| Thetanuts OptionBook | `0xd58b814C7Ce700f251722b5555e25aE0fa8169A1` |
| USDC | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |
| Aave Pool | `0xA238Dd80C259a72e81d7e4664a9801593F98d1c5` |
| KITAVault | TBD (deploy) |
| GroupVault | TBD (deploy) |
