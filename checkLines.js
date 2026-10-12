const fs = require('fs');
let c = fs.readFileSync('src/screens/MatchesScreen.tsx', 'utf8');
const lines = c.split('\n');
for (let i = 185; i < 195; i++) {
  console.log(i + ': ' + lines[i]);
}
