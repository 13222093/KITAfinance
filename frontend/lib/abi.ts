// ERC20 Standard ABI for USDC approval and balance checks
export const ERC20_ABI = [
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' }
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const;

// IOptionBook.Order struct - matches Thetanuts V4 exactly (13 fields)
// CRITICAL: This struct must match contracts/contracts/interfaces/IOptionBook.sol exactly
export const OPTION_BOOK_ORDER_TYPE = {
  name: 'order',
  type: 'tuple',
  components: [
    { name: 'maker', type: 'address' },              // Market maker address
    { name: 'orderExpiryTimestamp', type: 'uint256' }, // When this order expires
    { name: 'collateral', type: 'address' },          // Collateral token (USDC)
    { name: 'isCall', type: 'bool' },                 // true = call, false = put
    { name: 'priceFeed', type: 'address' },           // Chainlink price feed
    { name: 'implementation', type: 'address' },      // Strategy implementation
    { name: 'isLong', type: 'bool' },                 // true = buying, false = selling
    { name: 'maxCollateralUsable', type: 'uint256' }, // Max collateral maker will use
    { name: 'strikes', type: 'uint256[]' },           // Strike prices (8 decimals)
    { name: 'expiry', type: 'uint256' },              // Option expiry timestamp
    { name: 'price', type: 'uint256' },               // Price per contract (8 decimals)
    { name: 'numContracts', type: 'uint256' },        // Number of contracts to fill
    { name: 'extraOptionData', type: 'bytes' }        // Additional option parameters
  ]
};

// KITAVault ABI (Solo Vault) - Updated to match actual contract
export const KITA_VAULT_ABI = [
  {
    inputs: [
      OPTION_BOOK_ORDER_TYPE,
      { name: 'signature', type: 'bytes' },
      { name: 'collateralAmount', type: 'uint256' },
      { name: 'expectedPremium', type: 'uint256' }
    ],
    name: 'executeOrder',
    outputs: [{ name: 'positionId', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: 'positionId', type: 'uint256' }],
    name: 'closePosition',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'getUserPositions',
    outputs: [{ name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'collateralToken',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'minCollateral',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const;

// GroupVault ABI (Nabung Bareng)
export const GROUP_VAULT_ABI = [
  {
    inputs: [
      { name: 'name', type: 'string' },
      { name: 'initialDeposit', type: 'uint256' }
    ],
    name: 'createGroup',
    outputs: [{ name: 'groupId', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { name: 'groupId', type: 'uint256' },
      { name: 'deposit', type: 'uint256' }
    ],
    name: 'joinGroup',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { name: 'groupId', type: 'uint256' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { name: 'groupId', type: 'uint256' },
      { name: 'proposalType', type: 'uint8' },
      { name: 'data', type: 'bytes' }
    ],
    name: 'createProposal',
    outputs: [{ name: 'proposalId', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { name: 'proposalId', type: 'uint256' },
      { name: 'support', type: 'bool' }
    ],
    name: 'vote',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: 'proposalId', type: 'uint256' }],
    name: 'executeProposal',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const;

// Helper type for IOptionBook.Order struct (for TypeScript)
export interface IOptionBookOrder {
  maker: `0x${string}`;
  orderExpiryTimestamp: bigint;
  collateral: `0x${string}`;
  isCall: boolean;
  priceFeed: `0x${string}`;
  implementation: `0x${string}`;
  isLong: boolean;
  maxCollateralUsable: bigint;
  strikes: bigint[];
  expiry: bigint;
  price: bigint;
  numContracts: bigint;
  extraOptionData: `0x${string}`;
}