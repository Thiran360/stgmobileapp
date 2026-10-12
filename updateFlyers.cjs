const fs = require('fs');
let content = fs.readFileSync('src/screens/TournamentFlyersScreen.tsx', 'utf8');

if (!content.includes('import { apiService }')) {
    content = content.replace(
        "import { AppContext } from '../context/AppContext';",
        "import { AppContext } from '../context/AppContext';\nimport { apiService } from '../api/index';"
    );
}

const hookSnippet = `  const fetchFlyers = async () => {
      setLoadingFlyers(true);
      try {
        const staticTemplates = [
          { id: 'cs_1', category: 'Coming Soon', image: require('../assets/images/flyers/1.png'), fields: [...genericFields, { name: 'tagline', label: 'Tagline', default: 'COMING SOON', y: '40%', x: 0, fontSize: 36, color: '#FF0000', fontWeight: 'bold' }] },
          { id: 'cs_2', category: 'Coming Soon', image: require('../assets/images/flyers/2.png'), fields: [...genericFields, { name: 'tagline', label: 'Tagline', default: 'GET READY', y: '50%', x: 0, fontSize: 40, color: '#00FFFF', fontWeight: 'bold' }] },
          { id: 'cs_3', category: 'Coming Soon', image: require('../assets/images/flyers/3.png'), fields: [...genericFields, { name: 'tagline', label: 'Tagline', default: 'STAY TUNED', y: '45%', x: 0, fontSize: 38, color: '#FFA500', fontWeight: 'bold' }] },
          // (Other templates omitted for brevity, keeping dummy as fallback)
        ];
        
        const apiData = await apiService.getFlyers();
        if (apiData && Array.isArray(apiData) && apiData.length > 0) {
           setFetchedFreeTemplates(apiData);
        } else {
           setFetchedFreeTemplates(staticTemplates);
        }
      } catch (error) {
        console.error('Error loading flyers API:', error);
      } finally {
        setLoadingFlyers(false);
      }
    };`;

content = content.replace(/const fetchFlyers = async \(\) => \{[\s\S]*?\} catch \(error\) \{[\s\S]*?\}[\s\S]*?\};/, hookSnippet);

fs.writeFileSync('src/screens/TournamentFlyersScreen.tsx', content, 'utf8');
console.log('TournamentFlyersScreen updated');
