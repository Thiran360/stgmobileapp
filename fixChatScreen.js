const fs = require('fs');
let content = fs.readFileSync('src/screens/ChatScreen.tsx', 'utf8');

// 1. Add handleRemoveMember
if (!content.includes('handleRemoveMember')) {
  content = content.replace(
    'const confirmAdminAction = () => {',
    `const handleRemoveMember = (id: string, name: string) => {
    Alert.alert(
      'Remove Member',
      \`Are you sure you want to remove \${name} from this group?\`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => setGroupMembers(prev => prev.filter(m => m.id !== id)) }
      ]
    );
  };

  const confirmAdminAction = () => {`
  );
}

// 2. Add Remove icon and Group Permissions toggle
content = content.replace(
  /<TouchableOpacity style=\{\[styles\.makeAdminBtn.*?\n.*?<\/TouchableOpacity>/g,
  `
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                          <TouchableOpacity style={[styles.makeAdminBtn, member.role === 'admin' && styles.removeAdminBtn]} onPress={() => { setAdminActionUser({id: member.id, name: member.name, type: member.role === 'admin' ? 'remove' : 'make'}); setAdminConfirmVisible(true); }}>
                            <Text style={[styles.makeAdminText, member.role === 'admin' && styles.removeAdminText]}>{member.role === 'admin' ? 'Remove Admin' : 'Make Admin'}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => handleRemoveMember(member.id, member.name)} style={{ padding: 4 }}>
                            <Icon name="person-remove" size={20} color="#DC2626" />
                          </TouchableOpacity>
                        </View>`
);

content = content.replace(
  /<Text style={{ flex: 1, fontSize: 16, color: '#1F2937' }}>Group permissions<\/Text>\s*<Icon name="chevron-forward" size={20} color="#9CA3AF" \/>/g,
  `<Text style={{ flex: 1, fontSize: 16, color: '#1F2937' }}>Only Admins can send messages</Text>
                      <Switch value={adminOnly} onValueChange={setAdminOnly} trackColor={{ false: '#E5E7EB', true: '#10B981' }} thumbColor="#FFF" />`
);

fs.writeFileSync('src/screens/ChatScreen.tsx', content, 'utf8');
console.log('Applied changes to ChatScreen');
