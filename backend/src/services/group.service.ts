import { publicClient } from '../utils/client';
import { getCurrentConfig } from '../config';
import { parseAbi } from 'viem';

// GroupVault ABI (read-only functions)
const groupVaultAbi = parseAbi([
    'function getGroup(uint256 groupId) view returns ((string name, address admin, uint256 totalDeposited, uint256 memberCount, uint256 createdAt, uint256 streakWeeks, bool isActive))',
    'function getGroupMembers(uint256 groupId) view returns (address[])',
    'function getMemberContribution(uint256 groupId, address member) view returns (uint256)',
    'function getMemberShare(uint256 groupId, address member) view returns (uint256)',
    'function getGroupPositions(uint256 groupId) view returns ((uint256 groupId, address optionContract, uint256 collateralAmount, uint256 premiumReceived, uint256 expiry, bool isActive)[])',
    'function getUserGroups(address user) view returns (uint256[])',
    'function nextGroupId() view returns (uint256)',
    'function proposals(uint256 proposalId) view returns (uint256 groupId, uint8 proposalType, bytes data, uint256 votesFor, uint256 votesAgainst, uint256 deadline, bool executed, bool cancelled)',
    'function nextProposalId() view returns (uint256)',
]);

export interface Group {
    id: number;
    name: string;
    admin: string;
    totalDeposited: string;
    memberCount: number;
    createdAt: string;
    streakWeeks: number;
    isActive: boolean;
}

export interface GroupMember {
    address: string;
    contribution: string;
    sharePercent: number;
}

export interface GroupPosition {
    optionContract: string;
    collateralAmount: string;
    premiumReceived: string;
    expiry: string;
    isActive: boolean;
}

export interface Proposal {
    id: number;
    groupId: number;
    proposalType: string;
    votesFor: number;
    votesAgainst: number;
    deadline: string;
    executed: boolean;
    cancelled: boolean;
}

const PROPOSAL_TYPES = ['EXECUTE_STRATEGY', 'WITHDRAW', 'ADD_MEMBER', 'REMOVE_MEMBER', 'CHANGE_ADMIN'];

export class GroupService {
    private getContractAddress(): `0x${string}` {
        const config = getCurrentConfig();
        return config.contracts.groupVault as `0x${string}`;
    }

    private isConfigured(): boolean {
        const address = this.getContractAddress();
        return address !== '0x0000000000000000000000000000000000000000';
    }

    /**
     * Get all groups (paginated by fetching count then each group)
     */
    async getGroups(limit = 20): Promise<Group[]> {
        if (!this.isConfigured()) {
            return [];
        }

        try {
            const address = this.getContractAddress();
            const nextGroupId = await publicClient.readContract({
                address,
                abi: groupVaultAbi,
                functionName: 'nextGroupId',
            }) as bigint;

            const groups: Group[] = [];
            const maxId = Number(nextGroupId);
            const fetchCount = Math.min(maxId, limit);

            for (let i = 0; i < fetchCount; i++) {
                const group = await this.getGroup(i);
                if (group && group.isActive) {
                    groups.push(group);
                }
            }

            return groups;
        } catch {
            return [];
        }
    }

    /**
     * Get single group details
     */
    async getGroup(groupId: number): Promise<Group | null> {
        if (!this.isConfigured()) {
            return null;
        }

        try {
            const address = this.getContractAddress();
            const result = await publicClient.readContract({
                address,
                abi: groupVaultAbi,
                functionName: 'getGroup',
                args: [BigInt(groupId)],
            }) as any;

            return {
                id: groupId,
                name: result.name,
                admin: result.admin,
                totalDeposited: (Number(result.totalDeposited) / 1e6).toFixed(2), // USDC has 6 decimals
                memberCount: Number(result.memberCount),
                createdAt: new Date(Number(result.createdAt) * 1000).toISOString(),
                streakWeeks: Number(result.streakWeeks),
                isActive: result.isActive,
            };
        } catch {
            return null;
        }
    }

    /**
     * Get group members with contributions
     */
    async getGroupMembers(groupId: number): Promise<GroupMember[]> {
        if (!this.isConfigured()) {
            return [];
        }

        try {
            const address = this.getContractAddress();
            const memberAddresses = await publicClient.readContract({
                address,
                abi: groupVaultAbi,
                functionName: 'getGroupMembers',
                args: [BigInt(groupId)],
            }) as string[];

            const members: GroupMember[] = [];

            for (const memberAddr of memberAddresses) {
                const [contribution, share] = await Promise.all([
                    publicClient.readContract({
                        address,
                        abi: groupVaultAbi,
                        functionName: 'getMemberContribution',
                        args: [BigInt(groupId), memberAddr as `0x${string}`],
                    }) as Promise<bigint>,
                    publicClient.readContract({
                        address,
                        abi: groupVaultAbi,
                        functionName: 'getMemberShare',
                        args: [BigInt(groupId), memberAddr as `0x${string}`],
                    }) as Promise<bigint>,
                ]);

                members.push({
                    address: memberAddr,
                    contribution: (Number(contribution) / 1e6).toFixed(2),
                    sharePercent: Number(share) / 100, // Basis points to percent
                });
            }

            return members;
        } catch {
            return [];
        }
    }

    /**
     * Get group positions (options trades)
     */
    async getGroupPositions(groupId: number): Promise<GroupPosition[]> {
        if (!this.isConfigured()) {
            return [];
        }

        try {
            const address = this.getContractAddress();
            const positions = await publicClient.readContract({
                address,
                abi: groupVaultAbi,
                functionName: 'getGroupPositions',
                args: [BigInt(groupId)],
            }) as any[];

            return positions.map((p: any) => ({
                optionContract: p.optionContract,
                collateralAmount: (Number(p.collateralAmount) / 1e6).toFixed(2),
                premiumReceived: (Number(p.premiumReceived) / 1e6).toFixed(2),
                expiry: new Date(Number(p.expiry) * 1000).toISOString(),
                isActive: p.isActive,
            }));
        } catch {
            return [];
        }
    }

    /**
     * Get groups a user belongs to
     */
    async getUserGroups(userAddress: string): Promise<Group[]> {
        if (!this.isConfigured()) {
            return [];
        }

        try {
            const address = this.getContractAddress();
            const groupIds = await publicClient.readContract({
                address,
                abi: groupVaultAbi,
                functionName: 'getUserGroups',
                args: [userAddress as `0x${string}`],
            }) as bigint[];

            const groups: Group[] = [];
            for (const gid of groupIds) {
                const group = await this.getGroup(Number(gid));
                if (group && group.isActive) {
                    groups.push(group);
                }
            }

            return groups;
        } catch {
            return [];
        }
    }

    /**
     * Get proposals for a group
     */
    async getProposals(groupId: number, limit = 10): Promise<Proposal[]> {
        if (!this.isConfigured()) {
            return [];
        }

        try {
            const address = this.getContractAddress();
            const nextProposalId = await publicClient.readContract({
                address,
                abi: groupVaultAbi,
                functionName: 'nextProposalId',
            }) as bigint;

            const proposals: Proposal[] = [];
            const maxId = Number(nextProposalId);

            // Scan proposals and filter by groupId
            for (let i = maxId - 1; i >= 0 && proposals.length < limit; i--) {
                try {
                    const result = await publicClient.readContract({
                        address,
                        abi: groupVaultAbi,
                        functionName: 'proposals',
                        args: [BigInt(i)],
                    }) as any;

                    if (Number(result.groupId) === groupId) {
                        proposals.push({
                            id: i,
                            groupId: Number(result.groupId),
                            proposalType: PROPOSAL_TYPES[result.proposalType] || 'UNKNOWN',
                            votesFor: Number(result.votesFor),
                            votesAgainst: Number(result.votesAgainst),
                            deadline: new Date(Number(result.deadline) * 1000).toISOString(),
                            executed: result.executed,
                            cancelled: result.cancelled,
                        });
                    }
                } catch {
                    // Skip invalid proposals
                }
            }

            return proposals;
        } catch {
            return [];
        }
    }

    /**
     * Get positions expiring within a time window
     * @param hoursAhead - Look for positions expiring within this many hours
     */
    async getExpiringPositions(hoursAhead: number = 24): Promise<{
        groupId: number;
        groupName: string;
        position: GroupPosition;
        hoursUntilExpiry: number;
    }[]> {
        if (!this.isConfigured()) {
            return [];
        }

        const expiringPositions: {
            groupId: number;
            groupName: string;
            position: GroupPosition;
            hoursUntilExpiry: number;
        }[] = [];

        try {
            const groups = await this.getGroups(100);
            const now = Date.now();
            const cutoffTime = now + (hoursAhead * 60 * 60 * 1000);

            for (const group of groups) {
                const positions = await this.getGroupPositions(group.id);

                for (const position of positions) {
                    if (!position.isActive) continue;

                    const expiryTime = new Date(position.expiry).getTime();
                    if (expiryTime > now && expiryTime <= cutoffTime) {
                        const hoursUntilExpiry = Math.ceil((expiryTime - now) / (1000 * 60 * 60));
                        expiringPositions.push({
                            groupId: group.id,
                            groupName: group.name,
                            position,
                            hoursUntilExpiry,
                        });
                    }
                }
            }

            return expiringPositions;
        } catch {
            return [];
        }
    }
}

export const groupService = new GroupService();
