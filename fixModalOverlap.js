const fs = require('fs');
let content = fs.readFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', 'utf8');

// 1. Remove the separate Modal for Add Members
const modalUIRegex = /\{\/\* Add Members \(Instagram Style Search\) Modal \*\/\}\r?\n\s*<Modal visible=\{isAddMembersVisible\}[\s\S]*?<\/Modal>\r?\n/g;
content = content.replace(modalUIRegex, '');

// 2. Put the Search UI inside the isSettingsVisible Modal
const settingsModalStart = `<Modal visible={isSettingsVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSettingsVisible(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top']}>`;

const searchUI = `
          {isAddMembersVisible ? (
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F4F6F8' }}>
                <TouchableOpacity onPress={() => { setAddMembersVisible(false); setSelectedNewMembers([]); setMemberSearchQuery(''); }} style={{ padding: 4 }}>
                  <Icon name="arrow-back" size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827' }}>Add members</Text>
                <TouchableOpacity onPress={() => { setAddMembersVisible(false); setSelectedNewMembers([]); setMemberSearchQuery(''); }} disabled={selectedNewMembers.length === 0}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: selectedNewMembers.length > 0 ? '#E51025' : '#D1D5DB' }}>Add</Text>
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F4F6F8' }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginRight: 10 }}>To:</Text>
                <TextInput 
                  style={{ flex: 1, fontSize: 16, color: '#111827', padding: 0 }}
                  placeholder="Search globally..."
                  placeholderTextColor="#9CA3AF"
                  value={memberSearchQuery}
                  onChangeText={setMemberSearchQuery}
                  autoFocus
                />
              </View>

              <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <Text style={{ padding: 15, fontSize: 14, fontWeight: 'bold', color: '#6B7280' }}>Suggested</Text>
                {dummySearchUsers
                  .filter(u => u.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) || u.username.toLowerCase().includes(memberSearchQuery.toLowerCase()))
                  .map(user => {
                    const isSelected = selectedNewMembers.includes(user.id);
                    return (
                      <TouchableOpacity 
                        key={user.id} 
                        style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10 }}
                        onPress={() => {
                          if (isSelected) {
                            setSelectedNewMembers(prev => prev.filter(id => id !== user.id));
                          } else {
                            setSelectedNewMembers(prev => [...prev, user.id]);
                          }
                        }}
                      >
                        <Image source={{ uri: user.avatar }} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 15 }} />
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111827' }}>{user.name}</Text>
                          <Text style={{ fontSize: 14, color: '#6B7280' }}>{user.username}</Text>
                        </View>
                        <View style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: isSelected ? '#E51025' : '#D1D5DB', backgroundColor: isSelected ? '#E51025' : 'transparent', justifyContent: 'center', alignItems: 'center' }}>
                          {isSelected && <Icon name="checkmark" size={16} color="#FFFFFF" />}
                        </View>
                      </TouchableOpacity>
                    )
                })}
              </ScrollView>
            </View>
          ) : (
            <View style={{ flex: 1 }}>`;

content = content.replace(settingsModalStart, settingsModalStart + '\r\n' + searchUI);
content = content.replace(settingsModalStart.replace(/\r\n/g, '\n'), settingsModalStart.replace(/\r\n/g, '\n') + '\n' + searchUI);

// Close the View wrapper at the end of the isSettingsVisible Modal content
// We need to find the end of the Group Info ScrollView.
// Look for `<Modal visible={editNameVisible} transparent animationType="fade">`
// We will put `</View>` right before `{/* Modals for Group Edits */}`
const modalsStart = `{/* Modals for Group Edits */}`;
content = content.replace(modalsStart, `</View>\r\n          ${modalsStart}`);

fs.writeFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', content, 'utf8');
console.log('Fixed Add Members Modal overlapping issue');
