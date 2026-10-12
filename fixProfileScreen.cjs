const fs = require('fs');
let c = fs.readFileSync('src/screens/PlayerDetailsScreen.tsx', 'utf8');

const replacement = `
    const profile = { 
      id: userId, 
      username, 
      fullName, 
      liveLocation, 
      gender, 
      dateOfBirth, 
      mobileNumber, 
      profilePicture, 
      email,
      followers: 120, // Default mock
      following: 55,  // Default mock
      joinedDate: new Date().toISOString()
    };

    try {
      const response = await apiService.createProfile(profile);
      setLoading(false);
      
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      await loginUser(userId);
      navigation.replace('MainTabs', { userName: fullName });
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to create profile. Please try again.');
    }
`;

// Replace everything inside handleSave from `const profile = {` to the end of the try block (or wherever it ends).
// Let's use regex or split.

const oldSaveLogic = `const profile = { 
      id: userId, 
      username, 
      fullName, 
      liveLocation, 
      gender, 
      dateOfBirth, 
      mobileNumber, 
      profilePicture, 
      email,
      followers: 120, // Default mock
      following: 55,  // Default mock
      joinedDate: new Date().toISOString()
    };

    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      await loginUser(userId);
      navigation.replace('MainTabs', { userName: fullName });
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile details.');
    } finally {
      setLoading(false);
    }`;

c = c.replace(oldSaveLogic, replacement);

// We need to import apiService in PlayerDetailsScreen!
if (!c.includes("import { apiService }")) {
    c = c.replace(
        "import { AppContext } from '../context/AppContext';", 
        "import { AppContext } from '../context/AppContext';\nimport { apiService } from '../api/index';"
    );
}

fs.writeFileSync('src/screens/PlayerDetailsScreen.tsx', c, 'utf8');
console.log('Fixed PlayerDetailsScreen');
