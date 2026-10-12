const fs = require('fs');
let c = fs.readFileSync('src/screens/LoginScreen.tsx', 'utf8');

c = c.replace(
  "if (response && (response.status === 'success' || response.success)) {",
  "if (response && (response.status === 'success' || response.status === true || response.success)) {"
);
c = c.replace(
  "if (response && (response.status === 'success' || response.success)) {",
  "if (response && (response.status === 'success' || response.status === true || response.success)) {"
);

fs.writeFileSync('src/screens/LoginScreen.tsx', c, 'utf8');
console.log('Fixed LoginScreen condition');
