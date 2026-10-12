const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

if (!content.includes("import { apiService }")) {
    content = content.replace(
        "import AsyncStorage from '@react-native-async-storage/async-storage';",
        "import AsyncStorage from '@react-native-async-storage/async-storage';\nimport { apiService } from '../api/index';"
    );
}

const fetchTournamentsRegex = /const fetchTournaments = async \(\) => \{[\s\S]*?catch \(error\) \{[\s\S]*?\}[\s\S]*?\};/;
const newFetchTournaments = `const fetchTournaments = async () => {
    try {
      const apiData = await apiService.getTournaments().catch(() => null);
      if (apiData && Array.isArray(apiData)) {
          setGlobalTournaments(apiData);
          await AsyncStorage.setItem('tournaments', JSON.stringify(apiData));
      } else {
          const stored = await AsyncStorage.getItem('tournaments');
          if (stored) setGlobalTournaments(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Error fetching tournaments:', error);
    }
  };

  const fetchGlobalData = async () => {
    try {
      const homeData = await apiService.getHomeData().catch(() => null);
      const flyersData = await apiService.getFlyers().catch(() => null);
      if (flyersData && Array.isArray(flyersData)) setFlyers(flyersData);
      
      const inboxData = await apiService.getInbox().catch(() => null);
      if (inboxData && Array.isArray(inboxData)) setChats(inboxData);
    } catch (e) {
      console.log('Error fetching global API data:', e);
    }
  };`;

content = content.replace(fetchTournamentsRegex, newFetchTournaments);

// Add fetchGlobalData to loadInitialData
content = content.replace(
    "await fetchTournaments();\n      setIsAppLoading(false);",
    "await fetchTournaments();\n      await fetchGlobalData();\n      setIsAppLoading(false);"
);

fs.writeFileSync('src/context/AppContext.tsx', content, 'utf8');
console.log('AppContext updated with API calls');
