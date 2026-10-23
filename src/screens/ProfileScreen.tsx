import React, { useContext, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  StatusBar, 
  Linking, 
  Alert, 
  Modal, 
  TextInput, 
  ActivityIndicator,
  FlatList
} from 'react-native';
import { AppContext } from '../context/AppContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { apiService } from '../api/index';
import { launchImageLibrary } from 'react-native-image-picker';

const ProfileScreen = ({ route, navigation }: any) => {
  const { userProfile, updateUserProfile, logoutUser } = useContext(AppContext);
  const [menuVisible, setMenuVisible] = useState(false);
  
  const [otherProfile, setOtherProfile] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Follow modal state (Instagram style)
  const [followModalVisible, setFollowModalVisible] = useState(false);
  const [followTab, setFollowTab] = useState<'followers' | 'following'>('followers');
  const [followList, setFollowList] = useState<any[]>([]);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const inspectedUserId = route?.params?.userId;
  const isOtherUser = inspectedUserId && String(inspectedUserId) !== String(userProfile?.id);
  const displayedProfile = isOtherUser ? otherProfile : userProfile;

  React.useEffect(() => {
    if (isOtherUser) {
      setIsLoading(true);
      apiService.getProfile(inspectedUserId, userProfile?.id).then(res => {
        if (res && res.status !== false) {
           const profileData = res.data || res;
           setOtherProfile(profileData);
           setIsFollowing(profileData.is_followed_by_me || profileData.is_following || profileData.isFollowing || profileData.followed || profileData.isFollowed || false);
        }
      }).catch(e => console.log('Error fetching other profile', e))
        .finally(() => setIsLoading(false));
    }
  }, [inspectedUserId, isOtherUser]);

  const loadFollowData = async (tab: 'followers' | 'following', targetId?: string | number) => {
    setIsFollowLoading(true);
    setSearchQuery('');
    const idToFetch = targetId || displayedProfile?.id;
    try {
      const res = tab === 'followers'
        ? await apiService.getFollowers(idToFetch, userProfile?.id)
        : await apiService.getFollowing(idToFetch, userProfile?.id);
      
      if (res && res.status !== false && Array.isArray(res.data)) {
        setFollowList(res.data);
      } else {
        setFollowList([]);
      }
    } catch (e) {
      console.log('Error fetching ' + tab, e);
      setFollowList([]);
    } finally {
      setIsFollowLoading(false);
    }
  };

  const openFollowModal = (tab: 'followers' | 'following') => {
    setFollowTab(tab);
    setFollowModalVisible(true);
    loadFollowData(tab);
  };

  const handleTabSwitch = (tab: 'followers' | 'following') => {
    if (tab === followTab) return;
    setFollowTab(tab);
    loadFollowData(tab);
  };

  const handleUserPress = (item: any) => {
    setFollowModalVisible(false);
    if (String(item.id) === String(userProfile?.id)) {
      if (isOtherUser) {
        navigation.navigate('ProfileScreen', { userId: userProfile?.id });
      }
      return;
    }
    if (String(item.id) === String(displayedProfile?.id)) {
      return;
    }
    if (navigation.push) {
      navigation.push('ProfileScreen', { userId: item.id });
    } else {
      navigation.navigate('ProfileScreen', { userId: item.id });
    }
  };

  const handleFollowInList = async (targetUser: any) => {
    const isCurrentlyFollowing = !!targetUser.is_following;
    const newStatus = !isCurrentlyFollowing;
    
    // Optimistic update list
    setFollowList(prev => prev.map(item => item.id === targetUser.id ? { ...item, is_following: newStatus } : item));
    
    // Update my following count in userProfile
    if (userProfile && updateUserProfile) {
      updateUserProfile({
        ...userProfile,
        following: newStatus ? (userProfile.following || 0) + 1 : Math.max(0, (userProfile.following || 0) - 1)
      });
    }

    try {
      await apiService.followUser(targetUser.id, newStatus ? 'follow' : 'unfollow', userProfile?.id);
    } catch (e) {
      // Revert on error
      setFollowList(prev => prev.map(item => item.id === targetUser.id ? { ...item, is_following: isCurrentlyFollowing } : item));
    }
  };

  const handleUploadPhoto = () => {
    Alert.alert(
      'Profile Photo',
      'Choose an option',
      [
        {
          text: 'Choose from Gallery',
          onPress: async () => {
            try {
              const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
              if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
                const photoUri = result.assets[0].uri;
                if (updateUserProfile && userProfile) {
                  await updateUserProfile({
                    ...userProfile,
                    profilePicture: photoUri,
                  });
                  Alert.alert('Success', 'Profile photo updated successfully!');
                }
              }
            } catch (err: any) {
              console.log('Error choosing photo:', err);
              Alert.alert('Error', 'Failed to select photo');
            }
          }
        },
        ...(displayedProfile?.profilePicture ? [{
          text: 'Remove Photo',
          style: 'destructive' as const,
          onPress: async () => {
            if (updateUserProfile && userProfile) {
              await updateUserProfile({
                ...userProfile,
                profilePicture: '',
              });
              Alert.alert('Success', 'Profile photo removed');
            }
          }
        }] : []),
        { text: 'Cancel', style: 'cancel' as const }
      ]
    );
  };

  const handleFollowToggle = async () => {
     if (!isOtherUser || !otherProfile) return;
     // Optimistic update
     const newIsFollowing = !isFollowing;
     setIsFollowing(newIsFollowing);
     
     // Update other user's followers count
     setOtherProfile((prev: any) => ({
        ...prev,
        followers: newIsFollowing ? (prev.followers || 0) + 1 : Math.max(0, (prev.followers || 0) - 1)
     }));

     // Update MY following count
     if (userProfile && updateUserProfile) {
       updateUserProfile({
         ...userProfile,
         following: newIsFollowing ? (userProfile.following || 0) + 1 : Math.max(0, (userProfile.following || 0) - 1)
       });
     }
     
     try {
       await apiService.followUser(inspectedUserId, newIsFollowing ? 'follow' : 'unfollow', userProfile?.id);
     } catch(e) {
       console.log('Follow error', e);
       // Revert on error
       setIsFollowing(!newIsFollowing);
       
       setOtherProfile((prev: any) => ({
          ...prev,
          followers: !newIsFollowing ? (prev.followers || 0) + 1 : Math.max(0, (prev.followers || 0) - 1)
       }));

       if (userProfile && updateUserProfile) {
         updateUserProfile({
           ...userProfile,
           following: !newIsFollowing ? (userProfile.following || 0) + 1 : Math.max(0, (userProfile.following || 0) - 1)
         });
       }
     }
  };

  const instagramHandle = displayedProfile?.socialLinks?.instagram || displayedProfile?.instagram || '';
  const youtubeHandle = displayedProfile?.socialLinks?.youtube || displayedProfile?.youtube || '';
  const discordHandle = displayedProfile?.socialLinks?.discord || displayedProfile?.discord || '';

  const formatSocialHandle = (platform: string, val: string) => {
    if (!val) return '';
    const clean = val.trim();
    if (platform === 'instagram') {
      if (clean.includes('instagram.com/')) {
        const parts = clean.split('instagram.com/')[1]?.split(/[/?#]/);
        return parts && parts[0] ? `@${parts[0]}` : clean;
      }
      return clean.startsWith('@') ? clean : `@${clean}`;
    }
    if (platform === 'youtube') {
      if (clean.includes('youtube.com/@')) {
        const parts = clean.split('youtube.com/@')[1]?.split(/[/?#]/);
        return parts && parts[0] ? `@${parts[0]}` : clean;
      }
      if (clean.includes('youtube.com/')) {
        return 'YouTube Channel';
      }
      return clean.startsWith('@') ? clean : `@${clean}`;
    }
    return clean;
  };

  const handleOpenSocial = (platform: 'instagram' | 'youtube' | 'discord', value: string) => {
    if (!value || !value.trim()) {
      if (!isOtherUser) {
        Alert.alert(
          'Add Social Link',
          `You haven't linked your ${platform.toUpperCase()} yet. Would you like to add it in Edit Profile?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Edit Profile', onPress: () => navigation.navigate('EditProfileScreen') }
          ]
        );
      } else {
        Alert.alert('Not Linked', `${displayedProfile?.fullName || 'User'} has not linked their ${platform} account yet.`);
      }
      return;
    }

    let url = value.trim();
    if (platform === 'instagram') {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://instagram.com/${url.replace('@', '')}`;
      }
      Linking.openURL(url).catch(() => Alert.alert('Error', 'Could not open Instagram link'));
    } else if (platform === 'youtube') {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://youtube.com/@${url.replace('@', '')}`;
      }
      Linking.openURL(url).catch(() => Alert.alert('Error', 'Could not open YouTube link'));
    } else if (platform === 'discord') {
      if (url.startsWith('http://') || url.startsWith('https://')) {
        Linking.openURL(url).catch(() => Alert.alert('Discord', `Discord: ${value}`));
      } else {
        Alert.alert('Discord Tag', `User's Discord: ${value}`);
      }
    }
  };

  const insets = useSafeAreaInsets();

  if (!userProfile) return null;

  if (!displayedProfile || isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#E51025" />
      </SafeAreaView>
    );
  }

  const filteredFollowList = followList.filter(item => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      (item.username && item.username.toLowerCase().includes(q)) ||
      (item.fullName && item.fullName.toLowerCase().includes(q))
    );
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#1A1A1A' }]} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Icon name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="lock-closed-outline" size={16} color="#FFF" style={{ marginRight: 6 }} />
          <Text style={styles.headerTitle}>{displayedProfile.username}</Text>
          <Icon name="chevron-down" size={16} color="#FFF" style={{ marginLeft: 4 }} />
        </View>
        <TouchableOpacity style={styles.headerBtn} onPress={() => setMenuVisible(true)}>
          <Icon name="menu" size={30} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Profile Info Top (Avatar + Stats) */}
        <View style={styles.topInfoContainer}>
          <TouchableOpacity 
            style={styles.avatarContainer}
            activeOpacity={0.8}
            onPress={!isOtherUser ? handleUploadPhoto : undefined}
          >
            {displayedProfile.profilePicture ? (
              <Image 
                source={{ uri: displayedProfile.profilePicture }} 
                style={styles.avatar} 
              />
            ) : (
              <View style={[styles.avatar, { backgroundColor: '#262626', justifyContent: 'center', alignItems: 'center' }]}>
                <Icon name="person" size={40} color="#737373" />
              </View>
            )}
            {!isOtherUser && (
              <View style={styles.plusIconBadge}>
                <Icon name="camera" size={13} color="#FFF" />
              </View>
            )}
          </TouchableOpacity>
          
          <View style={styles.statsContainer}>
            <TouchableOpacity 
              style={styles.statBox} 
              activeOpacity={0.7}
              onPress={() => openFollowModal('followers')}
            >
              <Text style={styles.statNumber}>{displayedProfile.followers || 0}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.statBox} 
              activeOpacity={0.7}
              onPress={() => openFollowModal('following')}
            >
              <Text style={styles.statNumber}>{displayedProfile.following || 0}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bio Section */}
        <View style={styles.bioContainer}>
          <Text style={styles.fullName}>{displayedProfile.fullName}</Text>
          {!!displayedProfile.bio && <Text style={styles.bioText}>{displayedProfile.bio}</Text>}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          {!isOtherUser ? (
            <>
              <TouchableOpacity 
                style={styles.actionBtn} 
                onPress={() => navigation.navigate('EditProfileScreen')}
              >
                <Text style={styles.actionBtnText}>Edit profile</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionBtn, { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }]}
                onPress={handleUploadPhoto}
              >
                <Icon name="camera-outline" size={16} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={styles.actionBtnText}>Upload Photo</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity 
              style={[styles.actionBtn, { backgroundColor: isFollowing ? '#262626' : '#E51025' }]}
              onPress={handleFollowToggle}
            >
              <Text style={styles.actionBtnText}>{isFollowing ? 'Following' : 'Follow'}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* SOCIAL MEDIA SECTION */}
        <View style={styles.socialSection}>
          <View style={styles.socialHeaderRow}>
            <Text style={styles.socialHeaderTitle}>SOCIAL PROFILES</Text>
            <Icon name="share-social-outline" size={18} color="#F59E0B" />
          </View>

          <View style={styles.socialList}>
            {/* Instagram */}
            <TouchableOpacity 
              style={styles.socialItem}
              activeOpacity={0.7}
              onPress={() => handleOpenSocial('instagram', instagramHandle)}
            >
              <View style={[styles.socialIconBox, { backgroundColor: 'rgba(225, 48, 108, 0.15)' }]}>
                <Icon name="logo-instagram" size={24} color="#E1306C" />
              </View>
              <View style={styles.socialInfoBox}>
                <Text style={styles.socialPlatformTitle}>Instagram</Text>
                <Text style={[styles.socialValueText, !instagramHandle && styles.socialValueEmpty]} numberOfLines={1}>
                  {instagramHandle ? formatSocialHandle('instagram', instagramHandle) : 'Not linked'}
                </Text>
              </View>
              <Icon 
                name={instagramHandle ? "open-outline" : "chevron-forward"} 
                size={18} 
                color={instagramHandle ? "#E1306C" : "#555"} 
              />
            </TouchableOpacity>

            {/* YouTube */}
            <TouchableOpacity 
              style={styles.socialItem}
              activeOpacity={0.7}
              onPress={() => handleOpenSocial('youtube', youtubeHandle)}
            >
              <View style={[styles.socialIconBox, { backgroundColor: 'rgba(255, 0, 0, 0.15)' }]}>
                <Icon name="logo-youtube" size={24} color="#FF0000" />
              </View>
              <View style={styles.socialInfoBox}>
                <Text style={styles.socialPlatformTitle}>YouTube</Text>
                <Text style={[styles.socialValueText, !youtubeHandle && styles.socialValueEmpty]} numberOfLines={1}>
                  {youtubeHandle ? formatSocialHandle('youtube', youtubeHandle) : 'Not linked'}
                </Text>
              </View>
              <Icon 
                name={youtubeHandle ? "open-outline" : "chevron-forward"} 
                size={18} 
                color={youtubeHandle ? "#FF0000" : "#555"} 
              />
            </TouchableOpacity>

            {/* Discord */}
            <TouchableOpacity 
              style={styles.socialItem}
              activeOpacity={0.7}
              onPress={() => handleOpenSocial('discord', discordHandle)}
            >
              <View style={[styles.socialIconBox, { backgroundColor: 'rgba(88, 101, 242, 0.15)' }]}>
                <Icon name="logo-discord" size={24} color="#5865F2" />
              </View>
              <View style={styles.socialInfoBox}>
                <Text style={styles.socialPlatformTitle}>Discord</Text>
                <Text style={[styles.socialValueText, !discordHandle && styles.socialValueEmpty]} numberOfLines={1}>
                  {discordHandle ? discordHandle : 'Not linked'}
                </Text>
              </View>
              <Icon 
                name={discordHandle ? "open-outline" : "chevron-forward"} 
                size={18} 
                color={discordHandle ? "#5865F2" : "#555"} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* USER DETAILS SECTION */}
        <View style={styles.detailsSection}>
          <View style={styles.detailsHeaderRow}>
            <Text style={styles.detailsHeaderTitle}>USER DETAILS</Text>
            {!isOtherUser ? (
              <TouchableOpacity style={styles.editDetailsBtn} onPress={() => navigation.navigate('EditProfileScreen')}>
                <Icon name="pencil" size={12} color="#FFF" style={{ marginRight: 4 }} />
                <Text style={styles.editDetailsText}>Edit Profile</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[styles.editDetailsBtn, { backgroundColor: isFollowing ? '#111827' : '#E51025' }]} 
                onPress={handleFollowToggle}
              >
                <Icon name={isFollowing ? "checkmark" : "person-add"} size={12} color="#FFF" style={{ marginRight: 4 }} />
                <Text style={styles.editDetailsText}>{isFollowing ? 'Following' : 'Follow'}</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.detailRowTwoCols}>
            <View style={styles.detailCol}>
              <Text style={styles.detailLabel}>First name</Text>
              <Text style={styles.detailValue}>{(displayedProfile.fullName || '').split(' ')[0] || 'N/A'}</Text>
            </View>
            <View style={styles.detailCol}>
              <Text style={styles.detailLabel}>Last name</Text>
              <Text style={styles.detailValue}>{(displayedProfile.fullName || '').split(' ').slice(1).join(' ') || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date of Birth (DD/MM/YYYY)</Text>
            <Text style={styles.detailValue}>{displayedProfile.dateOfBirth || 'N/A'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>E-mail</Text>
            <Text style={styles.detailValue}>{displayedProfile.email || 'N/A'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Region</Text>
            <Text style={styles.detailValue}>{displayedProfile.region || 'N/A'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Languages Known</Text>
            <Text style={styles.detailValue}>{displayedProfile.languages || 'N/A'}</Text>
          </View>
        </View>

        {!isOtherUser && (
          <TouchableOpacity 
            style={styles.logoutBtn} 
            onPress={() => {
              Alert.alert('Logout', 'Are you sure you want to logout?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', style: 'destructive', onPress: async () => {
                  await logoutUser();
                  navigation.replace('Login');
                }}
              ]);
            }}
          >
            <Text style={styles.logoutBtnText}>Logout</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* INSTAGRAM-STYLE FOLLOWERS / FOLLOWING MODAL */}
      <Modal 
        visible={followModalVisible} 
        animationType="slide" 
        onRequestClose={() => setFollowModalVisible(false)}
      >
        <SafeAreaView style={styles.followModalContainer}>
          <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />
          
          {/* Modal Header */}
          <View style={styles.followModalHeader}>
            <TouchableOpacity 
              style={styles.followModalCloseBtn} 
              onPress={() => setFollowModalVisible(false)}
            >
              <Icon name="arrow-back" size={26} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.followModalTitle}>{displayedProfile.username}</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Modal Tabs */}
          <View style={styles.followTabsContainer}>
            <TouchableOpacity 
              style={[styles.followTabBtn, followTab === 'followers' && styles.followTabBtnActive]}
              onPress={() => handleTabSwitch('followers')}
            >
              <Text style={[styles.followTabText, followTab === 'followers' && styles.followTabTextActive]}>
                {displayedProfile.followers || 0} Followers
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.followTabBtn, followTab === 'following' && styles.followTabBtnActive]}
              onPress={() => handleTabSwitch('following')}
            >
              <Text style={[styles.followTabText, followTab === 'following' && styles.followTabTextActive]}>
                {displayedProfile.following || 0} Following
              </Text>
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchBarContainer}>
            <Icon name="search" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search..."
              placeholderTextColor="#737373"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {!!searchQuery && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Icon name="close-circle" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>

          {/* Content List */}
          {isFollowLoading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#E51025" />
            </View>
          ) : (
            <FlatList
              data={filteredFollowList}
              keyExtractor={(item) => String(item.id)}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30 }}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Icon name="people-outline" size={60} color="#555" />
                  <Text style={styles.emptyText}>
                    {searchQuery ? `No users matching "${searchQuery}"` : `No ${followTab} yet`}
                  </Text>
                </View>
              }
              renderItem={({ item }) => {
                const isMe = String(item.id) === String(userProfile?.id);
                return (
                  <View style={styles.userRow}>
                    {/* Clickable Profile Navigation */}
                    <TouchableOpacity 
                      style={styles.userInfoTouchable}
                      activeOpacity={0.7}
                      onPress={() => handleUserPress(item)}
                    >
                      {item.profilePicture ? (
                        <Image source={{ uri: item.profilePicture }} style={styles.userRowAvatar} />
                      ) : (
                        <View style={[styles.userRowAvatar, styles.userRowAvatarPlaceholder]}>
                          <Icon name="person" size={22} color="#737373" />
                        </View>
                      )}
                      <View style={styles.userRowTextCol}>
                        <Text style={styles.userRowUsername} numberOfLines={1}>
                          {item.username || 'User'}
                        </Text>
                        <Text style={styles.userRowFullName} numberOfLines={1}>
                          {item.fullName || item.username}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {/* Action Button (Follow / Following) */}
                    {!isMe && (
                      <TouchableOpacity 
                        style={[
                          styles.userRowActionBtn, 
                          item.is_following ? styles.userRowFollowingBtn : styles.userRowFollowBtn
                        ]}
                        activeOpacity={0.8}
                        onPress={() => handleFollowInList(item)}
                      >
                        <Text style={[
                          styles.userRowActionText, 
                          item.is_following ? styles.userRowFollowingText : styles.userRowFollowText
                        ]}>
                          {item.is_following ? 'Following' : 'Follow'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              }}
            />
          )}
        </SafeAreaView>
      </Modal>

      {/* Hamburger Menu Modal */}
      <Modal visible={menuVisible} transparent animationType="slide" onRequestClose={() => setMenuVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuBox}>
            <View style={styles.dragHandle} />
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); navigation.navigate('SettingsScreen'); }}>
              <Icon name="settings-outline" size={24} color="#FFF" style={styles.menuIcon} />
              <Text style={styles.menuText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); navigation.navigate('ActivityScreen'); }}>
              <Icon name="time-outline" size={24} color="#FFF" style={styles.menuIcon} />
              <Text style={styles.menuText}>Your activity</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); navigation.navigate('SavedScreen'); }}>
              <Icon name="bookmark-outline" size={24} color="#FFF" style={styles.menuIcon} />
              <Text style={styles.menuText}>Saved</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); navigation.navigate('CloseFriendsScreen'); }}>
              <Icon name="star-outline" size={24} color="#FFF" style={styles.menuIcon} />
              <Text style={styles.menuText}>Close friends</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); navigation.navigate('BlockedScreen'); }}>
              <Icon name="ban-outline" size={24} color="#FFF" style={styles.menuIcon} />
              <Text style={styles.menuText}>Blocked</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, height: 60 },
  headerBtn: { padding: 5 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFF' },
  topInfoContainer: { flexDirection: 'row', paddingHorizontal: 15, paddingTop: 15, alignItems: 'center', justifyContent: 'space-between' },
  avatarContainer: { position: 'relative' },
  avatar: { width: 85, height: 85, borderRadius: 42.5 },
  plusIconBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#E51025', width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#1A1A1A' },
  statsContainer: { flexDirection: 'row', flex: 1, justifyContent: 'space-around', marginLeft: 20 },
  statBox: { alignItems: 'center', paddingVertical: 8, paddingHorizontal: 16 },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  statLabel: { fontSize: 13, color: '#FFF', marginTop: 2 },
  bioContainer: { paddingHorizontal: 15, paddingTop: 12 },
  fullName: { fontSize: 14, fontWeight: 'bold', color: '#FFF', marginBottom: 2 },
  bioText: { fontSize: 14, color: '#FFF', lineHeight: 20 },
  actionContainer: { flexDirection: 'row', paddingHorizontal: 15, paddingTop: 15, gap: 8 },
  actionBtn: { flex: 1, paddingVertical: 9, backgroundColor: '#333', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  actionBtnText: { fontSize: 14, fontWeight: 'bold', color: '#FFF' },
  
  // Social Media Section
  socialSection: { paddingHorizontal: 20, marginTop: 25 },
  socialHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  socialHeaderTitle: { color: '#F59E0B', fontSize: 15, fontWeight: 'bold', letterSpacing: 0.5 },
  socialList: { gap: 10 },
  socialItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#242424', 
    paddingHorizontal: 14, 
    paddingVertical: 12, 
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333'
  },
  socialIconBox: { 
    width: 42, 
    height: 42, 
    borderRadius: 21, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 14 
  },
  socialInfoBox: { flex: 1 },
  socialPlatformTitle: { color: '#9CA3AF', fontSize: 12, fontWeight: '600', marginBottom: 2 },
  socialValueText: { color: '#FFF', fontSize: 14, fontWeight: '500' },
  socialValueEmpty: { color: '#6B7280', fontStyle: 'italic' },

  // User Details Section
  detailsSection: { paddingHorizontal: 20, marginTop: 25 },
  detailsHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  detailsHeaderTitle: { color: '#F59E0B', fontSize: 15, fontWeight: 'bold', letterSpacing: 0.5 },
  editDetailsBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#333', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  editDetailsText: { color: '#FFF', fontSize: 12 },
  detailRow: { marginBottom: 18 },
  detailRowTwoCols: { flexDirection: 'row', marginBottom: 18 },
  detailCol: { flex: 1 },
  detailLabel: { color: '#6B7280', fontSize: 13, marginBottom: 5 },
  detailValue: { color: '#D1D5DB', fontSize: 15 },
  logoutBtn: { backgroundColor: '#E51025', marginHorizontal: 20, marginTop: 25, marginBottom: 40, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  logoutBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },

  // Follow Modal Styles
  followModalContainer: { flex: 1, backgroundColor: '#1A1A1A' },
  followModalHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 15, 
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#262626'
  },
  followModalCloseBtn: { padding: 6 },
  followModalTitle: { color: '#FFF', fontSize: 17, fontWeight: 'bold' },
  followTabsContainer: { 
    flexDirection: 'row', 
    borderBottomWidth: 1, 
    borderBottomColor: '#262626' 
  },
  followTabBtn: { 
    flex: 1, 
    paddingVertical: 14, 
    alignItems: 'center', 
    borderBottomWidth: 2, 
    borderBottomColor: 'transparent' 
  },
  followTabBtnActive: { borderBottomColor: '#FFF' },
  followTabText: { color: '#888', fontSize: 14, fontWeight: '600' },
  followTabTextActive: { color: '#FFF', fontWeight: 'bold' },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#262626',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    height: 40,
    borderWidth: 1,
    borderColor: '#333'
  },
  searchInput: { flex: 1, color: '#FFF', fontSize: 14, paddingVertical: 0 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 60 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 80 },
  emptyText: { color: '#737373', fontSize: 15, marginTop: 12 },
  userRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#222'
  },
  userInfoTouchable: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 10 },
  userRowAvatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  userRowAvatarPlaceholder: { backgroundColor: '#262626', justifyContent: 'center', alignItems: 'center' },
  userRowTextCol: { flex: 1 },
  userRowUsername: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  userRowFullName: { color: '#9CA3AF', fontSize: 13, marginTop: 2 },
  userRowActionBtn: { 
    paddingHorizontal: 16, 
    paddingVertical: 7, 
    borderRadius: 8, 
    minWidth: 86, 
    alignItems: 'center',
    justifyContent: 'center' 
  },
  userRowFollowBtn: { backgroundColor: '#E51025' },
  userRowFollowingBtn: { backgroundColor: '#262626', borderWidth: 1, borderColor: '#3E3E3E' },
  userRowActionText: { fontSize: 13, fontWeight: 'bold' },
  userRowFollowText: { color: '#FFF' },
  userRowFollowingText: { color: '#FFF' },

  // Hamburger Menu
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  menuBox: { backgroundColor: '#262626', borderTopLeftRadius: 16, borderTopRightRadius: 16, width: '100%', paddingVertical: 10, paddingBottom: 30, elevation: 5 },
  dragHandle: { width: 40, height: 4, backgroundColor: '#555', borderRadius: 2, alignSelf: 'center', marginBottom: 15 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 20 },
  menuIcon: { marginRight: 15 },
  menuText: { color: '#FFF', fontSize: 16 }
});

export default ProfileScreen;
