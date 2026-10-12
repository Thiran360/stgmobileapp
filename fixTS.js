const fs = require('fs');
let content = fs.readFileSync('C:/Office/STG/src/components/CustomDrawer.tsx', 'utf8');

content = content.replace(
  "drawerHeader: { backgroundColor: '#111827', paddingHorizontal: 20, paddingHorizontal: 20, paddingBottom: 25, borderBottomWidth: 1, borderBottomColor: '#374151' },",
  "drawerHeader: { backgroundColor: '#111827', paddingHorizontal: 20, paddingBottom: 25, borderBottomWidth: 1, borderBottomColor: '#374151' },"
);

fs.writeFileSync('C:/Office/STG/src/components/CustomDrawer.tsx', content, 'utf8');
console.log('Fixed TS duplicate property error.');
