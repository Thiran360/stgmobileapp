const fs = require('fs');
let content = fs.readFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', 'utf8');

// 1. Remove inline permissions toggle
const permTarget = `{iAmSuperAdmin && (
                  <View style={{ backgroundColor: '#FFF', marginBottom: 10, elevation: 1 }}>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
                      <Icon name="settings" size={24} color="#9CA3AF" style={{ marginRight: 15 }} />
                      <Text style={{ flex: 1, fontSize: 16, color: '#1F2937' }}>Only Admins can send messages</Text>
                      <Switch value={adminOnly} onValueChange={setAdminOnly} trackColor={{ false: '#E5E7EB', true: '#10B981' }} thumbColor="#FFF" />
                    </TouchableOpacity>
                  </View>
                )}`;
content = content.replace(permTarget, '');
content = content.replace(permTarget.replace(/\n/g, '\r\n'), '');

// 2. Add Modals for Edit Name, Edit Desc, Perms at the very end before </SafeAreaView>
const modals = `
        {/* Modals for Group Edits */}
        <Modal visible={editNameVisible} transparent animationType="fade">
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: '#FFF', width: '80%', padding: 20, borderRadius: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#111827' }}>Edit Group Name</Text>
              <TextInput style={{ borderBottomWidth: 1, borderBottomColor: '#10B981', fontSize: 16, paddingVertical: 5, color: '#1F2937', marginBottom: 20 }} value={currentGroupName} onChangeText={setCurrentGroupName} />
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 15 }}>
                <TouchableOpacity onPress={() => setEditNameVisible(false)}><Text style={{ color: '#6B7280', fontSize: 16, fontWeight: 'bold' }}>Cancel</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setEditNameVisible(false)}><Text style={{ color: '#10B981', fontSize: 16, fontWeight: 'bold' }}>Save</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={editDescVisible} transparent animationType="fade">
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: '#FFF', width: '80%', padding: 20, borderRadius: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#111827' }}>Edit Description</Text>
              <TextInput style={{ borderBottomWidth: 1, borderBottomColor: '#10B981', fontSize: 16, paddingVertical: 5, color: '#1F2937', marginBottom: 20 }} value={groupDescription} onChangeText={setGroupDescription} multiline />
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 15 }}>
                <TouchableOpacity onPress={() => setEditDescVisible(false)}><Text style={{ color: '#6B7280', fontSize: 16, fontWeight: 'bold' }}>Cancel</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setEditDescVisible(false)}><Text style={{ color: '#10B981', fontSize: 16, fontWeight: 'bold' }}>Save</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={groupPermsVisible} transparent animationType="fade">
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: '#FFF', width: '85%', padding: 20, borderRadius: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#111827' }}>Group Permissions</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 25 }}>
                <Text style={{ fontSize: 16, color: '#1F2937' }}>Only Admins can send messages</Text>
                <Switch value={adminOnly} onValueChange={setAdminOnly} trackColor={{ false: '#E5E7EB', true: '#10B981' }} thumbColor="#FFF" />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <TouchableOpacity onPress={() => setGroupPermsVisible(false)}><Text style={{ color: '#10B981', fontSize: 16, fontWeight: 'bold' }}>Done</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
`;
content = content.replace('</SafeAreaView>', modals);

fs.writeFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', content, 'utf8');
console.log('Added modals and removed inline perms');
