const fs = require('fs');
let content = fs.readFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', 'utf8');

// 1. Add States
const stateTarget = `const [currentGroupName, setCurrentGroupName] = useState(userName);`;
const stateReplacement = `const [currentGroupName, setCurrentGroupName] = useState(userName);
  const [groupDescription, setGroupDescription] = useState('Hello squad welcome to the tournament!');
  const [groupMenuVisible, setGroupMenuVisible] = useState(false);
  const [editNameVisible, setEditNameVisible] = useState(false);
  const [editDescVisible, setEditDescVisible] = useState(false);
  const [groupPermsVisible, setGroupPermsVisible] = useState(false);`;
content = content.replace(stateTarget, stateReplacement);

// 2. Modify Header
const headerTarget = `            {/* Header */}
            <View style={[styles.modalHeader, { backgroundColor: '#FFF', elevation: 2 }]}>
              <TouchableOpacity onPress={() => setSettingsVisible(false)} style={{ padding: 4 }}>
                <Icon name="arrow-back" size={24} color="#1F2937" />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { flex: 1, marginLeft: 15 }]}>{isGroup ? 'Group Info' : 'Contact Info'}</Text>
            </View>`;
            
const headerReplacement = `            {/* Header */}
            <View style={[styles.modalHeader, { backgroundColor: '#FFF', elevation: 2, zIndex: 10 }]}>
              <TouchableOpacity onPress={() => setSettingsVisible(false)} style={{ padding: 4 }}>
                <Icon name="arrow-back" size={24} color="#1F2937" />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { flex: 1, marginLeft: 15 }]}>{isGroup ? 'Group Info' : 'Contact Info'}</Text>
              
              {isGroup && iAmSuperAdmin && (
                <TouchableOpacity onPress={() => setGroupMenuVisible(true)} style={{ padding: 4 }}>
                  <Icon name="ellipsis-vertical" size={24} color="#1F2937" />
                </TouchableOpacity>
              )}

              {/* Group Menu Dropdown */}
              {groupMenuVisible && (
                <Modal transparent={true} animationType="fade" visible={groupMenuVisible} onRequestClose={() => setGroupMenuVisible(false)}>
                  <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setGroupMenuVisible(false)}>
                    <View style={{ position: 'absolute', top: 50, right: 10, backgroundColor: '#FFF', borderRadius: 8, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, width: 220, paddingVertical: 5 }}>
                      <TouchableOpacity style={{ padding: 15 }} onPress={() => { setGroupMenuVisible(false); /* Add members logic here later if needed, but we can reuse the inline for now, wait the user wanted it in menu */ }}>
                        <Text style={{ fontSize: 16, color: '#1F2937' }}>Add members</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{ padding: 15 }} onPress={() => { setGroupMenuVisible(false); setEditNameVisible(true); }}>
                        <Text style={{ fontSize: 16, color: '#1F2937' }}>Edit name</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{ padding: 15 }} onPress={() => { setGroupMenuVisible(false); setEditDescVisible(true); }}>
                        <Text style={{ fontSize: 16, color: '#1F2937' }}>Edit description</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{ padding: 15 }} onPress={() => { setGroupMenuVisible(false); setGroupPermsVisible(true); }}>
                        <Text style={{ fontSize: 16, color: '#1F2937' }}>Group permissions</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{ padding: 15 }}>
                        <Text style={{ fontSize: 16, color: '#1F2937' }}>Add group to a community</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{ padding: 15 }}>
                        <Text style={{ fontSize: 16, color: '#1F2937' }}>Export chat</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </Modal>
              )}
            </View>`;

content = content.replace(headerTarget, headerReplacement);
content = content.replace(headerTarget.replace(/\n/g, '\r\n'), headerReplacement.replace(/\n/g, '\r\n'));

fs.writeFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', content, 'utf8');
console.log('Added states and header menu');
