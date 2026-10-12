const fs = require('fs');
let c = fs.readFileSync('src/screens/MatchesScreen.tsx', 'utf8');
c = c.replace(
  'navigation.navigate(RegisteredTeams,',
  'navigation.navigate(\'RegisteredTeams\','
);
fs.writeFileSync('src/screens/MatchesScreen.tsx', c, 'utf8');
console.log('Fixed quotes in MatchesScreen');
