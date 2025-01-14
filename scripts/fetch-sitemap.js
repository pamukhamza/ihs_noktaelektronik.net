const fs = require('fs');
const http = require('http');

// Wait for 5 seconds to ensure the server is up
setTimeout(() => {
  http.get('http://www.noktaelektronik.net/api/sitemap', (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      fs.writeFileSync('public/sitemap.xml', data);
      console.log('Sitemap has been updated successfully!');
      process.exit(0);
    });
  }).on('error', (err) => {
    console.error('Error fetching sitemap:', err);
    process.exit(1);
  });
}, 5000);
