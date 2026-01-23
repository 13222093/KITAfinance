# Changelog: Backend Refactor & Feature Implementation
**Date:** January 24, 2026
**Focus:** Backend Architecture, Thetanuts Integration, Feature Support

## 1. Backend Architecture Refactor
Moved from hardcoded Mainnet values to a dynamic configuration system to support both Sepolia (Testnet) and Mainnet (Production) environments safely.

### **New Files:**
*   **`backend/src/config/index.ts`**: Centralized configuration file.
    *   Defines `mainnet` and `sepolia` environments.
    *   Dynamic switching based on `NETWORK` environment variable.
    *   Contains specific contract addresses (USDC, OptionBook, PriceFeeds) for each network.

### **Refactored Files:**
*   **`backend/src/utils/client.ts`**: Now initializes `viem` client with the chain (`base` or `baseSepolia`) and RPC URL derived from the new config.
*   **`backend/.env`**: Added comprehensive configuration variables.
    *   `NETWORK`: Switch between `sepolia` and `mainnet`.
    *   `BASE_SEPOLIA_RPC` & `BASE_MAINNET_RPC`.
    *   Mock address placeholders for Sepolia testing.
    *   Separate vault address keys for Mainnet and Sepolia.

## 2. Thetanuts V4 Integration Fixes
Resolved critical bugs where Mainnet addresses were hardcoded, causing failures on Testnet, and fixed broken asset filtering.

### **`backend/src/services/rfq.service.ts`**:
*   **Dynamic Addresses**: Replaced hardcoded addresses with `config.contracts...`.
*   **Asset Filtering**: Fixed `fetchOrdersByAsset` to compare exact Price Feed addresses instead of unreliable string inclusion (which failed for hex strings).
*   **Indexer URL**: Now uses dynamic `indexerUrl` from config (prevents Mainnet data leaking into Sepolia tests).
*   **Caching**: Implemented 30-second in-memory caching for `fetchOrders()` to respect rate limits and improve performance.
*   **Collateral Check**: Explicitly filters for USDC collateral (`config.contracts.usdc`) as IDRX is not supported by Thetanuts V4.

## 3. Feature Implementations

### **Event Indexer (`backend/src/services/listener.ts`):**
*   **GroupVault Support**: Added listeners for `GroupCreated` and `ProposalCreated` events.
*   **Persistence (MVP)**: Implemented in-memory storage arrays:
    *   `recentPositions`: For KITAVault trades.
    *   `recentGroupEvents`: For GroupVault activities.
*   **Safety**: Added checks to skip listeners if contract addresses are placeholders (`0x00...`).

### **API Endpoints:**
*   **`backend/src/routers/rfq.ts`**: Added `/api/orders/puts` alias endpoint for clarity.
*   **`backend/src/routers/positions.ts`**: Added `/api/positions/activity` endpoint to expose the merged stream of recent on-chain events (Positions + Group Events) for the frontend "Live Feed".

### **AI Service (`backend/src/services/ai.service.ts`):**
*   **Grandma-Proofing**: Updated reasoning text to be friendly and explanatory (Bahasa Indonesia).
*   **Risk Logic**: Refined premium estimation logic with base rates and risk multipliers ("Santai", "Seimbang", "Agresif").

### **CORS:**
*   **`backend/src/index.ts`**: Verified and documented default CORS configuration (Allow All) suitable for the hackathon environment.

### **Telegram Integration:**
*   **`backend/src/services/telegram.service.ts`**: New service created to handle Telegram Bot interactions.
    *   **Features**: `sendMessage` (with Markdown support) and `startPolling` (Long-polling for command handling).
    *   **Commands**: Initial support for `/start` (returns chat ID) and `/ping`.
*   **`backend/src/services/listener.ts`**: Integrated `telegramService` to push real-time notifications for:
    *   New individual positions created (`KITAVault`).
    *   New investment groups created (`GroupVault`).
    *   New governance proposals/voting started (`GroupVault`).
*   **`backend/.env`**: Added `TELEGRAM_BOT_TOKEN` and `TELEGRAM_ADMIN_CHAT_ID` configuration keys.

## 4. Documentation Updates
*   **`Gemini.md`**: Updated with current project status and checklist.
*   **`.claude/BACKEND_GUIDE.md`**: Updated file tree to reflect actual filenames (`thetanuts.ts` -> `rfq.service.ts`, `orders.ts` -> `rfq.ts`).

## 5. Next Steps
1.  **Smart Contracts**: Deploy `MockERC20`, `MockOptionBook`, `KITAVault`, and `GroupVault` to Base Sepolia.
2.  **Environment**: Update `backend/.env` with the real deployed addresses.
3.  **Frontend**: Integrate the new `/api/orders/puts` and `/api/positions/activity` endpoints.
