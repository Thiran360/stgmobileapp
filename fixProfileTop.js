const fs = require('fs');
let content = fs.readFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', 'utf8');

const startIdx = content.indexOf('{/* Top Profile Section */}');
const endIdx = content.indexOf('{/* Media Links Docs */}');

if (startIdx !== -1 && endIdx !== -1) {
  const replacement = `{/* Top Profile Section */}
            <View style={{ backgroundColor: '#FFF', alignItems: 'center', paddingVertical: 25, marginBottom: 10, elevation: 1 }}>
              <View style={styles.groupLogoWrapper}>
                <Image source={{ uri: groupLogo }} style={styles.groupLogoLarge} />
                {isGroup && iAmSuperAdmin && (
                  <TouchableOpacity style={styles.editLogoBtn} onPress={() => {
                    Alert.alert('Profile Photo', 'Choose an option', [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Remove Photo', onPress: () => setGroupLogo('https://via.placeholder.com/150/CCCCCC/FFFFFF?text=No+Photo'), style: 'destructive' },
                      { text: 'Upload Photo', onPress: handlePickImage }
                    ]);
                  }}>
                    <Icon name="camera" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                )}
              </View>

              <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#111827', marginBottom: 5 }}>
                {currentGroupName}
              </Text>
              
              {isGroup ? (
                <>
                  <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 10 }}>Group • {groupMembers.length} members</Text>
                  <Text style={{ fontSize: 15, color: '#4B5563', textAlign: 'center', paddingHorizontal: 20, marginBottom: 20 }}>
                    {groupDescription}
                  </Text>
                </>
              ) : (
                <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 20 }}>+91 98765 43210</Text>
              )}

              <View style={{ flexDirection: 'row', gap: 20 }}>
                <TouchableOpacity style={{ alignItems: 'center' }}>
                  <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
                    <Icon name="call" size={20} color="#10B981" />
                  </View>
                  <Text style={{ fontSize: 12, color: '#4B5563' }}>Audio</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center' }}>
                  <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
                    <Icon name="videocam" size={20} color="#10B981" />
                  </View>
                  <Text style={{ fontSize: 12, color: '#4B5563' }}>Video</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center' }}>
                  <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
                    <Icon name="search" size={20} color="#10B981" />
                  </View>
                  <Text style={{ fontSize: 12, color: '#4B5563' }}>Search</Text>
                </TouchableOpacity>
              </View>
            </View>

            `;
  content = content.substring(0, startIdx) + replacement + content.substring(endIdx);
  fs.writeFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', content, 'utf8');
  console.log('Replaced Top Profile Section');
}
