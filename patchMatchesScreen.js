const fs = require('fs');
let c = fs.readFileSync('src/screens/MatchesScreen.tsx', 'utf8');
c = c.replace(
  '<View key={t.id || i} style={s.card}>',
  '<TouchableOpacity key={t.id || i} style={s.card} onPress={() => navigation.navigate(RegisteredTeams, { tournamentId: t.id, tournamentName: t.name })} activeOpacity={0.9}>'
);
c = c.replace(
  '                    </View>\n                  </View>\n                ))} ',
  '                    </View>\n                  </TouchableOpacity>\n                ))} '
);
fs.writeFileSync('src/screens/MatchesScreen.tsx', c, 'utf8');
console.log('Done matches');
