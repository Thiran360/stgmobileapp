const fs = require('fs');
let content = fs.readFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', 'utf8');

// 1. Remove Dummy options
const dummyRegex = /\{\/\* Dummy Options exactly matching screenshot \*\/\}[\s\S]*?\{\/\* Media Links Docs \*\/\}/g;
content = content.replace(dummyRegex, '{/* Media Links Docs */}');

// 2. Remove inline permissions and add members
const permRegex = /\{iAmSuperAdmin && \([\s\S]*?Only Admins can send messages[\s\S]*?<\/View>\r?\n\s*\)\}\r?\n/g;
content = content.replace(permRegex, '');

const addMemRegex = /\{iAmSuperAdmin && \([\s\S]*?Add members[\s\S]*?<\/TouchableOpacity>\r?\n\s*\)\}\r?\n/g;
content = content.replace(addMemRegex, '');

fs.writeFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', content, 'utf8');
console.log('Done');
