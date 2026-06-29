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
    { name: 'STC', brandColor: '#4f008c', logoUrl: 'https://www.google.com/s2/favicons?domain=stc.com.sa&sz=128' },
    { name: 'Mobily', brandColor: '#00a3e0', logoUrl: 'https://www.google.com/s2/favicons?domain=mobily.com.sa&sz=128' },
    { name: 'Zain', brandColor: '#78b82a', logoUrl: 'https://www.google.com/s2/favicons?domain=sa.zain.com&sz=128' },
    { name: 'Salam', brandColor: '#009775', logoUrl: 'https://www.google.com/s2/favicons?domain=salam.sa&sz=128' },
    { name: 'Virgin Mobile', brandColor: '#e10a0a', logoUrl: 'https://www.google.com/s2/favicons?domain=virginmobile.sa&sz=128' },
    { name: 'Lebara', brandColor: '#0033a0', logoUrl: 'https://www.google.com/s2/favicons?domain=lebara.sa&sz=128' }
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
