const fs = require('fs');
let content = fs.readFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', 'utf8');

// Replace WhatsApp Dark Theme colors with normal App colors
content = content.replace(/#0B141B/g, '#FFFFFF'); // Main header bg
content = content.replace(/#111B21/g, '#FFFFFF'); // Main bg
content = content.replace(/#202C33/g, '#F4F6F8'); // Input bg, borders, msgOther
content = content.replace(/#233138/g, '#FFFFFF'); // Modal bg
content = content.replace(/#E9EDEF/g, '#111827'); // Primary text
content = content.replace(/#8696A0/g, '#6B7280'); // Secondary text

fs.writeFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', content, 'utf8');
console.log('Reverted WhatsApp dark colors to normal');
