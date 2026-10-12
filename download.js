const https = require('https');
const fs = require('fs');

const urls = [
  'https://wallpapercave.com/wp/wp9287349.jpg',
  'https://wallpapercave.com/wp/wp9287383.jpg',
  'https://wallpapercave.com/wp/wp9287385.jpg',
  'https://wallpapercave.com/wp/wp10398687.jpg',
  'https://wallpapercave.com/wp/wp10398689.jpg'
];

urls.forEach((url, i) => {
  https.get(url, (res) => {
    if (res.statusCode === 200) {
      res.pipe(fs.createWriteStream(`src/assets/images/flyers/bgmi_${i+1}.jpg`));
    } else {
      console.log(`Failed ${url}: ${res.statusCode}`);
    }
  });
});
