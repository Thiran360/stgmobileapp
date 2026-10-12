const fs = require('fs');
let content = fs.readFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', 'utf8');

const targetStr = `          {/* Header */}
          <View style={[styles.modalHeader, { backgroundColor: '#FFFFFF', elevation: 2 }]}>
            <TouchableOpacity onPress={() => setSettingsVisible(false)} style={{ padding: 4 }}>
              <Icon name="arrow-back" size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { flex: 1, marginLeft: 15 }]}>{isGroup ? 'Group Info' : 'Contact Info'}</Text>
          </View>`;
          
const replacement = `          {/* Header */}
          <View style={[styles.modalHeader, { backgroundColor: '#FFFFFF', elevation: 2, zIndex: 10 }]}>
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
                  <View style={{ position: 'absolute', top: 50, right: 10, backgroundColor: '#FFFFFF', borderRadius: 8, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, width: 220, paddingVertical: 5 }}>
                    <TouchableOpacity style={{ padding: 15 }} onPress={() => { setGroupMenuVisible(false); }}>
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
                    <View style={{ height: 1, backgroundColor: '#F3F4F6', marginVertical: 5 }} />
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

content = content.replace(targetStr, replacement);
content = content.replace(targetStr.replace(/\n/g, '\r\n'), replacement.replace(/\n/g, '\r\n'));

fs.writeFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', content, 'utf8');
console.log('Replaced header successfully.');
