const fs = require('fs');
let c = fs.readFileSync('src/screens/LookingScreen.tsx', 'utf8');
c = c.replace(/name: 'logo\.jpg'/g, "name: 'logo_' + Date.now() + '.jpg'");
fs.writeFileSync('src/screens/LookingScreen.tsx', c, 'utf8');
console.log('Fixed');
