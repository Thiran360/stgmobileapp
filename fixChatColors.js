const fs = require('fs');
let content = fs.readFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', 'utf8');

// Replace all WhatsApp Green variants with Primary Red (#E51025)
content = content.replace(/#10B981/g, '#E51025');
content = content.replace(/#005C4B/g, '#E51025');

fs.writeFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', content, 'utf8');
console.log('Replaced WhatsApp green with Primary Red');
