const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const logos = {
  'STC': 'https://upload.wikimedia.org/wikipedia/commons/4/41/STC-01.svg',
  'Mobily': 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Mobily_Logo.svg',
  'Zain': 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Zain_logo.svg',
  'Salam': 'https://salam.sa/assets/salam-logo.svg',
  'Virgin Mobile': 'https://upload.wikimedia.org/wikipedia/commons/2/22/Virgin_Mobile_logo.svg',
  'Lebara': 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Lebara_logo.svg'
};

async function main() {
  for (const [name, logoUrl] of Object.entries(logos)) {
    const updated = await prisma.company.updateMany({
      where: { name },
      data: { logoUrl }
    });
    console.log(`Updated ${name} with logo:`, updated.count);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
