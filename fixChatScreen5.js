const fs = require('fs');
let content = fs.readFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', 'utf8');

const lines = content.split('\n');
const startIdx = 491; // 0-indexed is 491 for line 492
const endIdx = 492; // 492 for line 493

const replacement = `                      <Text style={{ flex: 1, fontSize: 16, color: '#1F2937' }}>Only Admins can send messages</Text>
                      <Switch value={adminOnly} onValueChange={setAdminOnly} trackColor={{ false: '#E5E7EB', true: '#10B981' }} thumbColor="#FFF" />`;

lines.splice(startIdx, endIdx - startIdx + 1, replacement);

fs.writeFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', lines.join('\n'), 'utf8');
console.log('Replaced group permissions toggle by lines');
