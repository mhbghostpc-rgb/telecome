const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const domains = {
  'STC': 'stc.com.sa',
  'Mobily': 'mobily.com.sa',
  'Zain': 'sa.zain.com',
  'Salam': 'salam.sa',
  'Virgin Mobile': 'virginmobile.sa',
  'Lebara': 'lebara.sa'
};

async function main() {
  for (const [name, domain] of Object.entries(domains)) {
    const url = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    await prisma.company.updateMany({
      where: { name },
      data: { logoUrl: url }
    });
    console.log(`Updated ${name} with URL: ${url}`);
  }
}

main().finally(() => prisma.$disconnect());
