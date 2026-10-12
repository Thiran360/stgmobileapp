const fs = require('fs');
let c = fs.readFileSync('src/screens/LookingScreen.tsx', 'utf8');
const lines = c.split('\n');

const idx = lines.findIndex(l => l.includes('const payload = {') && lines[l.indexOf('const payload = {') > -1 ? lines.indexOf(l) + 1 : -1]?.includes('category: activeChip'));
if(idx > -1) {
  lines.splice(idx + 1, 0, 
    '          creator_username: userProfile?.username || "Unknown",',
    '          creator_avatar: userProfile?.profilePicture || "",'
  );
}

fs.writeFileSync('src/screens/LookingScreen.tsx', lines.join('\n'), 'utf8');
console.log('Added creator fields to payload');
