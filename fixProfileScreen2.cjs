const fs = require('fs');
let c = fs.readFileSync('src/screens/PlayerDetailsScreen.tsx', 'utf8');

const target = `    const profile = { 
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
      bio: 'Ready to conquer the esports world!',
      socialLinks: {}
    };
    try {
      await setUserProfile(profile);
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      await loginUser(userId);
      navigation.replace('MainTabs', { userName: fullName });
    } catch (e) {
      Alert.alert('Error', 'Failed to save profile locally.');
    }
    setLoading(false);
  };`;

const replacement = `    const profile = { 
      id: userId, 
      username, 
      fullName, 
      liveLocation, 
      gender, 
      dateOfBirth, 
      mobileNumber, 
      profilePicture, 
      email,
      followers: 120,
      following: 55,
      bio: 'Ready to conquer the esports world!',
      socialLinks: {}
    };

    try {
      // API call
      await apiService.createProfile(profile);
      
      await setUserProfile(profile);
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      await loginUser(userId);
      navigation.replace('MainTabs', { userName: fullName });
    } catch (e) {
      Alert.alert('Error', 'Failed to save profile. Make sure endpoint exists.');
    } finally {
      setLoading(false);
    }
  };`;

if (c.includes("bio: 'Ready to conquer the esports world!'")) {
  c = c.replace(target, replacement);
  
  if (!c.includes("import { apiService }")) {
      c = c.replace(
          "import { AppContext } from '../context/AppContext';", 
          "import { AppContext } from '../context/AppContext';\nimport { apiService } from '../api/index';"
      );
  }
  
  fs.writeFileSync('src/screens/PlayerDetailsScreen.tsx', c, 'utf8');
  console.log("Success!");
} else {
  console.log("Not found.");
}
