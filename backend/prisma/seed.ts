import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

console.log('Seed: Connecting to DB...', process.env.DATABASE_URL ? 'URL Found' : 'URL Missing')

const connectionString = process.env.DATABASE_URL || ''
const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({
  adapter,
})

async function main() {
  // Configurable Admin Details
  const adminUser = {
    name: 'Super Admin',
    username: 'superadmin',
    email: 'admin@kita.finance',
    countryCode: '+62',
    phoneNumber: '81234567890',
    walletAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
  }

  const user = await prisma.user.upsert({
    where: {
      countryCode_phoneNumber: {
        phoneNumber: adminUser.phoneNumber,
        countryCode: '+62'
      }
    },
    update: {}, // Don't update if exists
    create: adminUser,
  })

  console.log(`✅ Admin account seeded: ${user.name} (${user.phoneNumber})`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
