const fs = require('fs');
let content = fs.readFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', 'utf8');

content = content.replace(
  `Messages and calls are end-to-end{"\n"}encrypted.</Text>`,
  `Messages and calls are end-to-end{"\\n"}encrypted.</Text>`
);

// Fallback if the literal newline is \r\n
content = content.replace(
  `Messages and calls are end-to-end{"\r\n"}encrypted.</Text>`,
  `Messages and calls are end-to-end{"\\n"}encrypted.</Text>`
);

fs.writeFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', content, 'utf8');
console.log('Fixed unterminated string constant');
