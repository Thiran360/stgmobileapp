const fs = require('fs');
let c = fs.readFileSync('src/screens/MatchesScreen.tsx', 'utf8');
c = c.replace(
  '                    </View>\r\n                  </View>\r\n                ))}',
  '                    </View>\r\n                  </TouchableOpacity>\r\n                ))}'
);
c = c.replace(
  '                    </View>\n                  </View>\n                ))}',
  '                    </View>\n                  </TouchableOpacity>\n                ))}'
);
fs.writeFileSync('src/screens/MatchesScreen.tsx', c, 'utf8');
console.log('Done');
