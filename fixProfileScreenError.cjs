const fs = require('fs');
let c = fs.readFileSync('src/screens/ProfileScreen.tsx', 'utf8');

c = c.replace(
    "userProfile.fullName.split(' ')[0]", 
    "(userProfile.fullName || '').split(' ')[0]"
);

c = c.replace(
    "userProfile.fullName.split(' ').slice(1).join(' ')", 
    "(userProfile.fullName || '').split(' ').slice(1).join(' ')"
);

fs.writeFileSync('src/screens/ProfileScreen.tsx', c, 'utf8');
console.log("Fixed ProfileScreen.tsx");
