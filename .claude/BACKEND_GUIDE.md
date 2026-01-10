# NUNGGU - Backend Development Guide

## Quick Start
```bash
cd ~/hackathon/nunggu/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn web3 python-dotenv requests sqlalchemy psycopg2-binary

# Create project structure
mkdir -p {services,models,utils,routers}
touch main.py

# Create .env
cat > .env << EOF
DATABASE_URL=postgresql://user:pass@localhost/nunggu
BASE_RPC_URL=https://mainnet.base.org
THETANUTS_API_KEY=your_key_here
ALCHEMY_API_KEY=your_key_here
VAULT_CONTRACT_ADDRESS=0x...
EOF
```

## Project Structure
```
backend/
├── main.py                 # FastAPI app entry
├── models/
│   ├── __init__.py
│   ├── position.py        # Position database model
│   └── user.py            # User database model
├── routers/
│   ├── __init__.py
│   ├── rfq.py             # RFQ endpoints
│   ├── positions.py       # Position management
│   └── analytics.py       # Analytics/stats
├── services/
│   ├── __init__.py
│   ├── rfq_service.py     # Thetanuts RFQ integration
│   ├── price_monitor.py   # Price tracking
│   ├── ai_optimizer.py    # AI strike suggestions
│   └── event_listener.py  # Blockchain event monitoring
├── utils/
│   ├── __init__.py
│   ├── web3_client.py     # Web3 connection
│   └── helpers.py         # Utility functions
└── requirements.txt
```

## Main Application (`main.py`)
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import rfq, positions, analytics
from services.event_listener import start_event_listener
import asyncio

app = FastAPI(title="NUNGGU API", version="1.0.0")

# CORS (allow frontend origin)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://nunggu.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(rfq.router, prefix="/api/rfq", tags=["RFQ"])
app.include_router(positions.router, prefix="/api/positions", tags=["Positions"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])

@app.on_event("startup")
async def startup_event():
    # Start blockchain event listener
    asyncio.create_task(start_event_listener())
    print("🚀 NUNGGU API started")

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "NUNGGU API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

## RFQ Service (`services/rfq_service.py`)
```python
import requests
from typing import Dict, Optional
from web3 import Web3
import os

class RFQService:
    def __init__(self):
        self.api_url = "https://api.thetanuts.finance/v4/rfq"
        self.api_key = os.getenv("THETANUTS_API_KEY")
        self.w3 = Web3(Web3.HTTPProvider(os.getenv("BASE_RPC_URL")))
        
    async def get_quote(
        self,
        underlying: str = "ETH",
        strike_price: float = 40000000,  # in IDRX
        collateral: float = 40000000,   # in IDRX
        expiry_days: int = 7
    ) -> Dict:
        """
        Get quote from Thetanuts RFQ system.
        
        Returns:
        {
            "quote_id": "0x123...",
            "premium": 427500,  # IDRX
            "strike": 40000000,
            "expiry": 1706745600,
            "collateral": 40000000,
            "market_maker": "0xMM...",
            "valid_until": 1706659200
        }
        """
        
        # Prepare request
        payload = {
            "type": "PUT",
            "underlying": underlying,
            "strike": strike_price,
            "expiry_days": expiry_days,
            "collateral_amount": collateral,
            "collateral_currency": "IDRX",
            "chain": "base"
        }
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        try:
            response = requests.post(
                self.api_url,
                json=payload,
                headers=headers,
                timeout=10
            )
            response.raise_for_status()
            
            data = response.json()
            
            return {
                "quote_id": data["quoteId"],
                "premium": int(data["premium"]),  # Convert to IDRX base units
                "strike": int(strike_price),
                "expiry": data["expiry"],
                "collateral": int(collateral),
                "market_maker": data.get("marketMaker", ""),
                "valid_until": data.get("validUntil", 0),
                "fee": int(data.get("fee", 0))
            }
            
        except requests.exceptions.RequestException as e:
            print(f"RFQ request failed: {e}")
            # Return fallback (mock data for demo)
            return self._get_mock_quote(strike_price, collateral)
    
    def _get_mock_quote(self, strike: float, collateral: float) -> Dict:
        """Fallback mock quote if API fails (for demo purposes)."""
        premium = int(collateral * 0.01)  # 1% premium
        
        return {
            "quote_id": f"0xMOCK{int(strike)}",
            "premium": premium,
            "strike": int(strike),
            "expiry": int(time.time()) + 7*24*3600,
            "collateral": int(collateral),
            "market_maker": "0xMOCK",
            "valid_until": int(time.time()) + 300,  # 5 min validity
            "fee": int(premium * 0.01)  # 1% fee
        }
    
    async def execute_quote(self, quote_id: str, user_address: str) -> str:
        """
        Execute quote onchain via smart contract.
        Returns transaction hash.
        """
        # This would call the smart contract's executeRFQ function
        # For MVP, this might be handled by frontend directly
        pass

# Singleton instance
rfq_service = RFQService()
```

## RFQ Router (`routers/rfq.py`)
```python
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.rfq_service import rfq_service

router = APIRouter()

class QuoteRequest(BaseModel):
    underlying: str = "ETH"
    target_price: float  # in IDRX
    collateral: float    # in IDRX
    expiry_days: int = 7

class QuoteResponse(BaseModel):
    quote_id: str
    premium: int
    strike: int
    expiry: int
    collateral: int
    market_maker: str
    valid_until: int
    fee: int

@router.post("/quote", response_model=QuoteResponse)
async def get_quote(request: QuoteRequest):
    """
    Get RFQ quote for a put option.
    
    Example:
    POST /api/rfq/quote
    {
        "target_price": 40000000,
        "collateral": 40000000,
        "expiry_days": 7
    }
    
    Response:
    {
        "quote_id": "0x123...",
        "premium": 427500,
        "strike": 40000000,
        ...
    }
    """
    try:
        quote = await rfq_service.get_quote(
            underlying=request.underlying,
            strike_price=request.target_price,
            collateral=request.collateral,
            expiry_days=request.expiry_days
        )
        
        return QuoteResponse(**quote)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/quotes/multiple")
async def get_multiple_quotes(
    collateral: float,
    strike_range_start: float,
    strike_range_end: float,
    strike_step: float = 1000000  # 1M IDRX steps
):
    """
    Get quotes for multiple strike prices.
    Useful for showing user different options.
    
    Example:
    GET /api/rfq/quotes/multiple?collateral=40000000&strike_range_start=38000000&strike_range_end=42000000
    
    Response:
    [
        {"strike": 38000000, "premium": 850000, ...},
        {"strike": 39000000, "premium": 650000, ...},
        {"strike": 40000000, "premium": 427500, ...},
        {"strike": 41000000, "premium": 250000, ...},
        {"strike": 42000000, "premium": 120000, ...}
    ]
    """
    quotes = []
    
    strike = strike_range_start
    while strike <= strike_range_end:
        quote = await rfq_service.get_quote(
            strike_price=strike,
            collateral=collateral
        )
        quotes.append(quote)
        strike += strike_step
    
    return quotes
```

## Event Listener (`services/event_listener.py`)
```python
from web3 import Web3
from web3.contract import Contract
import asyncio
import os
import json

class EventListener:
    def __init__(self):
        self.w3 = Web3(Web3.HTTPProvider(os.getenv("BASE_RPC_URL")))
        self.vault_address = os.getenv("VAULT_CONTRACT_ADDRESS")
        
        # Load contract ABI
        with open("../contracts/artifacts/NUNGGUVault.json") as f:
            contract_json = json.load(f)
            self.contract: Contract = self.w3.eth.contract(
                address=self.vault_address,
                abi=contract_json["abi"]
            )
    
    async def listen_position_created(self):
        """Listen for PositionCreated events and update database."""
        
        event_filter = self.contract.events.PositionCreated.create_filter(
            fromBlock="latest"
        )
        
        while True:
            for event in event_filter.get_new_entries():
                await self.handle_position_created(event)
            
            await asyncio.sleep(5)  # Check every 5 seconds
    
    async def handle_position_created(self, event):
        """Process PositionCreated event."""
        user = event['args']['user']
        collateral = event['args']['collateral']
        premium = event['args']['premium']
        
        print(f"📍 Position created: {user[:8]}... | Collateral: {collateral} | Premium: {premium}")
        
        # TODO: Save to database
        # TODO: Send notification to user (email/WhatsApp)
        # TODO: Update analytics
    
    async def listen_position_assigned(self):
        """Listen for PositionAssigned events."""
        # Similar to above
        pass

async def start_event_listener():
    """Start all event listeners."""
    listener = EventListener()
    
    # Run multiple listeners concurrently
    await asyncio.gather(
        listener.listen_position_created(),
        listener.listen_position_assigned()
    )
```

## AI Optimizer (`services/ai_optimizer.py`)
```python
from typing import Dict
from services.rfq_service import rfq_service

class AIOptimizer:
    async def suggest_optimal_strike(
        self,
        current_price: float,  # Current ETH price in IDRX
        user_budget: float,    # Max collateral
        risk_tolerance: str = "medium"  # "low", "medium", "high"
    ) -> Dict:
        """
        Suggest optimal strike price for best risk/reward.
        
        Strategy:
        - Low risk: Strike 5-7% below current (safer, lower premium)
        - Medium risk: Strike 3-5% below current (balanced)
        - High risk: Strike 1-3% below current (higher premium, higher assignment risk)
        
        Returns:
        {
            "recommended_strike": 39500000,
            "expected_premium": 650000,
            "assignment_probability": 0.35,
            "reasoning": "Strike 1.5% below current price gives 2x premium...",
            "alternatives": [
                {"strike": 38000000, "premium": 850000, "risk": "low"},
                {"strike": 40000000, "premium": 427500, "risk": "medium"},
                {"strike": 41000000, "premium": 250000, "risk": "high"}
            ]
        }
        """
        
        # Define strike ranges based on risk tolerance
        risk_ranges = {
            "low": (0.93, 0.95),     # 5-7% below
            "medium": (0.95, 0.97),  # 3-5% below
            "high": (0.97, 0.99)     # 1-3% below
        }
        
        min_mult, max_mult = risk_ranges.get(risk_tolerance, (0.95, 0.97))
        
        # Generate candidate strikes
        strikes = [
            current_price * min_mult,
            current_price * ((min_mult + max_mult) / 2),
            current_price * max_mult
        ]
        
        # Get quotes for each strike
        quotes = []
        for strike in strikes:
            quote = await rfq_service.get_quote(
                strike_price=strike,
                collateral=user_budget
            )
            quotes.append(quote)
        
        # Pick strike with highest premium
        best_quote = max(quotes, key=lambda q: q['premium'])
        
        # Calculate assignment probability (simplified heuristic)
        distance_pct = abs(current_price - best_quote['strike']) / current_price
        assignment_prob = min(0.9, 0.1 + (0.05 - distance_pct) * 10)
        
        reasoning = self._generate_reasoning(
            current_price,
            best_quote['strike'],
            best_quote['premium'],
            user_budget,
            assignment_prob
        )
        
        return {
            "recommended_strike": best_quote['strike'],
            "expected_premium": best_quote['premium'],
            "assignment_probability": round(assignment_prob, 2),
            "reasoning": reasoning,
            "alternatives": [
                {
                    "strike": q['strike'],
                    "premium": q['premium'],
                    "distance_pct": round(abs(current_price - q['strike']) / current_price * 100, 1)
                }
                for q in quotes
            ]
        }
    
    def _generate_reasoning(self, current, strike, premium, collateral, prob):
        distance_pct = abs(current - strike) / current * 100
        premium_pct = premium / collateral * 100
        
        return (
            f"Strike {strike:,.0f} IDRX ({distance_pct:.1f}% below market) "
            f"gives {premium_pct:.2f}% premium ({premium:,.0f} IDRX). "
            f"Assignment probability: {prob*100:.0f}%. "
            f"Good balance of yield and safety."
        )

# Singleton
ai_optimizer = AIOptimizer()
```

## Testing Your Backend
```bash
# Start server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Test health endpoint
curl http://localhost:8000/health

# Test RFQ quote
curl -X POST http://localhost:8000/api/rfq/quote \
  -H "Content-Type: application/json" \
  -d '{
    "target_price": 40000000,
    "collateral": 40000000,
    "expiry_days": 7
  }'

# Expected response:
# {
#   "quote_id": "0x123...",
#   "premium": 427500,
#   "strike": 40000000,
#   ...
# }

# Test AI optimizer
curl http://localhost:8000/api/ai/optimize?current_price=42000000&budget=40000000&risk=medium
```

## Deployment (Railway / Render)
```bash
# Create Procfile
echo "web: uvicorn main:app --host 0.0.0.0 --port \$PORT" > Procfile

# Create requirements.txt
pip freeze > requirements.txt

# Deploy to Railway
railway init
railway up

# Or deploy to Render
# (Connect GitHub repo, set environment variables)
```

---

**Your Tasks (Backend Dev):**

**Priority 1 (Days 1-3):**
- [ ] Setup FastAPI project
- [ ] Create basic endpoints (/health, /api/rfq/quote)
- [ ] Test with mock data
- [ ] Deploy to Railway/Render (testnet)

**Priority 2 (Days 4-7):**
- [ ] Integrate real Thetanuts RFQ API
- [ ] Test quote requests
- [ ] Handle errors/fallbacks
- [ ] Add caching (Redis optional)

**Priority 3 (Days 8-10):**
- [ ] Build event listener
- [ ] Connect to smart contract
- [ ] Process PositionCreated events
- [ ] Save to database (optional, can skip)

**Priority 4 (Days 11-14):**
- [ ] Build AI optimizer
- [ ] Test with various inputs
- [ ] Add price monitoring
- [ ] Setup notifications (WhatsApp/Email)

**Days 15-21:**
- [ ] Bug fixes
- [ ] Performance optimization
- [ ] Load testing
- [ ] Deploy to production

**End of Backend Guide**
