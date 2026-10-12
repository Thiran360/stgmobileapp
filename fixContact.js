const fs = require('fs');
let content = fs.readFileSync('C:/Office/STG/src/components/CustomDrawer.tsx', 'utf8');

content = content.replace(
  '<DrawerItem icon="call-outline" label="Contact" />',
  '<DrawerItem icon="call-outline" label="Support" />'
);

fs.writeFileSync('C:/Office/STG/src/components/CustomDrawer.tsx', content, 'utf8');
console.log('Changed Contact to Support.');
