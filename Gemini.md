# NUNGGU - Project Context

## Overview
NUNGGU is a DeFi application built for the Base Indonesia Hackathon (Thetanuts Track). It democratizes options trading (cash-secured put selling) by reframing it as "getting paid to wait" for users who want to set limit orders.

- **Value Prop:** Users set a target buy price for crypto (ETH) in IDRX. They earn instant cashback (option premium) and yield (Aave) while waiting.
- **Target Audience:** Indonesian crypto users; mobile-first, IDRX-native interface.

## Technical Stack
- **Blockchain:** Base L2
- **Smart Contracts:** Solidity (Hardhat)
- **Frontend:** Next.js 14, Tailwind, OnchainKit (Coinbase Smart Wallet)
- **Backend:** FastAPI (Python) or Express (Node.js)
- **Integrations:**
    - **Thetanuts V4:** RFQ System for options liquidity.
    - **Aave V3:** Yield generation on collateral.
    - **Chainlink:** Keepers for auto-rolling positions, Price Feeds for monitoring.
    - **Paymaster:** Gasless transactions for users.

## Architecture
- **`contracts/`**: Contains `NUNGGUVault.sol` which manages user positions, collateral, and interactions with Thetanuts and Aave.
- **`backend/`** (Planned): Handles RFQ quoting, price monitoring, and AI strike optimization.
- **`client/`** (Planned): React/Next.js SPA for the user interface.
- **Documentation:** See `.claude/` directory for detailed specs, checklists, and guides.

## Key Features
1.  **Instant Cashback:** Immediate premium payout upon position creation.
2.  **Yield Stacking:** Collateral is deposited into Aave to earn interest.
3.  **Auto-Roll:** Automated weekly renewal of positions via Chainlink Keepers.
4.  **Gasless UX:** Paymaster integration removes gas fees for end-users.
5.  **IDRX Native:** All values displayed in Indonesian Rupiah.

## Current Status (as of Jan 2026)
- **Contracts:** `NUNGGUVault.sol` implemented.
- **Integrations:**
    - OnchainKit: Ready.
    - Thetanuts V4: In Progress.
    - Aave V3: In Progress.
    - Paymaster: In Progress.
- **Documentation:** Comprehensive guides available in `.claude/`.

## Important Workflows
- **Frontend:** `npm run dev` (in client dir)
- **Contracts:** `npx hardhat test`, `npx hardhat run scripts/deploy.ts` (in contracts dir)
- **Backend:** `uvicorn main:app --reload` (in backend dir)
