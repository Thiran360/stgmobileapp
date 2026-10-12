const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

const regex = /const fetchTournaments = async \(\) => {[\s\S]*?console\.log\('Error fetching tournaments:', error\);\s*}\s*};/m;

const newStr = const fetchTournaments = async () => {
    try {
      const res = await apiService.getTournaments().catch(() => null);
      let apiData = res;
      if (res && res.status === "success" && res.data && Array.isArray(res.data.tournaments_near_you)) {
        apiData = res.data.tournaments_near_you;
      }
      
      if (apiData && Array.isArray(apiData)) {
          setGlobalTournaments(apiData);
          await AsyncStorage.setItem("tournaments", JSON.stringify(apiData));
      } else {
          const stored = await AsyncStorage.getItem("tournaments");
          if (stored) setGlobalTournaments(JSON.parse(stored));
      }
    } catch (error) {
      console.log("Error fetching tournaments:", error);
    }
  };;

content = content.replace(regex, newStr);
fs.writeFileSync('src/context/AppContext.tsx', content, 'utf8');
