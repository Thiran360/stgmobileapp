const fs = require('fs');
let content = fs.readFileSync('C:/Office/STG/src/screens/ProfileScreen.tsx', 'utf8');

// Remove the manual marginTop
content = content.replace(
  "<View style={[styles.header, { marginTop: Platform.OS === 'ios' ? 0 : 10 }]}>",
  "<View style={styles.header}>"
);

fs.writeFileSync('C:/Office/STG/src/screens/ProfileScreen.tsx', content, 'utf8');
console.log('Removed manual marginTop from Header');
