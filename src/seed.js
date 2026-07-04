const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Seeding database...');

  const ownerEmail = 'owner@example.com';
  const userEmail = 'user@example.com';

  const ownerExists = await prisma.user.findUnique({ where: { email: ownerEmail } });
  if (!ownerExists) {
    const hashedOwnerPassword = await bcrypt.hash('password123', 12);
    await prisma.user.create({
      data: {
        name: 'Demo Owner',
        email: ownerEmail,
        password: hashedOwnerPassword,
        phone: '+1 555-111-2222',
        role: 'OWNER',
        isVerified: true
      }
    });
    console.log('✅ Created Demo Owner (owner@example.com)');
  } else {
    console.log('ℹ️ Demo Owner already exists');
  }

  const userExists = await prisma.user.findUnique({ where: { email: userEmail } });
  if (!userExists) {
    const hashedUserPassword = await bcrypt.hash('password123', 12);
    await prisma.user.create({
      data: {
        name: 'Demo User',
        email: userEmail,
        password: hashedUserPassword,
        phone: '+1 555-333-4444',
        role: 'USER',
        isVerified: true
      }
    });
    console.log('✅ Created Demo User (user@example.com)');
  } else {
    console.log('ℹ️ Demo User already exists');
  }

  console.log('🎉 Seeding completed!');
  await prisma.$disconnect();
}

seed().catch(err => {
  console.error('❌ Seeding failed:', err);
  prisma.$disconnect();
  process.exit(1);
});
