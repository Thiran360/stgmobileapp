const fs = require('fs');
let content = fs.readFileSync('src/screens/ChatScreen.tsx', 'utf8');

if (!content.includes('import { apiService }')) {
    content = content.replace(
        "import { AppContext } from '../context/AppContext';",
        "import { AppContext } from '../context/AppContext';\nimport { apiService } from '../api/index';"
    );
}

// Group Info and Messages Fetch
const chatUseEffect = `  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const msgs = await apiService.getChatMessages(userId);
        if (msgs && Array.isArray(msgs)) setMessages(msgs);
        
        if (isGroup) {
          const info = await apiService.getGroupInfo(userId);
          if (info) {
            if (info.name) setCurrentGroupName(info.name);
            if (info.description) setGroupDescription(info.description);
            if (info.logo) setGroupLogo(info.logo);
            if (info.members) setGroupMembers(info.members);
          }
        }
      } catch(e) {
        console.log('API error fetching chat info:', e);
      }
    };
    fetchChatData();
  }, [userId, isGroup]);`;

if (!content.includes('fetchChatData')) {
    content = content.replace(
        "const iAmSuperAdmin = myRole === 'super_admin';",
        "const iAmSuperAdmin = myRole === 'super_admin';\n\n" + chatUseEffect
    );
}

// Group Update Name/Desc
content = content.replace(
    "setCurrentGroupName(newName);",
    "setCurrentGroupName(newName);\n      apiService.updateGroup(userId, { name: newName }).catch(e=>console.log(e));"
);
content = content.replace(
    "setGroupDescription(newDesc);",
    "setGroupDescription(newDesc);\n      apiService.updateGroup(userId, { description: newDesc }).catch(e=>console.log(e));"
);

// Group Update Member Role
content = content.replace(
    "setGroupMembers(groupMembers.map(m => m.id === id ? { ...m, role: 'admin' } : m));",
    "setGroupMembers(groupMembers.map(m => m.id === id ? { ...m, role: 'admin' } : m));\n          apiService.updateGroupMember(userId, id, { role: 'admin' }).catch(e=>console.log(e));"
);
content = content.replace(
    "setGroupMembers(groupMembers.map(m => m.id === id ? { ...m, role: 'member' } : m));",
    "setGroupMembers(groupMembers.map(m => m.id === id ? { ...m, role: 'member' } : m));\n          apiService.updateGroupMember(userId, id, { role: 'member' }).catch(e=>console.log(e));"
);
content = content.replace(
    "setGroupMembers(groupMembers.filter(m => m.id !== id));",
    "setGroupMembers(groupMembers.filter(m => m.id !== id));\n          apiService.updateGroupMember(userId, id, { action: 'remove' }).catch(e=>console.log(e));"
);

fs.writeFileSync('src/screens/ChatScreen.tsx', content, 'utf8');
console.log('ChatScreen updated with API endpoints');
