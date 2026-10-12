const fs = require('fs');
let c = fs.readFileSync('src/screens/LookingScreen.tsx', 'utf8');
c = c.replace(/<View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>/g, '<SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }} edges={["top", "bottom"]}>');
c = c.replace(/<\/View>\s*<\/Modal>\s*\{\/\* You Modal \*\/\}/g, '</SafeAreaView>\n        </Modal>\n\n        {/* You Modal */}');
c = c.replace(/<\/View>\s*<\/Modal>\s*\{\/\* Dropdown Modal/g, '</SafeAreaView>\n        </Modal>\n\n        {/* Dropdown Modal');
c = c.replace(/<\/View>\r\n        <\/Modal>\r\n\r\n        \{\/\* You Modal \*\/\}/g, '</SafeAreaView>\r\n        </Modal>\r\n\r\n        {/* You Modal */}');
c = c.replace(/<\/View>\r\n        <\/Modal>\r\n\r\n        \{\/\* Dropdown Modal/g, '</SafeAreaView>\r\n        </Modal>\r\n\r\n        {/* Dropdown Modal');
fs.writeFileSync('src/screens/LookingScreen.tsx', c, 'utf8');
console.log('Done');
