const fs = require('fs');
let c = fs.readFileSync('src/screens/MatchesScreen.tsx', 'utf8');
const lines = c.split('\n');

// Find the line that needs replacement. We know it's around 243.
for (let i = 237; i < 248; i++) {
  if (lines[i] && lines[i].includes('</View>') && lines[i+1] && lines[i+1].includes('))}')) {
    lines[i] = lines[i].replace('</View>', '</TouchableOpacity>');
    console.log('Replaced at line: ' + i);
    break;
  }
}

fs.writeFileSync('src/screens/MatchesScreen.tsx', lines.join('\n'), 'utf8');
console.log('Done');
