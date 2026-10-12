const fs = require('fs');
let c = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

const target = `  const fetchUserProfile = async (userId: string) => {
      try {
        const profileStr = await AsyncStorage.getItem('userProfile');
        if (profileStr) {
          const profileData = JSON.parse(profileStr);
          setUserProfileState(profileData);
        }
      } catch (error) {
        console.log('Error fetching user profile:', error);
      }
  };`;

const replacement = `  const fetchUserProfile = async (userId: string) => {
      try {
        // Try to fetch from API
        const apiData = await apiService.getProfile(userId).catch(() => null);
        if (apiData && !apiData.error) {
          setUserProfileState(apiData);
          await AsyncStorage.setItem('userProfile', JSON.stringify(apiData));
          return;
        }

        // Fallback to local storage
        const profileStr = await AsyncStorage.getItem('userProfile');
        if (profileStr) {
          const profileData = JSON.parse(profileStr);
          setUserProfileState(profileData);
        }
      } catch (error) {
        console.log('Error fetching user profile:', error);
      }
  };`;

if (c.includes("const fetchUserProfile")) {
  c = c.replace(target, replacement);
  fs.writeFileSync('src/context/AppContext.tsx', c, 'utf8');
  console.log("Success in fetchUserProfile!");
} else {
  console.log("Target not found.");
}
