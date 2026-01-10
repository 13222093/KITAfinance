# NUNGGU Smart Contracts

NUNGGUVault - "Get Paid to Wait" DeFi Vault with Thetanuts Integration

## Overview

The NUNGGUVault smart contract allows users to earn instant cashback by setting limit orders to buy crypto at their target price. It works by selling cash-secured put options through Thetanuts V4 RFQ system and depositing collateral to Aave for additional yield.

## Project Structure

```
contracts/
├── contracts/
│   ├── NUNGGUVault.sol          # Main vault contract
│   ├── interfaces/
│   │   ├── IThetanutsRFQ.sol    # Thetanuts RFQ interface
│   │   └── IAave.sol            # Aave lending interface
│   └── mocks/
│       └── MockERC20.sol        # Mock IDRX token for testing
├── test/
│   └── NUNGGUVault.test.ts      # Comprehensive test suite
├── scripts/
│   └── deploy.ts                # Deployment script
├── hardhat.config.ts            # Hardhat configuration
├── .env.example                 # Environment variables template
└── README.md                    # This file
```

## Features

- **Instant Cashback**: Users receive premium immediately when creating positions
- **Yield Stacking**: Collateral deposited to Aave to earn interest while waiting
- **Auto-Roll**: Positions can automatically renew weekly until assignment
- **Position Management**: Users can view, close, and manage their positions
- **Platform Fees**: Configurable fee system (default 10% of premium)
- **Emergency Controls**: Pause/unpause functionality for safety

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Deployment
PRIVATE_KEY=your_private_key_here

# RPC URLs
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASE_MAINNET_RPC_URL=https://mainnet.base.org

# API Keys
BASESCAN_API_KEY=your_basescan_api_key_here

# Contract Addresses (Base Sepolia Testnet)
IDRX_ADDRESS=0x...
THETANUTS_RFQ_ADDRESS=0x...
AAVE_POOL_ADDRESS=0x...
ETH_ADDRESS=0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE
```

### 3. Compile Contracts

```bash
npx hardhat compile
```

## Testing

Run the test suite:

```bash
npx hardhat test
```

Run with gas reporting:

```bash
REPORT_GAS=true npx hardhat test
```

Run with coverage:

```bash
npx hardhat coverage
```

## Deployment

### Deploy to Base Sepolia (Testnet)

```bash
npx hardhat run scripts/deploy.ts --network baseSepolia
```

### Deploy to Base Mainnet

```bash
npx hardhat run scripts/deploy.ts --network base
```

### Verify on BaseScan

After deployment, verify the contract:

```bash
npx hardhat verify --network baseSepolia DEPLOYED_ADDRESS "IDRX_ADDRESS" "THETANUTS_ADDRESS" "AAVE_ADDRESS" "ETH_ADDRESS"
```

## Contract Addresses

### Base Sepolia Testnet

- **NUNGGUVault**: TBD (deploy first)
- **IDRX**: TBD (check BaseScan)
- **Thetanuts RFQ**: TBD (contact Thetanuts team)
- **Aave Pool**: [Find on Aave docs](https://docs.aave.com/developers/deployed-contracts/v3-testnet/base-sepolia)

### Base Mainnet

- **NUNGGUVault**: TBD
- **IDRX**: TBD (search on BaseScan)
- **Thetanuts RFQ**: TBD
- **Aave Pool**: `0xA238Dd80C259a72e81d7e4664a9801593F98d1c5`

## Usage

### Create a Position

```solidity
// 1. Approve vault to spend IDRX
IDRX.approve(vaultAddress, collateralAmount);

// 2. Create position
vault.createPosition(
    40000000 * 1e18,    // collateral (40M IDRX)
    40000000 * 1e18,    // targetPrice (40M IDRX)
    7 * 24 * 3600,      // expiryDuration (7 days)
    false               // autoRoll
);
```

### View Positions

```solidity
// Get all user positions
Position[] memory positions = vault.getUserPositions(userAddress);

// Get only active positions
Position[] memory activePositions = vault.getActivePositions(userAddress);

// Get total premium earned
uint256 totalPremium = vault.getTotalPremiumEarned(userAddress);
```

### Close a Position

```solidity
// Close position after expiry
vault.closePosition(positionId);
```

## Admin Functions

Only the contract owner can call these:

```solidity
// Update platform fee (in basis points)
vault.updateFee(500); // Set to 5%

// Withdraw collected fees
vault.withdrawFees(recipientAddress);

// Update minimum collateral
vault.updateMinCollateral(2000000 * 1e18); // 2M IDRX

// Pause contract (emergency)
vault.pause();

// Unpause contract
vault.unpause();

// Update Thetanuts RFQ address
vault.updateThetanutsRFQ(newAddress);

// Update Aave pool address
vault.updateAavePool(newAddress);
```

## Events

The contract emits the following events:

```solidity
event PositionCreated(
    address indexed user,
    uint256 indexed positionId,
    uint256 collateral,
    uint256 targetPrice,
    uint256 premium,
    uint256 expiry,
    bytes32 quoteId
);

event PositionClosed(
    address indexed user,
    uint256 indexed positionId,
    uint256 collateralReturned,
    uint256 yieldEarned
);

event PositionAssigned(
    address indexed user,
    uint256 indexed positionId,
    uint256 assetReceived
);

event PositionRolled(
    address indexed user,
    uint256 indexed oldPositionId,
    uint256 indexed newPositionId
);
```

## Security Considerations

- **ReentrancyGuard**: All state-changing functions are protected against reentrancy attacks
- **Pausable**: Contract can be paused in emergency situations
- **Access Control**: Admin functions restricted to owner only
- **SafeERC20**: All token transfers use OpenZeppelin's SafeERC20
- **Input Validation**: All user inputs are validated

## Integration Checklist

Before mainnet deployment:

- [ ] Get Thetanuts RFQ API key and contract address
- [ ] Verify IDRX token address on Base
- [ ] Confirm Aave pool supports IDRX (or use USDC)
- [ ] Test all functions on Base Sepolia testnet
- [ ] Run security audit (basic review minimum)
- [ ] Test with real small amounts ($10-$50)
- [ ] Setup monitoring (Tenderly, The Graph)
- [ ] Verify contract on BaseScan
- [ ] Transfer ownership to multisig (optional but recommended)

## Gas Optimization

Estimated gas costs (Base L2):

- `createPosition`: ~200-300k gas (~$0.20-$0.30 at 1 gwei)
- `closePosition`: ~100-150k gas (~$0.10-$0.15 at 1 gwei)
- `getUserPositions`: Free (view function)

## Troubleshooting

### Common Issues

**"Collateral below minimum"**
- Ensure collateral >= 1,000,000 IDRX (1M IDRX)

**"Insufficient allowance"**
- Call `IDRX.approve(vaultAddress, amount)` first

**"Insufficient balance"**
- Ensure your IDRX balance >= collateral amount

**Compilation errors**
- Make sure you're using Node.js version 18 or 20 (not 25)
- Run `npm install` again if dependencies are missing

**Test failures**
- Check that Hardhat network is clean: `npx hardhat clean`
- Recompile: `npx hardhat compile`

## Support & Resources

- **Documentation**: See `/home/ariaziz/hackathon/nunggu/.claude/` for full project specs
- **Thetanuts Docs**: https://docs.thetanuts.finance
- **Aave Docs**: https://docs.aave.com
- **Base Docs**: https://docs.base.org
- **OpenZeppelin**: https://docs.openzeppelin.com

## License

MIT

## Contributing

This is a hackathon project for Base Indonesia Hackathon + Thetanuts Track (Deadline: January 31, 2026).

---

**Built with ❤️ for the Indonesian crypto community**
