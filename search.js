const https = require('https');
https.get('https://api.github.com/search/code?q=filename:bgmi+extension:jpg', { headers: { 'User-Agent': 'Node.js' } }, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => console.log(data.substring(0, 1000)));
});
