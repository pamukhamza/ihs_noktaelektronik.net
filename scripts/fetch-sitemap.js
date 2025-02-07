const fs = require('fs');
const https = require('https');
const http = require('http');

// Configuration
const DEV_MODE = process.env.NODE_ENV !== 'production';
const HOST = DEV_MODE ? 'localhost:3000' : 'www.noktaelektronik.net';
const PROTOCOL = DEV_MODE ? 'http' : 'https';
const OUTPUT_PATH = 'public/sitemap.xml';

console.log(`Fetching sitemap from ${PROTOCOL}://${HOST}/api/sitemap`);

const client = PROTOCOL === 'https' ? https : http;

const options = {
  hostname: HOST.split(':')[0],
  port: HOST.includes(':') ? HOST.split(':')[1] : (PROTOCOL === 'https' ? 443 : 80),
  path: '/api/sitemap',
  method: 'GET',
  headers: {
    'Accept': 'application/xml'
  }
};

const req = client.request(options, (res) => {
  if (res.statusCode !== 200) {
    console.error(`Failed to fetch sitemap: HTTP ${res.statusCode}`);
    process.exit(1);
  }

  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      // Format XML with proper indentation
      const formattedXml = data
        .replace(/></g, '>\n<')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n');

      fs.writeFileSync(OUTPUT_PATH, formattedXml);
      console.log(`Sitemap has been successfully written to ${OUTPUT_PATH}`);
      process.exit(0);
    } catch (err) {
      console.error('Error writing sitemap:', err);
      process.exit(1);
    }
  });
});

req.on('error', (err) => {
  console.error('Error fetching sitemap:', err);
  process.exit(1);
});

req.end();
