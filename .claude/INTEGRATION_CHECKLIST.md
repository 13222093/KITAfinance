# NUNGGU - Integration Checklist

This file tracks all external integrations and their status.

## 1. Thetanuts V4 RFQ

**Status:** 🟡 In Progress

**What We Need:**
- [ ] API key from Thetanuts team
- [ ] RFQ endpoint documentation
- [ ] Base Sepolia testnet contract address
- [ ] Base Mainnet contract address
- [ ] Quote request format
- [ ] Quote execution flow
- [ ] Settlement callback handling

**How to Get:**
1. Contact Thetanuts team (Discord: https://discord.gg/thetanuts)
2. Request testnet API access
3. Get contract addresses from their docs: https://docs.thetanuts.finance

**Integration Owner:** Backend Dev + Smart Contract Dev

**Deadline:** Day 7 (must be working for demo)

---

## 2. Aave Lending Protocol

**Status:** 🟡 In Progress

**What We Need:**
- [ ] Aave Pool contract address (Base Mainnet)
- [ ] Check if IDRX is supported (likely need USDC instead)
- [ ] aToken contract address
- [ ] Supply/withdraw function signatures
- [ ] Interest calculation formula

**How to Get:**
1. Check Aave docs: https://docs.aave.com/developers/deployed-contracts/v3-mainnet/base
2. Find USDC pool (if IDRX not available)
3. Get contract ABIs from Base scan

**Integration Owner:** Smart Contract Dev

**Deadline:** Day 10 (can demo without this as "coming soon")

---

## 3. Chainlink Automation (Keepers)

**Status:** 🔴 Not Started

**What We Need:**
- [ ] Register upkeep contract
- [ ] Fund with LINK tokens
- [ ] Set check interval (daily)
- [ ] Test auto-roll trigger

**How to Get:**
1. Go to https://automation.chain.link
2. Connect wallet
3. Register new upkeep
4. Fund with LINK (get from faucet for testnet)

**Integration Owner:** Smart Contract Dev

**Deadline:** Day 14 (nice-to-have, can skip for MVP)

---

## 4. Chainlink Price Feeds

**Status:** 🟡 In Progress

**What We Need:**
- [ ] ETH/USD price feed address (Base)
- [ ] Update frequency
- [ ] Decimals

**How to Get:**
1. Check https://docs.chain.link/data-feeds/price-feeds/addresses?network=base
2. Use ETH/USD feed: 0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70

**Integration Owner:** Backend Dev

**Deadline:** Day 5 (needed for price monitoring)

---

## 5. Base Paymaster (Gasless Transactions)

**Status:** 🟡 In Progress

**What We Need:**
- [ ] Paymaster contract address
- [ ] Setup account abstraction
- [ ] Test gasless transactions
- [ ] Fund paymaster (for gas sponsorship)

**How to Get:**
1. Use Coinbase's Paymaster: https://docs.base.org/tools/paymaster
2. Or use Pimlico: https://docs.pimlico.io/
3. Follow OnchainKit guide: https://onchainkit.xyz/guides/paymaster

**Integration Owner:** Frontend Dev + Integration Engineer

**Deadline:** Day 12 (CRITICAL for UX, must have for demo)

---

## 6. OnchainKit (Smart Wallet)

**Status:** 🟢 Ready

**What We Need:**
- [x] Import OnchainKit in frontend
- [ ] Setup wallet connection
- [ ] Test biometric login
- [ ] Handle wallet state

**How to Get:**
```bash
npm install @coinbase/onchainkit
```

**Integration Owner:** Frontend Dev

**Deadline:** Day 3 (first feature to build)

---

## 7. IDRX Token Contract

**Status:** 🟡 In Progress

**What We Need:**
- [ ] IDRX contract address on Base
- [ ] Verify decimals (likely 18)
- [ ] Test transfers
- [ ] Check liquidity for swaps

**How to Get:**
1. Search "IDRX" on https://basescan.org
2. Verify it's the official token
3. Get contract address

**Possible Address (verify):** 0x... (TBD - search BaseScan)

**Integration Owner:** All Devs

**Deadline:** Day 1 (need immediately)

---

## 8. IDRX/USDC Swap (If Needed)

**Status:** 🔴 Not Started

**What We Need:**
- [ ] DEX with IDRX/USDC pair (Uniswap? Aerodrome?)
- [ ] Pool liquidity check
- [ ] Router contract address
- [ ] Optimal swap path

**How to Get:**
1. Check if Aave supports IDRX
2. If not, need to swap IDRX → USDC before Aave
3. Use Uniswap V3 router on Base

**Integration Owner:** Integration Engineer

**Deadline:** Day 8 (only if Aave doesn't support IDRX)

---

## 9. Database (Optional)

**Status:** 🔴 Not Started (May Skip)

**What We Need:**
- [ ] PostgreSQL or MongoDB instance
- [ ] Schema design
- [ ] ORM setup (SQLAlchemy)
- [ ] Connection pooling

**How to Get:**
1. Use Supabase (free tier): https://supabase.com
2. Or Railway PostgreSQL addon
3. Or skip entirely (read from blockchain only)

**Integration Owner:** Backend Dev

**Deadline:** Day 15 (low priority, can skip for hackathon)

---

## 10. Notifications (Optional)

**Status:** 🔴 Not Started (May Skip)

**What We Need:**
- [ ] WhatsApp Business API (or Twilio)
- [ ] Email service (SendGrid / AWS SES)
- [ ] Push notifications (optional)

**How to Get:**
1. Twilio: https://www.twilio.com/whatsapp
2. SendGrid: https://sendgrid.com

**Integration Owner:** Backend Dev

**Deadline:** Day 18 (nice-to-have, not critical)

---

## Integration Testing Milestones

### Milestone 1 (Day 7): Core Flow Working
- [ ] Smart contract deployed to testnet
- [ ] Thetanuts RFQ returns quotes
- [ ] Frontend can create positions
- [ ] Gasless transactions work
- [ ] IDRX transfers work

### Milestone 2 (Day 14): Advanced Features
- [ ] Aave yield stacking works
- [ ] AI optimizer returns suggestions
- [ ] Event listener catches events
- [ ] Auto-roll trigger tested

### Milestone 3 (Day 21): Production Ready
- [ ] All contracts deployed to mainnet
- [ ] All integrations tested with real money (small amounts)
- [ ] Monitoring setup
- [ ] Emergency pause tested

---

## Emergency Fallbacks

If integration fails, here are backups:

**Thetanuts RFQ fails:**
→ Use mock data for demo
→ Show "Beta - Real integration coming" message

**Aave integration fails:**
→ Skip yield stacking for MVP
→ Show "Yield stacking: Coming soon"

**Chainlink Keeper fails:**
→ Manual cron job for auto-roll
→ Or skip auto-roll for MVP

**Paymaster fails:**
→ User pays gas (bad UX but functional)
→ Waive gas costs post-hackathon

**IDRX not available:**
→ Use USDC as fallback
→ Display in IDRX terms (conversion rate)

---

**End of Integration Checklist**
