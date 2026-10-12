const fs = require('fs');
let content = fs.readFileSync('src/screens/LookingScreen.tsx', 'utf8');

const oldCode =   const handlePostRequest = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        category: activeChip,
        user_id: userProfile?.id || currentUserId,
        device_os: playerDevice,
        fps: playerFps,
        ...formData
      };;

const newCode =   const handlePostRequest = async () => {
    setIsSubmitting(true);
    try {
      let mappedData: any = {};
      
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
      }

      const payload = {
        category: activeChip,
        user_id: userProfile?.id || currentUserId,
        device_os: playerDevice,
        fps: playerFps,
        ...mappedData
      };;

content = content.replace(oldCode, newCode);
fs.writeFileSync('src/screens/LookingScreen.tsx', content, 'utf8');
console.log('Done rewriting payload mapping');
