const fs = require('fs');
let content = fs.readFileSync('C:/Office/STG/src/components/CustomDrawer.tsx', 'utf8');

content = content.replace(/navigation\.navigate\('Home'\)/g, "navigation.navigate('MainTabs', { screen: 'Home' })");
content = content.replace(/navigation\.navigate\('Looking'\)/g, "navigation.navigate('MainTabs', { screen: 'Looking' })");
content = content.replace(/navigation\.navigate\('Matches'\)/g, "navigation.navigate('MainTabs', { screen: 'Matches' })");
content = content.replace(/navigation\.navigate\('Community'\)/g, "navigation.navigate('MainTabs', { screen: 'Community' })");
content = content.replace(/navigation\.navigate\('Store'\)/g, "navigation.navigate('MainTabs', { screen: 'Store' })");

fs.writeFileSync('C:/Office/STG/src/components/CustomDrawer.tsx', content, 'utf8');
console.log('Fixed navigation targets.');
