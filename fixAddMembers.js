const fs = require('fs');
let content = fs.readFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', 'utf8');

const targetStr = `{iAmAdmin && (
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 12 }}>
                      <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                        <Icon name="person-add" size={20} color="#FFF" />
                      </View>
                      <Text style={{ fontSize: 16, color: '#10B981', fontWeight: '500' }}>Add members</Text>`;
                      
const replacement = `{iAmSuperAdmin && (
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 12 }}>
                      <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                        <Icon name="person-add" size={20} color="#FFF" />
                      </View>
                      <Text style={{ fontSize: 16, color: '#10B981', fontWeight: '500' }}>Add members</Text>`;

content = content.replace(targetStr, replacement);
content = content.replace(targetStr.replace(/\n/g, '\r\n'), replacement.replace(/\n/g, '\r\n'));

fs.writeFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', content, 'utf8');
console.log('Fixed Add members wrapper to iAmSuperAdmin');
