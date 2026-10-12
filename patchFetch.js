const fs = require('fs');
let c = fs.readFileSync('src/screens/LookingScreen.tsx', 'utf8');

const regex = /const res = await fetch\(endpoint, {\s*method: 'POST',\s*headers: { 'Content-Type': 'application\/json' },\s*body: JSON\.stringify\(payload\)\s*}\);/;

const replacement = 
        let reqBody = null;
        let reqHeaders = {};
        
        if (bannerImage) {
          const formData = new FormData();
          Object.keys(payload).forEach(key => {
            if (typeof payload[key] === 'object') {
              formData.append(key, JSON.stringify(payload[key]));
            } else {
              formData.append(key, payload[key]);
            }
          });
          formData.append('banner_image', {
            uri: bannerImage,
            name: \looking_logo_\.jpg\,
            type: 'image/jpeg'
          } as any);
          reqBody = formData;
          reqHeaders = { 'Content-Type': 'multipart/form-data' };
        } else {
          reqBody = JSON.stringify(payload);
          reqHeaders = { 'Content-Type': 'application/json' };
        }

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: reqHeaders,
          body: reqBody
        });
;

c = c.replace(regex, replacement);
fs.writeFileSync('src/screens/LookingScreen.tsx', c, 'utf8');
console.log('Patched fetch request');
