const fs = require('fs');
let c = fs.readFileSync('src/screens/EditProfileScreen.tsx', 'utf8');

if (!c.includes('import DateTimePicker')) {
  c = c.replace(
    "import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';",
    "import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';\nimport DateTimePicker from '@react-native-community/datetimepicker';\nimport { Platform, Modal } from 'react-native';"
  );
}

// Add state for date picker and gender
const stateReplacement = `
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
`;
c = c.replace("const [dob, setDob] = useState(userProfile.dateOfBirth || '');", stateReplacement);

// Add gender to save
c = c.replace("dateOfBirth: dob,", "dateOfBirth: dob,\n      gender,");

// Update UI
const uiTarget = `<View style={styles.inputGroup}>
          <Text style={styles.label}>Date of Birth (DD/MM/YYYY)</Text>
          <TextInput style={styles.input} value={dob} onChangeText={setDob} placeholderTextColor="#666" />
        </View>`;

const uiReplacement = `
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
`;

if (c.includes("Date of Birth (DD/MM/YYYY)")) {
    c = c.replace(uiTarget, uiReplacement);
}

// Add Gender Modal before final </SafeAreaView>
const modalCode = `
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
`;
c = c.replace("</SafeAreaView>", modalCode);

fs.writeFileSync('src/screens/EditProfileScreen.tsx', c, 'utf8');
console.log('EditProfileScreen updated!');
