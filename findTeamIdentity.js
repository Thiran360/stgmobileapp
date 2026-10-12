const fs = require('fs');
const lines = fs.readFileSync('src/screens/TeamRegistrationScreen.tsx', 'utf8').split('\n');
const idx = lines.findIndex(l => l.includes('Team Identity'));
console.log(idx);
