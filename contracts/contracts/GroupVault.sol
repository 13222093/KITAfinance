// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./interfaces/IOptionBook.sol";
import "./interfaces/IAave.sol";

/**
 * @title GroupVault
 * @notice "Nabung Bareng" - Pooled investing with voting for KITA
 * @dev Allows groups of users to pool capital and vote on investment decisions
 * 
 * Features:
 * - Create investment groups (5-10 members)
 * - Proportional profit sharing based on contribution
 * - Voting system for strategy execution and withdrawals
 * - Streak tracking for gamification
 */
contract GroupVault is ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // ============ Structs ============

    struct Group {
        string name;
        address admin;
        uint256 totalDeposited;
        uint256 memberCount;
        uint256 createdAt;
        uint256 streakWeeks;       // Consecutive weeks profitable
        bool isActive;
    }

    struct Member {
        address user;
        uint256 contribution;      // Amount deposited
        uint256 joinedAt;
        bool isActive;
    }

    struct Proposal {
        uint256 groupId;
        ProposalType proposalType;
        bytes data;               // Encoded proposal data
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 deadline;
        bool executed;
        bool cancelled;
        mapping(address => bool) hasVoted;
    }

    struct GroupPosition {
        uint256 groupId;
        address optionContract;
        uint256 collateralAmount;
        uint256 premiumReceived;
        uint256 expiry;
        bool isActive;
    }

    enum ProposalType {
        EXECUTE_STRATEGY,    // Execute a Thetanuts order
        WITHDRAW,           // Withdraw funds from group
        ADD_MEMBER,         // Add new member
        REMOVE_MEMBER,      // Remove member
        CHANGE_ADMIN        // Change group admin
    }

    // ============ State Variables ============

    IOptionBook public immutable optionBook;
    IERC20 public immutable collateralToken; // USDC
    IAave public aavePool;
    address public platformOwner;
    address public referrer;

    // Groups: groupId => Group
    mapping(uint256 => Group) public groups;
    uint256 public nextGroupId;

    // Members: groupId => member address => Member
    mapping(uint256 => mapping(address => Member)) public members;
    
    // Member list: groupId => member addresses
    mapping(uint256 => address[]) public memberList;

    // Proposals: proposalId => Proposal
    mapping(uint256 => Proposal) public proposals;
    uint256 public nextProposalId;

    // Group positions: groupId => positions[]
    mapping(uint256 => GroupPosition[]) public groupPositions;

    // User groups: user => groupIds[]
    mapping(address => uint256[]) public userGroups;

    // Aave shares per group
    mapping(uint256 => uint256) public groupAaveShares;


    // Configuration
    uint256 public constant MIN_MEMBERS = 2;
    uint256 public constant MAX_MEMBERS = 10;
    uint256 public constant VOTING_PERIOD = 48 hours;
    uint256 public constant QUORUM_PERCENT = 50; // 50% + 1 vote needed

    uint256 public platformFee = 500; // 5%
    uint256 public collectedFees;

    // ============ Events ============

    event GroupCreated(uint256 indexed groupId, string name, address indexed admin);
    event MemberJoined(uint256 indexed groupId, address indexed member, uint256 amount);
    event MemberLeft(uint256 indexed groupId, address indexed member, uint256 amountReturned);
    event DepositMade(uint256 indexed groupId, address indexed member, uint256 amount);
    
    event ProposalCreated(
        uint256 indexed proposalId,
        uint256 indexed groupId,
        ProposalType proposalType,
        address indexed proposer
    );
    event Voted(uint256 indexed proposalId, address indexed voter, bool support);
    event ProposalExecuted(uint256 indexed proposalId);
    event ProposalCancelled(uint256 indexed proposalId);

    event StrategyExecuted(
        uint256 indexed groupId,
        address optionContract,
        uint256 collateral,
        uint256 premium
    );
    event ProfitDistributed(uint256 indexed groupId, uint256 totalProfit);
    event StreakUpdated(uint256 indexed groupId, uint256 newStreak);

    // ============ Modifiers ============

    modifier onlyGroupAdmin(uint256 groupId) {
        require(groups[groupId].admin == msg.sender, "Not group admin");
        _;
    }

    modifier onlyGroupMember(uint256 groupId) {
        require(members[groupId][msg.sender].isActive, "Not a member");
        _;
    }

    modifier groupExists(uint256 groupId) {
        require(groups[groupId].isActive, "Group not found");
        _;
    }

    // ============ Constructor ============

    constructor(
        address _optionBook,
        address _collateralToken,
        address _aavePool,
        address _referrer
    ) {
        require(_optionBook != address(0), "Invalid OptionBook");
        require(_collateralToken != address(0), "Invalid token");
        
        optionBook = IOptionBook(_optionBook);
        collateralToken = IERC20(_collateralToken);
        aavePool = IAave(_aavePool);
        referrer = _referrer;
        platformOwner = msg.sender;
    }

    // ============ Group Management ============

    /**
     * @notice Create a new investment group
     * @param name Group name (e.g., "Grup Nikahan Budi")
     * @param initialDeposit Admin's initial deposit
     */
    function createGroup(
        string calldata name,
        uint256 initialDeposit
    ) external nonReentrant whenNotPaused returns (uint256 groupId) {
        require(bytes(name).length > 0, "Name required");
        require(initialDeposit > 0, "Deposit required");

        groupId = nextGroupId++;

        groups[groupId] = Group({
            name: name,
            admin: msg.sender,
            totalDeposited: initialDeposit,
            memberCount: 1,
            createdAt: block.timestamp,
            streakWeeks: 0,
            isActive: true
        });

        members[groupId][msg.sender] = Member({
            user: msg.sender,
            contribution: initialDeposit,
            joinedAt: block.timestamp,
            isActive: true
        });
        memberList[groupId].push(msg.sender);
        userGroups[msg.sender].push(groupId);

        // Transfer deposit
        collateralToken.safeTransferFrom(msg.sender, address(this), initialDeposit);

        // Deposit to Aave for yield
        if (address(aavePool) != address(0)) {
            uint256 shares = _depositToAave(initialDeposit);
            groupAaveShares[groupId] = shares;
        }

        emit GroupCreated(groupId, name, msg.sender);
        emit MemberJoined(groupId, msg.sender, initialDeposit);
    }

    /**
     * @notice Join an existing group
     * @param groupId The group to join
     * @param deposit Amount to deposit
     */
    function joinGroup(
        uint256 groupId,
        uint256 deposit
    ) external nonReentrant whenNotPaused groupExists(groupId) {
        Group storage group = groups[groupId];
        require(group.memberCount < MAX_MEMBERS, "Group full");
        require(!members[groupId][msg.sender].isActive, "Already member");
        require(deposit > 0, "Deposit required");

        group.memberCount++;
        group.totalDeposited += deposit;

        members[groupId][msg.sender] = Member({
            user: msg.sender,
            contribution: deposit,
            joinedAt: block.timestamp,
            isActive: true
        });
        memberList[groupId].push(msg.sender);
        userGroups[msg.sender].push(groupId);

        // Transfer and stake
        collateralToken.safeTransferFrom(msg.sender, address(this), deposit);
        if (address(aavePool) != address(0)) {
            uint256 shares = _depositToAave(deposit);
            groupAaveShares[groupId] += shares;
        }

        emit MemberJoined(groupId, msg.sender, deposit);
    }

    /**
     * @notice Deposit more funds to a group
     * @param groupId The group ID
     * @param amount Amount to deposit
     */
    function deposit(
        uint256 groupId,
        uint256 amount
    ) external nonReentrant whenNotPaused onlyGroupMember(groupId) {
        require(amount > 0, "Amount required");

        Group storage group = groups[groupId];
        Member storage member = members[groupId][msg.sender];

        group.totalDeposited += amount;
        member.contribution += amount;

        collateralToken.safeTransferFrom(msg.sender, address(this), amount);
        if (address(aavePool) != address(0)) {
            uint256 shares = _depositToAave(amount);
            groupAaveShares[groupId] += shares;
        }

        emit DepositMade(groupId, msg.sender, amount);
    }

    // ============ Voting System ============

    /**
     * @notice Create a proposal for group action
     * @param groupId The group ID
     * @param proposalType Type of proposal
     * @param data Encoded proposal data
     */
    function createProposal(
        uint256 groupId,
        ProposalType proposalType,
        bytes calldata data
    ) external onlyGroupMember(groupId) returns (uint256 proposalId) {
        proposalId = nextProposalId++;

        Proposal storage proposal = proposals[proposalId];
        proposal.groupId = groupId;
        proposal.proposalType = proposalType;
        proposal.data = data;
        proposal.deadline = block.timestamp + VOTING_PERIOD;

        emit ProposalCreated(proposalId, groupId, proposalType, msg.sender);
    }

    /**
     * @notice Vote on a proposal
     * @param proposalId The proposal ID
     * @param support True for yes, false for no
     */
    function vote(uint256 proposalId, bool support) external {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp < proposal.deadline, "Voting ended");
        require(!proposal.executed && !proposal.cancelled, "Proposal closed");
        require(!proposal.hasVoted[msg.sender], "Already voted");
        require(members[proposal.groupId][msg.sender].isActive, "Not a member");

        proposal.hasVoted[msg.sender] = true;

        if (support) {
            proposal.votesFor++;
        } else {
            proposal.votesAgainst++;
        }

        emit Voted(proposalId, msg.sender, support);
    }

    /**
     * @notice Execute a passed proposal
     * @param proposalId The proposal ID
     */
    function executeProposal(uint256 proposalId) external nonReentrant {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp >= proposal.deadline, "Voting ongoing");
        require(!proposal.executed && !proposal.cancelled, "Already processed");

        Group storage group = groups[proposal.groupId];
        uint256 quorumNeeded = (group.memberCount * QUORUM_PERCENT / 100) + 1;
        require(proposal.votesFor >= quorumNeeded, "Quorum not reached");
        require(proposal.votesFor > proposal.votesAgainst, "Proposal rejected");

        proposal.executed = true;

        // Execute based on type
        if (proposal.proposalType == ProposalType.EXECUTE_STRATEGY) {
            _executeStrategy(proposal.groupId, proposal.data);
        } else if (proposal.proposalType == ProposalType.WITHDRAW) {
            _executeWithdraw(proposal.groupId, proposal.data);
        }
        // Other types can be added

        emit ProposalExecuted(proposalId);
    }

    // ============ Strategy Execution ============

    /**
     * @notice Internal: Execute a Thetanuts strategy
     */
    function _executeStrategy(uint256 groupId, bytes memory data) internal {
        // Decode: (order, signature, collateralAmount)
        (
            IOptionBook.Order memory order,
            bytes memory signature,
            uint256 collateralAmount
        ) = abi.decode(data, (IOptionBook.Order, bytes, uint256));

        Group storage group = groups[groupId];
        require(collateralAmount <= group.totalDeposited, "Insufficient funds");

        // Withdraw from Aave if needed
        if (address(aavePool) != address(0) && groupAaveShares[groupId] > 0) {
            _withdrawFromAave(groupAaveShares[groupId]);
            groupAaveShares[groupId] = 0;
        }

        // Approve and execute
        collateralToken.approve(address(optionBook), collateralAmount);

        // IMPORTANT: Do NOT modify order fields - signature will break!
        // The order (including numContracts) must be passed exactly as received from the API
        address optionContract = optionBook.fillOrder(order, signature, referrer);

        uint256 grossPremium = (order.price * order.numContracts) / 1e8;
        
        // Bug #7 fix: Slippage protection (at least 95% of expected premium)
        require(collateralAmount >= grossPremium, "Insufficient collateral");
        
        uint256 fee = (grossPremium * platformFee) / 10000;
        uint256 netPremium = grossPremium - fee;
        collectedFees += fee;

        // Create position
        groupPositions[groupId].push(GroupPosition({
            groupId: groupId,
            optionContract: optionContract,
            collateralAmount: collateralAmount,
            premiumReceived: netPremium,
            expiry: order.expiry,
            isActive: true
        }));

        // Redeposit remaining to Aave
        uint256 remaining = group.totalDeposited - collateralAmount + netPremium;
        if (address(aavePool) != address(0) && remaining > 0) {
            groupAaveShares[groupId] = _depositToAave(remaining);
        }

        group.totalDeposited = remaining;

        emit StrategyExecuted(groupId, optionContract, collateralAmount, netPremium);
    }

    /**
     * @notice Internal: Execute withdrawal (proportional)
     */
    function _executeWithdraw(uint256 groupId, bytes memory data) internal {
        (address withdrawer, uint256 amount) = abi.decode(data, (address, uint256));
        
        Member storage member = members[groupId][withdrawer];
        require(member.isActive, "Not active member");
        require(amount <= member.contribution, "Exceeds contribution");

        Group storage group = groups[groupId];
        uint256 withdrawn = 0;

        // Bug #8 fix: Handle withdrawal whether Aave is configured or not
        if (address(aavePool) != address(0) && groupAaveShares[groupId] > 0) {
            uint256 shareRatio = (amount * 1e18) / group.totalDeposited;
            uint256 sharesToWithdraw = (groupAaveShares[groupId] * shareRatio) / 1e18;
            withdrawn = _withdrawFromAave(sharesToWithdraw);
            groupAaveShares[groupId] -= sharesToWithdraw;
        } else {
            // No Aave, just use the amount directly
            withdrawn = amount;
        }
        
        group.totalDeposited -= amount;
        member.contribution -= amount;

        if (member.contribution == 0) {
            member.isActive = false;
            group.memberCount--;
        }

        collateralToken.safeTransfer(withdrawer, withdrawn);
        emit MemberLeft(groupId, withdrawer, withdrawn);
    }

    // ============ View Functions ============

    function getGroup(uint256 groupId) external view returns (Group memory) {
        return groups[groupId];
    }

    function getGroupMembers(uint256 groupId) external view returns (address[] memory) {
        return memberList[groupId];
    }

    function getMemberContribution(uint256 groupId, address member) 
        external view returns (uint256) 
    {
        return members[groupId][member].contribution;
    }

    function getMemberShare(uint256 groupId, address member) 
        external view returns (uint256) 
    {
        Group storage group = groups[groupId];
        if (group.totalDeposited == 0) return 0;
        return (members[groupId][member].contribution * 10000) / group.totalDeposited;
    }

    function getGroupPositions(uint256 groupId) 
        external view returns (GroupPosition[] memory) 
    {
        return groupPositions[groupId];
    }

    function getUserGroups(address user) external view returns (uint256[] memory) {
        return userGroups[user];
    }

    // ============ Internal Helpers ============

    function _depositToAave(uint256 amount) internal returns (uint256 shares) {
        collateralToken.approve(address(aavePool), amount);
        try aavePool.supply(address(collateralToken), amount, address(this), 0) {
            return amount;
        } catch {
            return 0;
        }
    }

    function _withdrawFromAave(uint256 shares) internal returns (uint256 withdrawn) {
        try aavePool.withdraw(address(collateralToken), shares, address(this)) returns (uint256 amount) {
            return amount;
        } catch {
            return 0;
        }
    }

    // ============ Admin Functions ============

    function updatePlatformFee(uint256 newFee) external {
        require(msg.sender == platformOwner, "Not owner");
        require(newFee <= 2000, "Fee too high");
        platformFee = newFee;
    }

    function withdrawFees(address recipient) external {
        require(msg.sender == platformOwner, "Not owner");
        uint256 amount = collectedFees;
        collectedFees = 0;
        collateralToken.safeTransfer(recipient, amount);
    }

    function pause() external {
        require(msg.sender == platformOwner, "Not owner");
        _pause();
    }

    function unpause() external {
        require(msg.sender == platformOwner, "Not owner");
        _unpause();
    }
}
