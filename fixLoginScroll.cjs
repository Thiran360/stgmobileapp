const fs = require('fs');
let c = fs.readFileSync('src/screens/LoginScreen.tsx', 'utf8');

if (!c.includes('KeyboardAwareScrollView')) {
    // 1. Import it
    c = c.replace(
        "import {\n  View,", 
        "import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';\nimport {\n  View,"
    );
    
    // 2. Wrap content
    c = c.replace(
        "<View style={styles.content}>",
        "<KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps=\"handled\">\n      <View style={styles.content}>"
    );
    
    c = c.replace(
        "</View>\n    </SafeAreaView>",
        "</View>\n      </KeyboardAwareScrollView>\n    </SafeAreaView>"
    );
    
    fs.writeFileSync('src/screens/LoginScreen.tsx', c, 'utf8');
    console.log("Wrapped with KeyboardAwareScrollView!");
} else {
    console.log("Already wrapped.");
}
