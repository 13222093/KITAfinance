# NUNGGU - Smart Contract Development Guide

## Quick Start
```bash
cd ~/hackathon/nunggu/contracts

# Initialize Hardhat project (if not done)
npx hardhat init

# Install dependencies
npm install @openzeppelin/contracts @chainlink/contracts

# Create contract
touch contracts/NUNGGUVault.sol

# Create deployment script
touch scripts/deploy.ts

# Create test file
touch test/NUNGGUVault.test.ts
```

## Contract Development Workflow

### 1. Write Contract (`contracts/NUNGGUVault.sol`)

Start with minimal viable contract:
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NUNGGUVault is ReentrancyGuard {
    IERC20 public immutable IDRX;
    
    struct Position {
        address user;
        uint256 collateral;
        uint256 targetPrice;
        uint256 premiumReceived;
        bool isActive;
    }
    
    mapping(address => Position[]) public userPositions;
    
    event PositionCreated(address indexed user, uint256 collateral, uint256 premium);
    
    constructor(address _idrx) {
        IDRX = IERC20(_idrx);
    }
    
    function createPosition(uint256 collateral, uint256 targetPrice) external nonReentrant {
        require(collateral > 0, "Collateral must be > 0");
        require(targetPrice > 0, "Target price must be > 0");
        
        // Transfer IDRX from user
        IDRX.transferFrom(msg.sender, address(this), collateral);
        
        // TODO: Call Thetanuts RFQ
        // For now, mock premium (1% of collateral)
        uint256 premium = collateral / 100;
        
        // Store position
        userPositions[msg.sender].push(Position({
            user: msg.sender,
            collateral: collateral,
            targetPrice: targetPrice,
            premiumReceived: premium,
            isActive: true
        }));
        
        // Send premium to user immediately
        IDRX.transfer(msg.sender, premium);
        
        emit PositionCreated(msg.sender, collateral, premium);
    }
    
    function getUserPositions(address user) external view returns (Position[] memory) {
        return userPositions[user];
    }
}
```

### 2. Write Tests (`test/NUNGGUVault.test.ts`)
```typescript
import { expect } from "chai";
import { ethers } from "hardhat";
import { NUNGGUVault, MockERC20 } from "../typechain-types";

describe("NUNGGUVault", function () {
  let vault: NUNGGUVault;
  let idrx: MockERC20;
  let owner: any;
  let user: any;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();
    
    // Deploy mock IDRX token
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    idrx = await MockERC20.deploy("IDRX", "IDRX", 18);
    await idrx.waitForDeployment();
    
    // Deploy vault
    const Vault = await ethers.getContractFactory("NUNGGUVault");
    vault = await Vault.deploy(await idrx.getAddress());
    await vault.waitForDeployment();
    
    // Mint IDRX to user
    await idrx.mint(user.address, ethers.parseEther("1000000"));
  });

  it("Should create position and send premium", async function () {
    const collateral = ethers.parseEther("40000000"); // 40M IDRX
    const targetPrice = ethers.parseEther("40000000");
    
    // Approve vault to spend IDRX
    await idrx.connect(user).approve(await vault.getAddress(), collateral);
    
    // Create position
    await expect(
      vault.connect(user).createPosition(collateral, targetPrice)
    ).to.emit(vault, "PositionCreated");
    
    // Check position created
    const positions = await vault.getUserPositions(user.address);
    expect(positions.length).to.equal(1);
    expect(positions[0].collateral).to.equal(collateral);
    
    // Check premium received (should be ~1% = 400k)
    const expectedPremium = collateral / 100n;
    expect(positions[0].premiumReceived).to.equal(expectedPremium);
  });

  it("Should revert if collateral is zero", async function () {
    await expect(
      vault.connect(user).createPosition(0, ethers.parseEther("40000000"))
    ).to.be.revertedWith("Collateral must be > 0");
  });
});
```

### 3. Compile & Test
```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Check coverage
npx hardhat coverage

# Gas report
REPORT_GAS=true npx hardhat test
```

### 4. Deploy to Testnet

Create `scripts/deploy.ts`:
```typescript
import { ethers } from "hardhat";

async function main() {
  console.log("Deploying NUNGGUVault...");

  // Base Sepolia IDRX address (replace with actual)
  const IDRX_ADDRESS = "0x..."; 

  const Vault = await ethers.getContractFactory("NUNGGUVault");
  const vault = await Vault.deploy(IDRX_ADDRESS);

  await vault.waitForDeployment();

  console.log(`NUNGGUVault deployed to: ${await vault.getAddress()}`);
  
  // Verify on BaseScan
  console.log("Waiting 30 seconds before verification...");
  await new Promise(resolve => setTimeout(resolve, 30000));
  
  await hre.run("verify:verify", {
    address: await vault.getAddress(),
    constructorArguments: [IDRX_ADDRESS],
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

Deploy:
```bash
# Set environment variables
export PRIVATE_KEY="0x..."
export BASE_SEPOLIA_RPC="https://sepolia.base.org"
export BASESCAN_API_KEY="..."

# Deploy
npx hardhat run scripts/deploy.ts --network baseSepolia

# Should output:
# NUNGGUVault deployed to: 0xABC123...
```

## Integration Tasks

### Task 1: Add Thetanuts RFQ Integration
```solidity
interface IThetanutsRFQ {
    function requestQuote(
        address underlying,
        uint256 strike,
        uint256 expiry,
        uint256 size
    ) external returns (bytes32 quoteId);
    
    function executeQuote(bytes32 quoteId) external;
}

contract NUNGGUVault is ReentrancyGuard {
    IThetanutsRFQ public thetanutsRFQ;
    
    constructor(address _idrx, address _thetanutsRFQ) {
        IDRX = IERC20(_idrx);
        thetanutsRFQ = IThetanutsRFQ(_thetanutsRFQ);
    }
    
    function createPosition(uint256 collateral, uint256 targetPrice) external nonReentrant {
        // ... (transfer IDRX)
        
        // Request quote from Thetanuts
        bytes32 quoteId = thetanutsRFQ.requestQuote(
            address(ETH),  // underlying
            targetPrice,   // strike
            block.timestamp + 7 days,  // expiry
            collateral     // size
        );
        
        // Execute quote (sell put)
        thetanutsRFQ.executeQuote(quoteId);
        
        // Premium will be sent to this contract
        // Transfer to user
        uint256 premium = IDRX.balanceOf(address(this)) - collateral;
        IDRX.transfer(msg.sender, premium);
        
        // ... (store position)
    }
}
```

**TODO for you:**
- [ ] Get Thetanuts RFQ contract address (Base Sepolia)
- [ ] Read their docs for exact interface
- [ ] Test quote request on testnet
- [ ] Handle quote expiry (if not executed in time)

### Task 2: Add Aave Yield Stacking
```solidity
interface IAave {
    function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external;
    function withdraw(address asset, uint256 amount, address to) external returns (uint256);
}

contract NUNGGUVault is ReentrancyGuard {
    IAave public aavePool;
    
    function createPosition(uint256 collateral, uint256 targetPrice) external nonReentrant {
        // ... (transfer IDRX, execute RFQ)
        
        // Deposit collateral to Aave for yield
        IDRX.approve(address(aavePool), collateral);
        aavePool.supply(address(IDRX), collateral, address(this), 0);
        
        // Store aToken balance
        positions[msg.sender].aaveShares = aToken.balanceOf(address(this));
        
        // ... (rest of logic)
    }
    
    function closePosition(uint256 positionId) external {
        Position storage pos = positions[msg.sender][positionId];
        require(pos.isActive, "Position not active");
        
        // Withdraw from Aave (includes accrued interest)
        uint256 withdrawn = aavePool.withdraw(
            address(IDRX),
            pos.collateral,
            msg.sender
        );
        
        // withdrawn > pos.collateral means user earned yield
        uint256 yieldEarned = withdrawn - pos.collateral;
        
        pos.isActive = false;
        
        emit PositionClosed(msg.sender, positionId, yieldEarned);
    }
}
```

**TODO for you:**
- [ ] Get Aave pool address (Base)
- [ ] Check if IDRX is supported (might need USDC)
- [ ] Get aToken address
- [ ] Test supply/withdraw flow
- [ ] Calculate APY for display in frontend

### Task 3: Add Auto-Roll with Chainlink Keeper
```solidity
import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";

contract NUNGGUVault is AutomationCompatibleInterface {
    
    function checkUpkeep(bytes calldata) 
        external 
        view 
        override 
        returns (bool upkeepNeeded, bytes memory performData) 
    {
        // Check if any positions need auto-roll
        for (uint i = 0; i < allPositions.length; i++) {
            Position storage pos = allPositions[i];
            
            if (pos.isActive && 
                pos.autoRoll && 
                block.timestamp > pos.expiry &&
                !pos.assigned) {
                    
                upkeepNeeded = true;
                performData = abi.encode(i);  // Position index to roll
                break;
            }
        }
    }
    
    function performUpkeep(bytes calldata performData) external override {
        uint256 positionIndex = abi.decode(performData, (uint256));
        Position storage pos = allPositions[positionIndex];
        
        // Withdraw from Aave
        uint256 withdrawn = aavePool.withdraw(address(IDRX), pos.collateral, address(this));
        
        // Create new position (same params)
        _createPosition(pos.user, pos.collateral, pos.targetPrice, true);
        
        // Mark old position as rolled
        pos.isActive = false;
        pos.rolledTo = allPositions.length - 1;
        
        emit PositionRolled(pos.user, positionIndex, allPositions.length - 1);
    }
}
```

**TODO for you:**
- [ ] Register upkeep on Chainlink Automation
- [ ] Fund upkeep with LINK tokens
- [ ] Test trigger on testnet
- [ ] Set appropriate check interval (daily is fine)

## Testing Checklist

Before deploying to mainnet:

- [ ] All unit tests pass
- [ ] Integration tests with Thetanuts testnet
- [ ] Integration tests with Aave testnet
- [ ] Tested with frontend (E2E flow)
- [ ] Gas optimization (functions <500k gas)
- [ ] Security review (basic):
  - [ ] No reentrancy vulnerabilities
  - [ ] All state changes before external calls
  - [ ] Input validation on all public functions
  - [ ] Access control where needed
  - [ ] SafeERC20 for all token transfers
- [ ] Emergency pause function works
- [ ] Can upgrade/migrate if needed (proxy pattern optional)

## Common Issues & Solutions

**Issue:** "Insufficient allowance" error
**Fix:** User must approve vault before createPosition
```typescript
await idrx.approve(vaultAddress, collateral);
```

**Issue:** "Transfer failed" error
**Fix:** Check user actually has IDRX balance
```typescript
const balance = await idrx.balanceOf(userAddress);
if (balance < collateral) throw new Error("Insufficient balance");
```

**Issue:** Gas estimation fails
**Fix:** Use fixed gas limits
```typescript
await vault.createPosition(collateral, target, { gasLimit: 500000 });
```

**Issue:** Nonce too low
**Fix:** Reset nonce or wait for pending tx
```typescript
await provider.getTransactionCount(address, "latest");
```

## Deployment Checklist

Before deploying:
- [ ] All tests pass
- [ ] Coverage >80%
- [ ] Contracts compiled with optimization
- [ ] Constructor args prepared
- [ ] Deployment script tested on testnet
- [ ] Gas price acceptable
- [ ] Deployer wallet funded
- [ ] BaseScan API key ready (for verification)

After deploying:
- [ ] Contract verified on BaseScan
- [ ] Ownership transferred (if using Ownable)
- [ ] Emergency pause tested
- [ ] Contract addresses saved to .env
- [ ] Frontend updated with new addresses
- [ ] Small test transaction executed
- [ ] Monitoring setup (Tenderly)

---

**Your Tasks (Smart Contract Dev):**

**Priority 1 (Days 1-3):**
- [ ] Setup Hardhat project
- [ ] Write basic NUNGGUVault.sol
- [ ] Write comprehensive tests
- [ ] Deploy to Base Sepolia
- [ ] Verify on BaseScan

**Priority 2 (Days 4-7):**
- [ ] Integrate Thetanuts RFQ (CRITICAL)
- [ ] Test quote requests
- [ ] Test quote execution
- [ ] Handle edge cases (no quotes, expired quotes)

**Priority 3 (Days 8-10):**
- [ ] Integrate Aave for yield stacking
- [ ] Test supply/withdraw
- [ ] Calculate yield correctly

**Priority 4 (Days 11-14):**
- [ ] Add Chainlink Keeper auto-roll
- [ ] Register upkeep
- [ ] Test auto-roll trigger

**Days 15-21:**
- [ ] Bug fixes
- [ ] Gas optimization
- [ ] Security review
- [ ] Deploy to mainnet
- [ ] Final testing

**End of Smart Contract Guide**
