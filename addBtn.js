const fs = require('fs');
let c = fs.readFileSync('src/screens/MatchesScreen.tsx', 'utf8');
const lines = c.split('\n');

const search = '<Text style={s.sectionLabel}>Active Tournaments</Text>';
const rep = "              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 4 }}>\n                <Text style={[s.sectionLabel, { marginBottom: 0, marginTop: 0 }]}>Active Tournaments</Text>\n                <TouchableOpacity onPress={() => requireLogin(() => navigation.navigate('CreateTournament'))} style={{ backgroundColor: '#E51025', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, flexDirection: 'row', alignItems: 'center' }}>\n                  <Icon name=\"add\" size={16} color=\"#fff\" style={{ marginRight: 2 }} />\n                  <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>Create</Text>\n                </TouchableOpacity>\n              </View>";

let idx = lines.findIndex(l => l.includes(search));
if(idx > -1) {
  lines[idx] = rep;
}

fs.writeFileSync('src/screens/MatchesScreen.tsx', lines.join('\n'), 'utf8');
console.log('Added create button');
