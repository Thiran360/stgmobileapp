const fs = require('fs');
let content = fs.readFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', 'utf8');

const lines = content.split('\n');
const startIdx = 521; // 0-indexed is 521 for line 522
const endIdx = 523; // 523 for line 524

const replacement = `                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                          <TouchableOpacity style={[styles.makeAdminBtn, member.role === 'admin' && styles.removeAdminBtn]} onPress={() => { setAdminActionUser({id: member.id, name: member.name, type: member.role === 'admin' ? 'remove' : 'make'}); setAdminConfirmVisible(true); }}>
                            <Text style={[styles.makeAdminText, member.role === 'admin' && styles.removeAdminText]}>{member.role === 'admin' ? 'Remove Admin' : 'Make Admin'}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => handleRemoveMember(member.id, member.name)} style={{ padding: 4 }}>
                            <Icon name="person-remove" size={20} color="#DC2626" />
                          </TouchableOpacity>
                        </View>`;

lines.splice(startIdx, endIdx - startIdx + 1, replacement);

fs.writeFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', lines.join('\n'), 'utf8');
console.log('Replaced member button by lines');
