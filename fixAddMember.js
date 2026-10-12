const fs = require('fs');
let content = fs.readFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', 'utf8');

content = content.replace(
  `onPress={() => { setGroupMenuVisible(false); }}>\r\n                      <Text style={{ fontSize: 16, color: '#1F2937' }}>Add members</Text>`,
  `onPress={() => { setGroupMenuVisible(false); Alert.alert('Add Members', 'Select contacts screen will open here.'); }}>\r\n                      <Text style={{ fontSize: 16, color: '#1F2937' }}>Add members</Text>`
);
// Also support \n without \r
content = content.replace(
  `onPress={() => { setGroupMenuVisible(false); }}>\n                      <Text style={{ fontSize: 16, color: '#1F2937' }}>Add members</Text>`,
  `onPress={() => { setGroupMenuVisible(false); Alert.alert('Add Members', 'Select contacts screen will open here.'); }}>\n                      <Text style={{ fontSize: 16, color: '#1F2937' }}>Add members</Text>`
);

fs.writeFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', content, 'utf8');
console.log('Done Add Member Alert');
