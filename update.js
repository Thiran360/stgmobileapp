const fs = require('fs');
let content = fs.readFileSync('src/screens/TournamentFlyersScreen.tsx', 'utf8');

const oldLine1 = `{ id: 'cs_1', category: 'Coming Soon', image: require('../assets/images/flyers/bgmi_1.jpg')`;
const newLine1 = `{ id: 'cs_1', category: 'Coming Soon', image: require('../assets/images/flyers/custom_bgmi_1.jpg')`;

const oldLine2 = `{ id: 'cs_2', category: 'Coming Soon', image: require('../assets/images/flyers/bgmi_2.jpg')`;
const newLine2 = `{ id: 'cs_2', category: 'Coming Soon', image: require('../assets/images/flyers/custom_bgmi_2.jpg')`;

content = content.replace(oldLine1, newLine1).replace(oldLine2, newLine2);
fs.writeFileSync('src/screens/TournamentFlyersScreen.tsx', content, 'utf8');
console.log('Update done');
