// Centralized mock data configuration for consistent display across pages
// Use these values for demo purposes until real API integration

export const MOCK_USER_STATS = {
    // Financial metrics (in Rupiah)
    totalBalance: 7500000,  // 7.5 juta
    totalYield: 525000,      // 525 ribu
    activePositions: 1,
    monthlyReturn: 8.5,      // 8.5%
    targetReached: 65,       // 65%

    // Gamification (synchronized)
    level: 8,
    currentXP: 2450,
    levelXP: 3000,
    totalXP: 12450,
    streak: 7,
    totalTrades: 12,
    achievements: 5,
    totalAchievements: 15,
};

export const MOCK_VAULTS = [
    {
        id: 1,
        name: 'USDC Vault',
        strategy: 'Cash-Secured Put',
        balance: 7500000,      // Same as totalBalance
        apy: 8.5,
        status: 'Active',
        dailyYield: 1750,
        totalEarned: 525000,   // Same as totalYield
        startDate: '10 Jan 2026',
    },
];

export const MOCK_POSITIONS = [
    {
        id: 1,
        name: 'ETH Covered Call',
        apy: 8.5,
        balance: 7500000,
        status: 'Active'
    }
];
