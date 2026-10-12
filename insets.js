const fs = require('fs');
let c = fs.readFileSync('src/screens/LookingScreen.tsx', 'utf8');

c = c.replace(
  "import { SafeAreaView } from 'react-native-safe-area-context';",
  "import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';"
);

c = c.replace(
  "const LookingScreen = () => {",
  "const LookingScreen = () => {\n  const insets = useSafeAreaInsets();"
);

// Post and You Modal wrappers
const search1 = '<SafeAreaView style={{ flex: 0, backgroundColor: "#E51025" }} edges={["top"]} />\n          <SafeAreaView style={{ flex: 1, backgroundColor: "#F3F4F6" }} edges={["bottom", "left", "right"]}>';
const rep = '<View style={{ flex: 1, backgroundColor: "#F3F4F6", paddingTop: insets.top, paddingBottom: insets.bottom }}>';
c = c.replace(search1, rep);
c = c.replace(search1.replace(/\n/g, '\r\n'), rep);

const search2 = '<SafeAreaView style={{ flex: 0, backgroundColor: "#E51025" }} edges={["top"]} />\n            <SafeAreaView style={{ flex: 1, backgroundColor: "#F3F4F6" }} edges={["bottom", "left", "right"]}>';
c = c.replace(search2, rep);
c = c.replace(search2.replace(/\n/g, '\r\n'), rep);

const search3 = '</KeyboardAvoidingView>\n        </SafeAreaView>\n        </Modal>';
const rep3 = '</KeyboardAvoidingView>\n        </View>\n        </Modal>';
c = c.replace(search3, rep3);
c = c.replace(search3.replace(/\n/g, '\r\n'), rep3.replace(/\n/g, '\r\n'));

const search4 = '</View>\n          </SafeAreaView>\n        </Modal>';
const rep4 = '</View>\n          </View>\n        </Modal>';
c = c.replace(search4, rep4);
c = c.replace(search4.replace(/\n/g, '\r\n'), rep4.replace(/\n/g, '\r\n'));

fs.writeFileSync('src/screens/LookingScreen.tsx', c, 'utf8');
console.log('Done');
