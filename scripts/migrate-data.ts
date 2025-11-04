import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import db from '../src/lib/db'

async function main() {
  try {
    // Create system user
    const systemUser = await db.user.create({
      data: {
        email: 'system@greenwipe.com',
        name: 'System',
        hashedPassword: await bcrypt.hash('system123', 12),
      },
    })
    console.log('System user created successfully')
  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })