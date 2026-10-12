const fs = require('fs');
let content = fs.readFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', 'utf8');

// Replace backgrounds in Modal ScrollView from #FFF to #0B141B
content = content.replace(/backgroundColor: '#FFF'/g, "backgroundColor: '#0B141B'");
content = content.replace(/backgroundColor: '#FFFFFF'/g, "backgroundColor: '#0B141B'");

// Fix text colors from dark grey to Whatsapp white (#E9EDEF) or grey (#8696A0)
content = content.replace(/color: '#1F2937'/g, "color: '#E9EDEF'");
content = content.replace(/color: '#111827'/g, "color: '#E9EDEF'");
content = content.replace(/color: '#6B7280'/g, "color: '#8696A0'");
content = content.replace(/color: '#9CA3AF'/g, "color: '#8696A0'");

// Fix borders
content = content.replace(/borderBottomColor: '#F3F4F6'/g, "borderBottomColor: '#202C33'");
content = content.replace(/borderBottomColor: '#E5E7EB'/g, "borderBottomColor: '#202C33'");

// Ensure the Edit modals are legible by making their backgrounds solid dark grey
content = content.replace(/backgroundColor: '#0B141B', width: '80%'/g, "backgroundColor: '#233138', width: '80%'");
content = content.replace(/backgroundColor: '#0B141B', width: '85%'/g, "backgroundColor: '#233138', width: '85%'");

fs.writeFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', content, 'utf8');
console.log('Fixed theme colors');
