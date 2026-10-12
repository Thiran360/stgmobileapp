const fs = require('fs');
let content = fs.readFileSync('C:/Office/STG/src/components/CustomDrawer.tsx', 'utf8');

const targetStr = `<ScrollView style={styles.drawerMenu} showsVerticalScrollIndicator={false}>`;

const replacementStr = `<ScrollView style={styles.drawerMenu} showsVerticalScrollIndicator={false}>
              
              <DrawerItem icon="home-outline" label="Home" onPress={() => { setIsDrawerOpen(false); navigation.navigate('Home'); }} />
              <DrawerItem icon="search-outline" label="Looking" onPress={() => { setIsDrawerOpen(false); navigation.navigate('Looking'); }} />
              <DrawerItem icon="trophy-outline" label="Matches" onPress={() => { setIsDrawerOpen(false); navigation.navigate('Matches'); }} />
              <DrawerItem icon="people-outline" label="Community" onPress={() => { setIsDrawerOpen(false); navigation.navigate('Community'); }} />
              <DrawerItem icon="cart-outline" label="Store" onPress={() => { setIsDrawerOpen(false); navigation.navigate('Store'); }} />

              <View style={styles.menuDivider} />`;

content = content.replace(targetStr, replacementStr);
fs.writeFileSync('C:/Office/STG/src/components/CustomDrawer.tsx', content, 'utf8');
console.log('Added bottom tabs to drawer.');
