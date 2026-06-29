const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const logos = {
  'STC': 'https://www.google.com/s2/favicons?domain=stc.com.sa&sz=128',
  'Mobily': 'https://www.google.com/s2/favicons?domain=mobily.com.sa&sz=128',
  'Zain': 'https://www.google.com/s2/favicons?domain=sa.zain.com&sz=128',
  'Salam': 'https://www.google.com/s2/favicons?domain=salam.sa&sz=128',
  'Virgin Mobile': 'https://www.google.com/s2/favicons?domain=virginmobile.sa&sz=128',
  'Lebara': 'https://www.google.com/s2/favicons?domain=lebara.sa&sz=128'
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
