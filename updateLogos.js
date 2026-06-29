const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const logos = {
  'STC': 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Stc_logo.svg',
  'Mobily': 'https://upload.wikimedia.org/wikipedia/commons/8/87/Mobily_Logo.svg',
  'Zain': 'https://upload.wikimedia.org/wikipedia/commons/1/12/Zain_logo.svg',
  'Salam': 'https://salam.sa/themes/custom/salam/logo.svg',
  'Virgin Mobile': 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Virgin_Mobile_logo.svg',
  'Lebara': 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Lebara_logo.svg'
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
