# KITA - Backend Development Guide (Bun + TypeScript)

## Quick Start
```bash
# Install Bun (if not yet)
curl -fsSL https://bun.sh/install | bash

mkdir -p backend && cd backend
bun init -y

# Install dependencies
bun add elysia @elysiajs/cors viem axios dotenv
bun add -d @types/node

# Create project structure
mkdir -p src/{services,models,utils,routers,types}
touch src/index.ts .env
```

## Project Structure
```
backend/
├── src/
│   ├── index.ts            # Elysia app entry
│   ├── routers/
│   │   ├── orders.ts       # Thetanuts orders endpoints
│   │   ├── positions.ts    # Position management
│   │   └── ai.ts           # AI suggestions
│   ├── services/
│   │   ├── thetanuts.ts    # Thetanuts V4 API integration
│   │   ├── listener.ts     # Blockchain event monitoring
│   │   └── ai.service.ts   # AI logic
│   ├── utils/
│   │   └── client.ts       # Viem client (RPC)
│   └── types/              # TS interfaces
├── .env
├── package.json
└── tsconfig.json
```

## Environment Variables (.env)
```env
PORT=8000
BASE_RPC_URL=https://mainnet.base.org
KITA_VAULT_ADDRESS=0x...      # After deployment
GROUP_VAULT_ADDRESS=0x...     # After deployment
```

## Main Application (`src/index.ts`)
```typescript
import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { ordersRouter } from './routers/orders';
import { aiRouter } from './routers/ai';
import { startEventListener } from './services/listener';

const app = new Elysia()
  .use(cors())
  .get('/health', () => ({ status: 'ok', message: 'KITA API is running' }))
  .group('/api', (app) => 
    app
      .use(ordersRouter)
      .use(aiRouter)
  )
  .listen(process.env.PORT || 8000);

// Start blockchain listener in background
startEventListener();

console.log(`🚀 KITA API started at ${app.server?.hostname}:${app.server?.port}`);
```

## Thetanuts V4 Integration (`src/services/thetanuts.ts`)

**Important:** Thetanuts V4 uses off-chain orders fetched via API, then executed on-chain via `fillOrder()`.

```typescript
import axios from 'axios';

const THETANUTS_API = "https://round-snowflake-9c31.devops-118.workers.dev/";

interface ThetanutsOrder {
  order: {
    maker: string;
    collateral: string;
    isCall: boolean;
    priceFeed: string;
    implementation: string;
    strikes: number[];
    expiry: number;
    price: string;
    maxCollateralUsable: string;
    isLong: boolean;
    orderExpiryTimestamp: number;
    numContracts: string;
    extraOptionData: string;
  };
  signature: string;
}

export async function fetchOrders(): Promise<ThetanutsOrder[]> {
  const response = await axios.get(THETANUTS_API);
  return response.data.data.orders;
}

export async function fetchPutOrders(): Promise<ThetanutsOrder[]> {
  const orders = await fetchOrders();
  // Filter for PUT options (isCall = false)
  return orders.filter(o => !o.order.isCall);
}

export async function fetchPutSellOrders(): Promise<ThetanutsOrder[]> {
  const orders = await fetchOrders();
  // Filter for selling PUTs (isCall = false, isLong = false)
  // This is what KITA needs for "cash-secured put" strategy
  return orders.filter(o => !o.order.isCall && !o.order.isLong);
}
```

## Orders Router (`src/routers/orders.ts`)
```typescript
import { Elysia } from 'elysia';
import { fetchPutOrders, fetchPutSellOrders } from '../services/thetanuts';

export const ordersRouter = new Elysia({ prefix: '/orders' })
  .get('/', async () => {
    const orders = await fetchPutOrders();
    return { 
      count: orders.length,
      orders: orders.slice(0, 10) // Return first 10
    };
  })
  .get('/puts', async () => {
    const orders = await fetchPutSellOrders();
    return {
      count: orders.length,
      orders: orders.map(o => ({
        asset: o.order.priceFeed.includes('BTC') ? 'BTC' : 'ETH',
        strikes: o.order.strikes.map(s => Number(s) / 1e8),
        pricePerContract: Number(o.order.price) / 1e8,
        expiry: new Date(o.order.expiry * 1000).toISOString(),
        signature: o.signature.slice(0, 20) + '...'
      }))
    };
  });
```

## Event Listener (`src/services/listener.ts`)
```typescript
import { createPublicClient, http, parseAbiItem } from 'viem';
import { base } from 'viem/chains';

const client = createPublicClient({
  chain: base,
  transport: http(process.env.BASE_RPC_URL)
});

// KITAVault events
const PositionCreatedAbi = parseAbiItem(
  'event PositionCreated(address indexed user, uint256 indexed positionId, address optionContract, uint256 collateral, uint256 premium, uint256 strikePrice, uint256 expiry, bool isCall, bool isLong)'
);

export const startEventListener = () => {
  if (!process.env.KITA_VAULT_ADDRESS) {
    console.log("⚠️ KITA_VAULT_ADDRESS not set, skipping event listener");
    return;
  }

  console.log("👂 Listening for KITA events...");

  client.watchEvent({
    address: process.env.KITA_VAULT_ADDRESS as `0x${string}`,
    event: PositionCreatedAbi,
    onLogs: (logs) => {
      logs.forEach(log => {
        console.log(`📍 New Position:`, log.args);
        // TODO: Save to DB, trigger notifications
      });
    }
  });
};
```

## Integration with Smart Contracts

### Key Contract Functions

**KITAVault.sol:**
```solidity
// Execute a Thetanuts order
function executeOrder(
    IOptionBook.Order calldata order,
    bytes calldata signature,
    uint256 collateralAmount,
    uint256 expectedPremium
) external returns (uint256 positionId);

// View functions
function getUserPositions(address user) external view returns (Position[] memory);
function getActivePositions(address user) external view returns (Position[] memory);
function getTotalPremiumEarned(address user) external view returns (uint256);
```

**GroupVault.sol:**
```solidity
function createGroup(string calldata name, uint256 initialDeposit) returns (uint256 groupId);
function joinGroup(uint256 groupId, uint256 deposit) external;
function createProposal(uint256 groupId, ProposalType proposalType, bytes calldata data) returns (uint256);
function vote(uint256 proposalId, bool support) external;
function executeProposal(uint256 proposalId) external;
```

### Frontend → Backend → Contract Flow

1. **Frontend** calls backend `/api/orders/puts` to get available orders
2. **Frontend** displays orders to user, user selects one
3. **Frontend** calls `KITAVault.executeOrder(order, signature, amount, expectedPremium)`
4. **Smart contract** calls Thetanuts `OptionBook.fillOrder()`
5. **Backend listener** picks up `PositionCreated` event and updates DB

## Tasks (Backend Dev)

**Priority 1:**
- [x] Setup Bun project with Elysia
- [ ] Implement `/api/orders` endpoint (fetch from Thetanuts API)
- [ ] Test `/health` and `/api/orders`
- [ ] Deploy to VPS using PM2

**Priority 2:**
- [ ] Complete `viem` listener for KITAVault events
- [ ] Add GroupVault event listening
- [ ] Implement AI strike recommendations

**Priority 3:**
- [ ] Add caching for Thetanuts orders
- [ ] Implement WebSocket for real-time updates
- [ ] Add database (PostgreSQL/SQLite) for position history

## Run Commands
```bash
# Development
bun run src/index.ts

# Or with hot reload
bun --watch src/index.ts

# Production (PM2)
pm2 start src/index.ts --interpreter bun --name kita-api
```

---
**End of Backend Guide**
