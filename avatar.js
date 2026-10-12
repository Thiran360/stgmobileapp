const fs = require('fs');
let c = fs.readFileSync('src/screens/LookingScreen.tsx', 'utf8');
const lines = c.split('\n');

const idx = lines.findIndex(l => l.includes('https://i.pravatar.cc'));
if (idx > -1) {
  lines.splice(idx - 1, 8, 
    '                { (card.banner_image || card.creator_avatar) && (',
    '                  <View style={styles.avatarContainer}>',
    '                    <Image source={{ uri: card.banner_image || card.creator_avatar }} style={styles.avatar} />',
    '                    {card.isPro && (',
    '                      <View style={styles.cardProBadge}>',
    '                        <Text style={styles.cardProText}>PRO</Text>',
    '                      </View>',
    '                    )}',
    '                  </View>',
    '                )}'
  );
}

fs.writeFileSync('src/screens/LookingScreen.tsx', lines.join('\n'), 'utf8');
console.log('Fixed feed avatar');
