export type TokenSymbol = 'IDRX';

export interface Member {
  id: string;
  name?: string;
  address: string; // EVM address
  waPhone?: string; // WhatsApp phone
}

export interface Group {
  id: string;
  name: string;
  adminId: string;
  targetAmount: number;
  maxMembers: number; // 5-10
  createdAt: number;
  inviteCode?: string;
  members: Member[];
}

export interface Contribution {
  groupId: string;
  memberId: string;
  amount: number; // in IDRX units
  token: TokenSymbol;
  timestamp: number;
}

export interface PoolState {
  groupId: string;
  totalDeposited: number;
  aaveBalance?: number;
  accruedInterest?: number;
}

export type ProposalType = 'STRATEGY' | 'WITHDRAWAL';

export interface VoteRecord {
  memberId: string;
  choice: 'YES' | 'NO';
  timestamp: number;
}

export interface Proposal {
  id: string;
  groupId: string;
  type: ProposalType;
  title: string;
  details: string;
  createdBy: string;
  createdAt: number;
  votingDeadline: number; // epoch ms
  yesVotes: string[]; // memberId list
  noVotes: string[];
  requiredApprovalCount: number; // 50%+1
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXECUTED';
  history?: VoteRecord[];
}

export interface Position {
  id: string;
  protocol: 'THETANUTS' | 'AAVE' | 'OTHER';
  description: string;
  principal: number; // IDRX equivalent
  pnl?: number;
  status: 'active' | 'settled';
}
