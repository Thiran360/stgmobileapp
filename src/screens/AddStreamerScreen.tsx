import React, { useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Alert,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';

const AddStreamerScreen = () => {
  const navigation = useNavigation<any>();

  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const handlePickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
    if (result.assets && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri || null);
    }
  };

  const [name, setName] = useState('Gokul Ram');
  const [contact, setContact] = useState('9344149318');
  const [city, setCity] = useState('Erode');
  const [platform, setPlatform] = useState('YouTube');
  const [feeStream, setFeeStream] = useState('');

  const [feeDay, setFeeDay] = useState('');

  const [exp, setExp] = useState('');


  const handlePublish = () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Streamer name is required');
      return;
    }
    if (!contact.trim()) {
      Alert.alert('Validation Error', 'Streamer contact number is required');
      return;
    }
    if (!city.trim()) {
      Alert.alert('Validation Error', 'City is required');
      return;
    }
    if (!platform.trim()) {
      Alert.alert('Validation Error', 'Platform is required');
      return;
    }
    if (!feeStream.trim() && !feeDay.trim()) {
      Alert.alert('Validation Error', 'Please enter at least one fee field');
      return;
    }

    const newStreamer = {
      id: Date.now(),
      name: name,
      avatar: 'https://i.pravatar.cc/150?img=60',
      matches: 0,
      points: 0,
      feeMatch: feeStream ? parseInt(feeStream, 10) : 0,
      feeDay: feeDay ? parseInt(feeDay, 10) : 0,
      platform: platform,
      badge: false,
    };

    navigation.navigate({
      name: 'Streamers',
      params: { newStreamer },
      merge: true,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.textBlack} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add streamer</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={{ width: 96, height: 96, borderRadius: 48 }} />
            ) : (
              <View style={styles.iconContainer}>
                <Icon name="videocam-outline" size={48} color="#757575" />
              </View>
            )}
            <TouchableOpacity style={styles.cameraIcon} onPress={handlePickImage}>
              <Icon name="camera" size={14} color={colors.textBlack} />
            </TouchableOpacity>
          </View>
          <Text style={styles.addPhotoText}>Add photo</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Streamer name *</Text>
          <TextInput 
            style={styles.input} 
            value={name} 
            onChangeText={setName} 
            placeholder="Enter streamer name"
            placeholderTextColor="#757575"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Streamer contact number *</Text>
          <TextInput 
            style={styles.input} 
            value={contact} 
            onChangeText={setContact} 
            keyboardType="phone-pad"
            placeholder="Enter contact number"
            placeholderTextColor="#757575"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>City *</Text>
          <TextInput 
            style={styles.input} 
            value={city} 
            onChangeText={setCity} 
            placeholder="Enter city"
            placeholderTextColor="#757575"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Platform *</Text>
          <TextInput 
            style={styles.input} 
            value={platform} 
            onChangeText={setPlatform} 
            placeholder="e.g. YouTube, Twitch, Rooter"
            placeholderTextColor="#757575"
          />
        </View>

        <View style={styles.feesRow}>
          <View style={styles.feeGroup}>
            <Text style={styles.inputLabel}>Fees *</Text>
            <View style={styles.feeInputContainer}>
              <TextInput 
                style={styles.feeInput} 
                keyboardType="numeric" 
                placeholder="Fees" 
                placeholderTextColor="#757575"
                value={feeStream} 
                onChangeText={setFeeStream} 
              />
              <Text style={styles.feeSuffix}>Per stream</Text>
            </View>
          </View>

          <View style={styles.feeGroup}>
            <Text style={styles.inputLabel}>Fees *</Text>
            <View style={styles.feeInputContainer}>
              <TextInput 
                style={styles.feeInput} 
                keyboardType="numeric" 
                placeholder="Fees" 
                placeholderTextColor="#757575"
                value={feeDay} 
                onChangeText={setFeeDay} 
              />
              <Text style={styles.feeSuffix}>per day</Text>
            </View>
          </View>
        </View>

        <View style={styles.experienceContainer}>
          <Text style={styles.inputLabel}>Total experience (approx)</Text>
          <View style={styles.expInputRow}>
            <TextInput 
              style={styles.expInputSquare} 
              keyboardType="numeric" 
              value={exp} 
              onChangeText={setExp}
              maxLength={2}
            />
            <Text style={styles.yrsSuffix}>yrs</Text>
          </View>
        </View>

      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.publishButton} onPress={handlePublish}>
          <Text style={styles.publishText}>Publish</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    backgroundColor: '#E51025',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  headerTitle: {
    color: colors.textBlack,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 35,
    marginTop: 25,
  },
  avatarCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1.5,
    borderColor: '#757575',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#E51025',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    color: '#E51025',
    fontSize: 14,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  inputLabel: {
    fontSize: 13,
    color: '#757575',
    marginBottom: 2,
  },
  input: {
    fontSize: 16,
    color: colors.textBlack,
    paddingVertical: 6,
    paddingHorizontal: 0,
    fontWeight: '500',
  },
  feesRow: {
    flexDirection: 'row',
    marginBottom: 25,
    justifyContent: 'space-between',
  },
  feeGroup: {
    flex: 1,
    marginRight: 10,
  },
  feeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 4,
  },
  feeInput: {
    fontSize: 16,
    color: colors.textBlack,
    paddingVertical: 6,
    paddingHorizontal: 0,
    minWidth: 45,
    fontWeight: '500',
  },
  feeSuffix: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 8,
    flexShrink: 1,
  },
  experienceContainer: {
    marginBottom: 40,
  },
  expInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  expInputSquare: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    width: 65,
    height: 42,
    borderRadius: 4,
    textAlign: 'center',
    marginRight: 12,
    fontSize: 16,
    color: colors.textBlack,
    backgroundColor: '#FAFAFA',
    fontWeight: '500',
  },
  yrsSuffix: {
    fontSize: 14,
    color: '#757575',
    fontStyle: 'italic',
  },
  bottomBar: {
    flexDirection: 'row',
    height: 52,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    color: '#757575',
    fontSize: 16,
    fontWeight: '500',
  },
  publishButton: {
    flex: 1,
    backgroundColor: '#0D9488',
    justifyContent: 'center',
    alignItems: 'center',
  },
  publishText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddStreamerScreen;





