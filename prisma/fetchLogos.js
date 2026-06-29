const https = require('https');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

const logoFiles = {
  'STC': 'File:STC-01.svg',
  'Mobily': 'File:Mobily_Logo.svg',
  'Zain': 'File:Zain_logo.svg',
  'Virgin Mobile': 'File:Virgin_Mobile_logo.svg',
  'Lebara': 'File:Lebara_logo.svg',
  'Salam': 'File:Salam_Mobile.png' // salam might not have wikipedia svg, let's use initials
};

async function getWikiImageUrl(filename) {
  return new Promise((resolve, reject) => {
    https.get(`https://commons.wikimedia.org/w/api.php?action=query&titles=${filename}&prop=imageinfo&iiprop=url&format=json`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query.pages;
          const pageId = Object.keys(pages)[0];
          if (pageId === '-1') resolve(null);
          resolve(pages[pageId].imageinfo[0].url);
        } catch(e) {
          resolve(null);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  const publicLogosDir = path.join(__dirname, '..', 'public', 'logos');
  if (!fs.existsSync(publicLogosDir)) fs.mkdirSync(publicLogosDir, { recursive: true });

  for (const [name, filename] of Object.entries(logoFiles)) {
    let url = await getWikiImageUrl(filename);
    if (!url) {
      console.log(`Could not find ${filename}, using placeholder`);
      url = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128`;
    }
    
    // update db
    await prisma.company.updateMany({
      where: { name },
      data: { logoUrl: url }
    });
    console.log(`Updated ${name} with URL: ${url}`);
  }
}

main().finally(() => prisma.$disconnect());
