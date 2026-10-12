import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, StatusBar, TextInput, Modal, ScrollView, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../context/AppContext';

const InboxScreen = () => {
  const navigation = useNavigation<any>();

  const { chats, addMultipleChats } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState<string>('Chats');
  const [customLists, setCustomLists] = useState<string[]>([]);
  const [isCustomizeVisible, setCustomizeVisible] = useState(false);
  const [newListName, setNewListName] = useState('');

  // Filter chats based on tab
  const getFilteredChats = () => {
    if (activeTab === 'Groups') return chats.filter(c => c.isGroup);
    if (activeTab === 'Favorites') return chats.filter(c => c.isFavorite);
    if (customLists.includes(activeTab)) return []; // Dummy empty list for custom lists
    return chats.filter(c => !c.isGroup);
  };

  const filteredChatList = getFilteredChats();

  const handleDeleteChat = (id: string, name: string) => {
    Alert.alert(
      'Delete Chat',
      `Are you sure you want to delete your chat with ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => { console.log('Chat deleted:', id); }
        }
      ]
    );
  };

  const renderChatItem = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.chatItem}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('ChatScreen', { userId: item.id, userName: item.name, isGroup: item.isGroup, isCreator: false })}
      onLongPress={() => handleDeleteChat(item.id, item.name)}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: `https://i.pravatar.cc/150?u=${item.id}` }} style={styles.avatar} />
        {item.unread > 0 && <View style={styles.onlineIndicator} />}
      </View>
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={[styles.chatName, item.unread > 0 && styles.chatNameUnread]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.chatTime, item.unread > 0 && styles.chatTimeUnread]}>
            {item.time}
          </Text>
        </View>
        <View style={styles.chatFooter}>
          <Text style={[styles.lastMessage, item.unread > 0 && styles.lastMessageUnread]} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const [isCreateGroupVisible, setCreateGroupVisible] = useState(false);
  const [createGroupStep, setCreateGroupStep] = useState<1 | 2>(1);
  const [groupPermissions, setGroupPermissions] = useState({
    editSettings: true,
    sendMessages: true,
    addMembers: true,
    approveMembers: false
  });
  const [newGroupName, setNewGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const dummyUsers = [
    { id: '101', name: 'Rakesh Kumar', username: '@rakesh_op', avatar: 'https://i.pravatar.cc/150?u=101' },
    { id: '102', name: 'Sneha Reddy', username: '@sneha_gaming', avatar: 'https://i.pravatar.cc/150?u=102' },
    { id: '103', name: 'Vikram Singh', username: '@vikram_UPMI', avatar: 'https://i.pravatar.cc/150?u=103' },
    { id: '104', name: 'Priya Sharma', username: '@priya_play', avatar: 'https://i.pravatar.cc/150?u=104' },
    { id: '105', name: 'Arjun Das', username: '@arjun_esports', avatar: 'https://i.pravatar.cc/150?u=105' },
  ];

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleCreateGroup = () => {
    setCreateGroupVisible(false);
    
    const finalName = newGroupName.trim().length > 0 ? newGroupName : 'New Group';
    const newChatId = 'group_' + Date.now();

    // Build member list
    const members: any[] = [
      { id: 'me', name: 'You', avatar: 'https://i.pravatar.cc/150?u=me', role: 'super_admin' }
    ];
    selectedUsers.forEach(uid => {
      const u = dummyUsers.find(du => du.id === uid);
      if (u) {
        members.push({ id: u.id, name: u.name, avatar: u.avatar, role: 'member' });
      }
    });

    const newGroupObj = {
      id: newChatId,
      name: finalName,
      lastMessage: 'Group created.',
      time: 'Just now',
      unread: 0,
      isGroup: true,
      members,
      permissions: { ...groupPermissions }
    };

    // Add to context
    addMultipleChats([newGroupObj]);

    setNewGroupName('');
    setSelectedUsers([]);
    setSearchQuery('');
    setCreateGroupStep(1);

    // Navigate to ChatScreen
    navigation.navigate('ChatScreen', {
      userId: newChatId,
      userName: finalName,
      isGroup: true,
      isCreator: true,
      permissions: groupPermissions,
      members: members
    });
  };

  const handleHeaderEditPress = () => {
    setCreateGroupStep(1);
    setSearchQuery('');
    setSelectedUsers([]);
    setNewGroupName('');
    setCreateGroupVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="chevron-back" size={28} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.headerRightBtn} onPress={handleHeaderEditPress}>
          <Icon name="create-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Icon name="search" size={20} color="#9CA3AF" />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search messages..."
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row', paddingHorizontal: 20, marginBottom: 10, flexGrow: 0 }} contentContainerStyle={{ paddingRight: 40 }}>
        {['Chats', 'Groups', 'Favorites', ...customLists].map(tab => (
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
      </ScrollView>

      {/* Chat List */}
      <FlatList
        data={filteredChatList}
        keyExtractor={item => item.id}
        renderItem={renderChatItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Create Group / New Message Modal */}
      <Modal visible={isCreateGroupVisible} transparent={true} animationType="slide" onRequestClose={() => { setCreateGroupVisible(false); setSelectedUsers([]); }}>
        <TouchableOpacity style={styles.modalOverlayFull} activeOpacity={1} onPress={() => { setCreateGroupVisible(false); setSelectedUsers([]); }}>
          <TouchableOpacity activeOpacity={1} style={styles.modalContentFull}>
            
            
            {activeTab === 'Chats' ? (
              <>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                    <Text style={[styles.modalTitle, { marginBottom: 0 }]}>New Chat</Text>
                    <TouchableOpacity onPress={() => { setCreateGroupVisible(false); setSelectedUsers([]); }} style={{ padding: 4 }}>
                      <Icon name="close" size={24} color="#111827" />
                    </TouchableOpacity>
                  </View>
                
                <View style={styles.searchBoxModal}>
                  <Text style={{ fontWeight: '600', marginRight: 10, color: '#111827' }}>To:</Text>
                  <TextInput 
                    style={styles.searchInputModal}
                    placeholder="Search people..."
                    placeholderTextColor="#9CA3AF"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>

                <ScrollView style={{ flex: 1, marginTop: 10 }} showsVerticalScrollIndicator={false}>
                  <Text style={styles.sectionLabel}>Suggested</Text>
                  {dummyUsers.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase())).map(user => (
                    <TouchableOpacity 
                      key={user.id} 
                      style={styles.userRow}
                      activeOpacity={0.7}
                      onPress={() => {
                        setCreateGroupVisible(false);
                        navigation.navigate('ChatScreen', { userId: user.id, userName: user.name, isGroup: false, isCreator: false });
                      }}
                    >
                      <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.userName}>{user.name}</Text>
                        <Text style={styles.userSub}>{user.username}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            ) : (
              // Groups Flow
              createGroupStep === 1 ? (
                <>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                    <Text style={[styles.modalTitle, { marginBottom: 0 }]}>New Group</Text>
                    <TouchableOpacity onPress={() => { setCreateGroupVisible(false); setSelectedUsers([]); }} style={{ padding: 4 }}>
                      <Icon name="close" size={24} color="#111827" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.searchBoxModal}>
                    <Text style={{ fontWeight: '600', marginRight: 10, color: '#111827' }}>To:</Text>
                    <TextInput 
                      style={styles.searchInputModal}
                      placeholder="Search people..."
                      placeholderTextColor="#9CA3AF"
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                    />
                  </View>

                  <ScrollView style={{ flex: 1, marginTop: 10 }} showsVerticalScrollIndicator={false}>
                    <Text style={styles.sectionLabel}>Suggested</Text>
                    {dummyUsers.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase())).map(user => {
                      const isSelected = selectedUsers.includes(user.id);
                      return (
                        <TouchableOpacity 
                          key={user.id} 
                          style={styles.userRow}
                          activeOpacity={0.7}
                          onPress={() => toggleUserSelection(user.id)}
                        >
                          <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
                          <View style={{ flex: 1 }}>
                            <Text style={styles.userName}>{user.name}</Text>
                            <Text style={styles.userSub}>{user.username}</Text>
                          </View>
                          <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                            {isSelected && <Icon name="checkmark" size={16} color="#FFFFFF" />}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>

                  {selectedUsers.length > 0 && (
                    <TouchableOpacity style={styles.createBtn} onPress={() => setCreateGroupStep(2)}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={[styles.createBtnText, { marginRight: 8 }]}>Next</Text>
                        <Icon name="arrow-forward" size={18} color="#FFF" />
                      </View>
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                    <TouchableOpacity onPress={() => setCreateGroupStep(1)} style={{ marginRight: 15, padding: 4 }}>
                      <Icon name="arrow-back" size={24} color="#111827" />
                    </TouchableOpacity>
                    <Text style={[styles.modalTitle, { marginBottom: 0 }]}>Group Settings</Text>
                  </View>

                  <TextInput 
                    style={styles.groupNameInput}
                    placeholder="Group Name"
                    placeholderTextColor="#9CA3AF"
                    value={newGroupName}
                    onChangeText={setNewGroupName}
                  />

                  <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                    <Text style={styles.sectionLabel}>Group Permissions</Text>

                    <View style={styles.permissionRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.permissionTitle}>Edit group settings</Text>
                        <Text style={styles.permissionDesc}>This includes the name, icon, description, and ability to pin.</Text>
                      </View>
                      <Switch value={groupPermissions.editSettings} onValueChange={v => setGroupPermissions(p => ({...p, editSettings: v}))} trackColor={{ false: '#E5E7EB', true: '#FECDD3' }} thumbColor={groupPermissions.editSettings ? '#E51025' : '#F9FAFB'} />
                    </View>

                    <View style={styles.permissionRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.permissionTitle}>Send new messages</Text>
                      </View>
                      <Switch value={groupPermissions.sendMessages} onValueChange={v => setGroupPermissions(p => ({...p, sendMessages: v}))} trackColor={{ false: '#E5E7EB', true: '#FECDD3' }} thumbColor={groupPermissions.sendMessages ? '#E51025' : '#F9FAFB'} />
                    </View>

                    <View style={styles.permissionRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.permissionTitle}>Add other members</Text>
                      </View>
                      <Switch value={groupPermissions.addMembers} onValueChange={v => setGroupPermissions(p => ({...p, addMembers: v}))} trackColor={{ false: '#E5E7EB', true: '#FECDD3' }} thumbColor={groupPermissions.addMembers ? '#E51025' : '#F9FAFB'} />
                    </View>

                    <View style={styles.permissionRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.permissionTitle}>Approve new members</Text>
                        <Text style={styles.permissionDesc}>When turned on, admin must approve anyone who wants to join.</Text>
                      </View>
                      <Switch value={groupPermissions.approveMembers} onValueChange={v => setGroupPermissions(p => ({...p, approveMembers: v}))} trackColor={{ false: '#E5E7EB', true: '#FECDD3' }} thumbColor={groupPermissions.approveMembers ? '#E51025' : '#F9FAFB'} />
                    </View>
                  </ScrollView>

                  <TouchableOpacity style={[styles.createBtn, { marginTop: 15 }]} onPress={handleCreateGroup}>
                    <Text style={styles.createBtnText}>Create Group</Text>
                  </TouchableOpacity>
                </>
              )
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
      {/* Customize List Modal */}
      <Modal visible={isCustomizeVisible} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '80%', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 15 }}>Create Custom List</Text>
            <TextInput 
              style={{ borderBottomWidth: 1, borderBottomColor: '#E51025', fontSize: 16, paddingVertical: 5, color: '#111827', marginBottom: 20 }} 
              placeholder="List name (e.g., Work, Family)" placeholderTextColor="#9CA3AF"
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

      {/* Customize List Modal */}
      <Modal visible={isCustomizeVisible} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '80%', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 15 }}>Create Custom List</Text>
            <TextInput 
              style={{ borderBottomWidth: 1, borderBottomColor: '#E51025', fontSize: 16, paddingVertical: 5, color: '#111827', marginBottom: 20 }} 
              placeholder="List name (e.g., Work, Family)" placeholderTextColor="#9CA3AF"
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

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 12, backgroundColor: '#FFFFFF' },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  headerRightBtn: { padding: 4 },
  searchContainer: { paddingHorizontal: 15, paddingBottom: 15, backgroundColor: '#FFFFFF' },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 15, height: 44 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: '#1F2937' },
  listContainer: { paddingHorizontal: 15, paddingTop: 5, paddingBottom: 20 },
  chatItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
  avatarContainer: { position: 'relative', marginRight: 15 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#F3F4F6' },
  onlineIndicator: { position: 'absolute', right: 2, bottom: 2, width: 14, height: 14, borderRadius: 7, backgroundColor: '#10B981', borderWidth: 2, borderColor: '#FFFFFF' },
  chatInfo: { flex: 1, justifyContent: 'center' },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  chatName: { fontSize: 16, fontWeight: '600', color: '#1F2937', flex: 1, marginRight: 10 },
  chatNameUnread: { fontWeight: 'bold', color: '#111827' },
  chatTime: { fontSize: 12, color: '#6B7280' },
  chatTimeUnread: { color: '#E51025', fontWeight: '600' },
  chatFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lastMessage: { fontSize: 14, color: '#6B7280', flex: 1, marginRight: 15 },
  lastMessageUnread: { color: '#111827', fontWeight: '500' },
  unreadBadge: { backgroundColor: '#E51025', borderRadius: 10, minWidth: 20, height: 20, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6 },
  unreadText: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, minHeight: 400 },
  modalHandle: { width: 40, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 15 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#4B5563', marginBottom: 8 },
  groupNameInput: { backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 15, paddingVertical: 12, fontSize: 16, color: '#1F2937', marginBottom: 20 },
  createBtn: { backgroundColor: '#E51025', borderRadius: 25, paddingVertical: 14, alignItems: 'center', marginTop: 10 },
  createBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  modalOverlayFull: { flex: 1, backgroundColor: '#FFFFFF' },
  modalContentFull: { flex: 1, backgroundColor: '#FFFFFF', padding: 20, paddingTop: 40 },
  searchBoxModal: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F3F4F6', paddingBottom: 10, marginBottom: 10 },
  searchInputModal: { flex: 1, fontSize: 16, color: '#1F2937' },
  sectionLabel: { fontSize: 14, fontWeight: 'bold', color: '#6B7280', marginBottom: 15 },
  userRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  userAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  userName: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  userSub: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#D1D5DB', justifyContent: 'center', alignItems: 'center' },
  checkboxSelected: { backgroundColor: '#E51025', borderColor: '#E51025' },
  permissionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  permissionTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  permissionDesc: { fontSize: 13, color: '#6B7280', marginTop: 4, paddingRight: 10 }
});

export default InboxScreen;




