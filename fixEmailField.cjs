const fs = require('fs');
const filePath = 'src/screens/PlayerDetailsScreen.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const target = `<TextInput
                style={[styles.input, { backgroundColor: '#F3F4F6' }]}
                value={email}
                editable={false}
              />`;

const replacement = `<TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
              />`;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Replaced successfully!");
} else {
    console.log("Target not found. It might be formatted differently.");
}
