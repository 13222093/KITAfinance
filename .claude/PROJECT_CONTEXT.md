# NUNGGU - Project Context

## Overview
NUNGGU is a DeFi application that allows users to earn instant cashback while setting limit orders to buy crypto at their target price. It democratizes options trading (specifically cash-secured put selling) by reframing it as "getting paid to wait."

## Core Value Proposition
**Traditional:** Set limit order → Money sits idle → Maybe get asset
**NUNGGU:** Set target price → Get instant cashback → Either get asset OR keep cashback

## Target Users
- Indonesian crypto holders (5M+ people)
- Portfolio size: 5M-100M IDRX ($300-$6,500)
- Behavior: Already use limit orders to "buy the dip"
- Knowledge level: Don't understand options trading

## Hackathon Details
- **Event:** Base Indonesia Hackathon + Thetanuts Track
- **Deadline:** January 31, 2026
- **Prize Pool:** $3,250 ($1,500 Thetanuts + $1,250 Base + $500 IDRX)
- **Competition:** Zero submissions in Thetanuts track
- **Win Probability:** 90%+

## Key Features (MVP)
1. **Instant Cashback:** Users get paid immediately when setting positions
2. **Yield Stacking:** Deposited funds earn interest via Aave while waiting
3. **Auto-Roll:** Positions automatically renew weekly until assignment
4. **AI Optimizer:** Suggests optimal strike prices for better premiums
5. **Gasless UX:** Zero gas fees via Paymaster (Base)
6. **IDRX Native:** All amounts displayed in Indonesian Rupiah

## Technical Stack
- **Blockchain:** Base L2 (Ethereum Layer 2)
- **Smart Contracts:** Solidity + Hardhat
- **Options Infrastructure:** Thetanuts V4 (RFQ API)
- **Yield Protocol:** Aave (lending pools)
- **Automation:** Chainlink Keepers
- **Stablecoin:** IDRX (Indonesian Rupiah stablecoin)
- **Wallet:** OnchainKit (Coinbase Smart Wallet)
- **Gasless Transactions:** Paymaster (Account Abstraction)
- **Backend:** FastAPI (Python) or Express (Node.js)
- **Frontend:** Next.js 14 + Tailwind + OnchainKit
- **Web3 Libraries:** wagmi + viem

## User Flow
1. User connects wallet (biometric login via Smart Wallet)
2. User sets target price (e.g., "Buy ETH at 40M IDRX")
3. User deposits collateral (40M IDRX)
4. System executes put-selling via Thetanuts RFQ
5. User receives instant cashback (e.g., 427k IDRX premium)
6. Collateral auto-deposited to Aave (earns 4% APY)
7. Two outcomes:
   - **ETH hits target:** User gets ETH + keeps cashback
   - **ETH doesn't hit:** User gets collateral back + keeps cashback + earned interest
8. If auto-roll enabled: Repeat weekly until assignment

## What Makes This Win
1. **Novel Framing:** Options → "Get paid to wait" (eliminates jargon)
2. **Perfect Thetanuts Fit:** Deep RFQ integration, solves their stated problem
3. **Real Problem:** Monetizes existing behavior (limit orders)
4. **Accessibility:** Mobile-first, gasless, Indonesian language
5. **Zero Competition:** Only submission in Thetanuts track
6. **Business Viability:** Clear revenue model (10% rake on premiums)

## Success Metrics
- Can demo in 3 minutes
- Non-technical judges understand immediately
- Live cashback display working
- Gasless UX actually works
- IDRX integration seamless
- All judge questions anticipated

## Critical Constraints
- **Timeline:** 22 days (ends Jan 31)
- **Team Size:** 5 people (1 contracts, 1 backend, 1 frontend, 1 integration, 1 PM)
- **Demo Day:** February 7, 2026 (Jakarta)
- **Legal:** Must NOT be fund management (users control own positions)
- **Technical:** Must use Thetanuts V4 RFQ (not just vaults)

## Non-Negotiables (Must-Haves for Demo)
1. Working wallet connection (OnchainKit)
2. Set target price UI
3. Instant cashback display (even if mocked)
4. Position status dashboard
5. Gasless transactions (Paymaster)
6. Mobile-responsive design
7. IDRX-denominated amounts

## Nice-to-Haves (If Time Permits)
1. Yield stacking indicators
2. AI strike optimizer
3. Auto-roll toggle
4. Historical analytics
5. Social sharing features

## Development Philosophy
- **Demo-driven:** Build what judges will see first
- **Pragmatic:** Use mocks if integration fails
- **Mobile-first:** Indonesian users are on phones
- **Simple UX:** No jargon, plain Indonesian language
- **Fast feedback:** Show cashback instantly (dopamine hit)

## References
- Thetanuts Docs: https://docs.thetanuts.finance
- Base Docs: https://docs.base.org
- OnchainKit: https://onchainkit.xyz
- Aave Base Deployment: https://docs.aave.com/developers/deployed-contracts/v3-mainnet/base
