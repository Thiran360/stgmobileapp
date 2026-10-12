const fs = require('fs');
let c = fs.readFileSync('src/screens/LookingScreen.tsx', 'utf8');

c = c.replace(
  "import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, StatusBar, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';",
  "import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, StatusBar, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';\nimport ImagePicker from 'react-native-image-crop-picker';"
);

c = c.replace(
  "const [currentPost, setCurrentPost] = useState<any>(null);",
  "const [currentPost, setCurrentPost] = useState<any>(null);\n  const [bannerImage, setBannerImage] = useState<string | null>(null);\n\n  const handleImagePick = async () => {\n    try {\n      const image = await ImagePicker.openPicker({\n        width: 400,\n        height: 400,\n        cropping: true,\n      });\n      setBannerImage(image.path);\n    } catch (error) {\n      console.log('User cancelled image selection');\n    }\n  };"
);

fs.writeFileSync('src/screens/LookingScreen.tsx', c, 'utf8');
console.log('Patched top');
