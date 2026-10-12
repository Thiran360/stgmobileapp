const fs = require('fs');
let content = fs.readFileSync('C:/Office/STG/src/components/CustomDrawer.tsx', 'utf8');

const regexBadDrawerItem = /const DrawerItem = \(\{ icon, label, badge, isStore, onPress, rightIcon, \}: \{ icon: string, label: string, badge\?: string, isStore\?: boolean, onPress\?: \(\) => void, rightIcon\?: string,\?: boolean \}\) => \(\r?\n\s*<TouchableOpacity\r?\n\s*style=\{\[styles\.drawerItem, && \{ paddingLeft: 50 \}\]\}/;

const goodDrawerItem = `const DrawerItem = ({ icon, label, badge, isStore, onPress, rightIcon }: { icon: string, label: string, badge?: string, isStore?: boolean, onPress?: () => void, rightIcon?: string }) => (
  <TouchableOpacity
    style={styles.drawerItem}`;

content = content.replace(regexBadDrawerItem, goodDrawerItem);

fs.writeFileSync('C:/Office/STG/src/components/CustomDrawer.tsx', content, 'utf8');
console.log('Fixed syntax error in DrawerItem.');
