import { parseAbiItem } from 'viem';
import { publicClient } from '../utils/client';
import { getCurrentConfig } from '../config';

// Simple in-memory store for MVP
export const recentPositions: any[] = [];
export const recentGroupEvents: any[] = [];

// ABIs
const PositionCreatedAbi = parseAbiItem(
  'event PositionCreated(address indexed user, uint256 indexed positionId, address optionContract, uint256 collateral, uint256 premium, uint256 strikePrice, uint256 expiry, bool isCall, bool isLong)'
);

const GroupCreatedAbi = parseAbiItem(
  'event GroupCreated(uint256 indexed groupId, string name, address indexed admin)'
);

const ProposalCreatedAbi = parseAbiItem(
  'event ProposalCreated(uint256 indexed proposalId, uint256 indexed groupId, uint8 proposalType, address indexed proposer)'
);

export const startEventListener = () => {
  const config = getCurrentConfig();
  const kitaVaultAddress = config.contracts.kitaVault as `0x${string}`;
  const groupVaultAddress = config.contracts.groupVault as `0x${string}`;

  console.log(`👂 Starting Event Listener on ${config.chain.name}...`);

  // Listener for KITAVault
  if (kitaVaultAddress && !kitaVaultAddress.startsWith("0x0000")) {
    console.log(`   - Listening to KITAVault: ${kitaVaultAddress}`);
    publicClient.watchEvent({
      address: kitaVaultAddress,
      event: PositionCreatedAbi,
      onLogs: (logs) => {
        logs.forEach(log => {
          const args = log.args;
          console.log(`📍 [KITA] New Position: ID ${args.positionId} | User ${args.user}`);
          recentPositions.unshift({
              type: 'POSITION_CREATED',
              txHash: log.transactionHash,
              ...args,
              timestamp: new Date().toISOString()
          });
          if (recentPositions.length > 100) recentPositions.pop();
        });
      }
    });
  } else {
    console.warn("⚠️ KITAVault address not configured. Skipping listener.");
  }

  // Listener for GroupVault
  if (groupVaultAddress && !groupVaultAddress.startsWith("0x0000")) {
    console.log(`   - Listening to GroupVault: ${groupVaultAddress}`);
    
    // Group Created
    publicClient.watchEvent({
      address: groupVaultAddress,
      event: GroupCreatedAbi,
      onLogs: (logs) => {
        logs.forEach(log => {
          const args = log.args;
          console.log(`👥 [GROUP] New Group: ${args.name} (ID: ${args.groupId})`);
          recentGroupEvents.unshift({
              type: 'GROUP_CREATED',
              txHash: log.transactionHash,
              ...args,
              timestamp: new Date().toISOString()
          });
        });
      }
    });

    // Proposal Created
    publicClient.watchEvent({
      address: groupVaultAddress,
      event: ProposalCreatedAbi,
      onLogs: (logs) => {
        logs.forEach(log => {
          const args = log.args;
          console.log(`🗳️ [GROUP] New Proposal: ID ${args.proposalId} in Group ${args.groupId}`);
          recentGroupEvents.unshift({
              type: 'PROPOSAL_CREATED',
              txHash: log.transactionHash,
              ...args,
              timestamp: new Date().toISOString()
          });
        });
      }
    });
  } else {
    console.warn("⚠️ GroupVault address not configured. Skipping listener.");
  }
};