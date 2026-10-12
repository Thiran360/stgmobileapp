const fs = require('fs');
let content = fs.readFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', 'utf8');

// 1. Make Modal dark and fix Header
const headerTarget = `        <Modal visible={isSettingsVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSettingsVisible(false)}>
          <SafeAreaView style={{ flex: 1, backgroundColor: '#F4F6F8' }} edges={['top']}>
            {/* Header */}
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

const headerReplacement = `        <Modal visible={isSettingsVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSettingsVisible(false)}>
          <SafeAreaView style={{ flex: 1, backgroundColor: '#0B141B' }} edges={['top']}>
            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, zIndex: 10 }}>
              <TouchableOpacity onPress={() => setSettingsVisible(false)} style={{ padding: 4 }}>
                <Icon name="arrow-back" size={26} color="#FFF" />
              </TouchableOpacity>
              
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                <TouchableOpacity style={{ padding: 4 }}>
                  <Icon name="qr-code-outline" size={24} color="#FFF" />
                </TouchableOpacity>
                {isGroup && iAmSuperAdmin && (
                  <TouchableOpacity onPress={() => setGroupMenuVisible(true)} style={{ padding: 4 }}>
                    <Icon name="ellipsis-vertical" size={24} color="#FFF" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Group Menu Dropdown */}`;

content = content.replace(headerTarget, headerReplacement);
content = content.replace(headerTarget.replace(/\n/g, '\r\n'), headerReplacement.replace(/\n/g, '\r\n'));


// 2. Fix Dropdown style to match Whatsapp Dark Mode
const dropdownTarget = `position: 'absolute', top: 50, right: 10, backgroundColor: '#FFF', borderRadius: 8, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, width: 220, paddingVertical: 5`;
const dropdownReplacement = `position: 'absolute', top: 50, right: 10, backgroundColor: '#233138', borderRadius: 12, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, width: 230, paddingVertical: 8`;
content = content.replace(dropdownTarget, dropdownReplacement);

// Fix dropdown text color
content = content.replace(/<Text style={{ fontSize: 16, color: '#1F2937' }}>/g, '<Text style={{ fontSize: 16, color: \'#FFF\' }}>');


// 3. Fix Top Profile Section to match screenshot
const topProfileTarget = `{/* Top Profile Section */}
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
            </View>`;

const topProfileReplacement = `{/* Top Profile Section */}
            <View style={{ backgroundColor: '#0B141B', alignItems: 'center', paddingVertical: 10, paddingBottom: 25, borderBottomWidth: 1, borderBottomColor: '#202C33' }}>
              <View style={styles.groupLogoWrapper}>
                <Image source={{ uri: groupLogo }} style={[styles.groupLogoLarge, { width: 140, height: 140, borderRadius: 70 }]} />
              </View>

              <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#E9EDEF', marginBottom: 5 }}>
                {currentGroupName}
              </Text>
              
              {isGroup ? (
                <>
                  <Text style={{ fontSize: 16, color: '#8696A0', marginBottom: 10 }}>Group • {groupMembers.length} members</Text>
                  <Text style={{ fontSize: 16, color: '#E9EDEF', textAlign: 'center', paddingHorizontal: 20, marginBottom: 25 }}>
                    {groupDescription}
                  </Text>
                </>
              ) : (
                <Text style={{ fontSize: 16, color: '#8696A0', marginBottom: 20 }}>+91 98765 43210</Text>
              )}

              <View style={{ flexDirection: 'row', gap: 20 }}>
                <TouchableOpacity style={{ alignItems: 'center' }}>
                  <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: '#202C33', justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
                    <Icon name="chatbubble-ellipses-outline" size={22} color="#E9EDEF" />
                  </View>
                  <Text style={{ fontSize: 13, color: '#E9EDEF', fontWeight: '500' }}>Voice chat</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center' }}>
                  <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: '#202C33', justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
                    <Icon name="search" size={22} color="#E9EDEF" />
                  </View>
                  <Text style={{ fontSize: 13, color: '#E9EDEF', fontWeight: '500' }}>Search</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Dummy Options exactly matching screenshot */}
            <View style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#202C33' }}>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 }}>
                <Icon name="folder-outline" size={24} color="#8696A0" style={{ marginRight: 20 }} />
                <View>
                  <Text style={{ fontSize: 17, color: '#E9EDEF', fontWeight: '400' }}>Manage storage</Text>
                  <Text style={{ fontSize: 14, color: '#8696A0', marginTop: 2 }}>3.5 MB</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 }}>
                <Icon name="notifications-outline" size={24} color="#8696A0" style={{ marginRight: 20 }} />
                <View>
                  <Text style={{ fontSize: 17, color: '#E9EDEF', fontWeight: '400' }}>Notifications</Text>
                  <Text style={{ fontSize: 14, color: '#8696A0', marginTop: 2 }}>Highlights</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 }}>
                <Icon name="image-outline" size={24} color="#8696A0" style={{ marginRight: 20 }} />
                <Text style={{ fontSize: 17, color: '#E9EDEF', fontWeight: '400' }}>Media visibility</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 }}>
                <Icon name="lock-closed-outline" size={24} color="#8696A0" style={{ marginRight: 20 }} />
                <View>
                  <Text style={{ fontSize: 17, color: '#E9EDEF', fontWeight: '400' }}>Encryption</Text>
                  <Text style={{ fontSize: 14, color: '#8696A0', marginTop: 2 }}>Messages and calls are end-to-end{"\n"}encrypted.</Text>
                </View>
              </TouchableOpacity>
            </View>
`;

content = content.replace(topProfileTarget, topProfileReplacement);
content = content.replace(topProfileTarget.replace(/\n/g, '\r\n'), topProfileReplacement.replace(/\n/g, '\r\n'));

fs.writeFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', content, 'utf8');
console.log('Fixed Top Profile section to match screenshot');
