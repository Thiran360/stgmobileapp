const fs = require('fs');
const lines = fs.readFileSync('src/screens/LookingScreen.tsx', 'utf8').split('\n');
const idx = lines.findIndex(l => l.includes('creator_avatar: userProfile?.profilePicture || '));
if (idx > -1) {
  lines[idx] = '          creator_avatar: userProfile?.profilePicture || "https://via.placeholder.com/150",';
}
fs.writeFileSync('src/screens/LookingScreen.tsx', lines.join('\n'), 'utf8');
console.log('Fixed creator_avatar');
