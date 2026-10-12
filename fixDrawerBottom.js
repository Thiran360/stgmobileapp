const fs = require('fs');
let content = fs.readFileSync('C:/Office/STG/src/components/CustomDrawer.tsx', 'utf8');

// 1. Remove What's New and Change Language
content = content.replace(/<DrawerItem icon="information-circle-outline" label="What's New" isSubItem \/>\r?\n?/g, '');
content = content.replace(/<DrawerItem icon="language-outline" label="Change Language" isSubItem \/>\r?\n?/g, '');

// 2. Remove Blog
content = content.replace(/<DrawerItem icon="newspaper-outline" label="Blog" isSubItem \/>\r?\n?/g, '');

// 3. Remove isSubItem from everything else to make them align properly
content = content.replace(/ isSubItem/g, '');

// 4. Add bottom safe area padding to ScrollView
content = content.replace(
  /<ScrollView style=\{styles\.drawerMenu\} showsVerticalScrollIndicator=\{false\}>/,
  "<ScrollView style={styles.drawerMenu} contentContainerStyle={{ paddingBottom: insets.bottom + 20 }} showsVerticalScrollIndicator={false}>"
);

fs.writeFileSync('C:/Office/STG/src/components/CustomDrawer.tsx', content, 'utf8');
console.log('Fixed drawer contents and safe area.');
