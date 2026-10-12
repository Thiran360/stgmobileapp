const fs = require('fs');
let c = fs.readFileSync('src/screens/HomeScreen.tsx', 'utf8');

c = c.replace(
  '<View style={[styles.tournamentCard, { width: width - 50 }]}>',
  '<TouchableOpacity style={[styles.tournamentCard, { width: width - 50 }]} onPress={() => navigation.navigate(\'TeamRegistration\', { tournamentId: tournament.id, tournamentName: tournament.name })} activeOpacity={0.9}>'
);

c = c.replace(
  '      </TouchableOpacity>\r\n    </View>\r\n  );\r\n',
  '      </TouchableOpacity>\r\n    </TouchableOpacity>\r\n  );\r\n'
);

c = c.replace(
  '      </TouchableOpacity>\n    </View>\n  );\n',
  '      </TouchableOpacity>\n    </TouchableOpacity>\n  );\n'
);

fs.writeFileSync('src/screens/HomeScreen.tsx', c, 'utf8');
console.log('Done HomeScreen');
