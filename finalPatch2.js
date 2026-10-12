const fs = require('fs');
let c = fs.readFileSync('src/screens/LookingScreen.tsx', 'utf8');
const regex = /const res = await fetch\(endpoint, \{\s*method: 'POST',\s*headers: \{ 'Content-Type': 'application\\/json' \},\s*body: JSON\.stringify\(payload\)\s*\}\);/;
const replacement = '      let reqBody = null;\n      let reqHeaders = {};\n      if (bannerImage) {\n        const formD = new FormData();\n        Object.keys(payload).forEach(key => {\n          if (typeof payload[key] === \'object\') {\n            formD.append(key, JSON.stringify(payload[key]));\n          } else {\n            formD.append(key, String(payload[key]));\n          }\n        });\n        formD.append(\'banner_image\', { uri: bannerImage, name: \'looking_logo.jpg\', type: \'image/jpeg\' });\n        reqBody = formD;\n      } else {\n        reqBody = JSON.stringify(payload);\n        reqHeaders = { \'Content-Type\': \'application/json\' };\n      }\n      const res = await fetch(endpoint, {\n        method: \'POST\',\n        headers: bannerImage ? undefined : reqHeaders,\n        body: reqBody\n      });';
c = c.replace(regex, replacement);
fs.writeFileSync('src/screens/LookingScreen.tsx', c, 'utf8');
