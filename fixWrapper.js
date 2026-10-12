const fs = require('fs');
let content = fs.readFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', 'utf8');

const targetStr = `{iAmAdmin && (
                  <View style={{ backgroundColor: '#FFF', marginBottom: 10, elevation: 1 }}>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
                      <Icon name="settings" size={24} color="#9CA3AF" style={{ marginRight: 15 }} />
                      <Text style={{ flex: 1, fontSize: 16, color: '#1F2937' }}>Only Admins can send messages</Text>`;
                      
const replacement = `{iAmSuperAdmin && (
                  <View style={{ backgroundColor: '#FFF', marginBottom: 10, elevation: 1 }}>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
                      <Icon name="settings" size={24} color="#9CA3AF" style={{ marginRight: 15 }} />
                      <Text style={{ flex: 1, fontSize: 16, color: '#1F2937' }}>Only Admins can send messages</Text>`;

content = content.replace(targetStr, replacement);
content = content.replace(targetStr.replace(/\n/g, '\r\n'), replacement.replace(/\n/g, '\r\n'));

fs.writeFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', content, 'utf8');
console.log('Fixed permissions wrapper to iAmSuperAdmin');
