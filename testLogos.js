const https = require('https');

const domains = [
  'stc.com.sa',
  'mobily.com.sa',
  'sa.zain.com',
  'salam.sa',
  'virginmobile.sa',
  'lebara.sa'
];

domains.forEach(domain => {
  const url = `https://logo.clearbit.com/${domain}`;
  https.get(url, (res) => {
    console.log(`${domain}: ${res.statusCode}`);
  }).on('error', (e) => {
    console.error(e);
  });
});
