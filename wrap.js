const fs = require('fs');
let c = fs.readFileSync('src/screens/LookingScreen.tsx', 'utf8');

const s1 = '<View style={{ height: insets.top, backgroundColor: "#E51025", width: "100%" }} />\n        <View style={{ flex: 1, backgroundColor: "#F3F4F6", paddingBottom: insets.bottom }}>';
const r1 = '<View style={{ flex: 1 }}>\n        <View style={{ height: insets.top, backgroundColor: "#E51025", width: "100%" }} />\n        <View style={{ flex: 1, backgroundColor: "#F3F4F6", paddingBottom: insets.bottom }}>';

c = c.replace(s1, r1);
c = c.replace(s1.replace(/\n/g, '\r\n'), r1.replace(/\n/g, '\r\n'));
c = c.replace(s1, r1);
c = c.replace(s1.replace(/\n/g, '\r\n'), r1.replace(/\n/g, '\r\n'));

const s2 = '</KeyboardAvoidingView>\n        </View>\n        </Modal>';
const r2 = '</KeyboardAvoidingView>\n        </View>\n        </View>\n        </Modal>';
c = c.replace(s2, r2);
c = c.replace(s2.replace(/\n/g, '\r\n'), r2.replace(/\n/g, '\r\n'));

const s3 = '</View>\n          </View>\n        </Modal>';
const r3 = '</View>\n          </View>\n        </View>\n        </Modal>';
c = c.replace(s3, r3);
c = c.replace(s3.replace(/\n/g, '\r\n'), r3.replace(/\n/g, '\r\n'));

fs.writeFileSync('src/screens/LookingScreen.tsx', c, 'utf8');
console.log('Fixed wrapper');
