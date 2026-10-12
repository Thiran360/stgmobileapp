const fs = require('fs');
let c = fs.readFileSync('src/screens/PlayerDetailsScreen.tsx', 'utf8');

c = c.replace(
  "const userId = Date.now().toString();",
  "const userId = route?.params?.userId || mobileNumber.replace(/[^0-9]/g, '') || Date.now().toString();"
);

// Also fix LoginScreen to pass mobile instead of email
c = fs.readFileSync('src/screens/LoginScreen.tsx', 'utf8');
c = c.replace("navigation.replace('PlayerDetails', { userId, mobile });", "navigation.replace('PlayerDetails', { userId, mobileNumber: mobile });");
fs.writeFileSync('src/screens/LoginScreen.tsx', c, 'utf8');

fs.writeFileSync('src/screens/PlayerDetailsScreen.tsx', c, 'utf8');
console.log("Fixed userId in PlayerDetailsScreen");
