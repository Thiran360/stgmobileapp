const fs = require('fs');
let content = fs.readFileSync('C:/Office/STG/src/components/CustomDrawer.tsx', 'utf8');

content = content.replace(
  '<DrawerItem icon="shield-checkmark-outline" label="Privacy Policy" />',
  '<DrawerItem icon="shield-checkmark-outline" label="Privacy Policy" onPress={() => { setIsDrawerOpen(false); navigation.navigate("PolicyScreen", { title: "Privacy Policy" }); }} />'
);
content = content.replace(
  '<DrawerItem icon="document-text-outline" label="Terms of Service" />',
  '<DrawerItem icon="document-text-outline" label="Terms of Service" onPress={() => { setIsDrawerOpen(false); navigation.navigate("PolicyScreen", { title: "Terms of Service" }); }} />'
);
content = content.replace(
  '<DrawerItem icon="card-outline" label="Paid Service Terms" />',
  '<DrawerItem icon="card-outline" label="Paid Service Terms" onPress={() => { setIsDrawerOpen(false); navigation.navigate("PolicyScreen", { title: "Paid Service Terms" }); }} />'
);

fs.writeFileSync('C:/Office/STG/src/components/CustomDrawer.tsx', content, 'utf8');
console.log('Added onPress for policies.');
