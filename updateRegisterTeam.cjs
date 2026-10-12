const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

const regex = /const registerTeam = \(data: TeamRegistrationData\) => \{[\s\S]*?setTeamRegistrations\(prev => \[data, \.\.\.prev\]\);[\s\S]*?\};/;
const replacement = `const registerTeam = async (data: TeamRegistrationData) => {
    // API Call
    try {
        await apiService.registerTeam(data.tournamentId, data);
    } catch (e) {
        console.log('Failed to post register team API', e);
    }
    // Update local state anyway
    setTeamRegistrations(prev => [data, ...prev]);
  };`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/context/AppContext.tsx', content, 'utf8');
console.log('registerTeam updated in AppContext');
