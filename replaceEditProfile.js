const fs = require('fs');

const content = `import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Image, TextInput, ScrollView } from 'react-native';
import { AppContext } from '../context/AppContext';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const EditProfileScreen = ({ navigation }: any) => {
  const { userProfile, updateUserProfile } = useContext(AppContext);

  if (!userProfile) return null;

  const nameParts = userProfile.fullName.split(' ');

  const [profilePic, setProfilePic] = useState(userProfile.profilePicture || '');
  const [firstName, setFirstName] = useState(nameParts[0] || '');
  const [lastName, setLastName] = useState(nameParts.slice(1).join(' ') || '');
  const [username, setUsername] = useState(userProfile.username || '');
  const [bio, setBio] = useState(userProfile.bio || '');
  const [dob, setDob] = useState(userProfile.dateOfBirth || '');
  const [email, setEmail] = useState(userProfile.email || '');
  const [password, setPassword] = useState(userProfile.password || '');
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
      fullName: \`\${firstName} \${lastName}\`.trim(),
      username,
      bio,
      dateOfBirth: dob,
      email,
      password,
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
    <SafeAreaView style={styles.container}>
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

      <KeyboardAwareScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
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
          <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} placeholderTextColor="#666" />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput style={styles.input} value={lastName} onChangeText={setLastName} placeholderTextColor="#666" />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username</Text>
          <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholderTextColor="#666" />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Bio</Text>
          <TextInput style={styles.input} value={bio} onChangeText={setBio} placeholderTextColor="#666" multiline />
        </View>

        <Text style={styles.sectionTitle}>Personal Details</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date of Birth (DD/MM/YYYY)</Text>
          <TextInput style={styles.input} value={dob} onChangeText={setDob} placeholderTextColor="#666" />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholderTextColor="#666" keyboardType="email-address" />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholderTextColor="#666" secureTextEntry />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholderTextColor="#666" keyboardType="phone-pad" />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Region</Text>
          <TextInput style={styles.input} value={region} onChangeText={setRegion} placeholderTextColor="#666" />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Languages Known</Text>
          <TextInput style={styles.input} value={languages} onChangeText={setLanguages} placeholderTextColor="#666" />
        </View>

        <Text style={styles.sectionTitle}>Social Links</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>YouTube Link</Text>
          <TextInput style={styles.input} value={yt} onChangeText={setYt} placeholderTextColor="#666" />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Instagram Link</Text>
          <TextInput style={styles.input} value={insta} onChangeText={setInsta} placeholderTextColor="#666" />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Discord ID</Text>
          <TextInput style={styles.input} value={discord} onChangeText={setDiscord} placeholderTextColor="#666" />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Facebook Link</Text>
          <TextInput style={styles.input} value={fb} onChangeText={setFb} placeholderTextColor="#666" />
        </View>
      </KeyboardAwareScrollView>
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
  deleteBtnText: { color: '#EF4444', fontSize: 14, fontWeight: 'bold' },
  sectionTitle: { color: '#888', fontSize: 14, fontWeight: 'bold', marginBottom: 15, marginTop: 10, textTransform: 'uppercase' },
  inputGroup: { marginBottom: 20 },
  label: { color: '#CCC', fontSize: 13, marginBottom: 5 },
  input: { borderBottomWidth: 1, borderBottomColor: '#333', color: '#FFF', fontSize: 16, paddingVertical: 8 },
});

export default EditProfileScreen;
`;

fs.writeFileSync('src/screens/EditProfileScreen.tsx', content, 'utf8');
console.log('EditProfileScreen replaced');
