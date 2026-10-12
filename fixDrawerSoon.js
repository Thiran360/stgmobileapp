const fs = require('fs');
let content = fs.readFileSync('C:/Office/STG/src/components/CustomDrawer.tsx', 'utf8');

// 1. Replace Store, add My Performance and Leaderboards
const oldTabsRegex = /<DrawerItem icon="cart-outline" label="Store" onPress=\{\(\) => \{ setIsDrawerOpen\(false\); navigation\.navigate\('MainTabs', \{ screen: 'Store' \}\); \}\} \/>/;

const newTabs = `<DrawerItem icon="bar-chart-outline" label="My Performance" onPress={() => { setIsDrawerOpen(false); Alert.alert('Coming Soon', 'This feature will be available shortly!'); }} />
                <DrawerItem icon="podium-outline" label="Leaderboards" onPress={() => { setIsDrawerOpen(false); Alert.alert('Coming Soon', 'This feature will be available shortly!'); }} />
                <DrawerItem icon="cart-outline" label="Store" onPress={() => { setIsDrawerOpen(false); Alert.alert('Coming Soon', 'Our STG Store will be launching shortly!'); }} />`;

content = content.replace(oldTabsRegex, newTabs);

// 2. Add Discord to Social Media
const oldSocialRegex = /<DrawerItem icon="close-outline" label="X" \/>/;
const newSocial = `<DrawerItem icon="close-outline" label="X" />
                <DrawerItem icon="logo-discord" label="Discord" />`;

content = content.replace(oldSocialRegex, newSocial);

fs.writeFileSync('C:/Office/STG/src/components/CustomDrawer.tsx', content, 'utf8');
console.log('Added coming soon items and Discord.');
