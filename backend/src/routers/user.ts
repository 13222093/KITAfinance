import { Elysia, t } from 'elysia';
import prisma from '../utils/prisma';
import { groupService } from '../services/group.service';

export const userRouter = new Elysia({ prefix: '/user' })
    /**
     * Get User Dashboard Profile
     * GET /api/user/profile/:address
     */
    .get('/profile/:address', async ({ params }) => {
        const { address } = params;

        // 1. Get User from DB
        const user = await prisma.user.findFirst({
            where: { 
                OR: [
                    { walletAddress: address },
                    { phoneNumber: address }, // Allow phone lookup too if needed
                    { username: address }     // Allow username lookup
                ]
            },
            include: {
                positions: true,
                groupsAdmin: true,
                groupMembers: true
            }
        });

        if (!user) {
            return {
                success: false,
                error: 'User not found'
            };
        }

        // 2. Calculate Stats from DB (Positions)
        const positions = user.positions || [];
        const activePositions = positions.filter(p => p.status === 'OPEN');
        
        let totalYield = 0;
        let totalLocked = 0;

        activePositions.forEach(p => {
            totalLocked += Number(p.amount);
            // Estimate yield if not tracked: 1.5% average
            totalYield += Number(p.amount) * 0.015; 
        });

        // 3. Get Groups (On-chain/DB hybrid)
        const groups = await groupService.getUserGroups(user.walletAddress || '');

        return {
            success: true,
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    walletAddress: user.walletAddress
                },
                stats: {
                    totalBalance: totalLocked, // Currently just locked value
                    totalYield: totalYield,
                    activePositions: activePositions.length,
                    monthlyReturn: 3.5 // Dummy/Estimated
                },
                positions: activePositions.map(p => ({
                    id: p.id,
                    name: `${p.assetSymbol} ${p.isCall ? 'Call' : 'Put'}`, // e.g. ETH Put
                    balance: Number(p.amount),
                    apy: 12.5, // Estimated APY
                    status: p.status,
                    expiry: p.expiry
                })),
                groups: groups.map(g => ({
                    id: g.id,
                    name: g.name,
                    role: g.admin === user.walletAddress ? 'Admin' : 'Member',
                    members: g.memberCount
                }))
            }
        };
    }, {
        params: t.Object({
            address: t.String()
        })
    })

    /**
     * Update User Profile
     * PUT /api/user/profile
     */
    .put('/profile', async ({ body }) => {
        const { phoneNumber, name, username, email, walletAddress } = body;

        try {
            // Check if username/email already exists (excluding current user)
            // Note: Since we identify by phone, we check others
            if (username) {
                const existingUser = await prisma.user.findFirst({
                    where: {
                        username,
                        NOT: { phoneNumber }
                    }
                });
                if (existingUser) {
                    return { success: false, error: 'Username already taken' };
                }
            }

            if (email) {
                const existingUser = await prisma.user.findFirst({
                    where: {
                        email,
                        NOT: { phoneNumber }
                    }
                });
                if (existingUser) {
                    return { success: false, error: 'Email already taken' };
                }
            }

            const updatedUser = await prisma.user.update({
                where: { 
                    countryCode_phoneNumber: {
                        countryCode: '+62', // Defaulting for now, ideally pass it
                        phoneNumber: phoneNumber
                    }
                },
                data: {
                    name,
                    username,
                    email,
                    walletAddress
                }
            });

            return {
                success: true,
                data: updatedUser
            };
        } catch (error) {
            console.error('Update profile error:', error);
            return { success: false, error: 'Failed to update profile' };
        }
    }, {
        body: t.Object({
            phoneNumber: t.String(),
            name: t.Optional(t.String()),
            username: t.Optional(t.String()),
            email: t.Optional(t.String()),
            walletAddress: t.Optional(t.String())
        })
    });
