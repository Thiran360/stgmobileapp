import React, { useState, useContext, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Platform, Image, StatusBar, Modal, Alert, ScrollView, Switch, PermissionsAndroid } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from '../utils/SafeRNFS';
import { AppContext } from '../context/AppContext';
import { apiService } from '../api/index';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';

const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { userId, userName, isGroup, isCreator = true, members, permissions } = route.params || { userId: '1', userName: 'Unknown User', isGroup: false, isCreator: true };

  const { chats, toggleFavoriteChat, userProfile, currentUserId } = useContext(AppContext);
  const currentChat = chats.find(c => c.id === userId);
  const isFavorite = currentChat?.isFavorite || false;

  const [message, setMessage] = useState('');
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isSettingsVisible, setSettingsVisible] = useState(false);
  const [isMediaVisible, setMediaVisible] = useState(false);
  const [isEmojiVisible, setEmojiVisible] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [adminOnly, setAdminOnly] = useState(false);
  const [currentGroupName, setCurrentGroupName] = useState(userName);
  const [groupDescription, setGroupDescription] = useState('Hello squad welcome to the tournament!');
  const [groupMenuVisible, setGroupMenuVisible] = useState(false);
  const [editNameVisible, setEditNameVisible] = useState(false);
  const [editDescVisible, setEditDescVisible] = useState(false);
  const [groupPermsVisible, setGroupPermsVisible] = useState(false);
  const [isAddMembersVisible, setAddMembersVisible] = useState(false);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [selectedNewMembers, setSelectedNewMembers] = useState<string[]>([]);
  
  const dummySearchUsers = [
    { id: '101', name: 'Mortal', username: 'mortal_esports', avatar: 'https://i.pravatar.cc/150?u=101' },
    { id: '102', name: 'Scout', username: 'scout_pubg', avatar: 'https://i.pravatar.cc/150?u=102' },
    { id: '103', name: 'Dynamo', username: 'dynamo_gaming', avatar: 'https://i.pravatar.cc/150?u=103' },
    { id: '104', name: 'Jonathan', username: 'jonathan_gaming', avatar: 'https://i.pravatar.cc/150?u=104' },
  ];
  const [groupLogo, setGroupLogo] = useState(`https://i.pravatar.cc/150?u=${userId}`);
  
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;
  const [recordSecs, setRecordSecs] = useState(0);
  const [recordTime, setRecordTime] = useState('00:00');
  const [currentPlaySecs, setCurrentPlaySecs] = useState(0);
  const [currentDurationSecs, setCurrentDurationSecs] = useState(0);
  const [viewerImage, setViewerImage] = useState<string | null>(null);
  
  const handlePickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });
    
    if (result.assets && result.assets.length > 0) {
      setGroupLogo(result.assets[0].uri || groupLogo);
    }
    setAttachmentVisible(false);
  };

  const handleOpenCamera = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.8,
    });
    
    if (result.assets && result.assets.length > 0) {
      setMessages([...messages, { id: Date.now().toString(), type: 'image', uri: result.assets[0].uri, sender: 'me', time: 'Now' } as any]);
    }
    setAttachmentVisible(false);
  };

  const handleSendPhoto = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });
    
    if (result.assets && result.assets.length > 0) {
      setMessages([...messages, { id: Date.now().toString(), type: 'image', uri: result.assets[0].uri, sender: 'me', time: 'Now' } as any]);
    }
    setAttachmentVisible(false);
  };

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
        
        // On Android 13+ (API 33+), WRITE_EXTERNAL_STORAGE is automatically denied.
        // We only strictly need RECORD_AUDIO to record.
        if (grants['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else {
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const onStartRecord = async () => {
    const isGranted = await requestPermissions();
    if (!isGranted) {
      Alert.alert('Permission denied', 'Cannot record audio without permissions');
      return;
    }
    setIsRecording(true);
    const path = Platform.select({
      ios: 'sound_' + Date.now() + '.m4a',
      android: RNFS.CachesDirectoryPath + '/sound_' + Date.now() + '.mp4',
    });
    await audioRecorderPlayer.startRecorder(path);
    audioRecorderPlayer.addRecordBackListener((e: any) => {
      setRecordSecs(e.currentPosition);
      setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
    });
  };

  const onStopRecord = async () => {
    if (!isRecording) return;
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setRecordSecs(0);
    setIsRecording(false);
    
    // Add voice message to list
    setMessages([...messages, { id: Date.now().toString(), type: 'voice', uri: result, duration: recordTime.substring(0, 5), sender: 'me', time: 'Now' } as any]);
  };

  const onStartPlay = async (msgId: string, uri: string) => {
    if (playingId) {
      await audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
    }
    setPlayingId(msgId);
    await audioRecorderPlayer.startPlayer(uri);
    audioRecorderPlayer.addPlayBackListener((e: any) => {
      setCurrentPlaySecs(e.currentPosition);
      setCurrentDurationSecs(e.duration);
      if (e.currentPosition === e.duration) {
        audioRecorderPlayer.stopPlayer();
        audioRecorderPlayer.removePlayBackListener();
        setPlayingId(null);
      }
    });
  };

  const onStopPlay = async () => {
    await audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
    setPlayingId(null);
  };

  const handleOpenDocument = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      if (res && res.length > 0) {
        const file = res[0];
        setMessages([...messages, { id: Date.now().toString(), text: `?? ${file.name}`, sender: 'me', time: 'Now' }]);
      }
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Alert.alert("Error", "Could not pick document");
      }
    }
    setAttachmentVisible(false);
  };

  const [groupMembers, setGroupMembers] = useState<any[]>(members || [
    { id: '1', name: 'Me', role: 'super_admin' },
    { id: '2', name: 'Viper', role: 'member' },
    { id: '3', name: 'Mortal', role: 'member' },
    { id: '4', name: 'Scout', role: 'member' }
  ]);

  const myRole = groupMembers.find(m => m.id === '1' || m.id === 'me')?.role || 'member';
  const iAmAdmin = myRole === 'admin' || myRole === 'super_admin';
  const iAmSuperAdmin = myRole === 'super_admin';

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const msgs = await apiService.getChatMessages(userId, userProfile?.id || currentUserId || '1');
        if (msgs && Array.isArray(msgs)) setMessages(msgs);
        
        if (isGroup) {
          const info = await apiService.getGroupInfo(userId);
          if (info) {
            if (info.name) setCurrentGroupName(info.name);
            if (info.description) setGroupDescription(info.description);
            if (info.logo) setGroupLogo(info.logo);
            if (info.members) setGroupMembers(info.members);
          }
        }
      } catch(e) {
        console.log('API error fetching chat info:', e);
      }
    };
    fetchChatData();
  }, [userId, isGroup]);
  
  const [messages, setMessages] = useState(
    isGroup 
    ? [
        { id: '1', text: 'Welcome to the Organisation group!', sender: 'other', senderName: 'Admin', time: '10:00 AM' },
        { id: '2', text: 'Hey guys, excited to join.', sender: 'other', senderName: 'Viper', time: '10:05 AM' }
      ]
    : [
        { id: '1', text: 'Hi, I saw your post looking for a squad.', sender: 'me', time: '10:00 AM' },
        { id: '2', text: 'Hey! Yes, are you interested?', sender: 'other', time: '10:05 AM' }
      ]
  );

  const sendMessage = async () => {
    if (message.trim().length > 0) {
      const text = message;
      setMessage('');
      setMessages(prev => [...prev, { id: Date.now().toString(), text: text, sender: 'me', is_me: true, time: 'Now' }]);
      try {
        await apiService.sendMessage(userId, text, userProfile?.id || currentUserId || 'unknown');
      } catch (err) {}
    }
  };

  const [adminConfirmVisible, setAdminConfirmVisible] = useState(false);
  const [adminActionUser, setAdminActionUser] = useState<{id: string, name: string, type: 'make' | 'remove'} | null>(null);

  const handleRemoveMember = (id: string, name: string) => {
    Alert.alert(
      'Remove Member',
      `Are you sure you want to remove ${name} from this group?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => setGroupMembers(prev => prev.filter(m => m.id !== id)) }
      ]
    );
  };

  const confirmAdminAction = () => {
    if (adminActionUser) {
      const newRole = adminActionUser.type === 'make' ? 'admin' : 'member';
      setGroupMembers(groupMembers.map(m => m.id === adminActionUser.id ? { ...m, role: newRole } : m));
    }
    setAdminConfirmVisible(false);
    setAdminActionUser(null);
  };

  const deleteGroup = () => {
    Alert.alert("Delete Group", "Are you sure you want to delete this organisation group? This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => {
          setSettingsVisible(false);
          navigation.goBack();
      }}
    ]);
  };

  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [attachmentVisible, setAttachmentVisible] = useState(false);

  const handleLongPressMessage = (msg: any) => {
    setSelectedMessage(msg);
  };

  const deleteMessage = (type: 'me' | 'everyone') => {
    if (selectedMessage) {
      setMessages(messages.filter(m => m.id !== selectedMessage.id));
    }
    setSelectedMessage(null);
  };

  const renderMessage = ({ item }: any) => {
    const myId = String(userProfile?.id || currentUserId || '').replace('user_', '');
    const msgSenderId = String(item.sender_id || '').replace('user_', '');
    const isMe = item.sender === 'me' || 
                 item.is_me === true || 
                 (!!myId && !!msgSenderId && myId === msgSenderId) ||
                 (item.sender && String(item.sender).toLowerCase() === 'me');
    
    if (item.type === 'voice') {
      const isPlaying = playingId === item.id;
      return (
        <TouchableOpacity 
          activeOpacity={0.8} 
          onLongPress={() => handleLongPressMessage(item)}
          style={[styles.messageBubble, isMe ? styles.messageMe : styles.messageOther, { flexDirection: 'row', alignItems: 'center', width: 240, paddingVertical: 10, paddingHorizontal: 12 }]}
        >
          <View style={{ marginRight: 10 }}>
            <Image source={{ uri: isMe ? 'https://i.pravatar.cc/150?img=11' : `https://i.pravatar.cc/150?u=${userId}` }} style={{ width: 40, height: 40, borderRadius: 20 }} />
          </View>
          
          <TouchableOpacity style={{ marginRight: 10 }} onPress={() => isPlaying ? onStopPlay() : onStartPlay(item.id, item.uri)}>
            <Icon name={isPlaying ? "pause" : "play"} size={28} color={isMe ? '#FFFFFF' : '#1F2937'} />
          </TouchableOpacity>
          
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6, height: 20 }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((wave, index) => (
                <View key={index} style={{ width: 3, height: isPlaying ? Math.random() * 15 + 5 : 5, backgroundColor: isMe ? 'rgba(255,255,255,0.7)' : '#D1D5DB', marginHorizontal: 2, borderRadius: 2 }} />
              ))}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 11, color: isMe ? 'rgba(255,255,255,0.9)' : '#6B7280', fontWeight: '500' }}>{item.duration}</Text>
              <Text style={[styles.messageTime, isMe ? styles.messageTimeMe : styles.messageTimeOther, { marginTop: 0 }]}>{item.time}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    if (item.type === 'image') {
      return (
        <TouchableOpacity 
          activeOpacity={0.8} 
          onLongPress={() => handleLongPressMessage(item)}
          onPress={() => setViewerImage(item.uri)}
          style={[styles.messageBubble, isMe ? styles.messageMe : styles.messageOther, { padding: 4, width: 220, height: 260 }]}
        >
          {!isMe && isGroup && <Text style={[styles.messageSenderName, { paddingLeft: 8 }]}>{item.senderName}</Text>}
          <Image source={{ uri: item.uri }} style={{ flex: 1, borderRadius: 10, backgroundColor: '#E5E7EB' }} />
          <Text style={[styles.messageTime, isMe ? styles.messageTimeMe : styles.messageTimeOther, { position: 'absolute', bottom: 8, right: 12, backgroundColor: 'rgba(0,0,0,0.5)', color: '#FFF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, fontSize: 10, marginTop: 0 }]}>{item.time}</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity 
        activeOpacity={0.8} 
        onLongPress={() => handleLongPressMessage(item)}
        style={[styles.messageBubble, isMe ? styles.messageMe : styles.messageOther]}
      >
        {!isMe && isGroup && <Text style={styles.messageSenderName}>{item.senderName}</Text>}
        <Text style={[styles.messageText, isMe ? styles.messageTextMe : styles.messageTextOther]}>{item.text}</Text>
        <Text style={[styles.messageTime, isMe ? styles.messageTimeMe : styles.messageTimeOther]}>{item.time}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="chevron-back" size={28} color="#1F2937" />
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }} onPress={() => setSettingsVisible(true)}>
          <View style={{ position: 'relative', marginRight: 12 }}>
            <Image source={{ uri: `https://i.pravatar.cc/150?u=${userId}` }} style={styles.headerAvatar} />
            {!isGroup && <View style={styles.onlineDot} />}
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{userName}</Text>
            <Text style={styles.headerActive}>{isGroup ? `${groupMembers.length} Members` : 'Active now'}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerMenu} onPress={() => setMenuVisible(true)}>
          <Icon name="ellipsis-vertical" size={20} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {/* Chat Body */}
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 20}
      >
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatContainer}
          showsVerticalScrollIndicator={false}
        />
        {/* Input Footer */}
        <View style={styles.inputContainerWrapper}>
          {(isGroup && adminOnly && !iAmAdmin) ? (
            <View style={{ flex: 1, backgroundColor: '#F3F4F6', paddingVertical: 12, borderRadius: 24, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#6B7280', fontSize: 15, fontWeight: '500' }}>Only admins can send messages</Text>
            </View>
          ) : (
            <>
              {isRecording && (
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F4F6F8', borderRadius: 24, minHeight: 48, marginRight: 8, paddingHorizontal: 15, elevation: 1 }}>
                  <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#E51025', marginRight: 10 }} />
                  <Text style={{ color: '#E51025', fontSize: 16, fontWeight: 'bold' }}>Recording... {recordTime.substring(0, 5)}</Text>
                </View>
              )}

              {!isRecording && (
                <View style={styles.waInputBox}>
                  <TouchableOpacity style={styles.waIconBtn} onPress={() => setEmojiVisible(true)}>
                    <Icon name="happy-outline" size={24} color="#6B7280" />
                  </TouchableOpacity>
                  <TextInput
                    style={styles.waTextInput}
                    placeholder="Message"
                    placeholderTextColor="#9CA3AF"
                    value={message}
                    onChangeText={setMessage}
                    multiline
                  />
                  <TouchableOpacity style={[styles.waIconBtn, { marginRight: 4 }]} onPress={() => setAttachmentVisible(true)}>
                    <Icon name="attach" size={24} color="#6B7280" style={{ transform: [{ rotate: '-45deg' }] }} />
                  </TouchableOpacity>
                  {!message.trim() && (
                    <TouchableOpacity style={styles.waIconBtn} onPress={handleOpenCamera}>
                      <Icon name="camera" size={24} color="#6B7280" />
                    </TouchableOpacity>
                  )}
                </View>
              )}

              <TouchableOpacity 
                onPress={() => {
                  if (message.trim().length > 0) {
                    sendMessage();
                  }
                }}
                onLongPress={() => {
                  if (message.trim().length === 0) {
                    onStartRecord();
                  }
                }}
                onPressOut={() => {
                  if (isRecording) {
                    onStopRecord();
                  }
                }}
                style={styles.waSendBtn}
              >
                <Icon name={message.trim().length > 0 ? "send" : "mic"} size={20} color="#FFFFFF" style={message.trim().length > 0 ? { marginLeft: 3 } : {}} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>

      {/* Contact / Group Info Modal */}
      <Modal visible={isSettingsVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSettingsVisible(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top']}>
          {/* Header */}
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
                    <TouchableOpacity style={{ padding: 15 }} onPress={() => { setGroupMenuVisible(false); setAddMembersVisible(true); }}>
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
                    
                  </View>
                </TouchableOpacity>
              </Modal>
            )}
          </View>

          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            {/* Top Profile Section */}
            <View style={{ backgroundColor: '#FFFFFF', alignItems: 'center', paddingVertical: 10, paddingBottom: 25, borderBottomWidth: 1, borderBottomColor: '#F4F6F8' }}>
              <View style={styles.groupLogoWrapper}>
                <Image source={{ uri: groupLogo }} style={[styles.groupLogoLarge, { width: 140, height: 140, borderRadius: 70 }]} />
              </View>

              <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#111827', marginBottom: 5 }}>
                {currentGroupName}
              </Text>
              
              {isGroup ? (
                <>
                  <Text style={{ fontSize: 16, color: '#6B7280', marginBottom: 10 }}>Group � {groupMembers.length} members</Text>
                  <Text style={{ fontSize: 16, color: '#111827', textAlign: 'center', paddingHorizontal: 20, marginBottom: 25 }}>
                    {groupDescription}
                  </Text>
                </>
                              ) : (
                  <TouchableOpacity 
                    style={{ backgroundColor: '#E51025', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, marginBottom: 20 }}
                    onPress={() => {
                      setSettingsVisible(false);
                      navigation.navigate('ProfileScreen', { userId });
                    }}
                  >
                    <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 }}>View Profile</Text>
                  </TouchableOpacity>
                )}

              <View style={{ flexDirection: 'row', gap: 20 }}>
                <TouchableOpacity style={{ alignItems: 'center' }}>
                  <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: '#F4F6F8', justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
                    <Icon name="chatbubble-ellipses-outline" size={22} color="#111827" />
                  </View>
                  <Text style={{ fontSize: 13, color: '#111827', fontWeight: '500' }}>Voice chat</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center' }}>
                  <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: '#F4F6F8', justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
                    <Icon name="search" size={22} color="#111827" />
                  </View>
                  <Text style={{ fontSize: 13, color: '#111827', fontWeight: '500' }}>Search</Text>
                </TouchableOpacity>
              </View>
            </View>

            


            {/* Media Links Docs */}
            <TouchableOpacity onPress={() => setMediaVisible(true)} style={{ backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', padding: 15, marginBottom: 10, elevation: 1 }}>
              <Icon name="images" size={24} color="#9CA3AF" style={{ marginRight: 15 }} />
              <Text style={{ flex: 1, fontSize: 16, color: '#111827' }}>Media, links, and docs</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: '#6B7280', marginRight: 5 }}>12</Text>
                <Icon name="chevron-forward" size={20} color="#9CA3AF" />
              </View>
            </TouchableOpacity>

            {/* Notifications */}
            <View style={{ backgroundColor: '#FFFFFF', marginBottom: 10, elevation: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F4F6F8' }}>
                <Icon name="notifications" size={24} color="#9CA3AF" style={{ marginRight: 15 }} />
                <Text style={{ flex: 1, fontSize: 16, color: '#111827' }}>Mute notifications</Text>
                <Switch value={false} onValueChange={() => {}} trackColor={{ false: '#E5E7EB', true: '#E51025' }} thumbColor="#FFF" />
              </View>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 15 }}>
                <Icon name="musical-notes" size={24} color="#9CA3AF" style={{ marginRight: 15 }} />
                <Text style={{ flex: 1, fontSize: 16, color: '#111827' }}>Custom notifications</Text>
              </TouchableOpacity>
            </View>

            {/* Group Specific: Permissions & Members */}
            {isGroup && (
              <>
                
                <View style={{ backgroundColor: '#FFFFFF', marginBottom: 10, elevation: 1 }}>
                  <Text style={{ padding: 15, fontSize: 14, fontWeight: 'bold', color: '#6B7280' }}>
                    {groupMembers.length} members
                  </Text>
                  
                  
                  {groupMembers.map((member) => (
                    <View key={member.id} style={[styles.memberRow, { backgroundColor: '#FFFFFF', paddingHorizontal: 15, paddingVertical: 12, marginBottom: 0, borderRadius: 0 }]}>
                      <Image source={{ uri: member.avatar || `https://i.pravatar.cc/150?u=${member.id}` }} style={styles.memberAvatar} />
                      <View style={styles.memberInfo}>
                        <Text style={styles.memberName}>{member.name}</Text>
                        <Text style={styles.memberRole}>
                          {member.role === 'super_admin' ? 'Super Admin' : (member.role === 'admin' ? 'Admin' : 'Member')}
                        </Text>
                      </View>
                      {iAmSuperAdmin && (member.id !== '1' && member.id !== 'me') && member.role !== 'super_admin' && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                          <TouchableOpacity style={[styles.makeAdminBtn, member.role === 'admin' && styles.removeAdminBtn]} onPress={() => { setAdminActionUser({id: member.id, name: member.name, type: member.role === 'admin' ? 'remove' : 'make'}); setAdminConfirmVisible(true); }}>
                            <Text style={[styles.makeAdminText, member.role === 'admin' && styles.removeAdminText]}>{member.role === 'admin' ? 'Remove Admin' : 'Make Admin'}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => handleRemoveMember(member.id, member.name)} style={{ padding: 4 }}>
                            <Icon name="person-remove" size={20} color="#E51025" />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  ))}
                </View>

                <TouchableOpacity style={{ backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', padding: 15, marginBottom: 40, elevation: 1 }} onPress={deleteGroup}>
                  <Icon name="log-out" size={24} color="#E51025" style={{ marginRight: 15 }} />
                  <Text style={{ fontSize: 16, color: '#E51025', fontWeight: 'bold' }}>Exit group</Text>
                </TouchableOpacity>
              </>
            )}

            {!isGroup && (
              <View style={{ backgroundColor: '#FFFFFF', marginBottom: 40, elevation: 1 }}>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F4F6F8' }}>
                  <Icon name="ban" size={24} color="#E51025" style={{ marginRight: 15 }} />
                  <Text style={{ fontSize: 16, color: '#E51025', fontWeight: '500' }}>Block {userName}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 15 }}>
                  <Icon name="alert-circle" size={24} color="#E51025" style={{ marginRight: 15 }} />
                  <Text style={{ fontSize: 16, color: '#E51025', fontWeight: '500' }}>Report {userName}</Text>
                </TouchableOpacity>
              </View>
            )}

          </ScrollView>
          {/* Image Viewer Modal */}
      <Modal visible={!!viewerImage} transparent={true} animationType="fade" onRequestClose={() => setViewerImage(null)}>
        <View style={{ flex: 1, backgroundColor: '#000000', justifyContent: 'center' }}>
          <TouchableOpacity style={{ position: 'absolute', top: 50, left: 20, zIndex: 10 }} onPress={() => setViewerImage(null)}>
            <Icon name="close" size={30} color="#FFFFFF" />
          </TouchableOpacity>
          {viewerImage && <Image source={{ uri: viewerImage }} style={{ width: '100%', height: '80%', resizeMode: 'contain' }} />}
        </View>
      </Modal>

    
        {/* Modals for Group Edits */}
        <Modal visible={editNameVisible} transparent animationType="fade">
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: '#FFFFFF', width: '80%', padding: 20, borderRadius: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#111827' }}>Edit Group Name</Text>
              <TextInput style={{ borderBottomWidth: 1, borderBottomColor: '#E51025', fontSize: 16, paddingVertical: 5, color: '#111827', marginBottom: 20 }} value={currentGroupName} onChangeText={setCurrentGroupName} placeholder="Enter Group Name" placeholderTextColor="#9CA3AF" />
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 15 }}>
                <TouchableOpacity onPress={() => setEditNameVisible(false)}><Text style={{ color: '#6B7280', fontSize: 16, fontWeight: 'bold' }}>Cancel</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setEditNameVisible(false)}><Text style={{ color: '#E51025', fontSize: 16, fontWeight: 'bold' }}>Save</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={editDescVisible} transparent animationType="fade">
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: '#FFFFFF', width: '80%', padding: 20, borderRadius: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#111827' }}>Edit Description</Text>
              <TextInput style={{ borderBottomWidth: 1, borderBottomColor: '#E51025', fontSize: 16, paddingVertical: 5, color: '#111827', marginBottom: 20 }} value={groupDescription} onChangeText={setGroupDescription} multiline placeholder="Enter Group Description" placeholderTextColor="#9CA3AF" />
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 15 }}>
                <TouchableOpacity onPress={() => setEditDescVisible(false)}><Text style={{ color: '#6B7280', fontSize: 16, fontWeight: 'bold' }}>Cancel</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setEditDescVisible(false)}><Text style={{ color: '#E51025', fontSize: 16, fontWeight: 'bold' }}>Save</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={groupPermsVisible} transparent animationType="fade">
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: '#FFFFFF', width: '85%', padding: 20, borderRadius: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#111827' }}>Group Permissions</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 25 }}>
                <Text style={{ fontSize: 16, color: '#FFF' }}>Only Admins can send messages</Text>
                <Switch value={adminOnly} onValueChange={setAdminOnly} trackColor={{ false: '#E5E7EB', true: '#E51025' }} thumbColor="#FFF" />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <TouchableOpacity onPress={() => setGroupPermsVisible(false)}><Text style={{ color: '#E51025', fontSize: 16, fontWeight: 'bold' }}>Done</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>

      </Modal>

      {/* Admin Action Confirmation Modal */}
      <Modal visible={adminConfirmVisible} transparent={true} animationType="fade" onRequestClose={() => setAdminConfirmVisible(false)}>
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmBox}>
            <View style={styles.confirmIconBg}>
              <Icon name={adminActionUser?.type === 'make' ? "shield-checkmark" : "person-remove"} size={32} color="#E51025" />
            </View>
            <Text style={styles.confirmTitle}>{adminActionUser?.type === 'make' ? 'Make Admin?' : 'Remove Admin?'}</Text>
            <Text style={styles.confirmDesc}>
              {adminActionUser?.type === 'make' 
                ? `Are you sure you want to make `
                : `Are you sure you want to remove `}
              <Text style={{ fontWeight: 'bold', color: '#111827' }}>{adminActionUser?.name}</Text> 
              {adminActionUser?.type === 'make' ? ` an admin? They will be able to manage this group.` : ` as an admin? They will become a regular member.`}
            </Text>
            <View style={styles.confirmBtnRow}>
              <TouchableOpacity style={styles.confirmCancelBtn} onPress={() => setAdminConfirmVisible(false)}>
                <Text style={styles.confirmCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmAcceptBtn} onPress={confirmAdminAction}>
                <Text style={styles.confirmAcceptText}>Yes, {adminActionUser?.type === 'make' ? 'Make' : 'Remove'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Message Options Modal */}
      <Modal visible={!!selectedMessage} transparent={true} animationType="slide" onRequestClose={() => setSelectedMessage(null)}>
        <TouchableOpacity style={styles.sheetOverlay} activeOpacity={1} onPress={() => setSelectedMessage(null)}>
          <TouchableOpacity activeOpacity={1} style={styles.sheetContent}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Message Options</Text>
            
            <View style={styles.optionsGrid}>
              <TouchableOpacity style={styles.optionBtn} onPress={() => { setSelectedMessage(null); Alert.alert("Action", "Feature coming soon!"); }}>
                <View style={[styles.optionIconBg, { backgroundColor: '#FEF2F2' }]}>
                  <Icon name="arrow-undo" size={24} color="#E51025" />
                </View>
                <Text style={styles.optionText}>Reply</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionBtn} onPress={() => { setSelectedMessage(null); Alert.alert("Action", "Feature coming soon!"); }}>
                <View style={[styles.optionIconBg, { backgroundColor: '#F3E8FF' }]}>
                  <Icon name="arrow-redo" size={24} color="#A855F7" />
                </View>
                <Text style={styles.optionText}>Forward</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionBtn} onPress={() => { setSelectedMessage(null); Alert.alert("Action", "Feature coming soon!"); }}>
                <View style={[styles.optionIconBg, { backgroundColor: '#ECFCCB' }]}>
                  <Icon name="copy" size={24} color="#65A30D" />
                </View>
                <Text style={styles.optionText}>Copy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionBtn} onPress={() => { setSelectedMessage(null); Alert.alert("Action", "Feature coming soon!"); }}>
                <View style={[styles.optionIconBg, { backgroundColor: '#FEF9C3' }]}>
                  <Icon name="pin" size={24} color="#CA8A04" />
                </View>
                <Text style={styles.optionText}>Pin</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionBtn} onPress={() => { setSelectedMessage(null); Alert.alert("Action", "Feature coming soon!"); }}>
                <View style={[styles.optionIconBg, { backgroundColor: '#E0F2FE' }]}>
                  <Icon name="information-circle" size={24} color="#0284C7" />
                </View>
                <Text style={styles.optionText}>Info</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.optionBtn} onPress={() => deleteMessage('me')}>
                <View style={[styles.optionIconBg, { backgroundColor: '#FCE7F3' }]}>
                  <Icon name="trash" size={24} color="#DB2777" />
                </View>
                <Text style={styles.optionText}>Delete Msg</Text>
              </TouchableOpacity>
              
              {selectedMessage?.sender === 'me' && (
                <TouchableOpacity style={styles.optionBtn} onPress={() => deleteMessage('everyone')}>
                  <View style={[styles.optionIconBg, { backgroundColor: '#FEF2F2' }]}>
                    <Icon name="trash-bin" size={24} color="#E51025" />
                  </View>
                  <Text style={styles.optionText}>Delete for All</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Attachment Modal */}
      <Modal visible={attachmentVisible} transparent={true} animationType="slide" onRequestClose={() => setAttachmentVisible(false)}>
        <TouchableOpacity style={styles.sheetOverlay} activeOpacity={1} onPress={() => setAttachmentVisible(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.sheetContent}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Share Content</Text>
            
            <View style={styles.optionsGrid}>
              <TouchableOpacity style={styles.optionBtn} onPress={handleSendPhoto}>
                <View style={[styles.optionIconBg, { backgroundColor: '#E0F2FE' }]}>
                  <Icon name="image" size={28} color="#0284C7" />
                </View>
                <Text style={styles.optionText}>Photos</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionBtn} onPress={handleOpenCamera}>
                <View style={[styles.optionIconBg, { backgroundColor: '#FEF2F2' }]}>
                  <Icon name="camera" size={28} color="#E51025" />
                </View>
                <Text style={styles.optionText}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionBtn} onPress={handleOpenDocument}>
                <View style={[styles.optionIconBg, { backgroundColor: '#F3E8FF' }]}>
                  <Icon name="document-text" size={28} color="#A855F7" />
                </View>
                <Text style={styles.optionText}>Document</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Group Menu Modal */}
      <Modal visible={isMenuVisible} transparent={true} animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-start', alignItems: 'flex-end', paddingTop: 60, paddingRight: 15 }} activeOpacity={1} onPress={() => setMenuVisible(false)}>
          <TouchableOpacity activeOpacity={1} style={{ backgroundColor: '#FFFFFF', borderRadius: 12, paddingVertical: 10, minWidth: 220, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 6 }}>
            {(isGroup 
              ? [
                  { id: 'add', icon: 'person-add-outline', label: 'Add members' },
                  { id: 'link', icon: 'link-outline', label: 'Group link' },
                  { id: 'info', icon: 'information-circle-outline', label: 'Group info' },
                  { id: 'search', icon: 'search-outline', label: 'Search' },
                  { id: 'fav', icon: isFavorite ? 'star' : 'star-outline', label: isFavorite ? 'Remove Favorite' : 'Favorite', color: isFavorite ? '#F59E0B' : '#4B5563' },
                  { id: 'mute', icon: 'volume-mute-outline', label: 'Mute notifications' },
                  { id: 'clear', icon: 'trash-outline', label: 'Clear chats' },
                  { id: 'exit', icon: 'log-out-outline', label: 'Exit group', color: '#E51025' }
                ]
              : [
                  { id: 'fav', icon: isFavorite ? 'star' : 'star-outline', label: isFavorite ? 'Remove Favorite' : 'Favorite', color: isFavorite ? '#F59E0B' : '#4B5563' },
                  { id: 'block', icon: 'ban-outline', label: 'Block', color: '#E51025' },
                  { id: 'clear', icon: 'trash-outline', label: 'Clear chat' },
                  { id: 'delete', icon: 'trash-bin-outline', label: 'Delete chat', color: '#E51025' }
                ]
            ).map((opt, i, arr) => (
              <TouchableOpacity key={opt.id} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 20, borderBottomWidth: i === arr.length - 1 ? 0 : 1, borderBottomColor: '#F4F6F8' }} onPress={() => {
                setMenuVisible(false);
                if (opt.id === 'info' || opt.id === 'add') {
                  setSettingsVisible(true);
                } else if (opt.id === 'fav') {
                  toggleFavoriteChat(userId);
                } else {
                  Alert.alert('Action', opt.label);
                }
              }}>
                <Icon name={opt.icon} size={20} color={opt.color || '#4B5563'} style={{ marginRight: 12 }} />
                <Text style={{ fontSize: 16, color: opt.color || '#1F2937', fontWeight: '500' }}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Media Links Docs Modal */}
      <Modal visible={isMediaVisible} animationType="slide" onRequestClose={() => setMediaVisible(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top']}>
          <View style={[styles.modalHeader, { elevation: 2 }]}>
            <TouchableOpacity onPress={() => setMediaVisible(false)} style={{ padding: 4 }}>
              <Icon name="arrow-back" size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { flex: 1, marginLeft: 15 }]}>Media, links, and docs</Text>
          </View>
          <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F4F6F8' }}>
            <View style={{ flex: 1, paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: '#E51025', alignItems: 'center' }}><Text style={{ color: '#E51025', fontWeight: 'bold' }}>Media</Text></View>
            <View style={{ flex: 1, paddingVertical: 12, alignItems: 'center' }}><Text style={{ color: '#6B7280', fontWeight: 'bold' }}>Links</Text></View>
            <View style={{ flex: 1, paddingVertical: 12, alignItems: 'center' }}><Text style={{ color: '#6B7280', fontWeight: 'bold' }}>Docs</Text></View>
          </View>
          <ScrollView contentContainerStyle={{ padding: 2, flexDirection: 'row', flexWrap: 'wrap' }}>
            {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
              <View key={i} style={{ width: '32%', aspectRatio: 1, margin: '0.6%', backgroundColor: '#F3F4F6' }}>
                <Image source={{ uri: `https://picsum.photos/200?random=${i}` }} style={{ width: '100%', height: '100%' }} />
              </View>
            ))}
          </ScrollView>
          {/* Image Viewer Modal */}
      <Modal visible={!!viewerImage} transparent={true} animationType="fade" onRequestClose={() => setViewerImage(null)}>
        <View style={{ flex: 1, backgroundColor: '#000000', justifyContent: 'center' }}>
          <TouchableOpacity style={{ position: 'absolute', top: 50, left: 20, zIndex: 10 }} onPress={() => setViewerImage(null)}>
            <Icon name="close" size={30} color="#FFFFFF" />
          </TouchableOpacity>
          {viewerImage && <Image source={{ uri: viewerImage }} style={{ width: '100%', height: '80%', resizeMode: 'contain' }} />}
        </View>
      </Modal>

    </SafeAreaView>
      </Modal>

      {/* Emoji Picker Modal (Simple) */}
      <Modal visible={isEmojiVisible} transparent={true} animationType="fade" onRequestClose={() => setEmojiVisible(false)}>
        <TouchableOpacity style={{ flex: 1, justifyContent: 'flex-end' }} activeOpacity={1} onPress={() => setEmojiVisible(false)}>
          <View style={{ backgroundColor: '#FFFFFF', padding: 15, elevation: 10 }}>
            <Text style={{ color: '#6B7280', fontWeight: 'bold', marginBottom: 10 }}>Frequently Used</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 15 }}>
              {['??','??','??','??','??','??','??','??','??','??','??','??','??','?','??','??'].map(emoji => (
                <TouchableOpacity key={emoji} onPress={() => { setMessage(prev => prev + emoji); setEmojiVisible(false); }}>
                  <Text style={{ fontSize: 32 }}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Image Viewer Modal */}
      <Modal visible={!!viewerImage} transparent={true} animationType="fade" onRequestClose={() => setViewerImage(null)}>
        <View style={{ flex: 1, backgroundColor: '#000000', justifyContent: 'center' }}>
          <TouchableOpacity style={{ position: 'absolute', top: 50, left: 20, zIndex: 10 }} onPress={() => setViewerImage(null)}>
            <Icon name="close" size={30} color="#FFFFFF" />
          </TouchableOpacity>
          {viewerImage && <Image source={{ uri: viewerImage }} style={{ width: '100%', height: '80%', resizeMode: 'contain' }} />}
        </View>
      </Modal>

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

    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F6F8' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 12, backgroundColor: '#FFFFFF', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 4, zIndex: 10, borderBottomWidth: 1, borderBottomColor: '#F4F6F8' },
  backBtn: { marginRight: 10, padding: 4 },
  headerAvatar: { width: 44, height: 44, borderRadius: 22 },
  onlineDot: { position: 'absolute', right: 0, bottom: 2, width: 12, height: 12, borderRadius: 6, backgroundColor: '#E51025', borderWidth: 2, borderColor: '#FFFFFF' },
  headerInfo: { flex: 1, justifyContent: 'center' },
  headerName: { fontSize: 17, fontWeight: '800', color: '#111827', letterSpacing: -0.3 },
  headerActive: { fontSize: 13, color: '#6B7280', fontWeight: '500', marginTop: 2 },
  headerMenu: { padding: 8, backgroundColor: '#F3F4F6', borderRadius: 20 },
  chatContainer: { padding: 15, flexGrow: 1, justifyContent: 'flex-end' },
  messageBubble: { maxWidth: '80%', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 24, marginBottom: 12 },
  messageMe: { alignSelf: 'flex-end', backgroundColor: '#E51025', borderBottomRightRadius: 6, elevation: 2, shadowColor: '#E51025', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 5 },
  messageOther: { alignSelf: 'flex-start', backgroundColor: '#F4F6F8', borderBottomLeftRadius: 6, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  messageSenderName: { fontSize: 12, fontWeight: 'bold', color: '#E51025', marginBottom: 2 },
  messageText: { fontSize: 15, lineHeight: 22, letterSpacing: -0.1 },
  messageTextMe: { color: '#FFFFFF', fontWeight: '500' },
  messageTextOther: { color: '#111827', fontWeight: '500' },
  messageTime: { fontSize: 10, marginTop: 6, alignSelf: 'flex-end', fontWeight: '600' },
  messageTimeMe: { color: 'rgba(255, 255, 255, 0.7)' },
  messageTimeOther: { color: '#6B7280' },
  inputContainerWrapper: { paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#F4F6F8', flexDirection: 'row', alignItems: 'flex-end', marginBottom: 5 },
  waInputBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 24, minHeight: 48, marginRight: 8, paddingHorizontal: 8, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  waIconBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  waTextInput: { flex: 1, minHeight: 40, maxHeight: 100, color: '#111827', fontSize: 16, paddingTop: Platform.OS === 'ios' ? 12 : 10, paddingBottom: Platform.OS === 'ios' ? 12 : 10 },
  waSendBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#E51025', justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
  
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F4F6F8' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  modalCloseBtn: { padding: 4 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#6B7280', textTransform: 'uppercase', marginBottom: 15 },
  memberRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, padding: 10, backgroundColor: '#F9FAFB', borderRadius: 12 },
  memberAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  memberInfo: { flex: 1 },
  memberName: { fontSize: 15, fontWeight: 'bold', color: '#111827' },
  memberRole: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  makeAdminBtn: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#E51025', borderRadius: 16 },
  makeAdminText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' }, removeAdminBtn: { backgroundColor: '#F3F4F6' }, removeAdminText: { color: '#6B7280' },
  deleteGroupBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E51025', paddingVertical: 14, borderRadius: 12 },
  deleteGroupText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  groupEditContainer: { alignItems: 'center', marginBottom: 25, paddingVertical: 10 },
  groupLogoWrapper: { position: 'relative', marginBottom: 15 },
  groupLogoLarge: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F3F4F6' },
  editLogoBtn: { position: 'absolute', right: 0, bottom: 0, backgroundColor: '#E51025', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#FFFFFF' },
  groupNameInput: { fontSize: 20, fontWeight: 'bold', color: '#111827', textAlign: 'center', borderBottomWidth: 1, borderBottomColor: '#F4F6F8', paddingBottom: 8, minWidth: 200 },
  permissionContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F9FAFB', padding: 15, borderRadius: 12, marginBottom: 25 },
  permissionTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  permissionDesc: { fontSize: 13, color: '#6B7280', lineHeight: 18, paddingRight: 10 },
  confirmOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  confirmBox: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, width: '100%', alignItems: 'center', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
  confirmIconBg: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#FEF2F2', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  confirmTitle: { fontSize: 22, fontWeight: 'bold', color: '#111827', marginBottom: 12 },
  confirmDesc: { fontSize: 15, color: '#6B7280', textAlign: 'center', lineHeight: 22, marginBottom: 25 },
  confirmBtnRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', gap: 12 },
  confirmCancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: '#F3F4F6', alignItems: 'center' },
  confirmCancelText: { fontSize: 15, fontWeight: 'bold', color: '#4B5563' },
  confirmAcceptBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: '#E51025', alignItems: 'center' },
  confirmAcceptText: { fontSize: 15, fontWeight: 'bold', color: '#FFFFFF' },
  sheetOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheetContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40, alignItems: 'center' },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#E5E7EB', marginBottom: 20 },
  sheetTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 25 },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 20 },
  optionBtn: { alignItems: 'center', width: 80, marginBottom: 15 },
  optionIconBg: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  optionText: { fontSize: 12, color: '#4B5563', fontWeight: '500', textAlign: 'center' }
});

export default ChatScreen;




















