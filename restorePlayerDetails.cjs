const fs = require('fs');

const playerDetailsCode = `import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
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

  const handleSave = async () => {
    if (!fullName || !username || !mobileNumber) {
      Alert.alert('Error', 'Full Name, Username, and Mobile Number are required.');
      return;
    }
    
    setLoading(true);
    
    // We use the userId from route (which was returned by verifyOtp)
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
      // POST to backend API
      await apiService.createProfile(profile);
      
      // Save locally and login
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <KeyboardAwareScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
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
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gender</Text>
          <TextInput style={styles.input} value={gender} onChangeText={setGender} placeholder="Male / Female / Other" />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date of Birth</Text>
          <TextInput style={styles.input} value={dateOfBirth} onChangeText={setDateOfBirth} placeholder="YYYY-MM-DD" />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
          <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save & Continue'}</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: 'bold', color: '#111', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 14, color: '#444', marginBottom: 8, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 12, fontSize: 16, color: '#111', backgroundColor: '#F9FAFB' },
  saveButton: { backgroundColor: colors.primary, padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});

export default PlayerDetailsScreen;
`;

fs.writeFileSync('src/screens/PlayerDetailsScreen.tsx', playerDetailsCode, 'utf8');
console.log('Restored PlayerDetailsScreen.tsx');
