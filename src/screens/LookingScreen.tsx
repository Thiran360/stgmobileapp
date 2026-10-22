import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { AppContext } from '../context/AppContext';
import { useContext } from 'react';
const LookingScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { userProfile, currentUserId } = useContext(AppContext);
  const words = ['Squad', 'Team', 'Managers', 'Organisations'];
  const [wordIndex, setWordIndex] = useState(0);
  const [activeChip, setActiveChip] = useState('All');
  const [isPostModalVisible, setPostModalVisible] = useState(false);
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [isYouModalVisible, setYouModalVisible] = useState(false);
  // Player form states
  const [playerDevice, setPlayerDevice] = useState('Android');
  const [playerFps, setPlayerFps] = useState('60 FPS');
  const [dropdownType, setDropdownType] = useState<'device' | 'fps' | null>(
    null,
  );
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const handleImagePick = async () => {
    try {
      const ImagePicker = require('react-native-image-crop-picker').default;
      const image = await ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
      });
      setBannerImage(image.path);
    } catch (e) {
      console.log(e);
    }
  };
  const chips = [
    { id: 'All', icon: null },
    { id: 'Team', icon: 'account-group' },
    { id: 'Players', icon: 'account' },
    { id: 'Organisation', icon: 'domain' },
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex(prev => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  const [cards, setCards] = useState<any[]>([]);
  const [myPost, setMyPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Generic form state for post
  const [formData, setFormData] = useState<any>({});
  const currentPost = Array.isArray(myPost)
    ? myPost.find((p: any) => p.category === activeChip)
    : myPost?.category === activeChip
    ? myPost
    : null;
  const handleEditTrigger = () => {
    if (!currentPost) return;
    const initialData: any = {};
    if (currentPost.category === 'Team') {
      initialData.teamName = currentPost.team_name || currentPost.name;
      initialData.description =
        currentPost.description || currentPost.looking_for_text;
      if (currentPost.players && Array.isArray(currentPost.players)) {
        currentPost.players.forEach((p: any, i: number) => {
          initialData[`player${i + 1}Name`] = p.name;
          initialData[`player${i + 1}Role`] = p.role;
        });
      }
    } else if (currentPost.category === 'Players') {
      initialData.playerName = currentPost.player_name || currentPost.name;
      initialData.role = currentPost.role;
      initialData.experience = currentPost.experience;
      initialData.deviceModel = currentPost.device_model;
      initialData.description =
        currentPost.description || currentPost.looking_for_text;
      setPlayerDevice(currentPost.device_os || '');
      setPlayerFps(currentPost.fps || '');
    } else if (currentPost.category === 'Organisation') {
      initialData.orgName = currentPost.org_name || currentPost.name;
      initialData.established =
        currentPost.established_year || currentPost.established;
      initialData.description =
        currentPost.description || currentPost.looking_for_text;
    } else {
      initialData.inGameName = currentPost.player_name || currentPost.name;
      initialData.inGameId = currentPost.in_game_id;
      initialData.achievements =
        currentPost.achievements || currentPost.looking_for_text;
    }
    setFormData(initialData);
    setYouModalVisible(false);
    setIsEditingPost(true);
    setPostModalVisible(true);
  };
  const handleDeletePost = async () => {
    if (!currentPost) return;
    try {
      const payload = {
        post_id: currentPost.id,
        user_id: userProfile?.id || currentUserId,
      };
      const endpoint = `${
        require('../api/config').API_ENDPOINTS.LOOKING_DELETE
      }?post_id=${currentPost.id}&user_id=${userProfile?.id || currentUserId}`;
      const res = await fetch(endpoint, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      if (data?.success || res.ok) {
        setYouModalVisible(false);
        fetchLookingData();
      } else {
        console.log('Delete failed', data);
      }
    } catch (e) {
      console.log('Error deleting post:', e);
    }
  };
  const handlePostRequest = async () => {
    setIsSubmitting(true);
    try {
      let mappedData: any = {};
      if (activeChip === 'Team') {
        mappedData = {
          name: formData.teamName || '',
          team_name: formData.teamName || '',
          looking_for_text: formData.description || '',
          description: formData.description || '',
          players: [
            { name: formData.player1Name, role: formData.player1Role },
            { name: formData.player2Name, role: formData.player2Role },
            { name: formData.player3Name, role: formData.player3Role },
            { name: formData.player4Name, role: formData.player4Role },
            { name: formData.player5Name, role: formData.player5Role },
            { name: formData.player6Name, role: formData.player6Role },
          ].filter(p => p.name || p.role),
        };
      } else if (activeChip === 'Players') {
        mappedData = {
          name: formData.playerName || '',
          player_name: formData.playerName || '',
          role: formData.role || '',
          experience: formData.experience || '',
          looking_for_text: formData.description || '',
          description: formData.description || '',
          device_model: formData.deviceModel || '',
          device_os: playerDevice,
          fps: playerFps,
        };
      } else if (activeChip === 'Organisation') {
        mappedData = {
          name: formData.orgName || '',
          org_name: formData.orgName || '',
          established: formData.established || '',
          established_year: formData.established || '',
          looking_for_text: formData.description || '',
          description: formData.description || '',
        };
      } else {
        mappedData = {
          name: formData.inGameName || '',
          player_name: formData.inGameName || '',
          in_game_id: formData.inGameId || '',
          looking_for_text: formData.achievements || '',
          achievements: formData.achievements || '',
        };
      }
      const uid = (userProfile?.id || currentUserId || '1').toString().replace('user_', '');
      const postCategory = activeChip === 'All' ? 'Players' : activeChip;
      const payload: any = {
        creator_username: userProfile?.username || 'Unknown',
        category: postCategory,
        user_id: uid,
        ...mappedData,
      };
      let endpoint = require('../api/config').API_ENDPOINTS.LOOKING_POST;
      if (isEditingPost && currentPost && currentPost.id) {
        endpoint = require('../api/config').API_ENDPOINTS.LOOKING_UPDATE;
        payload.post_id = currentPost.id;
      }
      const f = new FormData();
      Object.keys(payload).forEach(k => {
        const val = payload[k];
        f.append(
          k,
          typeof val === 'object' ? JSON.stringify(val) : String(val),
        );
      });
      if (bannerImage) {
        if (
          bannerImage.startsWith('file://') ||
          bannerImage.startsWith('content://')
        ) {
          f.append('banner_image', {
            uri: bannerImage,
            name: (activeChip === 'Players' ? 'player_' : 'logo_') + Date.now() + '.jpg',
            type: 'image/jpeg',
          } as any);
        } else {
          f.append('banner_image', bannerImage);
        }
      }
      // Set creator_avatar to empty string as requested for these types
      if (activeChip === 'Team' || activeChip === 'Organisation') {
        f.append('creator_avatar', '');
      } else if (userProfile?.profilePicture) {
        if (
          userProfile.profilePicture.startsWith('file://') ||
          userProfile.profilePicture.startsWith('content://')
        ) {
          f.append('creator_avatar', {
            uri: userProfile.profilePicture,
            name: 'avatar_' + Date.now() + '.jpg',
            type: 'image/jpeg',
          } as any);
        } else {
          f.append('creator_avatar', userProfile.profilePicture);
        }
      }
      const res = await fetch(endpoint, { method: 'POST', body: f });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.status !== false) {
        const wasEditing = isEditingPost;
        setIsEditingPost(false);
        setPostModalVisible(false);
        setFormData({});
        setBannerImage(null);
        Alert.alert('Success', wasEditing ? 'Post updated successfully!' : 'Post created successfully!');
        fetchLookingData();
      } else {
        Alert.alert('Error', data?.message || 'Failed to submit post. Please try again.');
      }
    } catch (e: any) {
      console.log('Error posting looking request:', e);
      Alert.alert('Error', e?.message || 'Network error occurred while submitting post');
    }
    setIsSubmitting(false);
  };
  const fetchLookingData = async () => {
    setIsLoading(true);
    try {
      const categoryParam =
        activeChip === 'All' ? '' : `?category=${activeChip}`;
      const feedRes = await fetch(
        `${
          require('../api/config').API_ENDPOINTS.LOOKING_FEED
        }${categoryParam}`,
      );
      const feedData = await feedRes.json();
      const parseP = (p: any) => {
        if (!p) return [];
        if (typeof p === 'string') {
          try {
            return JSON.parse(p);
          } catch (e) {
            return [];
          }
        }
        return p;
      };
      if (feedData?.status !== false && feedData.data) {
        setCards(
          feedData.data.map((d: any) => ({ ...d, players: parseP(d.players) })),
        );
      }
      const uid = userProfile?.id || currentUserId;
      if (uid) {
        const meRes = await fetch(
          `${require('../api/config').API_ENDPOINTS.LOOKING_ME}?user_id=${uid}`,
        );
        if (!meRes.ok) {
          setMyPost(null);
        } else {
          const meData = await meRes.json().catch(() => null);
          if (meData?.status !== false && meData?.data) {
            const meD = Array.isArray(meData.data)
              ? meData.data.map((d: any) => ({
                  ...d,
                  players: parseP(d.players),
                }))
              : { ...meData.data, players: parseP(meData.data.players) };
            setMyPost(meD);
          } else {
            setMyPost(null);
          }
        }
      }
    } catch (e) {
      console.log('Error fetching looking feed:', e);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    fetchLookingData();
  }, [activeChip]);

  useFocusEffect(
    React.useCallback(() => {
      fetchLookingData();
    }, [activeChip])
  );
  return (
    <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      
      <KeyboardAwareScrollView enableOnAndroid={true} extraScrollHeight={20} keyboardShouldPersistTaps="handled" style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Action Bar */}
        <View style={styles.actionBar}>
          
          <View style={styles.actionLeft}>
            
            <Icon
              name="location"
              size={18}
              color="#B91C1C"
              style={{ marginRight: 6 }}
            />
            <View style={{ flex: 1, justifyContent: 'center' }}>
              
              <Text style={styles.actionTitle} numberOfLines={1}>
                
                Looking for
                <Text style={{ color: '#E51025' }}>
                  {words[wordIndex]}?
                </Text>
              </Text>
            </View>
          </View>
          <View style={styles.actionRight}>
            
            {activeChip !== 'All' && (
              <TouchableOpacity
                style={styles.postBtn}
                onPress={() => setPostModalVisible(true)}
              >
                
                <Icon name="add-circle" size={16} color="#FFFFFF" />
                <Text style={styles.postBtnText}>Post</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.youBtn}
              onPress={() => setYouModalVisible(true)}
            >
              
              <Icon name="person-outline" size={16} color="#FFFFFF" />
              <Text style={styles.youBtnText}>You</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Chips */}
        <View style={{ backgroundColor: '#FFFFFF' }}>
          
          <KeyboardAwareScrollView enableOnAndroid={true} extraScrollHeight={20} keyboardShouldPersistTaps="handled"
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipsScroll}
            contentContainerStyle={styles.chipsContainer}
          >
            
            {chips.map((chip, index) => {
              const isActive = activeChip === chip.id;
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.chip,
                    isActive ? styles.chipActive : styles.chipInactive,
                  ]}
                  onPress={() => setActiveChip(chip.id)}
                >
                  
                  {chip.icon && (
                    <MaterialCommunityIcons
                      name={chip.icon}
                      size={16}
                      color={isActive ? '#FFFFFF' : '#E51025'}
                      style={{ marginRight: 6 }}
                    />
                  )}
                  <Text
                    style={[
                      styles.chipText,
                      isActive
                        ? styles.chipTextActive
                        : styles.chipTextInactive,
                    ]}
                  >
                    {chip.id}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </KeyboardAwareScrollView>
        </View>
        {/* Cards List */}
        <View style={styles.cardsContainer}>
          
          {cards
            .filter(c => activeChip === 'All' || (c.category && c.category.toLowerCase() === activeChip.toLowerCase()))
            .map((card, index) => (
              <View key={card.id} style={styles.card}>
                
                <View style={styles.cardHeader}>
                  
                  {Boolean(card.banner_image || card.creator_avatar) ? (
                    <View style={styles.avatarContainer}>
                      
                      <Image
                        source={{
                          uri: card.banner_image || card.creator_avatar,
                        }}
                        style={styles.avatar}
                      />
                      {card.isPro && (
                        <View style={styles.cardProBadge}>
                          
                          <Text style={styles.cardProText}>PRO</Text>
                        </View>
                      )}
                    </View>
                  ) : null}
                  <View style={styles.cardHeaderInfo}>
                    
                    <View style={styles.cardTitleRow}>
                      
                      <Text style={styles.cardTitle} numberOfLines={1}>
                        {card.player_name || card.team_name || card.org_name || card.name || card.creator_username}
                      </Text>
                      {card.category !== 'Team' && card.matchType && (
                        <View style={styles.matchTypeBadge}>
                          
                          <MaterialCommunityIcons
                            name={card.matchTypeIcon}
                            size={12}
                            color="#4B5563"
                          />
                          <Text style={styles.matchTypeText}>
                            {card.matchType}
                          </Text>
                        </View>
                      )}
                    </View>
                    {card.name && card.creator_username && (
                      <Text
                        style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}
                        numberOfLines={1}
                      >
                        @{card.creator_username}
                      </Text>
                    )}
                    {card.category !== 'Team' && (
                      <Text style={styles.cardSubtitle}>
                        {card.looking_for_text || card.description || card.role || card.lookingText || ''}
                      </Text>
                    )}
                  </View>
                </View>
                {card.description && (
                  <View
                    style={{
                      backgroundColor: '#FEF2F2',
                      padding: 12,
                      borderRadius: 8,
                      borderLeftWidth: 4,
                      borderLeftColor: '#E51025',
                      marginTop: 4,
                      marginBottom: 15,
                    }}
                  >
                    
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 4,
                      }}
                    >
                      
                      <Icon
                        name="search"
                        size={14}
                        color="#B91C1C"
                        style={{ marginRight: 6 }}
                      />
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: 'bold',
                          color: '#B91C1C',
                          textTransform: 'uppercase',
                        }}
                      >
                        Looking For
                      </Text>
                    </View>
                    <Text
                      style={{ fontSize: 13, color: '#1F2937', lineHeight: 18 }}
                    >
                      {card.description}
                    </Text>
                  </View>
                )}
                {card.category === 'Players' && (
                  <View style={{ marginBottom: 10 }}>
                    
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                      
                      {card.role ? (
                        <View
                          style={[
                            styles.tag,
                            { marginRight: 6, marginBottom: 6 },
                          ]}
                        >
                          
                          <MaterialCommunityIcons
                            name="shield-account"
                            size={13}
                            color="#4B5563"
                          />
                          <Text style={styles.tagText}>{card.role}</Text>
                        </View>
                      ) : null}
                      {card.experience ? (
                        <View
                          style={[
                            styles.tag,
                            { marginRight: 6, marginBottom: 6 },
                          ]}
                        >
                          
                          <MaterialCommunityIcons
                            name="trophy-outline"
                            size={13}
                            color="#4B5563"
                          />
                          <Text style={styles.tagText}>{card.experience}</Text>
                        </View>
                      ) : null}
                      {card.device_os ? (
                        <View
                          style={[
                            styles.tag,
                            { marginRight: 6, marginBottom: 6 },
                          ]}
                        >
                          
                          <MaterialCommunityIcons
                            name={
                              card.device_os === 'iOS' ? 'apple' : 'android'
                            }
                            size={13}
                            color="#4B5563"
                          />
                          <Text style={styles.tagText}>{card.device_os}</Text>
                        </View>
                      ) : null}
                      {card.device_model ? (
                        <View
                          style={[
                            styles.tag,
                            { marginRight: 6, marginBottom: 6 },
                          ]}
                        >
                          
                          <MaterialCommunityIcons
                            name="cellphone"
                            size={13}
                            color="#4B5563"
                          />
                          <Text style={styles.tagText}>
                            {card.device_model}
                          </Text>
                        </View>
                      ) : null}
                      {card.fps ? (
                        <View
                          style={[
                            styles.tag,
                            { marginRight: 6, marginBottom: 6 },
                          ]}
                        >
                          
                          <MaterialCommunityIcons
                            name="speedometer"
                            size={13}
                            color="#4B5563"
                          />
                          <Text style={styles.tagText}>{card.fps}</Text>
                        </View>
                      ) : null}
                      {card.in_game_id ? (
                        <View
                          style={[
                            styles.tag,
                            { marginRight: 6, marginBottom: 6 },
                          ]}
                        >
                          
                          <Icon
                            name="game-controller-outline"
                            size={13}
                            color="#4B5563"
                          />
                          <Text style={styles.tagText}>{card.in_game_id}</Text>
                        </View>
                      ) : null}
                    </View>
                    {card.achievements ? (
                      <View
                        style={{
                          marginTop: 4,
                          backgroundColor: '#F9FAFB',
                          borderRadius: 6,
                          padding: 8,
                        }}
                      >
                        
                        <Text
                          style={{
                            fontSize: 11,
                            color: '#6B7280',
                            fontWeight: 'bold',
                            marginBottom: 2,
                          }}
                        >
                          ACHIEVEMENTS
                        </Text>
                        <Text style={{ fontSize: 12, color: '#1F2937' }}>
                          {card.achievements}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                )}
                {card.category === 'Organisation' && (
                  <View style={styles.tagsContainer}>
                    {Boolean(card.established_year) && (
                      <View style={styles.tag}>
                        <Icon name="calendar-outline" size={14} color="#4B5563" />
                        <Text style={styles.tagText}>Est. {card.established_year}</Text>
                      </View>
                    )}
                    {Boolean(card.achievements) && (
                      <View style={styles.tag}>
                        <MaterialCommunityIcons name="trophy-outline" size={14} color="#4B5563" />
                        <Text style={styles.tagText}>{card.achievements}</Text>
                      </View>
                    )}
                  </View>
                )}
                {card.category !== 'Team' && card.category !== 'Players' && card.category !== 'Organisation' && (
                  <View style={styles.tagsContainer}>
                    
                    <View style={styles.tag}>
                      
                      <Icon
                        name="calendar-outline"
                        size={14}
                        color="#4B5563"
                      />
                      <Text style={styles.tagText}>{card.date}</Text>
                    </View>
                    <View style={styles.tag}>
                      
                      <Icon
                        name="time-outline"
                        size={14}
                        color="#4B5563"
                      />
                      <Text style={styles.tagText}>{card.time}</Text>
                    </View>
                    <View style={styles.tag}>
                      
                      <Icon
                        name="location-outline"
                        size={14}
                        color="#4B5563"
                      />
                      <Text style={styles.tagText}>{card.map}</Text>
                    </View>
                    <View style={styles.tag}>
                      
                      <MaterialCommunityIcons
                        name="shield-star-outline"
                        size={14}
                        color="#4B5563"
                      />
                      <Text style={styles.tagText}>{card.rank}</Text>
                    </View>
                    <View style={styles.tag}>
                      
                      <Icon name="mic-outline" size={14} color="#4B5563" />
                      <Text style={styles.tagText}>{card.mic}</Text>
                    </View>
                  </View>
                )}
                {card.players && (
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      marginBottom: 12,
                    }}
                  >
                    
                    {card.players.map((p: any, i: number) => (
                      <View
                        key={i}
                        style={{
                          backgroundColor: '#F3F4F6',
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 12,
                          marginRight: 6,
                          marginBottom: 6,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        
                        <Icon
                          name="person"
                          size={10}
                          color="#4B5563"
                          style={{ marginRight: 4 }}
                        />
                        <Text
                          style={{
                            fontSize: 10,
                            color: '#1F2937',
                            fontWeight: 'bold',
                          }}
                        >
                          {p.name}
                        </Text>
                        {p.role ? (
                          <Text
                            style={{
                              fontSize: 9,
                              color: '#E51025',
                              marginLeft: 4,
                              fontWeight: 'bold',
                            }}
                          >
                            ({p.role})
                          </Text>
                        ) : null}
                      </View>
                    ))}
                  </View>
                )}
                <View style={styles.cardFooter}>
                  
                  <Text style={styles.footerTime}>
                    {card.postedAgo || card.posted_ago}
                  </Text>
                  <View style={styles.footerRight}>
                    
                    {card.category === 'Organisation' ? (
                      <TouchableOpacity
                        style={styles.contactAction}
                        onPress={() =>
                          navigation.navigate('ChatScreen', {
                            userId: card.user_id,
                            userName: card.creator_username || card.name,
                            isGroup: false,
                          })
                        }
                      >
                        
                        <Icon
                          name="chatbubble-outline"
                          size={15}
                          color="#E51025"
                          style={{ marginTop: 1 }}
                        />
                        <Text style={styles.contactActionText}>Contact</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.contactAction}
                        onPress={() => {
                          const chatUserName =
                            card.creator_username ||
                            (card.category === 'Team' &&
                            card.players &&
                            card.players.length > 0
                              ? card.players[0].name
                              : card.name);
                          navigation.navigate('ChatScreen', {
                            userId: card.user_id,
                            userName: chatUserName,
                            isGroup: false,
                          });
                        }}
                      >
                        
                        <Icon
                          name="chatbubble-outline"
                          size={15}
                          color="#E51025"
                          style={{ marginTop: 1 }}
                        />
                        <Text style={styles.contactActionText}>Contact</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            ))}
        </View>
        <View style={{ height: 20 }} />
      </KeyboardAwareScrollView>
      {/* Post Modal */}
      <Modal
        visible={isPostModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setIsEditingPost(false);
          setPostModalVisible(false);
          setFormData({});
          setBannerImage(null);
        }}
      >
        
        <View style={{ flex: 1 }}>
          
          <View
            style={{
              height: insets.top,
              backgroundColor: '#E51025',
              width: '100%',
            }}
          />
          <View
            style={{
              flex: 1,
              backgroundColor: '#F3F4F6',
              paddingBottom: insets.bottom,
            }}
          >
            
            {/* Header */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 15,
                backgroundColor: '#E51025',
              }}
            >
              
              <TouchableOpacity
                onPress={() => {
                  setIsEditingPost(false);
                  setPostModalVisible(false);
                  setFormData({});
                  setBannerImage(null);
                }}
              >
                
                <Icon name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={{ marginLeft: 15 }}>
                
                <Text
                  style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }}
                >
                  Post
                </Text>
                <Text style={{ color: '#FFFFFF', fontSize: 12 }}>
                  Find your perfect squad
                </Text>
              </View>
            </View>
            {/* Content */}
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
              style={{ flex: 1, backgroundColor: '#F3F4F6' }}
            >
              
              <KeyboardAwareScrollView enableOnAndroid={true} extraScrollHeight={20}
                contentContainerStyle={{ padding: 15, paddingBottom: 100 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                
                <View
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 12,
                    padding: 20,
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                  }}
                >
                  
                  {/* Title */}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 25,
                    }}
                  >
                    
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: '#E51025',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 15,
                      }}
                    >
                      
                      <Icon name="rocket" size={20} color="#FFFFFF" />
                    </View>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: '#000000',
                      }}
                    >
                      Send This Details
                    </Text>
                  </View>
                  {/* Dynamic Form Fields Based on Active Filter */}
                  {activeChip === 'Team' ? (
                    <>
                      
                      <View
                        style={{
                          alignItems: 'center',
                          marginBottom: 20,
                          marginTop: 10,
                        }}
                      >
                        
                        <TouchableOpacity
                          onPress={handleImagePick}
                          style={{
                            height: 80,
                            width: 80,
                            borderRadius: 40,
                            backgroundColor: bannerImage
                              ? 'transparent'
                              : '#F3F4F6',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderWidth: bannerImage ? 0 : 1.5,
                            borderColor: '#D1D5DB',
                            borderStyle: 'dashed',
                            overflow: 'hidden',
                          }}
                        >
                          
                          {bannerImage ? (
                            <Image
                              source={{ uri: bannerImage }}
                              style={{
                                width: '100%',
                                height: '100%',
                                resizeMode: 'cover',
                              }}
                            />
                          ) : (
                            <>
                              
                              <Icon
                                name="camera-outline"
                                size={30}
                                color="#9CA3AF"
                              />
                              <Text
                                style={{
                                  fontSize: 10,
                                  color: '#9CA3AF',
                                  marginTop: 4,
                                  fontWeight: 'bold',
                                }}
                              >
                                LOGO
                              </Text>
                            </>
                          )}
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.modalLabel}>TEAM NAME:</Text>
                      <TextInput
                        style={styles.modalInput}
                        value={formData.teamName}
                        onChangeText={t =>
                          setFormData({ ...formData, teamName: t })
                        }
                        placeholder="Enter your team name"
                        placeholderTextColor="#9CA3AF"
                      />
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginTop: 10,
                        }}
                      >
                        
                        <View style={{ flex: 1, marginRight: 5 }}>
                          
                          <Text style={styles.modalLabel}>
                            PLAYER 1 NAME:
                          </Text>
                          <TextInput
                            style={styles.modalInput}
                            value={formData.player1Name}
                            onChangeText={t =>
                              setFormData({ ...formData, player1Name: t })
                            }
                            placeholder="e.g. Mortal"
                            placeholderTextColor="#9CA3AF"
                          />
                        </View>
                        <View style={{ flex: 1, marginLeft: 5 }}>
                          
                          <Text style={styles.modalLabel}>ROLE:</Text>
                          <TextInput
                            style={styles.modalInput}
                            value={formData.player1Role}
                            onChangeText={t =>
                              setFormData({ ...formData, player1Role: t })
                            }
                            placeholder="e.g. IGL"
                            placeholderTextColor="#9CA3AF"
                          />
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginTop: 5,
                        }}
                      >
                        
                        <View style={{ flex: 1, marginRight: 5 }}>
                          
                          <Text style={styles.modalLabel}>
                            PLAYER 2 NAME:
                          </Text>
                          <TextInput
                            style={styles.modalInput}
                            value={formData.player2Name}
                            onChangeText={t =>
                              setFormData({ ...formData, player2Name: t })
                            }
                            placeholder="e.g. Viper"
                            placeholderTextColor="#9CA3AF"
                          />
                        </View>
                        <View style={{ flex: 1, marginLeft: 5 }}>
                          
                          <Text style={styles.modalLabel}>ROLE:</Text>
                          <TextInput
                            style={styles.modalInput}
                            value={formData.player2Role}
                            onChangeText={t =>
                              setFormData({ ...formData, player2Role: t })
                            }
                            placeholder="e.g. Assaulter"
                            placeholderTextColor="#9CA3AF"
                          />
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginTop: 5,
                        }}
                      >
                        
                        <View style={{ flex: 1, marginRight: 5 }}>
                          
                          <Text style={styles.modalLabel}>
                            PLAYER 3 NAME:
                          </Text>
                          <TextInput
                            style={styles.modalInput}
                            value={formData.player3Name}
                            onChangeText={t =>
                              setFormData({ ...formData, player3Name: t })
                            }
                            placeholder="e.g. Regaltos"
                            placeholderTextColor="#9CA3AF"
                          />
                        </View>
                        <View style={{ flex: 1, marginLeft: 5 }}>
                          
                          <Text style={styles.modalLabel}>ROLE:</Text>
                          <TextInput
                            style={styles.modalInput}
                            value={formData.player3Role}
                            onChangeText={t =>
                              setFormData({ ...formData, player3Role: t })
                            }
                            placeholder="e.g. Entry Fragger"
                            placeholderTextColor="#9CA3AF"
                          />
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginTop: 5,
                        }}
                      >
                        
                        <View style={{ flex: 1, marginRight: 5 }}>
                          
                          <Text style={styles.modalLabel}>
                            PLAYER 4 NAME:
                          </Text>
                          <TextInput
                            style={styles.modalInput}
                            value={formData.player4Name}
                            onChangeText={t =>
                              setFormData({ ...formData, player4Name: t })
                            }
                            placeholder="e.g. Scout"
                            placeholderTextColor="#9CA3AF"
                          />
                        </View>
                        <View style={{ flex: 1, marginLeft: 5 }}>
                          
                          <Text style={styles.modalLabel}>ROLE:</Text>
                          <TextInput
                            style={styles.modalInput}
                            value={formData.player4Role}
                            onChangeText={t =>
                              setFormData({ ...formData, player4Role: t })
                            }
                            placeholder="e.g. Flanker"
                            placeholderTextColor="#9CA3AF"
                          />
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginTop: 5,
                        }}
                      >
                        
                        <View style={{ flex: 1, marginRight: 5 }}>
                          
                          <Text style={styles.modalLabel}>
                            PLAYER 5 NAME:
                          </Text>
                          <TextInput
                            style={styles.modalInput}
                            value={formData.player5Name}
                            onChangeText={t =>
                              setFormData({ ...formData, player5Name: t })
                            }
                            placeholder="e.g. Jonathan"
                            placeholderTextColor="#9CA3AF"
                          />
                        </View>
                        <View style={{ flex: 1, marginLeft: 5 }}>
                          
                          <Text style={styles.modalLabel}>ROLE:</Text>
                          <TextInput
                            style={styles.modalInput}
                            value={formData.player5Role}
                            onChangeText={t =>
                              setFormData({ ...formData, player5Role: t })
                            }
                            placeholder="e.g. Support"
                            placeholderTextColor="#9CA3AF"
                          />
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginTop: 5,
                        }}
                      >
                        
                        <View style={{ flex: 1, marginRight: 5 }}>
                          
                          <Text style={styles.modalLabel}>
                            PLAYER 6 NAME:
                          </Text>
                          <TextInput
                            style={styles.modalInput}
                            value={formData.player6Name}
                            onChangeText={t =>
                              setFormData({ ...formData, player6Name: t })
                            }
                            placeholder="e.g. Mavi"
                            placeholderTextColor="#9CA3AF"
                          />
                        </View>
                        <View style={{ flex: 1, marginLeft: 5 }}>
                          
                          <Text style={styles.modalLabel}>ROLE:</Text>
                          <TextInput
                            style={styles.modalInput}
                            placeholder="e.g. IGL"
                            placeholderTextColor="#9CA3AF"
                          />
                        </View>
                      </View>
                      <Text style={styles.modalLabel}>WE ARE LOOKING FOR:</Text>
                      <TextInput
                        style={styles.modalTextArea}
                        multiline
                        value={formData.description}
                        onChangeText={t =>
                          setFormData({ ...formData, description: t })
                        }
                        placeholder="e.g. We are looking for an aggressive Assaulter"
                        placeholderTextColor="#9CA3AF"
                        textAlignVertical="top"
                      />
                      <Text style={styles.modalCharCount}>0/200</Text>
                    </>
                  ) : activeChip === 'Players' ? (
                    <>
                      
                      <View
                        style={{
                          alignItems: 'center',
                          marginBottom: 20,
                          marginTop: 10,
                        }}
                      >
                        
                        <TouchableOpacity
                          onPress={handleImagePick}
                          style={{
                            height: 80,
                            width: 80,
                            borderRadius: 40,
                            backgroundColor: bannerImage
                              ? 'transparent'
                              : '#F3F4F6',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderWidth: bannerImage ? 0 : 1.5,
                            borderColor: '#D1D5DB',
                            borderStyle: 'dashed',
                            overflow: 'hidden',
                          }}
                        >
                          
                          {bannerImage ? (
                            <Image
                              source={{ uri: bannerImage }}
                              style={{
                                width: '100%',
                                height: '100%',
                                resizeMode: 'cover',
                              }}
                            />
                          ) : (
                            <>
                              
                              <Icon
                                name="person-outline"
                                size={30}
                                color="#9CA3AF"
                              />
                              <Text
                                style={{
                                  fontSize: 10,
                                  color: '#9CA3AF',
                                  marginTop: 4,
                                  fontWeight: 'bold',
                                }}
                              >
                                PHOTO
                              </Text>
                            </>
                          )}
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.modalLabel}>PLAYER NAME:</Text>
                      <TextInput
                        style={styles.modalInput}
                        value={formData.playerName}
                        onChangeText={t =>
                          setFormData({ ...formData, playerName: t })
                        }
                        placeholder="Enter your name"
                        placeholderTextColor="#9CA3AF"
                      />
                      <Text style={styles.modalLabel}>MY ROLE:</Text>
                      <TextInput
                        style={styles.modalInput}
                        value={formData.role}
                        onChangeText={t =>
                          setFormData({ ...formData, role: t })
                        }
                        placeholder="e.g. Assaulter, Sniper, etc."
                        placeholderTextColor="#9CA3AF"
                      />
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginTop: 10,
                        }}
                      >
                        
                        <View style={{ flex: 1, marginRight: 5 }}>
                          
                          <Text style={[styles.modalLabel, { marginTop: 0 }]}>
                            MY DEVICE:
                          </Text>
                          <TouchableOpacity
                            style={styles.modalPicker}
                            onPress={() => setDropdownType('device')}
                          >
                            
                            <Text style={styles.modalPickerText}>
                              {playerDevice}
                            </Text>
                            <Icon
                              name="chevron-down"
                              size={20}
                              color="#6B7280"
                            />
                          </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1, marginLeft: 5 }}>
                          
                          <Text style={[styles.modalLabel, { marginTop: 0 }]}>
                            DEVICE MODEL:
                          </Text>
                          <TextInput
                            style={styles.modalInput}
                            value={formData.deviceModel}
                            onChangeText={t =>
                              setFormData({ ...formData, deviceModel: t })
                            }
                            placeholder="e.g. iPhone 15"
                            placeholderTextColor="#9CA3AF"
                          />
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginTop: 10,
                        }}
                      >
                        
                        <View style={{ flex: 1, marginRight: 5 }}>
                          
                          <Text style={[styles.modalLabel, { marginTop: 0 }]}>
                            FPS:
                          </Text>
                          <TouchableOpacity
                            style={styles.modalPicker}
                            onPress={() => setDropdownType('fps')}
                          >
                            
                            <Text style={styles.modalPickerText}>
                              {playerFps}
                            </Text>
                            <Icon
                              name="chevron-down"
                              size={20}
                              color="#6B7280"
                            />
                          </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1, marginLeft: 5 }}>
                          
                          <Text style={[styles.modalLabel, { marginTop: 0 }]}>
                            MY EXPERIENCE:
                          </Text>
                          <TextInput
                            style={styles.modalInput}
                            value={formData.experience}
                            onChangeText={t =>
                              setFormData({ ...formData, experience: t })
                            }
                            placeholder="e.g. 2+ Years"
                            placeholderTextColor="#9CA3AF"
                          />
                        </View>
                      </View>
                      <Text style={styles.modalLabel}>DESCRIPTION:</Text>
                      <TextInput
                        style={styles.modalTextArea}
                        multiline
                        value={formData.description}
                        onChangeText={t =>
                          setFormData({ ...formData, description: t })
                        }
                        placeholder="Tell us about your gameplay and achievements..."
                        placeholderTextColor="#9CA3AF"
                        textAlignVertical="top"
                      />
                      <Text style={styles.modalCharCount}>0/200</Text>
                    </>
                  ) : activeChip === 'Organisation' ? (
                    <>
                      
                      <View
                        style={{
                          alignItems: 'center',
                          marginBottom: 20,
                          marginTop: 10,
                        }}
                      >
                        
                        <TouchableOpacity
                          onPress={handleImagePick}
                          style={{
                            height: 80,
                            width: 80,
                            borderRadius: 40,
                            backgroundColor: bannerImage
                              ? 'transparent'
                              : '#F3F4F6',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderWidth: bannerImage ? 0 : 1.5,
                            borderColor: '#D1D5DB',
                            borderStyle: 'dashed',
                            overflow: 'hidden',
                          }}
                        >
                          
                          {bannerImage ? (
                            <Image
                              source={{ uri: bannerImage }}
                              style={{
                                width: '100%',
                                height: '100%',
                                resizeMode: 'cover',
                              }}
                            />
                          ) : (
                            <>
                              
                              <Icon
                                name="business-outline"
                                size={30}
                                color="#9CA3AF"
                              />
                              <Text
                                style={{
                                  fontSize: 10,
                                  color: '#9CA3AF',
                                  marginTop: 4,
                                  fontWeight: 'bold',
                                }}
                              >
                                LOGO
                              </Text>
                            </>
                          )}
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.modalLabel}>ORG NAME:</Text>
                      <TextInput
                        style={styles.modalInput}
                        value={formData.orgName}
                        onChangeText={t =>
                          setFormData({ ...formData, orgName: t })
                        }
                        placeholder="Enter your organisation name"
                        placeholderTextColor="#9CA3AF"
                      />
                      <Text style={styles.modalLabel}>ESTABLISHED:</Text>
                      <TextInput
                        style={styles.modalInput}
                        value={formData.established}
                        onChangeText={t =>
                          setFormData({ ...formData, established: t })
                        }
                        placeholder="e.g. 2023"
                        placeholderTextColor="#9CA3AF"
                      />
                      <Text style={styles.modalLabel}>DESCRIPTION:</Text>
                      <TextInput
                        style={styles.modalTextArea}
                        multiline
                        value={formData.description}
                        onChangeText={t =>
                          setFormData({ ...formData, description: t })
                        }
                        placeholder="Tell us about your organisation and what you are looking for..."
                        placeholderTextColor="#9CA3AF"
                        textAlignVertical="top"
                      />
                      <Text style={styles.modalCharCount}>0/200</Text>
                    </>
                  ) : (
                    <>
                      
                      <Text style={styles.modalLabel}>ING ID:</Text>
                      <TextInput
                        style={styles.modalInput}
                        value={formData.inGameId}
                        onChangeText={t =>
                          setFormData({ ...formData, inGameId: t })
                        }
                        placeholder="Enter your BGMI ID"
                        placeholderTextColor="#9CA3AF"
                      />
                      <Text style={styles.modalLabel}>ING NAME:</Text>
                      <TextInput
                        style={styles.modalInput}
                        value={formData.inGameName}
                        onChangeText={t =>
                          setFormData({ ...formData, inGameName: t })
                        }
                        placeholder="Enter your in-game name"
                        placeholderTextColor="#9CA3AF"
                      />
                      <Text style={styles.modalLabel}>PLAYER EXPERIENCE:</Text>
                      <View style={styles.modalPicker}>
                        
                        <Text style={styles.modalPickerText}>
                          Select experience
                        </Text>
                        <Icon name="chevron-down" size={20} color="#6B7280" />
                      </View>
                      <Text style={styles.modalLabel}>ROLE:</Text>
                      <View style={styles.modalPicker}>
                        
                        <Text style={styles.modalPickerText}>
                          Select role
                        </Text>
                        <Icon name="chevron-down" size={20} color="#6B7280" />
                      </View>
                      <Text style={styles.modalLabel}>DEVICE:</Text>
                      <View style={styles.modalPicker}>
                        
                        <Text style={styles.modalPickerText}>
                          Select device
                        </Text>
                        <Icon name="chevron-down" size={20} color="#6B7280" />
                      </View>
                      <Text style={styles.modalLabel}>FPS:</Text>
                      <View style={styles.modalPicker}>
                        
                        <Text style={styles.modalPickerText}>
                          Select FPS
                        </Text>
                        <Icon name="chevron-down" size={20} color="#6B7280" />
                      </View>
                      <Text style={styles.modalLabel}>ALREADY IN ORG:</Text>
                      <View style={styles.modalPicker}>
                        
                        <Text style={styles.modalPickerText}>
                          Select option
                        </Text>
                        <Icon name="chevron-down" size={20} color="#6B7280" />
                      </View>
                      <Text style={styles.modalLabel}>ACHIEVEMENT:</Text>
                      <TextInput
                        style={styles.modalTextArea}
                        multiline
                        value={formData.achievements}
                        onChangeText={t =>
                          setFormData({ ...formData, achievements: t })
                        }
                        placeholder="Mention your achievements"
                        placeholderTextColor="#9CA3AF"
                        textAlignVertical="top"
                      />
                      <Text style={styles.modalCharCount}>0/200</Text>
                    </>
                  )}
                  {/* Post Button */}
                  <TouchableOpacity
                    style={[styles.modalSubmitBtn, isSubmitting && { opacity: 0.5 }]}
                    onPress={handlePostRequest}
                    disabled={isSubmitting}
                  >
                    
                    <Icon
                      name={
                        activeChip === 'Organisation' ? 'people' : 'paper-plane'
                      }
                      size={18}
                      color="#FFFFFF"
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      style={{
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                        fontSize: 16,
                      }}
                    >
                      
                      {currentPost && isEditingPost ? 'Update' : 'Post'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAwareScrollView>
            </KeyboardAvoidingView>
          </View>
        </View>
      </Modal>
      {/* Dropdown Modal for Device and FPS */}
      <Modal
        visible={dropdownType !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDropdownType(null)}
      >
        
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
          }}
          activeOpacity={1}
          onPress={() => setDropdownType(null)}
        >
          
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              padding: 20,
            }}
          >
            
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                marginBottom: 15,
                color: '#1F2937',
              }}
            >
              
              Select {dropdownType === 'device' ? 'Device OS' : 'FPS'}
            </Text>
            {dropdownType === 'device' &&
              ['Android', 'iOS'].map(item => (
                <TouchableOpacity
                  key={item}
                  style={{
                    paddingVertical: 15,
                    borderBottomWidth: 1,
                    borderBottomColor: '#F3F4F6',
                  }}
                  onPress={() => {
                    setPlayerDevice(item);
                    setDropdownType(null);
                  }}
                >
                  
                  <Text
                    style={{
                      fontSize: 16,
                      color: playerDevice === item ? '#E51025' : '#4B5563',
                      fontWeight: playerDevice === item ? 'bold' : 'normal',
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            {dropdownType === 'fps' &&
              ['40 FPS', '60 FPS', '90 FPS', '120 FPS'].map(item => (
                <TouchableOpacity
                  key={item}
                  style={{
                    paddingVertical: 15,
                    borderBottomWidth: 1,
                    borderBottomColor: '#F3F4F6',
                  }}
                  onPress={() => {
                    setPlayerFps(item);
                    setDropdownType(null);
                  }}
                >
                  
                  <Text
                    style={{
                      fontSize: 16,
                      color: playerFps === item ? '#E51025' : '#4B5563',
                      fontWeight: playerFps === item ? 'bold' : 'normal',
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        </TouchableOpacity>
      </Modal>
      {/* You Modal */}
      <Modal
        visible={isYouModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setYouModalVisible(false)}
      >
        
        <View style={{ flex: 1 }}>
          
          <View
            style={{
              height: insets.top,
              backgroundColor: '#E51025',
              width: '100%',
            }}
          />
          <View
            style={{
              flex: 1,
              backgroundColor: '#F3F4F6',
              paddingBottom: insets.bottom,
            }}
          >
            
            {/* Header */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 15,
                backgroundColor: '#E51025',
              }}
            >
              
              <TouchableOpacity onPress={() => setYouModalVisible(false)}>
                
                <Icon name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text
                style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}
              >
                Your Posted Details
              </Text>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={() => setYouModalVisible(false)}
              >
                
                <Icon name="pencil" size={14} color="#FFFFFF" />
                <Text style={{ color: '#FFFFFF', fontSize: 14, marginLeft: 4 }}>
                  Edit
                </Text>
              </TouchableOpacity>
            </View>
            {/* Content */}
            <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
              
              <KeyboardAwareScrollView enableOnAndroid={true} extraScrollHeight={20} keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 15 }}>
                
                <View
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 12,
                    padding: 20,
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    alignItems: 'center',
                  }}
                >
                  
                  {/* Profile Avatar */}
                  <View
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 40,
                      backgroundColor: '#E5E7EB',
                      marginBottom: 12,
                      position: 'relative',
                    }}
                  >
                    
                    <Image
                      source={{
                        uri:
                          userProfile?.profilePicture ||
                          'https://via.placeholder.com/150',
                      }}
                      style={{ width: 80, height: 80, borderRadius: 40 }}
                    />
                  </View>
                  {/* Name */}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 8,
                    }}
                  >
                    
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: '#000000',
                      }}
                    >
                      {userProfile?.username || 'N/A'}
                    </Text>
                    <Icon
                      name="pencil"
                      size={16}
                      color="#6B7280"
                      style={{ marginLeft: 8 }}
                    />
                  </View>
                  {/* Description */}
                  <Text
                    style={{
                      textAlign: 'center',
                      color: '#6B7280',
                      fontSize: 12,
                      marginBottom: 20,
                      paddingHorizontal: 10,
                    }}
                  >
                    
                    Here are the details you posted for joining a team. Other
                    players can contact you using this.
                  </Text>
                  {/* Info List */}
                  <View style={{ width: '100%' }}>
                    
                    {currentPost?.category === 'Team' && (
                      <>
                        
                        <View style={styles.youInfoCard}>
                          
                          <Icon
                            name="people-outline"
                            size={24}
                            color="#4B5563"
                            style={{ marginRight: 15 }}
                          />
                          <View style={{ flex: 1 }}>
                            
                            <Text style={styles.youInfoLabel}>
                              TEAM NAME:
                            </Text>
                            <Text style={styles.youInfoValue}>
                              {currentPost.team_name ||
                                currentPost.name ||
                                'N/A'}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.youInfoCard}>
                          
                          <Icon
                            name="document-text-outline"
                            size={24}
                            color="#4B5563"
                            style={{ marginRight: 15 }}
                          />
                          <View style={{ flex: 1 }}>
                            
                            <Text style={styles.youInfoLabel}>
                              DESCRIPTION:
                            </Text>
                            <Text style={styles.youInfoValue}>
                              {currentPost.description ||
                                currentPost.looking_for_text ||
                                'N/A'}
                            </Text>
                          </View>
                        </View>
                        {currentPost.players?.map((p: any, i: number) => (
                          <View key={i} style={styles.youInfoCard}>
                            
                            <Icon
                              name="person"
                              size={24}
                              color="#4B5563"
                              style={{ marginRight: 15 }}
                            />
                            <View style={{ flex: 1 }}>
                              
                              <Text style={styles.youInfoLabel}>
                                PLAYER {i + 1}:
                              </Text>
                              <Text style={styles.youInfoValue}>
                                {p.name} ({p.role})
                              </Text>
                            </View>
                          </View>
                        ))}
                      </>
                    )}
                    {currentPost?.category === 'Players' && (
                      <>
                        
                        <View style={styles.youInfoCard}>
                          
                          <Icon
                            name="person-outline"
                            size={24}
                            color="#4B5563"
                            style={{ marginRight: 15 }}
                          />
                          <View style={{ flex: 1 }}>
                            
                            <Text style={styles.youInfoLabel}>
                              PLAYER NAME:
                            </Text>
                            <Text style={styles.youInfoValue}>
                              {currentPost.player_name ||
                                currentPost.name ||
                                'N/A'}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.youInfoCard}>
                          
                          <Icon
                            name="star-outline"
                            size={24}
                            color="#4B5563"
                            style={{ marginRight: 15 }}
                          />
                          <View style={{ flex: 1 }}>
                            
                            <Text style={styles.youInfoLabel}>ROLE:</Text>
                            <Text style={styles.youInfoValue}>
                              {currentPost.role || 'N/A'}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.youInfoCard}>
                          
                          <Icon
                            name="bar-chart-outline"
                            size={24}
                            color="#4B5563"
                            style={{ marginRight: 15 }}
                          />
                          <View style={{ flex: 1 }}>
                            
                            <Text style={styles.youInfoLabel}>
                              EXPERIENCE:
                            </Text>
                            <Text style={styles.youInfoValue}>
                              {currentPost.experience || 'N/A'}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.youInfoCard}>
                          
                          <Icon
                            name="phone-portrait-outline"
                            size={24}
                            color="#4B5563"
                            style={{ marginRight: 15 }}
                          />
                          <View style={{ flex: 1 }}>
                            
                            <Text style={styles.youInfoLabel}>
                              DEVICE:
                            </Text>
                            <Text style={styles.youInfoValue}>
                              {currentPost.device_model || 'N/A'}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.youInfoCard}>
                          
                          <Icon
                            name="document-text-outline"
                            size={24}
                            color="#4B5563"
                            style={{ marginRight: 15 }}
                          />
                          <View style={{ flex: 1 }}>
                            
                            <Text style={styles.youInfoLabel}>
                              DESCRIPTION:
                            </Text>
                            <Text style={styles.youInfoValue}>
                              {currentPost.description ||
                                currentPost.looking_for_text ||
                                'N/A'}
                            </Text>
                          </View>
                        </View>
                      </>
                    )}
                    {currentPost?.category === 'Organisation' && (
                      <>
                        
                        <View style={styles.youInfoCard}>
                          
                          <Icon
                            name="business-outline"
                            size={24}
                            color="#4B5563"
                            style={{ marginRight: 15 }}
                          />
                          <View style={{ flex: 1 }}>
                            
                            <Text style={styles.youInfoLabel}>
                              ORG NAME:
                            </Text>
                            <Text style={styles.youInfoValue}>
                              {currentPost.org_name ||
                                currentPost.name ||
                                'N/A'}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.youInfoCard}>
                          
                          <Icon
                            name="calendar-outline"
                            size={24}
                            color="#4B5563"
                            style={{ marginRight: 15 }}
                          />
                          <View style={{ flex: 1 }}>
                            
                            <Text style={styles.youInfoLabel}>
                              ESTABLISHED:
                            </Text>
                            <Text style={styles.youInfoValue}>
                              {currentPost.established_year ||
                                currentPost.established ||
                                'N/A'}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.youInfoCard}>
                          
                          <Icon
                            name="document-text-outline"
                            size={24}
                            color="#4B5563"
                            style={{ marginRight: 15 }}
                          />
                          <View style={{ flex: 1 }}>
                            
                            <Text style={styles.youInfoLabel}>
                              DESCRIPTION:
                            </Text>
                            <Text style={styles.youInfoValue}>
                              {currentPost.description ||
                                currentPost.looking_for_text ||
                                'N/A'}
                            </Text>
                          </View>
                        </View>
                      </>
                    )}
                    {!['Team', 'Players', 'Organisation'].includes(
                      currentPost?.category,
                    ) &&
                      currentPost && (
                        <>
                          
                          <View style={styles.youInfoCard}>
                            
                            <Icon
                              name="person-outline"
                              size={24}
                              color="#4B5563"
                              style={{ marginRight: 15 }}
                            />
                            <View style={{ flex: 1 }}>
                              
                              <Text style={styles.youInfoLabel}>
                                ING NAME:
                              </Text>
                              <Text style={styles.youInfoValue}>
                                {currentPost.player_name ||
                                  currentPost.name ||
                                  'N/A'}
                              </Text>
                            </View>
                          </View>
                          <View style={styles.youInfoCard}>
                            
                            <Icon
                              name="copy-outline"
                              size={24}
                              color="#4B5563"
                              style={{ marginRight: 15 }}
                            />
                            <View style={{ flex: 1 }}>
                              
                              <Text style={styles.youInfoLabel}>
                                ING ID:
                              </Text>
                              <Text style={styles.youInfoValue}>
                                {currentPost.in_game_id || 'N/A'}
                              </Text>
                            </View>
                          </View>
                          <View style={styles.youInfoCard}>
                            
                            <Icon
                              name="trophy-outline"
                              size={24}
                              color="#4B5563"
                              style={{ marginRight: 15 }}
                            />
                            <View style={{ flex: 1 }}>
                              
                              <Text style={styles.youInfoLabel}>
                                ACHIEVEMENTS:
                              </Text>
                              <Text style={styles.youInfoValue}>
                                {currentPost.achievements ||
                                  currentPost.looking_for_text ||
                                  'N/A'}
                              </Text>
                            </View>
                          </View>
                        </>
                      )}
                    {!currentPost && (
                      <Text
                        style={{
                          textAlign: 'center',
                          color: '#6B7280',
                          marginVertical: 20,
                        }}
                      >
                        No post found for this category.
                      </Text>
                    )}
                    {currentPost && (
                      <>
                        
                        <View style={styles.youInfoCard}>
                          
                          <Icon
                            name="time-outline"
                            size={24}
                            color="#4B5563"
                            style={{ marginRight: 15 }}
                          />
                          <View style={{ flex: 1 }}>
                            
                            <Text style={styles.youInfoLabel}>
                              POSTED AGO:
                            </Text>
                            <Text style={styles.youInfoValue}>
                              {currentPost.postedAgo ||
                                currentPost.posted_ago ||
                                'N/A'}
                            </Text>
                          </View>
                        </View>
                        <TouchableOpacity
                          style={styles.youEditBtn}
                          onPress={handleEditTrigger}
                        >
                          
                          <Icon
                            name="pencil"
                            size={18}
                            color="#E51025"
                            style={{ marginRight: 8 }}
                          />
                          <Text
                            style={{
                              color: '#E51025',
                              fontWeight: 'bold',
                              fontSize: 16,
                            }}
                          >
                            Edit Post
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.youEditBtn,
                            { borderColor: '#4B5563', marginTop: 10 },
                          ]}
                          onPress={handleDeletePost}
                        >
                          
                          <Icon
                            name="trash-outline"
                            size={18}
                            color="#4B5563"
                            style={{ marginRight: 8 }}
                          />
                          <Text
                            style={{
                              color: '#4B5563',
                              fontWeight: 'bold',
                              fontSize: 16,
                            }}
                          >
                            Delete Post
                          </Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>
              </KeyboardAwareScrollView>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#E51025' },
  navbar: {
    backgroundColor: '#E51025',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  navLeft: { flexDirection: 'row', alignItems: 'center' },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  headerLogo: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginRight: 5,
    tintColor: '#FFFFFF',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    fontStyle: 'italic',
  },
  proBadge: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  proText: { color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' },
  navRight: { flexDirection: 'row', alignItems: 'center' },
  navIcon: { marginLeft: 15 },
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  bannerContainer: {
    height: 160,
    width: '100%',
    backgroundColor: '#E0E0E0',
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    opacity: 0.8,
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    justifyContent: 'center',
  },
  bannerTextContainer: { width: '60%' },
  bannerTitleBlack: {
    fontSize: 28,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#000000',
    lineHeight: 30,
  },
  bannerTitleRed: {
    fontSize: 26,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#E51025',
    lineHeight: 30,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: '#000000',
    marginTop: 5,
    fontWeight: '500',
  },
  kraftonBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    borderWidth: 2,
    borderColor: '#000',
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignItems: 'center',
  },
  kraftonTextTitle: { fontSize: 14, fontWeight: '900', color: '#000' },
  kraftonTextSub: { fontSize: 8, fontWeight: 'bold', color: '#000' },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 30,
    flex: 1,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  actionTitle: { fontSize: 13, fontWeight: 'bold', color: '#1F2937' },
  actionSubtitle: { fontSize: 10, color: '#6B7280', marginTop: 1 },
  actionRight: { flexDirection: 'row', alignItems: 'center' },
  postBtn: {
    backgroundColor: '#E51025',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 6,
  },
  postBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
    marginLeft: 4,
  },
  youBtn: {
    backgroundColor: '#E51025',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 25,
  },
  youBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
    marginLeft: 4,
  },
  chipsScroll: { paddingBottom: 15, paddingTop: 5 },
  chipsContainer: { paddingHorizontal: 15, alignItems: 'center' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 1.5,
  },
  chipActive: { backgroundColor: '#E51025', borderColor: '#E51025' },
  chipInactive: { backgroundColor: '#FFFFFF', borderColor: '#E51025' },
  chipText: { fontSize: 13, fontWeight: 'bold' },
  chipTextActive: { color: '#FFFFFF' },
  chipTextInactive: { color: '#E51025' },
  cardsContainer: { padding: 15 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: { flexDirection: 'row', marginBottom: 12 },
  avatarContainer: {
    width: 50,
    height: 50,
    marginRight: 12,
    position: 'relative',
  },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  cardProBadge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: '#E51025',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  cardProText: { color: '#FFFFFF', fontSize: 8, fontWeight: 'bold' },
  cardHeaderInfo: { flex: 1 },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', flex: 1 },
  matchTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  matchTypeText: {
    fontSize: 11,
    color: '#4B5563',
    marginLeft: 4,
    fontWeight: '600',
  },
  cardSubtitle: { fontSize: 13, color: '#6B7280' },
  cardSubtitleBold: { fontWeight: 'bold', color: '#1F2937' },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: { fontSize: 11, color: '#4B5563', marginLeft: 6, fontWeight: '500' },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  footerTime: { fontSize: 12, color: '#9CA3AF' },
  footerRight: { flexDirection: 'row', alignItems: 'center' },
  footerAction: { flexDirection: 'row', alignItems: 'center', marginRight: 15 },
  footerActionText: {
    color: '#E51025',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  contactAction: { flexDirection: 'row', alignItems: 'center' },
  contactActionText: {
    color: '#E51025',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },
  bottomBanner: {
    marginHorizontal: 15,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#1F2937',
  },
  bottomBannerBg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    opacity: 0.4,
  },
  bottomBannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  bottomBannerLeft: { marginRight: 10 },
  bgmiBox: { borderWidth: 1, borderColor: '#FFFFFF', padding: 4 },
  bgmiBoxText: { color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' },
  bottomBannerCenter: { flex: 1 },
  bbTitleWhite: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  bbTitleRed: {
    color: '#E51025',
    fontSize: 16,
    fontWeight: '900',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  bbSubtitleRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  bbSubtitle: { color: '#FFFFFF', fontSize: 9 },
  joinBtn: {
    backgroundColor: '#E51025',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinBtnText: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' },
  modalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 6,
    marginTop: 15,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1F2937',
  },
  modalPicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  modalPickerText: { fontSize: 14, color: '#6B7280' },
  modalTextArea: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1F2937',
    height: 100,
  },
  modalCharCount: {
    textAlign: 'right',
    fontSize: 10,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 20,
  },
  modalSubmitBtn: {
    backgroundColor: '#E51025',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 25,
    marginTop: 10,
  },
  youInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  youInfoLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  youInfoValue: { fontSize: 13, color: '#4B5563' },
  youEditBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 25,
    marginTop: 10,
    borderWidth: 1.5,
    borderColor: '#E51025',
    backgroundColor: '#FFFFFF',
  },
});
export default LookingScreen;





