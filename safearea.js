const fs = require('fs');
let c = fs.readFileSync('src/screens/LookingScreen.tsx', 'utf8');
const search = '<SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }} edges={["top", "bottom"]}>';
const rep = '<SafeAreaView style={{ flex: 0, backgroundColor: "#E51025" }} edges={["top"]} />\n          <SafeAreaView style={{ flex: 1, backgroundColor: "#F3F4F6" }} edges={["bottom", "left", "right"]}>';
c = c.replace(search, rep);
c = c.replace(search, rep);

const search2 = '</KeyboardAvoidingView>\n          </SafeAreaView>\n        </Modal>';
const rep2 = '</KeyboardAvoidingView>\n          </SafeAreaView>\n          </SafeAreaView>\n        </Modal>';
c = c.replace(search2, rep2);

const search3 = '</KeyboardAvoidingView>\r\n          </SafeAreaView>\r\n        </Modal>';
const rep3 = '</KeyboardAvoidingView>\r\n          </SafeAreaView>\r\n          </SafeAreaView>\r\n        </Modal>';
c = c.replace(search3, rep3);

const search4 = '</View>\n          </SafeAreaView>\n        </Modal>';
const rep4 = '</View>\n          </SafeAreaView>\n          </SafeAreaView>\n        </Modal>';
c = c.replace(search4, rep4);

const search5 = '</View>\r\n          </SafeAreaView>\r\n        </Modal>';
const rep5 = '</View>\r\n          </SafeAreaView>\r\n          </SafeAreaView>\r\n        </Modal>';
c = c.replace(search5, rep5);

fs.writeFileSync('src/screens/LookingScreen.tsx', c, 'utf8');
