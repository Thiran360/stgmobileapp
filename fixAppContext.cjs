const fs = require('fs');
let c = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

const target = `  const updateUserProfile = async (profileData: Partial<UserProfile>) => {
    if (userProfile) {
      const updatedProfile = { ...userProfile, ...profileData } as UserProfile;
      setUserProfileState(updatedProfile);
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    }
  };`;

const replacement = `  const updateUserProfile = async (profileData: Partial<UserProfile>) => {
    if (userProfile) {
      const updatedProfile = { ...userProfile, ...profileData } as UserProfile;
      
      try {
        await apiService.updateProfile(updatedProfile);
      } catch (e) {
        console.log('API update profile error:', e);
      }
      
      setUserProfileState(updatedProfile);
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    }
  };`;

if (c.includes("setUserProfileState(updatedProfile);")) {
  c = c.replace(target, replacement);
  fs.writeFileSync('src/context/AppContext.tsx', c, 'utf8');
  console.log("Success in AppContext!");
} else {
  console.log("Target not found.");
}
