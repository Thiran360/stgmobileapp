const fs = require('fs');
let content = fs.readFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', 'utf8');

const targetHeader = `            {/* Header */}
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

              {/* Group Menu Dropdown */}`;

const replacementHeader = `            {/* Header */}
            <View style={[styles.modalHeader, { backgroundColor: '#FFF', elevation: 0, borderBottomWidth: 0, zIndex: 10, justifyContent: 'space-between' }]}>
              <TouchableOpacity onPress={() => setSettingsVisible(false)} style={{ padding: 4 }}>
                <Icon name="arrow-back" size={28} color="#1F2937" />
              </TouchableOpacity>
              
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                <TouchableOpacity style={{ padding: 4 }}>
                  <Icon name="qr-code-outline" size={24} color="#1F2937" />
                </TouchableOpacity>
                {isGroup && iAmSuperAdmin && (
                  <TouchableOpacity onPress={() => setGroupMenuVisible(true)} style={{ padding: 4 }}>
                    <Icon name="ellipsis-vertical" size={24} color="#1F2937" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Group Menu Dropdown */}`;

content = content.replace(targetHeader, replacementHeader);
content = content.replace(targetHeader.replace(/\n/g, '\r\n'), replacementHeader.replace(/\n/g, '\r\n'));

fs.writeFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', content, 'utf8');
console.log('Updated Group Info Header');
