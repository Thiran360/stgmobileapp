const fs = require('fs');
let content = fs.readFileSync('C:/Office/STG/src/screens/InboxScreen.tsx', 'utf8');

const targetStrChat = `<Text style={styles.modalTitle}>New Chat</Text>`;
const replacementChat = `<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                    <Text style={[styles.modalTitle, { marginBottom: 0 }]}>New Chat</Text>
                    <TouchableOpacity onPress={() => { setCreateGroupVisible(false); setSelectedUsers([]); }} style={{ padding: 4 }}>
                      <Icon name="close" size={24} color="#111827" />
                    </TouchableOpacity>
                  </View>`;

const targetStrGroup = `<Text style={styles.modalTitle}>New Group</Text>`;
const replacementGroup = `<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                    <Text style={[styles.modalTitle, { marginBottom: 0 }]}>New Group</Text>
                    <TouchableOpacity onPress={() => { setCreateGroupVisible(false); setSelectedUsers([]); }} style={{ padding: 4 }}>
                      <Icon name="close" size={24} color="#111827" />
                    </TouchableOpacity>
                  </View>`;

content = content.replace(targetStrChat, replacementChat);
content = content.replace(targetStrGroup, replacementGroup);

fs.writeFileSync('C:/Office/STG/src/screens/InboxScreen.tsx', content, 'utf8');
console.log('Added close buttons to Inbox modal');
