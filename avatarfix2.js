const fs = require('fs');
let c = fs.readFileSync('src/screens/LookingScreen.tsx', 'utf8');

if (c.includes('creator_avatar: bannerImage ? "" : (userProfile?.profilePicture || "https://via.placeholder.com/150"),')) {
  c = c.replace('creator_avatar: bannerImage ? "" : (userProfile?.profilePicture || "https://via.placeholder.com/150"),', 'creator_avatar: userProfile?.profilePicture || "https://via.placeholder.com/150",');
  fs.writeFileSync('src/screens/LookingScreen.tsx', c, 'utf8');
  console.log('Fixed creator_avatar text');
} else {
  console.log('Not found');
}
