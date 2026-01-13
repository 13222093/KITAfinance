# NUNGGU - Technical Specification

## System Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                         USER (Mobile)                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (Next.js + Vercel)                │
│  - OnchainKit (Wallet)                                       │
│  - Position Setup UI                                         │
│  - Cashback Calculator                                       │
│  - Dashboard                                                 │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
┌──────────────────────────┐   ┌───────────────────────────┐
│  SMART CONTRACTS (Base)  │   │  BACKEND (Bun/Elysia)     │
│  - NUNGGUVault           │   │  - RFQ Service            │
│  - Position Management   │   │  - Price Monitor          │
│  - Premium Distribution  │   │  - AI Optimizer           │
└──────────────────────────┘   │  - Event Listener         │
                │              └───────────────────────────┘
                │                            │
    ┌───────────┼───────────┬────────────────┘
    ▼           ▼           ▼
┌─────────┐ ┌─────────┐ ┌──────────────┐
│Thetanuts│ │  Aave   │ │  Chainlink   │
│  V4 RFQ │ │ Lending │ │  Automation  │
└─────────┘ └─────────┘ └──────────────┘
```

## Smart Contract Architecture

### NUNGGUVault.sol (Main Contract)
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IThetanutsRFQ {
    function requestQuote(...) external returns (bytes32 quoteId);
    function fillQuote(bytes32 quoteId) external;
}

interface IAave {
    function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external;
    function withdraw(address asset, uint256 amount, address to) external;
}

contract NUNGGUVault is ReentrancyGuard, Ownable {
    
    struct Position {
        address user;
        uint256 collateral;        // Amount in IDRX
        uint256 targetPrice;       // Strike price
        uint256 premiumReceived;   // Cashback amount
        uint256 expiry;            // Position expiry timestamp
        bool isActive;             // Position status
        bool autoRoll;             // Auto-renewal enabled
        uint256 aaveShares;        // Aave lending shares
    }
    
    mapping(address => Position[]) public userPositions;
    mapping(bytes32 => Position) public activePositions;
    
    IERC20 public IDRX;
    IThetanutsRFQ public thetanutsRFQ;
    IAave public aavePool;
    
    event PositionCreated(address indexed user, uint256 indexed positionId, uint256 premium);
    event PositionAssigned(address indexed user, uint256 indexed positionId);
    event PremiumClaimed(address indexed user, uint256 amount);
    event YieldClaimed(address indexed user, uint256 amount);
    
    // Core functions
    function createPosition(uint256 collateral, uint256 targetPrice, bool autoRoll) external;
    function claimPremium() external;
    function claimYield() external;
    function closePosition(uint256 positionId) external;
    function enableAutoRoll(uint256 positionId) external;
    
    // Internal functions
    function _executeRFQ(...) internal;
    function _depositToAave(...) internal;
    function _withdrawFromAave(...) internal;
    function _handleAssignment(...) internal;
    function _rollPosition(...) internal;
}
```

### Key Contract Functions

**createPosition:**
1. Validate inputs (collateral > 0, targetPrice reasonable)
2. Transfer IDRX from user to contract
3. Deposit IDRX to Aave (yield stacking)
4. Call Thetanuts RFQ for quote
5. Execute put sell
6. Distribute premium to user immediately
7. Store position data
8. Emit event

**handleAssignment (when ETH hits target):**
1. Thetanuts triggers assignment
2. Withdraw from Aave
3. Execute buy (swap IDRX for ETH)
4. Transfer ETH to user
5. Close position
6. Emit event

**rollPosition (auto-roll):**
1. Chainlink Keeper triggers on expiry
2. Check if position expired without assignment
3. Check if autoRoll enabled
4. Withdraw from Aave (keep yield)
5. Create new position with same parameters
6. Emit event

## Backend Services

### RFQ Service (`/services/rfq_service.py`)
```python
from web3 import Web3
import requests

class RFQService:
    def __init__(self, thetanuts_api_key: str):
        self.api_url = "https://api.thetanuts.finance/v4/rfq"
        self.api_key = thetanuts_api_key
        
    async def get_quote(
        self,
        underlying: str,  # e.g., "ETH"
        strike_price: float,
        expiry: int,  # Unix timestamp
        size: float,  # Collateral amount
    ) -> dict:
        """
        Request quote from Thetanuts market makers.
        Returns: {
            "quoteId": "0x123...",
            "premium": 427500,  # in IDRX
            "fee": 1000,
            "total": 426500
        }
        """
        payload = {
            "type": "PUT",
            "underlying": underlying,
            "strike": strike_price,
            "expiry": expiry,
            "collateral": size,
            "currency": "IDRX"
        }
        
        response = requests.post(
            self.api_url,
            json=payload,
            headers={"Authorization": f"Bearer {self.api_key}"}
        )
        
        return response.json()
        
    async def execute_quote(self, quote_id: str, user_address: str):
        """Execute the quote onchain via smart contract."""
        # Call NUNGGUVault.executeRFQ(quote_id)
        pass
```

### Price Monitor (`/services/price_monitor.py`)
```python
from web3 import Web3
import asyncio

class PriceMonitor:
    def __init__(self, chainlink_feed_address: str):
        self.feed = chainlink_feed_address
        self.w3 = Web3(Web3.HTTPProvider("https://mainnet.base.org"))
        
    async def get_current_price(self, asset: str) -> float:
        """Get current price from Chainlink oracle."""
        # Read from Chainlink price feed
        # Return price in IDRX terms
        pass
        
    async def monitor_positions(self):
        """
        Continuously monitor active positions.
        Alert when price approaching target.
        """
        while True:
            positions = await self.get_active_positions()
            current_price = await self.get_current_price("ETH")
            
            for pos in positions:
                if abs(current_price - pos.targetPrice) / current_price < 0.02:
                    # Price within 2% of target
                    await self.send_alert(pos.user, "Price approaching target!")
                    
            await asyncio.sleep(60)  # Check every minute
```

### AI Optimizer (`/services/ai_optimizer.py`)
```python
class AIOptimizer:
    def suggest_optimal_strike(
        self,
        current_price: float,
        user_budget: float,  # Max premium willing to pay
        risk_tolerance: str,  # "low", "medium", "high"
    ) -> dict:
        """
        Suggest optimal strike price for best risk/reward.
        
        Returns: {
            "suggested_strike": 39500000,
            "expected_premium": 450000,
            "assignment_probability": 0.35,
            "reasoning": "Strike 1.5% below current gives 2x premium..."
        }
        """
        
        # Simple heuristic (no ML needed for MVP):
        # - Lower strike = higher premium but higher assignment risk
        # - Higher strike = lower premium but safer
        
        strikes = [
            current_price * 0.95,  # 5% below
            current_price * 0.97,  # 3% below
            current_price * 0.99,  # 1% below
        ]
        
        quotes = []
        for strike in strikes:
            quote = await self.rfq_service.get_quote(
                "ETH", strike, expiry=7*24*3600, size=user_budget
            )
            quotes.append(quote)
            
        # Rank by premium amount
        best = max(quotes, key=lambda q: q['premium'])
        
        return {
            "suggested_strike": best['strike'],
            "expected_premium": best['premium'],
            "reasoning": f"Optimal balance of {best['premium']/user_budget:.2%} premium..."
        }
```

## Frontend Components

### Key Pages/Components
```
/app
├── page.tsx                 # Landing page
├── app/
│   ├── layout.tsx          # Root layout (wallet provider)
│   ├── dashboard/
│   │   └── page.tsx        # User dashboard (positions, earnings)
│   ├── create/
│   │   └── page.tsx        # Create position flow
│   └── api/
│       ├── rfq/route.ts    # Proxy to backend RFQ
│       └── positions/route.ts
├── components/
│   ├── WalletConnect.tsx   # OnchainKit wallet button
│   ├── PositionSetup.tsx   # Main position creation form
│   ├── CashbackCalculator.tsx  # Real-time premium calculator
│   ├── PositionCard.tsx    # Display active position
│   └── YieldDisplay.tsx    # Show Aave interest
```

### Critical Component: CashbackCalculator
```typescript
'use client';

import { useState, useEffect } from 'react';
import { formatUnits, parseUnits } from 'viem';

export function CashbackCalculator() {
  const [targetPrice, setTargetPrice] = useState(40000000); // 40M IDRX
  const [collateral, setCollateral] = useState(40000000);
  const [premium, setPremium] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPremium = async () => {
      setLoading(true);
      
      // Call backend RFQ service
      const response = await fetch('/api/rfq/quote', {
        method: 'POST',
        body: JSON.stringify({ targetPrice, collateral })
      });
      
      const data = await response.json();
      setPremium(data.premium);
      setLoading(false);
    };
    
    // Debounce: only fetch after user stops adjusting
    const timer = setTimeout(fetchPremium, 500);
    return () => clearTimeout(timer);
  }, [targetPrice, collateral]);

  return (
    <div className="space-y-4">
      <div>
        <label>Target Harga ETH</label>
        <input
          type="range"
          min={35000000}
          max={45000000}
          step={100000}
          value={targetPrice}
          onChange={(e) => setTargetPrice(Number(e.target.value))}
        />
        <p className="text-2xl">{targetPrice.toLocaleString('id-ID')} IDRX</p>
      </div>
      
      <div className="bg-green-100 p-6 rounded-lg">
        <p className="text-sm text-gray-600">Cashback Instant</p>
        {loading ? (
          <p className="text-3xl animate-pulse">Calculating...</p>
        ) : (
          <p className="text-4xl font-bold text-green-600">
            +{premium.toLocaleString('id-ID')} IDRX
          </p>
        )}
      </div>
    </div>
  );
}
```

## Integration Checklist

### Thetanuts V4
- [ ] Get API key from Thetanuts team
- [ ] Test RFQ endpoint on testnet
- [ ] Understand quote structure
- [ ] Implement FillQuote execution
- [ ] Handle settlement callbacks
- [ ] Test with real market makers

### Aave
- [ ] Find IDRX pool on Base (or use USDC)
- [ ] Get aToken contract address
- [ ] Test supply/withdraw flow
- [ ] Calculate interest accrual
- [ ] Handle edge case (pool full)

### Chainlink
- [ ] Setup Keeper for auto-roll
- [ ] Register upkeep contract
- [ ] Fund LINK for automation
- [ ] Test keeper triggers
- [ ] Get ETH/USD price feed

### Base / Paymaster
- [ ] Deploy contracts to Base Sepolia
- [ ] Setup Paymaster (Coinbase)
- [ ] Test gasless transactions
- [ ] Verify OnchainKit integration
- [ ] Deploy to Base Mainnet

### IDRX
- [ ] Get IDRX contract address on Base
- [ ] Verify decimals (18)
- [ ] Test transfers
- [ ] Setup approve/transferFrom flow
- [ ] Get IDRX/USDC swap route (if needed)

## Deployment Strategy

### Testnet (Base Sepolia)
1. Deploy NUNGGUVault.sol
2. Initialize with testnet addresses:
   - IDRX: [testnet address]
   - Thetanuts: [testnet RFQ]
   - Aave: [testnet pool]
3. Test all functions with small amounts
4. Verify gasless UX works
5. Run integration tests

### Mainnet (Base)
1. Audit contracts (minimal, hackathon-grade)
2. Deploy to Base mainnet
3. Initialize with mainnet addresses
4. Transfer ownership to multisig (optional)
5. Verify on BaseScan
6. Test with real small positions ($10-$50)
7. Monitor for 24 hours
8. If stable, announce to beta users

## Error Handling

### Common Issues & Solutions

**Issue:** RFQ returns no quotes
**Solution:** Fallback to Thetanuts vault (passive strategy)

**Issue:** Aave pool at capacity
**Solution:** Skip yield stacking, just hold IDRX

**Issue:** Chainlink Keeper not triggering
**Solution:** Manual cron job as backup

**Issue:** User's IDRX balance insufficient
**Solution:** Show clear error: "Insufficient balance. Need X IDRX"

**Issue:** Gas estimation fails
**Solution:** Use fixed gas limits (don't estimate dynamically)

## Security Considerations

### Smart Contract
- Use ReentrancyGuard for all state-changing functions
- Validate all inputs (no zero amounts, reasonable prices)
- Use SafeERC20 for token transfers
- Add emergency pause function (owner only)
- Test for integer overflow (use Solidity 0.8+)

### Backend
- Rate limit API endpoints (prevent DoS)
- Validate all user inputs
- Use environment variables for secrets
- Don't log sensitive data (private keys, API keys)
- Setup CORS properly (only allow frontend origin)

### Frontend
- Never expose private keys in client code
- Validate all inputs client-side (UX) AND server-side (security)
- Use HTTPS only (no HTTP)
- Sanitize user inputs (prevent XSS)
- Show clear warnings for risky actions

## Performance Optimization

### Smart Contracts
- Use indexed events (faster queries)
- Batch operations where possible
- Minimize storage writes (expensive)
- Use view functions for reads (free)

### Backend
- Cache RFQ quotes (30 second TTL)
- Use connection pooling for database
- Implement rate limiting
- Use CDN for static assets

### Frontend
- Code splitting (lazy load routes)
- Optimize images (WebP, proper sizing)
- Debounce user inputs (RFQ calls)
- Use React.memo for expensive components
- Implement virtual scrolling for long lists

## Monitoring & Analytics

### What to Track
- Total positions created
- Total premiums distributed
- Average premium amount
- Assignment rate (how often users get assets)
- Auto-roll engagement (% users enabling)
- Yield earned from Aave
- User retention (D1, D7, D30)
- Transaction success rate
- Average response time (RFQ calls)

### Tools
- **Smart Contracts:** The Graph (subgraph for events)
- **Backend:** Sentry (error tracking), Prometheus (metrics)
- **Frontend:** Vercel Analytics, PostHog (user behavior)
- **Blockchain:** Tenderly (transaction monitoring)

---

**End of Technical Spec**
