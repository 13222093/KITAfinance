# NUNGGU - Backend Development Guide (Bun + TypeScript)

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
│   │   ├── rfq.ts          # RFQ endpoints
│   │   ├── positions.ts    # Position management
│   │   └── ai.ts           # AI suggestions
│   ├── services/
│   │   ├── rfq.service.ts  # Thetanuts RFQ integration
│   │   ├── listener.ts     # Blockchain event monitoring
│   │   └── ai.service.ts   # AI logic
│   ├── utils/
│   │   └── client.ts       # Viem client (RPC)
│   └── types/              # TS interfaces
├── .env
├── package.json
└── tsconfig.json
```

## Main Application (`src/index.ts`)
```typescript
import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { rfqRouter } from './routers/rfq';
import { aiRouter } from './routers/ai';
import { startEventListener } from './services/listener';

const app = new Elysia()
  .use(cors())
  .get('/health', () => ({ status: 'ok', message: 'NUNGGU API (Bun) is running' }))
  .group('/api', (app) => 
    app
      .use(rfqRouter)
      .use(aiRouter)
  )
  .listen(process.env.PORT || 8000);

// Start blockchain listener in background
startEventListener();

console.log(`🚀 NUNGGU API started at ${app.server?.hostname}:${app.server?.port}`);
```

## RFQ Service (`src/services/rfq.service.ts`)
```typescript
import axios from 'axios';

export class RFQService {
  private apiUrl = "https://api.thetanuts.finance/v4/rfq";
  private apiKey = process.env.THETANUTS_API_KEY;

  async getQuote(params: {
    underlying: string;
    strike: number;
    collateral: number;
    expiryDays: number;
  }) {
    // Mock for demo if no API Key
    if (!this.apiKey) return this.getMockQuote(params.strike, params.collateral);

    try {
      const response = await axios.post(this.apiUrl, {
        type: "PUT",
        underlying: params.underlying,
        strike: params.strike,
        expiry_days: params.expiryDays,
        collateral_amount: params.collateral,
        collateral_currency: "IDRX",
        chain: "base"
      }, {
        headers: { Authorization: `Bearer ${this.apiKey}` }
      });

      return response.data;
    } catch (error) {
      console.error("RFQ failed, using mock", error);
      return this.getMockQuote(params.strike, params.collateral);
    }
  }

  private getMockQuote(strike: number, collateral: number) {
    const premium = Math.floor(collateral * 0.015); // 1.5% premium
    return {
      quote_id: `0xMOCK${Date.now()}`,
      premium,
      strike,
      expiry: Math.floor(Date.now() / 1000) + 7 * 24 * 3600,
      collateral,
      valid_until: Math.floor(Date.now() / 1000) + 300
    };
  }
}

export const rfqService = new RFQService();
```

## Event Listener (`src/services/listener.ts`)
```typescript
import { createPublicClient, http, parseAbiItem } from 'viem';
import { baseSepolia } from 'viem/chains';

const client = createPublicClient({
  chain: baseSepolia,
  transport: http(process.env.BASE_RPC_URL)
});

// ABI minimal for events
const PositionCreatedAbi = parseAbiItem(
  'event PositionCreated(address indexed user, uint256 collateral, uint256 premium)'
);

export const startEventListener = () => {
  console.log("👂 Listening for blockchain events...");

  client.watchEvent({
    address: process.env.VAULT_ADDRESS as `0x${string}`,
    event: PositionCreatedAbi,
    onLogs: (logs) => {
      logs.forEach(log => {
        const { user, collateral, premium } = log.args;
        console.log(`📍 New Position: ${user} | Collateral: ${collateral} | Premium: ${premium}`);
        // TODO: Save to DB or trigger Notification
      });
    }
  });
};
```

## Tasks (Backend Dev):

**Priority 1:**
- [ ] Setup Bun project with Elysia
- [ ] Port RFQ logic to TypeScript
- [ ] Test `/health` and `/api/rfq/quote`
- [ ] Deploy to VPS using PM2 (`bun install && pm2 start src/index.ts --interpreter bun`)

**Priority 2:**
- [ ] Complete `viem` listener setup
- [ ] Integrate real Thetanuts API
- [ ] Setup AI Optimizer logic (TypeScript version)

**End of Backend Guide**
