const fs = require('fs');
let content = fs.readFileSync('C:/Office/STG/src/screens/InboxScreen.tsx', 'utf8');

// 1. Update State types
content = content.replace(
  "const [activeTab, setActiveTab] = useState<'Chats' | 'Groups' | 'Favorites'>('Chats');",
  `const [activeTab, setActiveTab] = useState<string>('Chats');
  const [customLists, setCustomLists] = useState<string[]>([]);
  const [isCustomizeVisible, setCustomizeVisible] = useState(false);
  const [newListName, setNewListName] = useState('');`
);

// 2. Update getFilteredChats to handle custom lists
content = content.replace(
  "if (activeTab === 'Favorites') return chats.filter(c => c.isFavorite);",
  `if (activeTab === 'Favorites') return chats.filter(c => c.isFavorite);
    if (customLists.includes(activeTab)) return []; // Dummy empty list for custom lists`
);

// 3. Update tabs rendering
const oldTabsRegex = /\{?\['Chats', 'Groups', 'Favorites'\]\.map\(tab => \([\s\S]*?\}\)\]\}\>\r?\n\s*<Text style=\{\{ color: activeTab === tab \? '#FFFFFF' : '#4B5563', fontWeight: 'bold' \}\}>\{tab\}<\/Text>\r?\n\s*<\/TouchableOpacity>\r?\n\s*\)\}\r?\n\s*<\/View>/;

const newTabs = `{['Chats', 'Groups', 'Favorites', ...customLists].map(tab => (
          <TouchableOpacity 
            key={tab} 
            onPress={() => setActiveTab(tab)}
            style={{ 
              marginRight: 15, 
              paddingVertical: 6, 
              paddingHorizontal: 16, 
              borderRadius: 20, 
              backgroundColor: activeTab === tab ? '#E51025' : '#F3F4F6' 
            }}>
            <Text style={{ color: activeTab === tab ? '#FFFFFF' : '#4B5563', fontWeight: 'bold' }}>{tab}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity 
            onPress={() => setCustomizeVisible(true)}
            style={{ 
              paddingVertical: 6, 
              paddingHorizontal: 12, 
              borderRadius: 20, 
              backgroundColor: '#F3F4F6',
              flexDirection: 'row',
              alignItems: 'center'
            }}>
            <Icon name="add" size={16} color="#4B5563" />
            <Text style={{ color: '#4B5563', fontWeight: 'bold', marginLeft: 4 }}>Customize</Text>
          </TouchableOpacity>
      </ScrollView>`;

// We should wrap the tabs in a ScrollView horizontal instead of a normal View because there might be many tabs now.
const tabsContainerRegex = /<View style=\{\{ flexDirection: 'row', paddingHorizontal: 20, marginBottom: 10 \}\}>[\s\S]*?<\/View>/;
content = content.replace(tabsContainerRegex, `<ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row', paddingHorizontal: 20, marginBottom: 10, flexGrow: 0 }} contentContainerStyle={{ paddingRight: 40 }}>\r\n        ${newTabs}`);

// 4. Add the Customize Modal
const modalStr = `      {/* Customize List Modal */}
      <Modal visible={isCustomizeVisible} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '80%', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 15 }}>Create Custom List</Text>
            <TextInput 
              style={{ borderBottomWidth: 1, borderBottomColor: '#E51025', fontSize: 16, paddingVertical: 5, color: '#111827', marginBottom: 20 }} 
              placeholder="List name (e.g., Work, Family)"
              value={newListName} 
              onChangeText={setNewListName} 
              autoFocus
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 15 }}>
              <TouchableOpacity onPress={() => { setCustomizeVisible(false); setNewListName(''); }}><Text style={{ color: '#6B7280', fontSize: 16, fontWeight: 'bold' }}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => { 
                if(newListName.trim()) { 
                  setCustomLists([...customLists, newListName.trim()]); 
                  setActiveTab(newListName.trim()); 
                }
                setCustomizeVisible(false); 
                setNewListName(''); 
              }}><Text style={{ color: '#E51025', fontSize: 16, fontWeight: 'bold' }}>Create</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>`;

content = content.replace('    </SafeAreaView>', modalStr);
content = content.replace('    </SafeAreaView>', modalStr); // Fallback if double replacement doesn't happen, wait I only need one

fs.writeFileSync('C:/Office/STG/src/screens/InboxScreen.tsx', content, 'utf8');
console.log('Added custom lists logic.');
