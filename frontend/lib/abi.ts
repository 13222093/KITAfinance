export const NUNGGU_ABI = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "collateral", "type": "uint256" },
      { "internalType": "uint256", "name": "targetPrice", "type": "uint256" },
      { "internalType": "uint256", "name": "expiryDuration", "type": "uint256" },
      { "internalType": "bool", "name": "autoRoll", "type": "bool" }
    ],
    "name": "createPosition",
    "outputs": [{ "internalType": "uint256", "name": "positionId", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;