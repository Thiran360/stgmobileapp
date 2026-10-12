const fs = require('fs');
let content = fs.readFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', 'utf8');

const targetStr = `          </ScrollView>\r\n            </View>\r\n          )}\r\n          {/* Image Viewer Modal */}`;
const targetStr2 = `          </ScrollView>\n            </View>\n          )}\n          {/* Image Viewer Modal */}`;
const replacement = `          </ScrollView>\r\n          {/* Image Viewer Modal */}`;

content = content.replace(targetStr, replacement);
content = content.replace(targetStr2, replacement.replace(/\r\n/g, '\n'));

fs.writeFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', content, 'utf8');
console.log('Fixed syntax error');
