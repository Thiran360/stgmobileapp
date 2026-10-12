const fs = require('fs');
let content = fs.readFileSync('src/screens/ChatScreen.tsx', 'utf8');

const targetStr = `                        <TouchableOpacity style={[styles.makeAdminBtn, member.role === 'admin' && styles.removeAdminBtn]} onPress={() => { setAdminActionUser({id: member.id, name: member.name, type: member.role === 'admin' ? 'remove' : 'make'}); setAdminConfirmVisible(true); }}>
                          <Text style={[styles.makeAdminText, member.role === 'admin' && styles.removeAdminText]}>{member.role === 'admin' ? 'Remove Admin' : 'Make Admin'}</Text>
                        </TouchableOpacity>`;

const replacement = `                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                          <TouchableOpacity style={[styles.makeAdminBtn, member.role === 'admin' && styles.removeAdminBtn]} onPress={() => { setAdminActionUser({id: member.id, name: member.name, type: member.role === 'admin' ? 'remove' : 'make'}); setAdminConfirmVisible(true); }}>
                            <Text style={[styles.makeAdminText, member.role === 'admin' && styles.removeAdminText]}>{member.role === 'admin' ? 'Remove Admin' : 'Make Admin'}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => handleRemoveMember(member.id, member.name)} style={{ padding: 4 }}>
                            <Icon name="person-remove" size={20} color="#DC2626" />
                          </TouchableOpacity>
                        </View>`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, replacement);
    fs.writeFileSync('src/screens/ChatScreen.tsx', content, 'utf8');
    console.log('Replaced member button properly');
} else {
    console.log('Target string not found');
}
