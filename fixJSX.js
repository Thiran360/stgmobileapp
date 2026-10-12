const fs = require('fs');
let content = fs.readFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', 'utf8');

// 1. Remove the extra </View> that caused the crash
content = content.replace("</View>\r\n          {/* Modals for Group Edits */}", "{/* Modals for Group Edits */}");
content = content.replace("</View>\n          {/* Modals for Group Edits */}", "{/* Modals for Group Edits */}");

// 2. Remove the old Instagram style Modal if it exists at the bottom (it shouldn't but just in case)
const modalUIRegex = /\{\/\* Add Members \(Instagram Style Search\) Modal \*\/\}\r?\n\s*<Modal visible=\{isAddMembersVisible\}[\s\S]*?<\/Modal>\r?\n/g;
content = content.replace(modalUIRegex, '');

// 3. Add the Modal at the very end, exactly as we had before, but with fullScreen
const modalUI = `
        {/* Add Members (Instagram Style Search) Modal */}
        <Modal visible={isAddMembersVisible} animationType="slide" onRequestClose={() => { setAddMembersVisible(false); setSelectedNewMembers([]); setMemberSearchQuery(''); }}>
          <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top']}>
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
          </SafeAreaView>
        </Modal>
`;

content = content.replace('    );\r\n  };\r\n  \r\nconst styles', modalUI + '\r\n    );\r\n  };\r\n  \r\nconst styles');
content = content.replace('    );\n  };\n  \nconst styles', modalUI + '\n    );\n  };\n  \nconst styles');

fs.writeFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', content, 'utf8');
console.log('Fixed JSX Error and re-added Add Members Modal');
