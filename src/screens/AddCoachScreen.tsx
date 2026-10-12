import React, { useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';

const AddCoachScreen = () => {
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
  const [feeMatch, setFeeMatch] = useState('');

  const [feeDay, setFeeDay] = useState('');

  const [exp, setExp] = useState('');


  const handlePublish = () => {
    const newCoach = {
      id: Date.now(),
      name: name || 'New Coach',
      avatar: 'https://i.pravatar.cc/150?img=13',
      matches: 0,
      points: 0,
      feeMatch: feeMatch || '0',
      feeDay: feeDay || '0',
      badge: false,
    };

    navigation.navigate({
      name: 'Coaches',
      params: { newCoach },
      merge: true,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.textBlack} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add coach</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Icon name="person-outline" size={60} color="#757575" />
            <TouchableOpacity style={styles.cameraIcon}>
              <Icon name="camera" size={16} color={colors.textBlack} />
            </TouchableOpacity>
          </View>
          <Text style={styles.addPhotoText}>Add photo</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Coach name *</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Coach contact number *</Text>
          <TextInput style={styles.input} value={contact} onChangeText={setContact} keyboardType="phone-pad" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>City *</Text>
          <TextInput style={styles.input} value={city} onChangeText={setCity} />
        </View>

        <View style={styles.feesRow}>
          <View style={styles.feeGroup}>
            <Text style={styles.inputLabel}>Fees *</Text>
            <View style={styles.feeInputRow}>
              <TextInput style={styles.feeInput} keyboardType="numeric" placeholder="600" placeholderTextColor="#757575" value={feeMatch} onChangeText={setFeeMatch} />
              <Text style={styles.feeSubLabel}>Per match</Text>
            </View>
          </View>
          <View style={styles.feeGroup}>
            <Text style={styles.inputLabel}>Fees *</Text>
            <View style={styles.feeInputRow}>
              <TextInput style={styles.feeInput} keyboardType="numeric" placeholder="1800" placeholderTextColor="#757575" value={feeDay} onChangeText={setFeeDay} />
              <Text style={styles.feeSubLabel}>per day</Text>
            </View>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Total coaching experience (approx)</Text>
          <View style={styles.expRow}>
            <TextInput style={styles.expInput} keyboardType="numeric" value={exp} onChangeText={setExp} />
            <Text style={styles.yrsText}>yrs</Text>
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
    padding: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#E51025',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    color: '#E51025',
    fontSize: 14,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  inputLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 5,
  },
  input: {
    fontSize: 16,
    color: colors.textBlack,
    paddingVertical: 5,
    paddingHorizontal: 0,
  },
  feesRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  feeGroup: {
    flex: 1,
    marginRight: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 5,
  },
  feeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  feeInput: {
    fontSize: 16,
    color: colors.textBlack,
    paddingVertical: 0,
    paddingHorizontal: 0,
    minWidth: 40,
  },
  feeSubLabel: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 10,
  },
  expRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  expInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    width: 60,
    height: 40,
    borderRadius: 4,
    textAlign: 'center',
    marginRight: 10,
    fontSize: 16,
    color: colors.textBlack,
  },
  yrsText: {
    fontSize: 14,
    color: '#757575',
    fontStyle: 'italic',
  },
  bottomBar: {
    flexDirection: 'row',
    height: 50,
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
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
  },
  publishText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AddCoachScreen;






