const fs = require('fs');
let content = fs.readFileSync('C:/Office/STG/src/screens/ProfileScreen.tsx', 'utf8');

// 1. Remove SafeAreaView from react-native import
content = content.replace(
  "import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView, StatusBar, Linking, Alert, Modal, Platform, TextInput } from 'react-native';",
  "import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, StatusBar, Linking, Alert, Modal, Platform, TextInput } from 'react-native';"
);

// 2. Add SafeAreaView to react-native-safe-area-context import
content = content.replace(
  "import { useSafeAreaInsets } from 'react-native-safe-area-context';",
  "import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';"
);

// 3. Add edges prop to SafeAreaView
content = content.replace(
  "<SafeAreaView style={[styles.container, { backgroundColor: '#1A1A1A' }]}>",
  "<SafeAreaView style={[styles.container, { backgroundColor: '#1A1A1A' }]} edges={['top', 'bottom']}>"
);

fs.writeFileSync('C:/Office/STG/src/screens/ProfileScreen.tsx', content, 'utf8');
console.log('Fixed SafeAreaView for ProfileScreen');
