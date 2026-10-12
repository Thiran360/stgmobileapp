const fs = require('fs');
let c = fs.readFileSync('src/screens/LookingScreen.tsx', 'utf8');
const lines = c.split('\n');
const idx = lines.findIndex(l => l.includes('method: \'POST\''));
for (let i = idx - 2; i < idx + 5; i++) {
  console.log(i + ': ' + lines[i]);
}
