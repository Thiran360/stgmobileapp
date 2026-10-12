const fs = require('fs');
let c = fs.readFileSync('src/screens/LookingScreen.tsx', 'utf8');

const oldStr = "body: bannerImage ? (() => { const f = new FormData(); Object.keys(payload).forEach(k => { if (k !== 'creator_avatar') f.append(k, typeof (payload as any)[k] === 'object' ? JSON.stringify((payload as any)[k]) : String((payload as any)[k])); }); f.append('creator_avatar', { uri: bannerImage, name: 'logo.jpg', type: 'image/jpeg' } as any); return f; })() : JSON.stringify(payload)";

const newStr = "body: bannerImage ? (() => { const f = new FormData(); Object.keys(payload).forEach(k => { f.append(k, typeof (payload as any)[k] === 'object' ? JSON.stringify((payload as any)[k]) : String((payload as any)[k])); }); f.append('banner_image', { uri: bannerImage, name: 'logo.jpg', type: 'image/jpeg' } as any); return f; })() : JSON.stringify(payload)";

c = c.replace(oldStr, newStr);

fs.writeFileSync('src/screens/LookingScreen.tsx', c, 'utf8');
console.log('Fixed formdata');
