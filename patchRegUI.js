const fs = require('fs');
let c = fs.readFileSync('src/screens/TeamRegistrationScreen.tsx', 'utf8');

const newUI = 
          {tournament && tournament.stages && tournament.stages.length > 0 && (
            <View style={[styles.sectionCard, { marginTop: 15 }]}>
              <Text style={styles.sectionHeaderTitle}>Tournament Roadmap</Text>
              {tournament.stages.map((stage, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: i === tournament.stages.length - 1 ? 0 : 15 }}>
                  <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: '#E51025', marginRight: 15 }} />
                  <View style={{ flex: 1 }}>
                     <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#1F2937' }}>{stage.title}</Text>
                     {stage.date ? <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>{stage.date}</Text> : null}
                  </View>
                </View>
              ))}
            </View>
          )}

          {tournament && tournament.positions && tournament.positions.length > 0 && (
            <View style={[styles.sectionCard, { marginTop: 15 }]}>
              <Text style={styles.sectionHeaderTitle}>Point System</Text>
              <View style={{ backgroundColor: '#FEF2F2', padding: 10, borderRadius: 8, marginBottom: 15, flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="skull" size={18} color="#E51025" style={{ marginRight: 8 }} />
                <Text style={{ fontSize: 14, color: '#1F2937' }}>Kill Points: <Text style={{ fontWeight: '900', color: '#E51025' }}>{tournament.killsPoint || 1}</Text> per kill</Text>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -5 }}>
                {tournament.positions.filter(p => p.value !== '0' && p.value !== 0).map((pos, i) => (
                   <View key={i} style={{ width: '33.33%', padding: 5 }}>
                      <View style={{ backgroundColor: '#F3F4F6', paddingVertical: 10, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' }}>
                         <Text style={{ fontSize: 13, color: '#6B7280', fontWeight: 'bold', marginBottom: 2 }}>{pos.label}</Text>
                         <Text style={{ fontSize: 16, color: '#1F2937', fontWeight: '900' }}>{pos.value} PTS</Text>
                      </View>
                   </View>
                ))}
              </View>
            </View>
          )}

          {tournament && tournament.rules ? (
            <View style={[styles.sectionCard, { marginTop: 15 }]}>
              <Text style={styles.sectionHeaderTitle}>Rules</Text>
              <Text style={{ fontSize: 14, color: '#4B5563', lineHeight: 22 }}>{tournament.rules}</Text>
            </View>
          ) : null}

          <View style={[styles.sectionCard, { marginTop: 15 }]}>
;

c = c.replace('<View style={styles.sectionCard}>\r\n            <Text style={styles.sectionHeaderTitle}>Team Identity</Text>', newUI + '            <Text style={styles.sectionHeaderTitle}>Team Identity</Text>');
c = c.replace('<View style={styles.sectionCard}>\n            <Text style={styles.sectionHeaderTitle}>Team Identity</Text>', newUI + '            <Text style={styles.sectionHeaderTitle}>Team Identity</Text>');

fs.writeFileSync('src/screens/TeamRegistrationScreen.tsx', c, 'utf8');
console.log('Done UI');
