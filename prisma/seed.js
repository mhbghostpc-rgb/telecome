const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('13579', 10);
  
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
    },
  });

  console.log('Admin user created/verified:', admin.username);

  // Seed default companies if they don't exist
  const companies = [
    { name: 'STC', brandColor: '#4f008c' },
    { name: 'Mobily', brandColor: '#00a3e0' },
    { name: 'Zain', brandColor: '#78b82a' },
    { name: 'Salam', brandColor: '#009775' },
    { name: 'Virgin Mobile', brandColor: '#e10a0a' },
    { name: 'Lebara', brandColor: '#0033a0' }
  ];

  for (const comp of companies) {
    const existing = await prisma.company.findFirst({
      where: { name: comp.name }
    });
    if (!existing) {
      await prisma.company.create({
        data: comp
      });
      console.log('Created company:', comp.name);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
