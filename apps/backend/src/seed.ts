import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function seedDatabase() {
  const passwordHash = await bcrypt.hash('demo1234', 10)
  const user = await prisma.user.upsert({
    where: { email: 'demo@scripthing.local' },
    update: {},
    create: {
      email: 'demo@scripthing.local',
      name: 'Demo User',
      passwordHash,
    },
  })
  return user
}

if (require.main === module) {
  seedDatabase()
    .then((user) => {
      console.log('Database seeded with user:', user.email)
    })
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}
