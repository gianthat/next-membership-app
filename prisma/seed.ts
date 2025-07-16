import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: { role: 'admin' },
    create: {
      email: 'admin@example.com',
      name: 'Site Admin',
      role: 'admin',
      emailVerified: new Date(), // required by NextAuth
    },
  });

  console.log('✅ Admin user created:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
