const fs = require('fs');
let content = fs.readFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', 'utf8');

// 1. Remove ellipsis-vertical from main chat header
const mainHeaderTarget = `<TouchableOpacity style={styles.headerMenu} onPress={() => setMenuVisible(true)}>
            <Icon name="ellipsis-vertical" size={20} color="#1F2937" />
          </TouchableOpacity>`;
content = content.replace(mainHeaderTarget, '');

fs.writeFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', content, 'utf8');
console.log('Removed 3-dots from main chat header');
