const fs = require('fs');
let content = fs.readFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', 'utf8');

content = content.replace(
  "const iAmAdmin = myRole === 'admin' || myRole === 'super_admin';",
  "const iAmAdmin = myRole === 'admin' || myRole === 'super_admin';\n  const iAmSuperAdmin = myRole === 'super_admin';"
);

// 1. Group Name edit
content = content.replace(
  "{isGroup && iAmAdmin ? (",
  "{isGroup && iAmSuperAdmin ? ("
);
content = content.replace(
  "{isGroup && iAmAdmin && (",
  "{isGroup && iAmSuperAdmin && ("
);

// 2. Group permissions toggle
content = content.replace(
  "{iAmAdmin && (\n                  <View style={{ backgroundColor: '#FFF', marginBottom: 10, elevation: 1 }}>",
  "{iAmSuperAdmin && (\n                  <View style={{ backgroundColor: '#FFF', marginBottom: 10, elevation: 1 }}>"
);

// 3. Make/Remove Admins and Remove Member
content = content.replace(
  "{iAmAdmin && (member.id !== '1' && member.id !== 'me') && member.role !== 'super_admin' && (",
  "{iAmSuperAdmin && (member.id !== '1' && member.id !== 'me') && member.role !== 'super_admin' && ("
);

fs.writeFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', content, 'utf8');
console.log('Updated super admin permissions');
