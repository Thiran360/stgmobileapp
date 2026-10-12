const fs = require('fs');
let c = fs.readFileSync('src/screens/LookingScreen.tsx', 'utf8');

const s1 = '<Modal visible={isYouModalVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setYouModalVisible(false)}>\n        <View style={{ height: insets.top, backgroundColor: "#E51025", width: "100%" }} />';
const r1 = '<Modal visible={isYouModalVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setYouModalVisible(false)}>\n        <View style={{ flex: 1 }}>\n        <View style={{ height: insets.top, backgroundColor: "#E51025", width: "100%" }} />';

c = c.replace(s1, r1);
c = c.replace(s1.replace(/\n/g, '\r\n'), r1.replace(/\n/g, '\r\n'));

const s2 = '<Modal visible={isPostModalVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setPostModalVisible(false)}>\n          <View style={{ flex: 1 }}>\n          <View style={{ flex: 1 }}>';
const r2 = '<Modal visible={isPostModalVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setPostModalVisible(false)}>\n          <View style={{ flex: 1 }}>';
c = c.replace(s2, r2);
c = c.replace(s2.replace(/\n/g, '\r\n'), r2.replace(/\n/g, '\r\n'));

fs.writeFileSync('src/screens/LookingScreen.tsx', c, 'utf8');
console.log('Fixed you modal wrapper');
