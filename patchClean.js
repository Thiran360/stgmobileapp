const fs = require("fs");
let c = fs.readFileSync("src/screens/LookingScreen.tsx", "utf8");
const search = "      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });";
const rep = "      let reqBody = null;
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
        formD.append('banner_image', { uri: bannerImage, name: 'looking_logo.jpg', type: 'image/jpeg' });
        reqBody = formD;
      } else {
        reqBody = JSON.stringify(payload);
        reqHeaders = { 'Content-Type': 'application/json' };
      }
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: bannerImage ? undefined : reqHeaders,
        body: reqBody
      });";
c = c.replace(search, rep);
const search2 = search.replace(/\n/g, "\r\n");
const rep2 = rep.replace(/\n/g, "\r\n");
c = c.replace(search2, rep2);
fs.writeFileSync("src/screens/LookingScreen.tsx", c, "utf8");
console.log("Fixed!");
