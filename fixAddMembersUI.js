const fs = require('fs');
let content = fs.readFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', 'utf8');

// 1. Remove the bottom two options in the 3-dots menu
const dropdownMenuRegex = /<View style=\{\{ height: 1, backgroundColor: '#F3F4F6', marginVertical: 5 \}\} \/>\r?\n\s*<TouchableOpacity style=\{\{ padding: 15 \}\}>\r?\n\s*<Text style=\{\{ fontSize: 16, color: '#1F2937' \}\}>Add group to a community<\/Text>\r?\n\s*<\/TouchableOpacity>\r?\n\s*<TouchableOpacity style=\{\{ padding: 15 \}\}>\r?\n\s*<Text style=\{\{ fontSize: 16, color: '#1F2937' \}\}>Export chat<\/Text>\r?\n\s*<\/TouchableOpacity>/g;
content = content.replace(dropdownMenuRegex, '');

// 2. Change Add members onPress to open a new state (isAddMembersVisible)
content = content.replace(
  /setGroupMenuVisible\(false\); Alert\.alert\('Add Members', 'Select contacts screen will open here\.'\);/g,
  'setGroupMenuVisible(false); setAddMembersVisible(true);'
);

// 3. Add state for isAddMembersVisible and searchQuery
const stateTarget = `const [groupPermsVisible, setGroupPermsVisible] = useState(false);`;
const stateReplacement = `const [groupPermsVisible, setGroupPermsVisible] = useState(false);
  const [isAddMembersVisible, setAddMembersVisible] = useState(false);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [selectedNewMembers, setSelectedNewMembers] = useState<string[]>([]);
  
  const dummySearchUsers = [
    { id: '101', name: 'Mortal', username: 'mortal_esports', avatar: 'https://i.pravatar.cc/150?u=101' },
    { id: '102', name: 'Scout', username: 'scout_pubg', avatar: 'https://i.pravatar.cc/150?u=102' },
    { id: '103', name: 'Dynamo', username: 'dynamo_gaming', avatar: 'https://i.pravatar.cc/150?u=103' },
    { id: '104', name: 'Jonathan', username: 'jonathan_gaming', avatar: 'https://i.pravatar.cc/150?u=104' },
  ];`;
content = content.replace(stateTarget, stateReplacement);

// 4. Add the Add Members Modal at the bottom
const modalUI = `
        {/* Add Members (Instagram Style Search) Modal */}
        <Modal visible={isAddMembersVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => { setAddMembersVisible(false); setSelectedNewMembers([]); setMemberSearchQuery(''); }}>
          <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top']}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F4F6F8' }}>
              <TouchableOpacity onPress={() => { setAddMembersVisible(false); setSelectedNewMembers([]); setMemberSearchQuery(''); }} style={{ padding: 4 }}>
                <Icon name="close" size={24} color="#111827" />
              </TouchableOpacity>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827' }}>Add members</Text>
              <TouchableOpacity onPress={() => { setAddMembersVisible(false); setSelectedNewMembers([]); setMemberSearchQuery(''); }} disabled={selectedNewMembers.length === 0}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: selectedNewMembers.length > 0 ? '#E51025' : '#D1D5DB' }}>Done</Text>
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F4F6F8' }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginRight: 10 }}>To:</Text>
              <TextInput 
                style={{ flex: 1, fontSize: 16, color: '#111827', padding: 0 }}
                placeholder="Search..."
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
      </SafeAreaView>
`;
content = content.replace('</SafeAreaView>\r\n    );', modalUI + '\r\n    );');
content = content.replace('</SafeAreaView>\n    );', modalUI + '\n    );');

fs.writeFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', content, 'utf8');
console.log('Added Insta style add members modal');
