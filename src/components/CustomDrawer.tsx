import React, { useContext, useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal, Alert, Dimensions, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../theme/colors';
import { AppContext } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const CustomDrawer = () => {
  const { isDrawerOpen, setIsDrawerOpen, userProfile, logoutUser } = useContext(AppContext);
  const navigation = useNavigation<any>();
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const drawerAnim = useRef(new Animated.Value(-width)).current;
  const [isVisible, setIsVisible] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (isDrawerOpen) {
      setIsVisible(true);
      Animated.timing(drawerAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(drawerAnim, {
        toValue: -width,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setIsVisible(false);
        setShowProfileDetails(false);
      });
    }
  }, [isDrawerOpen]);

  const handleLogout = () => {
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await logoutUser();
            setIsDrawerOpen(false);
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }
      ]
    );
  };

  const FreeUserBadgeStyle = () => ({
    backgroundColor: '#374151',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start' as const,
  });

  if (!isVisible) return null;

  return (
    <Modal visible={isVisible} transparent={true} animationType="none">
      <View style={styles.drawerOverlay}>
        <TouchableOpacity style={styles.drawerCloseArea} onPress={() => setIsDrawerOpen(false)} activeOpacity={1} />
        
        <Animated.View style={[styles.drawerContent, { transform: [{ translateX: drawerAnim }] }]}>
          {/* Drawer Header */}
          <View style={[styles.drawerHeader, { paddingTop: insets.top + 20 }]}>
            <TouchableOpacity style={styles.drawerHeaderTop} onPress={() => { setIsDrawerOpen(false); navigation.navigate('ProfileScreen'); }}>
              <View style={styles.drawerAvatar}>
                {userProfile?.profilePicture ? (
                  <Image source={{ uri: userProfile.profilePicture }} style={{ width: '100%', height: '100%' }} />
                ) : (
                  <Icon name="person" size={36} color="#9CA3AF" />
                )}
              </View>
              <View style={styles.drawerUserInfo}>
                <Text style={styles.drawerUserName}>{userProfile?.fullName || 'Guest'}</Text>
                {userProfile?.username ? <Text style={styles.drawerUserHandle}>{userProfile.username.startsWith('@') ? userProfile.username : '@'+userProfile.username}</Text> : null}
                <Text style={styles.drawerUserPhone}>{userProfile?.mobileNumber || 'Not Logged In'}</Text>
                <View style={FreeUserBadgeStyle()}>
                  <Text style={styles.freeUserText}>Free User</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setIsDrawerOpen(false)} style={{ marginLeft: 'auto' }}>
                <Icon name="chevron-forward-circle-outline" size={24} color={colors.textBlack} />
              </TouchableOpacity>
            </TouchableOpacity>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBg}>
                <View style={styles.progressBarFill} />
              </View>
              <Text style={styles.progressText}>50%</Text>
            </View>
          </View>

          {showProfileDetails ? (
            <View style={styles.profileDetailsContainer}>
              <TouchableOpacity style={styles.profileBackRow} onPress={() => setShowProfileDetails(false)}>
                <Icon name="arrow-back-outline" size={20} color={colors.textBlack} />
                <Text style={styles.profileBackText}>Back to Menu</Text>
              </TouchableOpacity>

              <View style={styles.profileInfoSection}>
                <View style={styles.profileBigAvatar}>
                  {userProfile?.profilePicture ? (
                    <Image source={{ uri: userProfile.profilePicture }} style={{ width: '100%', height: '100%' }} />
                  ) : (
                    <Icon name="person" size={54} color="#9CA3AF" />
                  )}
                </View>
                <Text style={styles.profileNameText}>{userProfile?.fullName || 'Guest'}</Text>
                {userProfile?.username ? <Text style={styles.profileHandleText}>{userProfile.username.startsWith('@') ? userProfile.username : '@'+userProfile.username}</Text> : null}
                <Text style={styles.profilePhoneText}>{userProfile?.mobileNumber || ''}</Text>
                <View style={styles.profileStatusBadge}>
                  <Text style={styles.profileStatusText}>FREE USER</Text>
                </View>
              </View>

              <View style={styles.profileDetailsList}>
                {userProfile && (
                  <>
                    <View style={styles.profileDetailItem}>
                      <Icon name="location-outline" size={18} color={colors.textGray} style={{ marginRight: 10 }} />
                      <View style={styles.profileDetailContent}>
                        <Text style={styles.profileDetailLabel}>Live Location</Text>
                        <Text style={styles.profileDetailVal}>{userProfile.liveLocation}</Text>
                      </View>
                    </View>

                    <View style={styles.profileDetailItem}>
                      <Icon name="male-female-outline" size={18} color={colors.textGray} style={{ marginRight: 10 }} />
                      <View style={styles.profileDetailContent}>
                        <Text style={styles.profileDetailLabel}>Gender</Text>
                        <Text style={styles.profileDetailVal}>{userProfile.gender}</Text>
                      </View>
                    </View>

                    <View style={styles.profileDetailItem}>
                      <Icon name="calendar-outline" size={18} color={colors.textGray} style={{ marginRight: 10 }} />
                      <View style={styles.profileDetailContent}>
                        <Text style={styles.profileDetailLabel}>Date of Birth</Text>
                        <Text style={styles.profileDetailVal}>{userProfile.dateOfBirth}</Text>
                      </View>
                    </View>
                  </>
                )}
                {userProfile?.email && (
                  <View style={styles.profileDetailItem}>
                    <Icon name="mail-outline" size={18} color={colors.textGray} style={{ marginRight: 10 }} />
                    <View style={styles.profileDetailContent}>
                      <Text style={styles.profileDetailLabel}>Email</Text>
                      <Text style={styles.profileDetailVal}>{userProfile.email}</Text>
                    </View>
                  </View>
                )}

                <View style={styles.profileDetailItem}>
                  <Icon name="calendar-outline" size={18} color={colors.textGray} style={{ marginRight: 10 }} />
                  <View style={styles.profileDetailContent}>
                    <Text style={styles.profileDetailLabel}>Member Since</Text>
                    <Text style={styles.profileDetailVal}>July 2026</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Icon name="log-out-outline" size={18} color={colors.textBlack} style={{ marginRight: 8 }} />
                <Text style={styles.logoutText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView style={styles.drawerMenu} contentContainerStyle={{ paddingBottom: insets.bottom + 20 }} showsVerticalScrollIndicator={false}>
              
              <DrawerItem icon="home-outline" label="Home" onPress={() => { setIsDrawerOpen(false); navigation.navigate('MainTabs', { screen: 'Home' }); }} />
              <DrawerItem icon="search-outline" label="Looking" onPress={() => { setIsDrawerOpen(false); navigation.navigate('MainTabs', { screen: 'Looking' }); }} />
              <DrawerItem icon="trophy-outline" label="Matches" onPress={() => { setIsDrawerOpen(false); navigation.navigate('MainTabs', { screen: 'Matches' }); }} />
              <DrawerItem icon="people-outline" label="Community" onPress={() => { setIsDrawerOpen(false); navigation.navigate('MainTabs', { screen: 'Community' }); }} />
              <DrawerItem icon="bar-chart-outline" label="My Performance" onPress={() => { setIsDrawerOpen(false); Alert.alert('Coming Soon', 'This feature will be available shortly!'); }} />
                <DrawerItem icon="podium-outline" label="Leaderboards" onPress={() => { setIsDrawerOpen(false); Alert.alert('Coming Soon', 'This feature will be available shortly!'); }} />
                <DrawerItem icon="cart-outline" label="Store" onPress={() => { setIsDrawerOpen(false); navigation.navigate('MainTabs', { screen: 'Store' }); }} />

              <View style={styles.menuDivider} />
              
              <DrawerItem icon="call-outline" label="Support" />
              <DrawerItem icon="share-social-outline" label="Share the app" />
              <DrawerItem icon="star-outline" label="Rate us" />

              <View style={styles.menuDivider} />

                            
              <DrawerItem icon="logo-instagram" label="Instagram" />
              <DrawerItem icon="logo-youtube" label="YouTube" />
              <DrawerItem icon="logo-facebook" label="Facebook" />
              <DrawerItem icon="close-outline" label="X" />
                <DrawerItem icon="logo-discord" label="Discord" />

              <DrawerItem icon="globe-outline" label="About Us" />
                            <DrawerItem icon="help-circle-outline" label="Help / FAQs" />

              <DrawerItem icon="shield-checkmark-outline" label="Privacy Policy" onPress={() => { setIsDrawerOpen(false); navigation.navigate("PolicyScreen", { title: "Privacy Policy" }); }} />
              <DrawerItem icon="document-text-outline" label="Terms of Service" onPress={() => { setIsDrawerOpen(false); navigation.navigate("PolicyScreen", { title: "Terms of Service" }); }} />
              <DrawerItem icon="card-outline" label="Paid Service Terms" onPress={() => { setIsDrawerOpen(false); navigation.navigate("PolicyScreen", { title: "Paid Service Terms" }); }} />
            </ScrollView>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const DrawerItem = ({ icon, label, badge, isStore, onPress, rightIcon }: { icon: string, label: string, badge?: string, isStore?: boolean, onPress?: () => void, rightIcon?: string }) => (
  <TouchableOpacity
    style={styles.drawerItem}
    onPress={onPress}
    activeOpacity={onPress ? 0.7 : 1}
  >
    <Icon name={icon} size={22} color={colors.textGray} style={styles.drawerItemIcon} />
    <Text style={styles.drawerItemLabel}>{label}</Text>
    {badge && (
      <View style={styles.drawerBadge}>
        <Text style={styles.drawerBadgeText}>{badge}</Text>
      </View>
    )}
    {isStore && (
      <View style={styles.storeBadge}>
        <Icon name="gift-outline" size={12} color="#EAB308" />
      </View>
    )}
    {rightIcon && (
      <Icon name={rightIcon} size={20} color={colors.textGray} style={{ marginLeft: 'auto' }} />
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  drawerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', flexDirection: 'row' },
  drawerCloseArea: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 },
  drawerContent: { width: '85%', maxWidth: 320, backgroundColor: colors.white, height: '100%' },
  drawerHeader: { backgroundColor: '#111827', paddingHorizontal: 20, paddingBottom: 25, borderBottomWidth: 1, borderBottomColor: '#374151' },
  drawerHeaderTop: { flexDirection: 'row', alignItems: 'center' },
  drawerAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#374151', justifyContent: 'center', alignItems: 'center', marginRight: 15, overflow: 'hidden' },
  drawerUserInfo: { flex: 1 },
  drawerUserName: { color: '#F9FAFB', fontSize: 18, fontWeight: 'bold', overflow: 'hidden', marginBottom: 2 },
  drawerUserHandle: { color: colors.primary, fontSize: 13, fontWeight: 'bold', marginBottom: 2 },
  drawerUserPhone: { color: '#9CA3AF', fontSize: 12, marginBottom: 5 },
  freeUserText: { color: '#D1D5DB', fontSize: 10, fontWeight: 'bold' },
  progressBarContainer: { marginTop: 20, flexDirection: 'row', alignItems: 'center' },
  progressBarBg: { flex: 1, height: 6, backgroundColor: '#374151', borderRadius: 3, marginRight: 10 },
  progressBarFill: { width: '50%', height: '100%', backgroundColor: colors.primary, borderRadius: 3 },
  progressText: { color: '#F9FAFB', fontSize: 12, fontWeight: 'bold' },
  
  drawerMenu: { flex: 1, paddingTop: 10, backgroundColor: '#FFFFFF' },
  drawerItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 20 },
  drawerItemIcon: { marginRight: 15 },
  drawerItemLabel: { flex: 1, fontSize: 15, color: '#374151' },
  drawerBadge: { backgroundColor: '#FEF2F2', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  drawerBadgeText: { color: colors.primary, fontSize: 10, fontWeight: 'bold' },
  storeBadge: { backgroundColor: '#FEF9C3', padding: 4, borderRadius: 12, marginLeft: 8 },
  menuDivider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 8, marginHorizontal: 20 },
  
  profileDetailsContainer: { flex: 1, backgroundColor: '#FFFFFF' },
  profileBackRow: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingBottom: 10 },
  profileBackText: { fontSize: 16, fontWeight: 'bold', color: colors.textBlack, marginLeft: 10 },
  profileInfoSection: { alignItems: 'center', paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  profileBigAvatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginBottom: 12, overflow: 'hidden' },
  profileNameText: { fontSize: 20, fontWeight: 'bold', color: colors.textBlack, marginBottom: 4 },
  profileHandleText: { fontSize: 15, fontWeight: 'bold', color: colors.primary, marginBottom: 4 },
  profilePhoneText: { fontSize: 14, color: colors.textGray, marginBottom: 10 },
  profileStatusBadge: { backgroundColor: '#F0FDF4', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: '#BBF7D0' },
  profileStatusText: { color: '#166534', fontSize: 12, fontWeight: 'bold' },
  profileDetailsList: { padding: 20 },
  profileDetailItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  profileDetailContent: { flex: 1 },
  profileDetailLabel: { fontSize: 12, color: colors.textGray, marginBottom: 2 },
  profileDetailVal: { fontSize: 15, color: colors.textBlack, fontWeight: '500' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 20, marginTop: 'auto', marginBottom: 30, paddingVertical: 12, backgroundColor: '#FEF2F2', borderRadius: 8, borderWidth: 1, borderColor: '#FECACA' },
  logoutText: { fontSize: 15, fontWeight: 'bold', color: colors.textBlack },
});

export default CustomDrawer;







