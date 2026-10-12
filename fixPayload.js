const fs = require('fs');
let content = fs.readFileSync('src/screens/LookingScreen.tsx', 'utf8');

const oldCode =       let mappedData: any = {};
      
      if (activeChip === 'Team') {
        mappedData = {
          name: formData.teamName || '',
          looking_for_text: formData.description || '',
          players: [
            { name: formData.player1Name, role: formData.player1Role },
            { name: formData.player2Name, role: formData.player2Role },
            { name: formData.player3Name, role: formData.player3Role },
            { name: formData.player4Name, role: formData.player4Role },
            { name: formData.player5Name, role: formData.player5Role },
            { name: formData.player6Name, role: formData.player6Role },
          ].filter(p => p.name || p.role)
        };
      } else if (activeChip === 'Players') {
        mappedData = {
          name: formData.playerName || '',
          role: formData.role || '',
          experience: formData.experience || '',
          looking_for_text: formData.description || '',
          device_model: formData.deviceModel || ''
        };
      } else if (activeChip === 'Organisation') {
        mappedData = {
          name: formData.orgName || '',
          established: formData.established || '',
          looking_for_text: formData.description || ''
        };
      } else {
        mappedData = {
          name: formData.inGameName || '',
          in_game_id: formData.inGameId || '',
          looking_for_text: formData.achievements || ''
        };
      };

const newCode =       let mappedData: any = {};
      
      if (activeChip === 'Team') {
        mappedData = {
          team_name: formData.teamName || '',
          description: formData.description || '',
          players: [
            { name: formData.player1Name, role: formData.player1Role },
            { name: formData.player2Name, role: formData.player2Role },
            { name: formData.player3Name, role: formData.player3Role },
            { name: formData.player4Name, role: formData.player4Role },
            { name: formData.player5Name, role: formData.player5Role },
            { name: formData.player6Name, role: formData.player6Role },
          ].filter(p => p.name || p.role)
        };
      } else if (activeChip === 'Players') {
        mappedData = {
          player_name: formData.playerName || '',
          role: formData.role || '',
          experience: formData.experience || '',
          description: formData.description || '',
          device_model: formData.deviceModel || ''
        };
      } else if (activeChip === 'Organisation') {
        mappedData = {
          org_name: formData.orgName || '',
          established_year: formData.established || '',
          description: formData.description || ''
        };
      } else {
        mappedData = {
          player_name: formData.inGameName || '',
          in_game_id: formData.inGameId || '',
          achievements: formData.achievements || ''
        };
      };

content = content.replace(oldCode, newCode);
fs.writeFileSync('src/screens/LookingScreen.tsx', content, 'utf8');
