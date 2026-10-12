const fs = require('fs');
let c = fs.readFileSync('src/screens/EditProfileScreen.tsx', 'utf8');

c = c.replace(
    "const nameParts = userProfile.fullName.split(' ');", 
    "const nameParts = (userProfile?.fullName || '').split(' ');"
);

fs.writeFileSync('src/screens/EditProfileScreen.tsx', c, 'utf8');
console.log("Fixed EditProfileScreen.tsx");
