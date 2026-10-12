const fs = require('fs');
let content = fs.readFileSync('src/screens/LookingScreen.tsx', 'utf8');

const editFunc = 
  const handleEditTrigger = () => {
    if (!currentPost) return;
    
    // Map currentPost fields back to formData based on category
    const initialData: any = {};
    if (currentPost.category === 'Team') {
      initialData.teamName = currentPost.team_name || currentPost.name;
      initialData.description = currentPost.description || currentPost.looking_for_text;
      if (currentPost.players && Array.isArray(currentPost.players)) {
        currentPost.players.forEach((p: any, i: number) => {
          initialData[\player\Name\] = p.name;
          initialData[\player\Role\] = p.role;
        });
      }
    } else if (currentPost.category === 'Players') {
      initialData.playerName = currentPost.player_name || currentPost.name;
      initialData.role = currentPost.role;
      initialData.experience = currentPost.experience;
      initialData.deviceModel = currentPost.device_model;
      initialData.description = currentPost.description || currentPost.looking_for_text;
      setPlayerDevice(currentPost.device_os || '');
      setPlayerFps(currentPost.fps || '');
    } else if (currentPost.category === 'Organisation') {
      initialData.orgName = currentPost.org_name || currentPost.name;
      initialData.established = currentPost.established_year || currentPost.established;
      initialData.description = currentPost.description || currentPost.looking_for_text;
    } else {
      initialData.inGameName = currentPost.player_name || currentPost.name;
      initialData.inGameId = currentPost.in_game_id;
      initialData.achievements = currentPost.achievements || currentPost.looking_for_text;
    }
    
    setFormData(initialData);
    setYouModalVisible(false);
    setPostModalVisible(true);
  };
;

content = content.replace('const handleDeletePost = async () => {', editFunc + '  const handleDeletePost = async () => {');

// Now update the POST request to handle Edit
const originalFetch = const res = await fetch(\\\, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });;

const updatedFetch = 
        let endpoint = require('../api/config').API_ENDPOINTS.LOOKING_POST;
        if (currentPost && currentPost.id) {
          endpoint = \\?post_id=\\;
          payload.post_id = currentPost.id;
        }

        const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });;

content = content.replace(originalFetch, updatedFetch);

// Fix Edit Trigger button
content = content.replace('onPress={() => { /* Edit Trigger */ setYouModalVisible(false); setPostModalVisible(true); }}', 'onPress={handleEditTrigger}');

fs.writeFileSync('src/screens/LookingScreen.tsx', content, 'utf8');
