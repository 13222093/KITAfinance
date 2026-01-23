import { base, baseSepolia } from 'viem/chains';

const NETWORK = process.env.NETWORK || 'sepolia';

export const CONFIG = {
  activeNetwork: NETWORK,
  
  // Network-specific configurations
  networks: {
    mainnet: {
      chain: base,
      rpcUrl: process.env.BASE_MAINNET_RPC || 'https://mainnet.base.org',
      indexerUrl: "https://optionbook-indexer.thetanuts.finance/api/v1",
      contracts: {
        usdc: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        optionBook: "0xd58b814C7Ce700f251722b5555e25aE0fa8169A1",
        priceFeeds: {
          btc: "0x64c911996D3c6aC71f9b455B1E8E7266BcbD848F",
          eth: "0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70"
        },
        kitaVault: process.env.KITA_VAULT_ADDRESS_MAINNET || "0x0000000000000000000000000000000000000000",
        groupVault: process.env.GROUP_VAULT_ADDRESS_MAINNET || "0x0000000000000000000000000000000000000000"
      }
    },
    sepolia: {
      chain: baseSepolia,
      rpcUrl: process.env.BASE_SEPOLIA_RPC || 'https://sepolia.base.org',
      // For Sepolia, we might not have a live indexer yet, or use a mock URL
      // If Thetanuts has a testnet indexer, put it here. Otherwise, fallback or warn.
      indexerUrl: "https://testnet-optionbook-indexer.thetanuts.finance/api/v1", 
      contracts: {
        // TODO: Update these with deployed Mock addresses on Sepolia
        usdc: process.env.MOCK_USDC_ADDRESS || "0x0000000000000000000000000000000000000000",
        optionBook: process.env.MOCK_OPTIONBOOK_ADDRESS || "0x0000000000000000000000000000000000000000",
        priceFeeds: {
          // Mock feeds or placeholders
          btc: "0x0000000000000000000000000000000000000000",
          eth: "0x0000000000000000000000000000000000000000"
        },
        kitaVault: process.env.KITA_VAULT_ADDRESS_SEPOLIA || "0x0000000000000000000000000000000000000000",
        groupVault: process.env.GROUP_VAULT_ADDRESS_SEPOLIA || "0x0000000000000000000000000000000000000000"
      }
    }
  }
};

// Helper to get current config easily
export const getCurrentConfig = () => {
  return CONFIG.activeNetwork === 'mainnet' ? CONFIG.networks.mainnet : CONFIG.networks.sepolia;
};
