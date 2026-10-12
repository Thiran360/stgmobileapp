const fs = require('fs');
let content = fs.readFileSync('src/screens/TeamRegistrationScreen.tsx', 'utf8');

// Remove Linking.openURL
content = content.replace(/Linking\.openURL\('.*?'\);\n?/g, '');

// Change whatsapp icon
content = content.replace(/"logo-whatsapp"/g, '"chatbubbles-outline"');

// Fix the error text from 'WhatsApp group' to 'Tournament group'
content = content.replace(/'Please join the WhatsApp group first\.'/g, "'Please join the Tournament group first.'");

fs.writeFileSync('src/screens/TeamRegistrationScreen.tsx', content, 'utf8');
console.log('Fixed Group Link action');
