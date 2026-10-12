const fs = require('fs');
let content = fs.readFileSync('C:/Office/STG/src/components/CustomDrawer.tsx', 'utf8');

const regex = /<DrawerItem icon="ribbon-outline"[\s\S]*?<DrawerItem icon="shield-half-outline" label="Clubs" \/>\r?\n\s*<View style=\{styles\.menuDivider\} \/>/g;
content = content.replace(regex, '');

fs.writeFileSync('C:/Office/STG/src/components/CustomDrawer.tsx', content, 'utf8');
console.log('Removed top parts of the drawer.');
