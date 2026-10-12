const fs = require('fs');
let content = fs.readFileSync('C:/Office/STG/src/screens/PolicyScreen.tsx', 'utf8');

// 1. Replace SafeAreaView import
content = content.replace(
  "import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';",
  "import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';\nimport { SafeAreaView } from 'react-native-safe-area-context';"
);

// 2. Add edges to SafeAreaView
content = content.replace(
  "<SafeAreaView style={styles.container}>",
  "<SafeAreaView style={styles.container} edges={['top', 'bottom']}>"
);

// 3. Improve styling (alignment)
content = content.replace(
  "text: { fontSize: 16, color: '#374151', lineHeight: 24 },",
  "text: { fontSize: 15, color: '#4B5563', lineHeight: 26, textAlign: 'justify' },"
);

// Add paragraph formatting for the content to look better
const getNewContent = () => `  const getContent = () => {
    switch (title) {
      case 'Privacy Policy':
        return "We value your privacy. We collect data necessary for providing tournament and gaming services, such as your profile info and match statistics.\\n\\nWe do not sell your personal data to third parties. All user data is encrypted and securely stored.\\n\\nYou have the right to request deletion of your account at any time. For detailed information, please contact our support team.";
      case 'Terms of Service':
        return "Welcome to STG! By using our app, you agree to abide by our community guidelines.\\n\\nAny form of cheating, toxicity, or harassment in tournaments will result in an immediate ban.\\n\\nWe reserve the right to suspend accounts that violate these terms. Users must be 13 years or older to participate in cash prize tournaments.";
      case 'Paid Service Terms':
        return "Our PRO memberships and paid tournament entries are non-refundable unless specified otherwise.\\n\\nSubscriptions are billed automatically unless canceled at least 24 hours before the renewal date.\\n\\nSTG is not responsible for prize pool payouts managed by third-party organizers.";
      default:
        return "Content not available.";
    }
  };`;

content = content.replace(/const getContent = \(\) => \{[\s\S]*?\};\r?\n/, getNewContent() + '\n');

fs.writeFileSync('C:/Office/STG/src/screens/PolicyScreen.tsx', content, 'utf8');
console.log('Fixed PolicyScreen styling and safe area.');
