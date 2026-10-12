const fs = require('fs');
let content = fs.readFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', 'utf8');

// Fix Chat Input Wrapper background
content = content.replace("backgroundColor: '#F4F6F8'", "backgroundColor: '#0B141B'");
content = content.replace("backgroundColor: '#0B141B', borderRadius: 24,", "backgroundColor: '#202C33', borderRadius: 24,");

// Fix Main Chat background
content = content.replace("backgroundColor: '#E5E5E5'", "backgroundColor: '#0B141B'");
content = content.replace("backgroundColor: '#E51025'", "backgroundColor: '#005C4B'"); // Whatsapp green for 'me' bubble
content = content.replace("messageOther: { alignSelf: 'flex-start', backgroundColor: '#0B141B'", "messageOther: { alignSelf: 'flex-start', backgroundColor: '#202C33'");

// Fix Header of Main Chat
content = content.replace("backgroundColor: '#F4F6F8'", "backgroundColor: '#0B141B'");

fs.writeFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', content, 'utf8');
console.log('Fixed Main Chat Dark Mode');
