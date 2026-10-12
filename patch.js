const fs = require('fs');
let c = fs.readFileSync('src/screens/LookingScreen.tsx', 'utf8');

const regex = /const res = await fetch\(endpoint, \{\s*method: 'POST',\s*headers: \{ 'Content-Type': 'application\/json' \},\s*body: JSON\.stringify\(payload\)\s*\}\);/;

const replacement = 
      let reqBody = null;
      let reqHeaders = {};
      if (bannerImage) {
        const formD = new FormData();
        Object.keys(payload).forEach(key => {
          if (typeof payload[key] === 'object') {
            formD.append(key, JSON.stringify(payload[key]));
          } else {
            formD.append(key, String(payload[key]));
          }
        });
        formD.append('banner_image', {
          uri: bannerImage,
          name: 'looking_logo.jpg',
          type: 'image/jpeg'
        });
        reqBody = formD;
      } else {
        reqBody = JSON.stringify(payload);
        reqHeaders = { 'Content-Type': 'application/json' };
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: bannerImage ? undefined : reqHeaders,
        body: reqBody
      });
;

c = c.replace(regex, replacement);
fs.writeFileSync('src/screens/LookingScreen.tsx', c, 'utf8');
console.log('Done replacement');
