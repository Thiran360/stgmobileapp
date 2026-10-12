import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, StatusBar, Linking, Alert, Modal, Platform, TextInput, ActivityIndicator } from 'react-native';
import { AppContext } from '../context/AppContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';

import { apiService } from '../api/index';

const ProfileScreen = ({ route, navigation }: any) => {
  const { userProfile, updateUserProfile, logoutUser } = useContext(AppContext);
  const [menuVisible, setMenuVisible] = useState(false);
  
  const [otherProfile, setOtherProfile] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const inspectedUserId = route?.params?.userId;
  const isOtherUser = inspectedUserId && inspectedUserId !== userProfile?.id;
  const displayedProfile = isOtherUser ? otherProfile : userProfile;

  React.useEffect(() => {
    if (isOtherUser) {
      setIsLoading(true);
      apiService.getProfile(inspectedUserId).then(res => {
        if (res && res.status !== false) {
           const profileData = res.data || res;
           setOtherProfile(profileData);
           setIsFollowing(profileData.is_followed_by_me || profileData.is_following || profileData.isFollowing || profileData.followed || profileData.isFollowed || false);
        }
      }).catch(e => console.log('Error fetching other profile', e))
        .finally(() => setIsLoading(false));
    }
  }, [inspectedUserId, isOtherUser]);

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
       // Fire API
       const endpoint = require('../api/config').API_ENDPOINTS.PROFILE_FOLLOW(inspectedUserId);
       await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: newIsFollowing ? 'follow' : 'unfollow', user_id: userProfile?.id })
       });
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
  
  // Modals state
    
  // Form states for Basic Edit
          
  // Form states for Contact Edit
      
  const insets = useSafeAreaInsets();

  if (!userProfile) return null;

  

  

  

  

  const handleOpenLink = (url: string | undefined) => {
    if (url) {
      Linking.openURL(url).catch(() => Alert.alert('Error', 'Cannot open this link'));
    }
  };

  if (!displayedProfile) { return <SafeAreaView style={[styles.container, { backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center' }]}><ActivityIndicator size="large" color="#E51025" /></SafeAreaView>; }

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
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: displayedProfile.profilePicture || 'https://via.placeholder.com/150' }} 
              style={styles.avatar} 
            />
            <View style={styles.plusIconBadge}>
              <Icon name="add" size={16} color="#FFF" />
            </View>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{displayedProfile.followers || 0}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{displayedProfile.following || 0}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>

        {/* Bio Section */}
        <View style={styles.bioContainer}>
          <Text style={styles.fullName}>{displayedProfile.fullName}</Text>
          {!!displayedProfile.bio && <Text style={styles.bioText}>{displayedProfile.bio}</Text>}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.actionBtn} 
            onPress={() => navigation.navigate('EditProfileScreen')}
          >
            <Text style={styles.actionBtnText}>Edit profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>Invite</Text>
          </TouchableOpacity>
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

        <TouchableOpacity 
          style={{ backgroundColor: '#E51025', marginHorizontal: 20, marginTop: 30, marginBottom: 50, paddingVertical: 14, borderRadius: 10, alignItems: 'center' }} 
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
          <Text style={{ color: '#FFF', fontSize: 16, fontWeight: 'bold' }}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

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
  statBox: { alignItems: 'center' },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  statLabel: { fontSize: 13, color: '#FFF', marginTop: 2 },
  bioContainer: { paddingHorizontal: 15, paddingTop: 12 },
  fullName: { fontSize: 14, fontWeight: 'bold', color: '#FFF', marginBottom: 2 },
  bioText: { fontSize: 14, color: '#FFF', lineHeight: 20 },
  readyText: { fontSize: 14, color: '#FFF', marginTop: 2 },
  actionContainer: { flexDirection: 'row', paddingHorizontal: 15, paddingTop: 15, gap: 8 },
  actionBtn: { flex: 1, paddingVertical: 8, backgroundColor: '#333', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  actionBtnText: { fontSize: 14, fontWeight: 'bold', color: '#FFF' },
  detailsSection: { paddingHorizontal: 20, marginTop: 40 },
  detailsHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  detailsHeaderTitle: { color: '#F59E0B', fontSize: 16, fontWeight: 'bold' },
  editDetailsBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#333', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  editDetailsText: { color: '#FFF', fontSize: 12 },
  detailRow: { marginBottom: 20 },
  detailRowTwoCols: { flexDirection: 'row', marginBottom: 20 },
  detailCol: { flex: 1 },
  detailRowWithEdit: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  detailLabel: { color: '#6B7280', fontSize: 13, marginBottom: 6 },
  detailValue: { color: '#D1D5DB', fontSize: 15 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  menuBox: { backgroundColor: '#262626', borderTopLeftRadius: 16, borderTopRightRadius: 16, width: '100%', paddingVertical: 10, paddingBottom: 30, elevation: 5 },
  dragHandle: { width: 40, height: 4, backgroundColor: '#555', borderRadius: 2, alignSelf: 'center', marginBottom: 15 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 20 },
  menuIcon: { marginRight: 15 },
  menuText: { color: '#FFF', fontSize: 16 },
  editModalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  editModalContent: { backgroundColor: '#1A1A1A', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '80%' },
  editModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  editModalTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  inputLabel: { color: '#9CA3AF', fontSize: 13, marginBottom: 8, marginTop: 15 },
  inputField: { backgroundColor: '#262626', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 12, color: '#FFF', fontSize: 15, borderWidth: 1, borderColor: '#333' },
  saveBtn: { backgroundColor: '#F59E0B', borderRadius: 8, paddingVertical: 15, alignItems: 'center', marginTop: 30, marginBottom: 20 },
  saveBtnText: { color: '#1A1A1A', fontSize: 16, fontWeight: 'bold' }
});

export default ProfileScreen;














