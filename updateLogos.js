const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const logos = {
  'STC': 'https://logo.clearbit.com/stc.com.sa',
  'Mobily': 'https://logo.clearbit.com/mobily.com.sa',
  'Zain': 'https://logo.clearbit.com/sa.zain.com',
  'Salam': 'https://logo.clearbit.com/salam.sa',
  'Virgin Mobile': 'https://logo.clearbit.com/virginmobile.sa',
  'Lebara': 'https://logo.clearbit.com/lebara.sa'
};

async function main() {
  for (const [name, logoUrl] of Object.entries(logos)) {
    try {
      await prisma.company.updateMany({
        where: { name: name },
        data: { logoUrl: logoUrl }
      });
      console.log(`Updated logo for ${name}`);
    } catch (error) {
      console.error(`Failed to update ${name}:`, error.message);
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
