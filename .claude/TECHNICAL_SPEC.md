# KITA - Technical Specification

## System Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                         USER (Mobile)                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (Next.js + Vercel)                │
│  - OnchainKit (Smart Wallet)                                 │
│  - Position Setup UI                                         │
│  - Cashback Calculator                                       │
│  - Group Management (Nabung Bareng)                          │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
┌──────────────────────────┐   ┌───────────────────────────┐
│  SMART CONTRACTS (Base)  │   │  BACKEND (Bun/Elysia)     │
│  - KITAVault             │   │  - Thetanuts API fetch    │
│  - GroupVault            │   │  - Event Listener         │
│  - Position Management   │   │  - AI Optimizer           │
│  - Voting System         │   │                           │
└──────────────────────────┘   └───────────────────────────┘
                │                            │
    ┌───────────┼───────────────────────────┘
    ▼           ▼           
┌─────────┐ ┌─────────┐ 
│Thetanuts│ │  Aave   │ 
│ Option  │ │ Lending │ 
│  Book   │ │  Pool   │ 
└─────────┘ └─────────┘ 
```

## Smart Contract Architecture

### KITAVault.sol (Solo Investing)
```solidity
contract KITAVault is ReentrancyGuard, Ownable, Pausable {
    
    struct Position {
        address user;
        address optionContract;     // From fillOrder()
        uint256 collateralAmount;   // USDC deposited
        uint256 premiumReceived;    // Cashback amount
        uint256 strikePrice;        // Strike (8 decimals)
        uint256 expiry;             // Option expiry
        bool isCall;                // Call or Put
        bool isLong;                // Buying or Selling
        bool isActive;              // Position status
        uint256 aaveShares;         // Aave yield tracking
        uint256 createdAt;
    }
    
    // Core functions
    function executeOrder(
        IOptionBook.Order calldata order,
        bytes calldata signature,
        uint256 collateralAmount,
        uint256 expectedPremium
    ) external returns (uint256 positionId);
    
    function closePosition(uint256 positionId) external;
    
    // View functions
    function getUserPositions(address user) external view returns (Position[] memory);
    function getActivePositions(address user) external view returns (Position[] memory);
    function getTotalPremiumEarned(address user) external view returns (uint256);
}
```

### GroupVault.sol (Nabung Bareng)
```solidity
contract GroupVault is ReentrancyGuard, Pausable {
    
    struct Group {
        string name;
        address admin;
        uint256 totalDeposited;
        uint256 memberCount;       // 2-10 members
        uint256 createdAt;
        uint256 streakWeeks;       // Consecutive profitable weeks
        bool isActive;
    }
    
    enum ProposalType {
        EXECUTE_STRATEGY,    // Execute Thetanuts order
        WITHDRAW,           // Withdraw funds
        ADD_MEMBER,         // Add new member
        REMOVE_MEMBER,      // Remove member
        CHANGE_ADMIN        // Change admin
    }
    
    // Group Management
    function createGroup(string calldata name, uint256 initialDeposit) returns (uint256 groupId);
    function joinGroup(uint256 groupId, uint256 deposit) external;
    function deposit(uint256 groupId, uint256 amount) external;
    
    // Voting System (48h period, 50%+1 quorum)
    function createProposal(uint256 groupId, ProposalType, bytes calldata data) returns (uint256);
    function vote(uint256 proposalId, bool support) external;
    function executeProposal(uint256 proposalId) external;
    
    // View functions
    function getMemberShare(uint256 groupId, address member) returns (uint256); // Basis points
    function getGroupPositions(uint256 groupId) returns (GroupPosition[] memory);
}
```

### IOptionBook.sol (Thetanuts V4 Interface)
```solidity
interface IOptionBook {
    struct Order {
        address maker;
        uint256 orderExpiryTimestamp;
        address collateral;             // USDC/WETH/CBBTC
        bool isCall;                    // true=call, false=put
        address priceFeed;              // Chainlink feed
        address implementation;         // Strategy contract
        bool isLong;                    // true=buy, false=sell
        uint256 maxCollateralUsable;
        uint256[] strikes;              // 8 decimals
        uint256 expiry;                 // Option expiry
        uint256 price;                  // Price per contract (8 decimals)
        uint256 numContracts;           // Number to fill
        bytes extraOptionData;
    }
    
    function fillOrder(
        Order calldata order,
        bytes calldata signature,
        address referrer
    ) external returns (address optionAddress);
    
    function fees(address token, address referrer) external view returns (uint256);
    function claimFees(address token) external;
}
```

## Key Contract Functions

**KITAVault.executeOrder Flow:**
1. Validate inputs (collateral >= minCollateral)
2. Transfer USDC from user to vault
3. Approve OptionBook to spend USDC
4. Call `optionBook.fillOrder(order, signature, referrer)` - **DO NOT modify order!**
5. Calculate premium: `price * numContracts / 1e8`
6. Deduct platform fee (5%)
7. Deposit remaining collateral to Aave for yield
8. Store position data
9. Transfer net premium to user (instant cashback)
10. Emit `PositionCreated` event

**GroupVault.createProposal + executeProposal Flow:**
1. Member creates proposal with encoded data
2. 48-hour voting period starts
3. Members vote (each member = 1 vote)
4. After deadline, if quorum (50%+1) reached and votesFor > votesAgainst
5. Execute proposal (e.g., call `_executeStrategy()`)

## Backend Services

### Thetanuts Order Fetcher
```typescript
// src/services/thetanuts.ts
const THETANUTS_API = "https://round-snowflake-9c31.devops-118.workers.dev/";

export async function fetchOrders() {
  const response = await axios.get(THETANUTS_API);
  return response.data.data.orders;
}

// Filter for selling PUTs (what KITA needs)
export async function fetchPutSellOrders() {
  const orders = await fetchOrders();
  return orders.filter(o => !o.order.isCall && !o.order.isLong);
}
```

### Event Listener
```typescript
// src/services/listener.ts
const PositionCreatedAbi = parseAbiItem(
  'event PositionCreated(address indexed user, uint256 indexed positionId, ...)'
);

client.watchEvent({
  address: KITA_VAULT_ADDRESS,
  event: PositionCreatedAbi,
  onLogs: (logs) => {
    // Save to DB, notify user, etc.
  }
});
```

## Frontend Integration

### Execute Order Flow
```typescript
// 1. Fetch order from backend
const orders = await fetch('/api/orders/puts').then(r => r.json());
const selectedOrder = orders[0];

// 2. Approve USDC
await usdc.approve(KITA_VAULT_ADDRESS, collateralAmount);

// 3. Execute order
await kitaVault.executeOrder(
  selectedOrder.order,
  selectedOrder.signature,
  collateralAmount,
  expectedPremium
);
```

## Contract Addresses

### Base Mainnet
| Contract | Address |
|----------|---------|
| Thetanuts OptionBook | `0xd58b814C7Ce700f251722b5555e25aE0fa8169A1` |
| USDC | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |
| Aave Pool | `0xA238Dd80C259a72e81d7e4664a9801593F98d1c5` |
| KITAVault | TBD |
| GroupVault | TBD |

## Security Considerations

### Smart Contracts
- ✅ ReentrancyGuard on all state-changing functions
- ✅ Pausable for emergency stops
- ✅ SafeERC20 for token transfers
- ✅ Input validation (min collateral, valid addresses)
- ✅ Try/catch for external calls (Aave)
- ⚠️ Order passed unmodified (signature verification)

### Backend
- Rate limit API endpoints
- Validate all inputs
- Use environment variables for secrets
- Setup CORS properly

## Deployment Commands

```bash
# Compile
npx hardhat compile

# Test
npx hardhat test

# Deploy to Base Mainnet
npx hardhat run scripts/deploy-kita.ts --network base

# Verify on BaseScan
npx hardhat verify --network base <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

---

**End of Technical Spec**
