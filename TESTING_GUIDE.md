# NUNGGU Vault Testing Guide

## 🎯 Overview

This guide explains how to test your NUNGGU Vault smart contract in different ways, from automated tests to real user interactions.

---

## ✅ What's Already Tested (Automated Tests)

Your automated test suite covers **24 scenarios** and all are passing:

```bash
cd contracts
npx hardhat test
```

### Test Coverage:

#### ✅ Deployment Tests (4/4)
- Correct IDRX token configuration
- Owner verification
- Initial values (TVL, fees, positions)
- Constructor validation (zero address rejection)

#### ✅ Position Creation Tests (7/7)
- Successful position creation
- Collateral transfer from user to vault
- Minimum collateral enforcement (1M IDRX)
- Target price validation
- Expiry duration validation (24hrs - 365 days)
- Insufficient allowance rejection
- Insufficient balance rejection

#### ✅ Position Query Tests (4/4)
- Getting all user positions
- Getting only active positions
- Empty array for users with no positions
- Total premium calculation

#### ✅ Admin Function Tests (7/7)
- Platform fee updates (with max limit)
- Fee update restrictions (max 20%)
- Permission checks (only owner)
- Pause/unpause functionality
- Minimum collateral updates
- Fee withdrawal

#### ✅ Multi-user Tests (2/2)
- Multiple users creating positions
- TVL tracking across users

---

## 🧪 Interactive Testing Options

### Option 1: Interactive Script (Recommended for Quick Testing)

Run the full user journey simulation:

```bash
cd contracts
npx hardhat run scripts/test-interactive.ts
```

This simulates:
1. ✅ Deploying all contracts
2. ✅ Creating a protected position as a user
3. ✅ Checking position details
4. ✅ Testing multiple users
5. ✅ Testing admin functions

**Output**: You'll see each step with colored output and detailed stats.

---

### Option 2: Hardhat Console (Manual Interactive Testing)

For hands-on exploration:

```bash
cd contracts
npx hardhat console
```

Then interact with the contract:

```javascript
// Deploy Mock IDRX
const MockERC20 = await ethers.getContractFactory("MockERC20");
const idrx = await MockERC20.deploy("Indonesian Rupiah", "IDRX", 18);
await idrx.waitForDeployment();

// Deploy Mock Thetanuts
const MockThetanuts = await ethers.getContractFactory("MockThetanutsRFQ");
const thetanuts = await MockThetanuts.deploy();
await thetanuts.waitForDeployment();

// Deploy Mock Aave
const MockAave = await ethers.getContractFactory("MockAave");
const aave = await MockAave.deploy();
await aave.waitForDeployment();

// Deploy Vault
const Vault = await ethers.getContractFactory("NUNGGUVault");
const [owner, user1] = await ethers.getSigners();
const vault = await Vault.deploy(
  await idrx.getAddress(),
  await thetanuts.getAddress(),
  await aave.getAddress(),
  owner.address
);

// Mint IDRX to user
await idrx.mint(user1.address, ethers.parseEther("1000000000"));

// Create a position
await idrx.connect(user1).approve(await vault.getAddress(), ethers.parseEther("40000000"));
await vault.connect(user1).createPosition(
  ethers.parseEther("40000000"),  // collateral
  ethers.parseEther("40000000"),  // target price
  7 * 24 * 3600,                  // 7 days
  false                            // no auto-roll
);

// Check positions
const positions = await vault.getUserPositions(user1.address);
console.log("User has", positions.length, "position(s)");
console.log("Position details:", positions[0]);
```

---

### Option 3: Local Network Deployment

Deploy to a local blockchain and interact via frontend or wallet:

```bash
# Terminal 1: Start local Hardhat node
cd contracts
npx hardhat node
```

```bash
# Terminal 2: Deploy contracts
cd contracts
npx hardhat run scripts/deploy.ts --network localhost
```

Then connect MetaMask to `http://localhost:8545` (Chain ID: 31337) and interact with the deployed contracts.

---

### Option 4: Base Sepolia Testnet Deployment

Deploy to real testnet for production-like testing:

#### Prerequisites:
1. Get Base Sepolia ETH from [Base Sepolia Faucet](https://www.alchemy.com/faucets/base-sepolia)
2. Update `.env` with your private key:
   ```
   PRIVATE_KEY=your_private_key_here
   ```

#### Deploy:

```bash
cd contracts
npx hardhat run scripts/deploy.ts --network baseSepolia
```

**Important**: You'll need to set these in your `.env` file:
```
IDRX_ADDRESS=<your_idrx_token_address>
THETANUTS_RFQ_ADDRESS=<thetanuts_v4_rfq_address>
AAVE_POOL_ADDRESS=<aave_pool_address>
```

---

## ⚠️ CRITICAL: Thetanuts V4 Integration

### What We Found:

❌ **Thetanuts V4 RFQ contracts are NOT publicly available**

- GitHub org exists but has 0 public repositories: [Theta-Nuts](https://github.com/Theta-Nuts)
- Docs only show V3 contracts: [Deployed Contracts](https://docs.thetanuts.finance/insights/deployed-contracts)
- V4 launched September 2025 with Odette as first partner
- Integration requires direct contact with team

### What This Means:

✅ Your contract works perfectly with **mock** Thetanuts
❌ Your `IThetanutsRFQ` interface **may not match** the real V4 API
⚠️ Contract could fail when connecting to real Thetanuts

### Your Interface (What You Have):

```solidity
interface IThetanutsRFQ {
    function requestQuote(address underlying, uint256 strike, uint256 expiry, uint256 size)
        external returns (bytes32 quoteId);

    function executeQuote(bytes32 quoteId)
        external returns (uint256 premium);

    function cancelQuote(bytes32 quoteId) external;

    function getQuote(bytes32 quoteId) external view returns (...);
}
```

### Next Steps to Verify:

1. **Contact Thetanuts Team**:
   - Email: hello@thetanuts.finance
   - Fill out [Builder Form](https://docs.google.com/forms/d/16jY2zTMDox67I1yZuHQ1el84BoDDIpByK-DBSmHQkKQ/edit)
   - Ask for V4 RFQ contract interface and testnet addresses

2. **Questions to Ask**:
   - What is the correct interface for V4 RFQ?
   - Do you have testnet contracts deployed?
   - What are the parameter formats for `requestQuote` and `executeQuote`?
   - Do you have integration docs or SDKs?

3. **Compare and Update**:
   - Once you get the real interface, compare with your `IThetanutsRFQ.sol`
   - Update if needed
   - Re-run tests to ensure compatibility

---

## 🚀 Testing Checklist

### Local Testing (Mock Contracts)
- [x] ✅ Automated tests pass (24/24)
- [ ] Run interactive script to see full flow
- [ ] Test in Hardhat console manually
- [ ] Deploy to local network and interact via MetaMask

### Integration Testing
- [ ] ⚠️ Contact Thetanuts team for V4 RFQ interface
- [ ] ⚠️ Verify your interface matches real V4
- [ ] Update `IThetanutsRFQ.sol` if needed
- [ ] Get testnet contract addresses

### Testnet Testing
- [ ] Deploy mock contracts to Base Sepolia
- [ ] Test full user flow on testnet
- [ ] Verify contracts on Basescan
- [ ] Test frontend integration (if applicable)

### Production Readiness
- [ ] Integrate with real Thetanuts V4 RFQ
- [ ] Integrate with real Aave on Base
- [ ] Security audit
- [ ] Gas optimization review
- [ ] Deploy to Base mainnet

---

## 📊 Understanding Test Results

### When Tests Pass:
✅ **What it proves:**
- Contract logic is correct
- All functions work as expected
- Edge cases are handled
- Security checks work

❌ **What it DOESN'T prove:**
- Real Thetanuts integration will work
- Real Aave integration will work
- Gas costs are optimal
- Contract is secure against all attacks

### What Mock Contracts Do:

**MockThetanutsRFQ**:
- Returns fake quote IDs
- Returns 1M IDRX premium (hardcoded)
- Doesn't actually interact with market makers

**MockAave**:
- Simulates deposit/withdraw
- Doesn't earn real yield
- Simplified version of real Aave

**Real Integration** will require:
- Actual Thetanuts V4 RFQ contract address
- Actual Aave Pool contract address
- Real IDRX token (or testnet equivalent)
- Real market makers providing quotes

---

## 🔍 Debugging Tips

### If Tests Fail:

1. **Clean and recompile**:
   ```bash
   npx hardhat clean
   npx hardhat compile
   ```

2. **Check Node version**:
   ```bash
   node --version  # Should be v20.x or v22.x
   ```

3. **Reinstall dependencies**:
   ```bash
   rm -rf node_modules
   npm install --legacy-peer-deps
   ```

### If Deployment Fails:

1. **Check account balance**:
   ```javascript
   const balance = await ethers.provider.getBalance(deployer.address);
   console.log(ethers.formatEther(balance), "ETH");
   ```

2. **Verify addresses in .env**:
   - All addresses should start with `0x`
   - All addresses should be valid checksummed addresses

3. **Check network config**:
   - RPC URL is correct
   - Chain ID matches network

---

## 📚 Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Thetanuts V4 Docs](https://docs.thetanuts.finance/)
- [Aave V3 Docs](https://docs.aave.com/developers/)
- [Base Network Docs](https://docs.base.org/)
- [Ethers.js Documentation](https://docs.ethers.org/)

---

## 🎓 Understanding Your Contract

### User Flow:
1. User deposits IDRX collateral
2. Vault requests quote from Thetanuts for put option
3. Vault executes quote, receives premium
4. Vault deposits collateral to Aave for yield
5. If ETH price stays above target: User keeps everything
6. If ETH price drops below target: Position liquidated but downside protected

### Key Parameters:
- **Min Collateral**: 1M IDRX (~$62.50)
- **Platform Fee**: 10% (1000 basis points)
- **Expiry Range**: 24 hours to 365 days
- **Target Price**: User-defined ETH price floor

### Gas Costs (Estimated):
- Create Position: ~300,000 gas
- Get Positions: ~50,000 gas
- Admin Operations: ~50,000 gas

---

## ❓ FAQ

**Q: Why do tests pass if Thetanuts V4 interface might be wrong?**
A: Tests use mock contracts that implement whatever interface you defined. Real integration needs real contracts.

**Q: Can I deploy to mainnet now?**
A: NO! You must verify Thetanuts V4 integration first. Contact their team.

**Q: What's the difference between automated tests and interactive tests?**
A: Automated tests check logic. Interactive tests let you experience the full user flow.

**Q: Do I need to deploy mock contracts to testnet?**
A: For initial testing, yes. For production, use real IDRX, Thetanuts, and Aave contracts.

**Q: How do I know if my contract is production-ready?**
A: After:
1. Verifying Thetanuts integration
2. Security audit
3. Successful testnet deployment
4. Frontend integration testing

---

## 🆘 Getting Help

If you encounter issues:
1. Check this guide first
2. Review test output carefully
3. Check contract addresses in deployment
4. Verify .env configuration
5. Ask for help with specific error messages

---

**Last Updated**: January 2026
**Version**: 1.0.0
