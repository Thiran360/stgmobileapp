const fs = require('fs');
let c = fs.readFileSync('src/screens/MatchesScreen.tsx', 'utf8');
const lines = c.split('\n');
const idx = lines.findIndex(l => l.includes('actionBtnOutlineText'));
for (let i = idx - 2; i < idx + 5; i++) {
  console.log(i + ': ' + lines[i]);
}
