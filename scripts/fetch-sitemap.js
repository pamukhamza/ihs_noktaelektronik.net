const fs = require('fs');
const https = require('https');
const http = require('http');

// Configuration
const DEV_MODE = process.env.NODE_ENV !== 'production';
const HOST = DEV_MODE ? 'localhost:3000' : 'www.noktaelektronik.net';
const PROTOCOL = DEV_MODE ? 'http' : 'https';
const WAIT_TIME = 5000; // 5 seconds
const OUTPUT_PATH = 'public/sitemap.xml';

console.log(`Fetching sitemap from ${PROTOCOL}://${HOST}/api/sitemap`);

// Wait for server to be ready
setTimeout(() => {
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
        // Validate that we received XML data
        if (!data.trim().startsWith('<?xml')) {
          throw new Error('Invalid XML response received');
        }

        // Format the XML data with proper indentation
        const formattedXml = data
          .replace(/></g, '>\n<')  // Add newlines between tags
          .replace(/\n\s*\n/g, '\n'); // Remove empty lines

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
}, WAIT_TIME);
