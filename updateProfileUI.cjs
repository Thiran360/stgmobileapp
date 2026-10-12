const fs = require('fs');
const content = `import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Alert, 
  Modal,
  FlatList,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import { AppContext } from '../context/AppContext';
import { apiService } from '../api/index';
import { colors } from '../theme/colors';

const PlayerDetailsScreen = ({ route, navigation }: any) => {
  const { loginUser, setUserProfile } = useContext(AppContext);
  
  const userIdFromRoute = route?.params?.userId || '';
  const mobileNumberFromRoute = route?.params?.mobileNumber || '';
  
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [liveLocation, setLiveLocation] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [mobileNumber, setMobileNumber] = useState(mobileNumberFromRoute);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Modals / Pickers state
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateObj, setDateObj] = useState(new Date(2000, 0, 1));
  
  const genderOptions = ['Male', 'Female', 'Other'];

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDateObj(selectedDate);
      const formattedDate = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
      setDateOfBirth(formattedDate);
    }
  };

  const handleSave = async () => {
    if (!fullName || !username || !mobileNumber) {
      Alert.alert('Error', 'Full Name, Username, and Mobile Number are required.');
      return;
    }
    
    setLoading(true);
    const finalUserId = userIdFromRoute || mobileNumber.replace(/[^0-9]/g, '') || Date.now().toString();

    const profile = { 
      id: finalUserId, 
      username, 
      fullName, 
      liveLocation, 
      gender, 
      dateOfBirth, 
      mobileNumber, 
      profilePicture: null, 
      email,
      followers: 0,
      following: 0,
      bio: '',
      socialLinks: {}
    };

    try {
      await apiService.createProfile(profile);
      await setUserProfile(profile);
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      await loginUser(finalUserId);
      navigation.replace('MainTabs');
    } catch (e) {
      Alert.alert('Error', 'Failed to save profile. Make sure endpoint exists.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAwareScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Player Details</Text>
        <Text style={styles.subtitle}>Complete your profile to continue</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="Enter full name" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username *</Text>
          <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholder="Enter username" />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mobile Number *</Text>
          <TextInput style={styles.input} value={mobileNumber} onChangeText={setMobileNumber} placeholder="Enter 10-digit mobile number" keyboardType="phone-pad" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Enter your email" keyboardType="email-address" autoCapitalize="none" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Live Location</Text>
          <TextInput style={styles.input} value={liveLocation} onChangeText={setLiveLocation} placeholder="e.g. Chennai" />
        </View>
        
        {/* Gender Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gender</Text>
          <TouchableOpacity style={styles.dropdownButton} onPress={() => setShowGenderModal(true)}>
            <Text style={[styles.dropdownText, !gender && { color: '#999' }]}>
              {gender || 'Select Gender'}
            </Text>
            <Icon name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>
        
        {/* Date of Birth Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity style={styles.dropdownButton} onPress={() => setShowDatePicker(true)}>
            <Text style={[styles.dropdownText, !dateOfBirth && { color: '#999' }]}>
              {dateOfBirth || 'YYYY-MM-DD'}
            </Text>
            <Icon name="calendar-outline" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={dateObj}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
          <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save & Continue'}</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>

      {/* Gender Modal */}
      <Modal visible={showGenderModal} transparent={true} animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowGenderModal(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Gender</Text>
            {genderOptions.map((item) => (
              <TouchableOpacity 
                key={item} 
                style={styles.modalOption}
                onPress={() => {
                  setGender(item);
                  setShowGenderModal(false);
                }}
              >
                <Text style={styles.modalOptionText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 14, color: '#444', marginBottom: 8, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 12, fontSize: 16, color: '#111', backgroundColor: '#F9FAFB' },
  
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F9FAFB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  dropdownText: { fontSize: 16, color: '#111' },
  
  saveButton: { backgroundColor: colors.primary, padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },

  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: '#FFF', borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#111' },
  modalOption: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  modalOptionText: { fontSize: 16, color: '#333' }
});

export default PlayerDetailsScreen;
`;

fs.writeFileSync('src/screens/PlayerDetailsScreen.tsx', content, 'utf8');
console.log('PlayerDetailsScreen updated with safe area, gender dropdown, and date picker.');
