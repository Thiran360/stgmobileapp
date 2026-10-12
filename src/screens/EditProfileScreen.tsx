import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext } from '../context/AppContext';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform, Modal } from 'react-native';

const EditProfileScreen = ({ navigation }: any) => {
  const { userProfile, updateUserProfile } = useContext(AppContext);

  if (!userProfile) return null;

  const nameParts = (userProfile?.fullName || '').split(' ');

  const [profilePic, setProfilePic] = useState(userProfile.profilePicture || '');
  const [firstName, setFirstName] = useState(nameParts[0] || '');
  const [lastName, setLastName] = useState(nameParts.slice(1).join(' ') || '');
  const [username, setUsername] = useState(userProfile.username || '');
  const [bio, setBio] = useState(userProfile.bio || '');
  
  const [dob, setDob] = useState(userProfile.dateOfBirth || '');
  const [gender, setGender] = useState(userProfile.gender || '');
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const genderOptions = ['Male', 'Female', 'Other'];

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setDob(formattedDate);
    }
  };

  const [email, setEmail] = useState(userProfile.email || '');
  const [phone, setPhone] = useState(userProfile.mobileNumber || '');
  const [region, setRegion] = useState(userProfile.region || '');
  const [languages, setLanguages] = useState(userProfile.languages || '');
  
  const [yt, setYt] = useState(userProfile.socialLinks?.youtube || '');
  const [insta, setInsta] = useState(userProfile.socialLinks?.instagram || '');
  const [discord, setDiscord] = useState(userProfile.socialLinks?.discord || '');
  const [fb, setFb] = useState(userProfile.socialLinks?.facebook || '');

  const handleChangePhoto = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
    if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
      setProfilePic(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    await updateUserProfile({
      profilePicture: profilePic,
      fullName: `${firstName} ${lastName}`.trim(),
      username,
      bio,
      dateOfBirth: dob,
      gender,
      email,
      mobileNumber: phone,
      region,
      languages,
      socialLinks: {
        youtube: yt,
        instagram: insta,
        discord: discord,
        facebook: fb
      }
    });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10 }}>
          <Icon name="close" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} style={{ padding: 10 }}>
          <Icon name="checkmark" size={28} color="#10B981" />
        </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }} enableOnAndroid={true} extraScrollHeight={20}>
        <View style={styles.photoSection}>
          <Image 
            source={{ uri: profilePic || 'https://via.placeholder.com/150' }} 
            style={styles.avatar} 
          />
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 15 }}>
            <TouchableOpacity style={styles.uploadBtn} onPress={handleChangePhoto}>
              <Text style={styles.uploadBtnText}>Change Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => setProfilePic('')}>
              <Text style={styles.deleteBtnText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Basic Info</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>First Name</Text>
          <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} placeholder="First Name" placeholderTextColor="#666" />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput style={styles.input} value={lastName} onChangeText={setLastName} placeholder="Last Name" placeholderTextColor="#666" />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username</Text>
          <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholder="Username" placeholderTextColor="#666" />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Bio</Text>
          <TextInput style={styles.input} value={bio} onChangeText={setBio} placeholder="Tell us about yourself..." placeholderTextColor="#666" multiline />
        </View>

        <Text style={styles.sectionTitle}>Personal Details</Text>
        
        {/* Gender */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gender</Text>
          <TouchableOpacity 
            style={[styles.input, { justifyContent: 'center' }]} 
            onPress={() => setShowGenderModal(true)}
          >
            <Text style={{ color: gender ? '#FFF' : '#666' }}>{gender || 'Select Gender'}</Text>
          </TouchableOpacity>
        </View>

        {/* Date of Birth */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity 
            style={[styles.input, { justifyContent: 'center' }]} 
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ color: dob ? '#FFF' : '#666' }}>{dob || 'YYYY-MM-DD'}</Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={dob ? new Date(dob) : new Date(2000, 0, 1)}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email Address" placeholderTextColor="#666" keyboardType="email-address" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Mobile Number" placeholderTextColor="#666" keyboardType="phone-pad" />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Region</Text>
          <TextInput style={styles.input} value={region} onChangeText={setRegion} placeholder="Region (e.g. India)" placeholderTextColor="#666" />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Languages Known</Text>
          <TextInput style={styles.input} value={languages} onChangeText={setLanguages} placeholder="Languages (e.g. Tamil, English)" placeholderTextColor="#666" />
        </View>

        <Text style={styles.sectionTitle}>Social Links</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>YouTube Link</Text>
          <TextInput style={styles.input} value={yt} onChangeText={setYt} placeholder="YouTube URL" placeholderTextColor="#666" />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Instagram Link</Text>
          <TextInput style={styles.input} value={insta} onChangeText={setInsta} placeholder="Instagram Handle" placeholderTextColor="#666" />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Discord ID</Text>
          <TextInput style={styles.input} value={discord} onChangeText={setDiscord} placeholder="Discord Tag" placeholderTextColor="#666" />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Facebook Link</Text>
          <TextInput style={styles.input} value={fb} onChangeText={setFb} placeholder="Facebook URL" placeholderTextColor="#666" />
        </View>
      </KeyboardAwareScrollView>
    
      {/* Gender Modal */}
      <Modal visible={showGenderModal} transparent={true} animationType="fade">
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }} onPress={() => setShowGenderModal(false)}>
          <View style={{ width: '80%', backgroundColor: '#222', borderRadius: 12, padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#FFF' }}>Select Gender</Text>
            {genderOptions.map((item) => (
              <TouchableOpacity 
                key={item} 
                style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#444' }}
                onPress={() => {
                  setGender(item);
                  setShowGenderModal(false);
                }}
              >
                <Text style={{ fontSize: 16, color: '#FFF' }}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, paddingTop: 10, paddingBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  content: { flex: 1, paddingHorizontal: 20 },
  photoSection: { alignItems: 'center', marginBottom: 30 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#333', borderWidth: 2, borderColor: '#444' },
  uploadBtn: { backgroundColor: '#333', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  uploadBtnText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  deleteBtn: { backgroundColor: '#333', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  deleteBtnText: { color: '#E51025', fontSize: 14, fontWeight: 'bold' },
  sectionTitle: { color: '#888', fontSize: 14, fontWeight: 'bold', marginBottom: 15, marginTop: 10, textTransform: 'uppercase' },
  inputGroup: { marginBottom: 20 },
  label: { color: '#CCC', fontSize: 13, marginBottom: 5 },
  input: { borderBottomWidth: 1, borderBottomColor: '#333', color: '#FFF', fontSize: 16, paddingVertical: 8 },
});

export default EditProfileScreen;






