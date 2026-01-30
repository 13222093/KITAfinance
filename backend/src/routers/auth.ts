import { Elysia, t } from 'elysia';
import prisma from '../utils/prisma';

// In-memory OTP store for MVP (in prod use Redis)
const otpStore = new Map<string, { code: string; expires: number }>();

export const authRouter = new Elysia({ prefix: '/auth' })
    /**
     * Request OTP
     * POST /api/auth/request-otp
     */
    .post('/request-otp', async ({ body }) => {
        const { phoneNumber, countryCode } = body;
        const fullPhone = `${countryCode}${phoneNumber}`;

        // Check if user exists (optional, or auto-register)
        // For this MVP, we'll allow any phone number to request OTP

        // Generate OTP (Fixed for dev or random)
        const code = process.env.NODE_ENV === 'development' ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP with 5 min expiry
        otpStore.set(fullPhone, {
            code,
            expires: Date.now() + 5 * 60 * 1000
        });

        console.log(`OTP for ${fullPhone}: ${code}`); // Log for dev

        return {
            success: true,
            message: 'OTP sent successfully',
            // In dev mode, return code for convenience
            debugCode: process.env.NODE_ENV === 'development' ? code : undefined
        };
    }, {
        body: t.Object({
            phoneNumber: t.String(),
            countryCode: t.String()
        })
    })

    /**
     * Verify OTP
     * POST /api/auth/verify-otp
     */
    .post('/verify-otp', async ({ body }) => {
        const { phoneNumber, countryCode, code } = body;

        // Bug #4 fix: Use fullPhone to match how OTP was stored
        const fullPhone = `${countryCode}${phoneNumber}`;
        const record = otpStore.get(fullPhone);

        if (!record) {
            return { success: false, error: 'OTP expired or not requested' };
        }

        if (Date.now() > record.expires) {
            otpStore.delete(fullPhone);
            return { success: false, error: 'OTP expired' };
        }

        if (record.code !== code) {
            return { success: false, error: 'Invalid OTP' };
        }

        // OTP Valid, find or create user
        let user = await prisma.user.findFirst({
            where: {
                AND: [
                    { countryCode },
                    { phoneNumber }
                ]
            }
        });

        if (!user) {
            // Create new user
            user = await prisma.user.create({
                data: { 
                    countryCode,
                    phoneNumber
                }
            });
        }

        // Clear OTP
        otpStore.delete(fullPhone);

        return {
            success: true,
            data: {
                id: user.id,
                phoneNumber: user.phoneNumber,
                walletAddress: user.walletAddress,
                name: user.name
            }
        };
    }, {
        body: t.Object({
            phoneNumber: t.String(),
            countryCode: t.String(),
            code: t.String()
        })
    });
