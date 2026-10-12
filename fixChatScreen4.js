const fs = require('fs');
let content = fs.readFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', 'utf8');

const targetStr = `<Text style={{ flex: 1, fontSize: 16, color: '#1F2937' }}>Group permissions</Text>
                      <Icon name="chevron-forward" size={20} color="#9CA3AF" />`;

const replacement = `<Text style={{ flex: 1, fontSize: 16, color: '#1F2937' }}>Only Admins can send messages</Text>
                      <Switch value={adminOnly} onValueChange={setAdminOnly} trackColor={{ false: '#E5E7EB', true: '#10B981' }} thumbColor="#FFF" />`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, replacement);
    fs.writeFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', content, 'utf8');
    console.log('Replaced group permissions');
} else {
    console.log('Target not found for permissions');
}
