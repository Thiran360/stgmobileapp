const fs = require('fs');
let content = fs.readFileSync('src/screens/LookingScreen.tsx', 'utf8');

const deleteFunc =   const handleDeletePost = async () => {
    if (!currentPost) return;
    try {
      const payload = {
        post_id: currentPost.id,
        user_id: userProfile?.id || currentUserId
      };
      const res = await fetch(require('../api/config').API_ENDPOINTS.LOOKING_DELETE, {
        method: 'POST', // Try POST first as Django often expects POST for /delete/ routes
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => null);
      if (data?.success || res.ok) {
        setYouModalVisible(false);
        fetchLookingData();
      } else {
        console.log("Delete failed", data);
      }
    } catch (e) {
      console.log('Error deleting post:', e);
    }
  };
;

content = content.replace('const handlePostRequest = async () => {', deleteFunc + '\n  const handlePostRequest = async () => {');
fs.writeFileSync('src/screens/LookingScreen.tsx', content, 'utf8');
