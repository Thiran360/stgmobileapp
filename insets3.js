const fs = require('fs');
let c = fs.readFileSync('src/screens/LookingScreen.tsx', 'utf8');

const rep = '<View style={{ height: insets.top, backgroundColor: "#E51025", width: "100%" }} />\n        <View style={{ flex: 1, backgroundColor: "#F3F4F6", paddingBottom: insets.bottom }}>';
c = c.replace(
  '<View style={{ flex: 1, backgroundColor: "#F3F4F6", paddingTop: insets.top, paddingBottom: insets.bottom }}>',
  rep
);
c = c.replace(
  '<View style={{ flex: 1, backgroundColor: "#F3F4F6", paddingTop: insets.top, paddingBottom: insets.bottom }}>',
  rep
);

fs.writeFileSync('src/screens/LookingScreen.tsx', c, 'utf8');
console.log('Fixed Top Inset Background Color');
