import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { AppContext } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen = () => {
  const navigation = useNavigation<any>();
  const { logoutUser } = useContext(AppContext);

  const renderItem = (icon: string, title: string, subtitle?: string, onPress?: () => void) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.itemLeft}>
        <Icon name={icon} size={24} color="#6B7280" style={styles.itemIcon} />
        <View>
          <Text style={styles.itemTitle}>{title}</Text>
          {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <Icon name="chevron-forward" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 34 }} /> {/* Spacer for balance */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.section}>
          {renderItem('person-outline', 'Edit Profile', 'Update your personal details', () => navigation.navigate('EditProfileScreen'))}
          {renderItem('shield-checkmark-outline', 'Security', 'Password and authentication')}
          {renderItem('notifications-outline', 'Notifications', 'Manage push and email alerts')}
        </View>

        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.section}>
          {renderItem('globe-outline', 'Language', 'English')}
          {renderItem('moon-outline', 'Theme', 'System Default')}
        </View>

        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.section}>
          {renderItem('document-text-outline', 'Privacy Policy', '', () => navigation.navigate('PolicyScreen'))}
          {renderItem('information-circle-outline', 'Terms of Service')}
          {renderItem('help-circle-outline', 'Help & Support')}
        </View>

        <TouchableOpacity 
          style={styles.logoutBtn}
          onPress={async () => {
             await logoutUser();
             navigation.replace('Login');
          }}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>App Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 15, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  scrollContent: { padding: 15, paddingBottom: 40 },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#6B7280', textTransform: 'uppercase', marginBottom: 8, marginTop: 10, marginLeft: 5 },
  section: { backgroundColor: '#FFF', borderRadius: 12, overflow: 'hidden', marginBottom: 20 },
  item: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  itemLeft: { flexDirection: 'row', alignItems: 'center' },
  itemIcon: { marginRight: 15 },
  itemTitle: { fontSize: 16, color: '#1F2937', fontWeight: '500' },
  itemSubtitle: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  logoutBtn: { backgroundColor: '#FFF', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 10 },
  logoutText: { color: '#E51025', fontSize: 16, fontWeight: 'bold' },
  versionText: { textAlign: 'center', color: '#9CA3AF', fontSize: 12, marginTop: 20 },
});

export default SettingsScreen;


