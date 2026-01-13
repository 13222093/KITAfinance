# KITA - Integration Checklist

This file tracks all external integrations and their status.

## 1. Thetanuts V4 OptionBook

**Status:** ✅ **Ready**

**What's Done:**
- [x] Created `IOptionBook.sol` interface matching official ABI
- [x] All 13 Order struct fields verified against docs
- [x] `fillOrder()` function signature correct
- [x] Created API fetch script (`fetchOrders.js`)
- [x] Created test script (`testFillOrder.ts`)

**Contract Address (Base Mainnet):**
```
OptionBook: 0xd58b814C7Ce700f251722b5555e25aE0fa8169A1
```

**API Endpoint:**
```
https://round-snowflake-9c31.devops-118.workers.dev/
```

**Pending:**
- [ ] Test `fillOrder()` on Base Mainnet with real USDC
- [ ] Verify premium calculation with actual trades

**Integration Owner:** Smart Contract Dev

---

## 2. Aave Lending Protocol

**Status:** ✅ **Ready**

**What's Done:**
- [x] Created `IAave.sol` interface
- [x] Integrated into `KITAVault.sol` and `GroupVault.sol`
- [x] Created `MockAave.sol` for testing
- [x] All 32 tests passing

**Contract Address (Base Mainnet):**
```
Aave Pool: 0xA238Dd80C259a72e81d7e4664a9801593F98d1c5
```

**Important:** Aave uses USDC, not IDRX. Our contracts use USDC as collateral.

**Integration Owner:** Smart Contract Dev

---

## 3. Base Paymaster (Gasless Transactions)

**Status:** 🟡 In Progress

**What We Need:**
- [ ] Paymaster contract address
- [ ] Setup account abstraction
- [ ] Test gasless transactions
- [ ] Fund paymaster (for gas sponsorship)

**How to Get:**
1. Use Coinbase's Paymaster: https://docs.base.org/tools/paymaster
2. Follow OnchainKit guide: https://onchainkit.xyz/guides/paymaster

**Integration Owner:** Frontend Dev

**Deadline:** Day 12

---

## 4. OnchainKit (Smart Wallet)

**Status:** 🟢 Ready

**What's Done:**
- [x] Import OnchainKit in frontend
- [ ] Setup wallet connection
- [ ] Test biometric login
- [ ] Handle wallet state

**Integration Owner:** Frontend Dev

---

## 5. USDC Token

**Status:** ✅ **Ready**

**Contract Address (Base Mainnet):**
```
USDC: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
```

**Decimals:** 6

**Note:** Using USDC (not IDRX) because Thetanuts V4 requires USDC/WETH/CBBTC.

---

## 6. Smart Contracts

**Status:** ✅ **Ready** (32 tests passing)

| Contract | Status | Tests |
|----------|--------|-------|
| `KITAVault.sol` | ✅ Complete | 12 passing |
| `GroupVault.sol` | ✅ Complete | 20 passing |
| `IOptionBook.sol` | ✅ Complete | - |
| `IAave.sol` | ✅ Complete | - |

**Pending:**
- [ ] Deploy to Base Sepolia (testnet)
- [ ] Deploy to Base Mainnet

---

## Integration Testing Milestones

### Milestone 1: Core Contracts ✅
- [x] Smart contracts compile
- [x] All tests passing (32 total)
- [x] Thetanuts interface verified
- [x] Aave interface ready

### Milestone 2: On-chain Testing
- [ ] Deploy to Base Sepolia
- [ ] Test `executeOrder()` with real Thetanuts API
- [ ] Test USDC approvals and transfers
- [ ] Test position creation flow

### Milestone 3: Production Ready
- [ ] Deploy to Base Mainnet
- [ ] Test with small amounts ($5-$10)
- [ ] Verify on BaseScan
- [ ] Fund paymaster

---

## Emergency Fallbacks

**Thetanuts `fillOrder` fails:**
→ Display error message with reason
→ Suggest user try different order

**Aave integration fails:**
→ Skip yield stacking (try/catch in contract)
→ Funds stay in vault

**Paymaster fails:**
→ User pays gas (bad UX but functional)

---

**End of Integration Checklist**
