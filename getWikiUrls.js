const https = require('https');

const files = [
  'File:Stc_logo.svg',
  'File:Mobily_Logo.svg',
  'File:Zain_(Unternehmen)_logo.svg',
  'File:Virgin_Mobile_logo.svg',
  'File:Lebara_logo.svg'
];

const titles = files.map(encodeURIComponent).join('|');
const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${titles}&prop=imageinfo&iiprop=url&format=json`;

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    const pages = json.query.pages;
    for (const id in pages) {
      if (pages[id].imageinfo && pages[id].imageinfo.length > 0) {
        console.log(`${pages[id].title} -> ${pages[id].imageinfo[0].url}`);
      } else {
        console.log(`${pages[id].title} -> NOT FOUND`);
      }
    }
  });
}).on('error', (e) => {
  console.error(e);
});
