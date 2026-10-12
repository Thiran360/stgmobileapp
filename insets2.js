const fs = require('fs');
let c = fs.readFileSync('src/screens/LookingScreen.tsx', 'utf8');

c = c.replace(
  /<SafeAreaView style={{ flex: 0, backgroundColor: "#E51025" }} edges={\["top"\]} \/>\r?\n\s*<SafeAreaView style={{ flex: 1, backgroundColor: "#F3F4F6" }} edges={\["bottom", "left", "right"\]}>/,
  '<View style={{ flex: 1, backgroundColor: "#F3F4F6", paddingTop: insets.top, paddingBottom: insets.bottom }}>'
);
c = c.replace(
  '</View>\r\n          </SafeAreaView>\r\n        </Modal>',
  '</View>\r\n          </View>\r\n        </Modal>'
);
c = c.replace(
  '</View>\n          </SafeAreaView>\n        </Modal>',
  '</View>\n          </View>\n        </Modal>'
);

fs.writeFileSync('src/screens/LookingScreen.tsx', c, 'utf8');
console.log('You Modal Fixed');
