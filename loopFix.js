const fs = require('fs');
let c = fs.readFileSync('src/screens/LookingScreen.tsx', 'utf8');

const search = "Object.keys(payload).forEach(k => f.append(k, typeof (payload as any)[k] === 'object' ? JSON.stringify((payload as any)[k]) : String((payload as any)[k])));";
const replace = "Object.keys(payload).forEach(k => { if (k !== 'creator_avatar') f.append(k, typeof (payload as any)[k] === 'object' ? JSON.stringify((payload as any)[k]) : String((payload as any)[k])); });";

c = c.replace(search, replace);
fs.writeFileSync('src/screens/LookingScreen.tsx', c, 'utf8');
console.log('Fixed loop');
