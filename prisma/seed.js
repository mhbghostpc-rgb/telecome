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
    { name: 'STC', brandColor: '#4f008c', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Stc_logo.svg' },
    { name: 'Mobily', brandColor: '#00a3e0', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Mobily_Logo.svg' },
    { name: 'Zain', brandColor: '#78b82a', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Zain_logo.svg' },
    { name: 'Salam', brandColor: '#009775', logoUrl: 'https://salam.sa/themes/custom/salam/logo.svg' },
    { name: 'Virgin Mobile', brandColor: '#e10a0a', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Virgin_Mobile_logo.svg' },
    { name: 'Lebara', brandColor: '#0033a0', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Lebara_logo.svg' }
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
