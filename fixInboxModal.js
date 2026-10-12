const fs = require('fs');
let content = fs.readFileSync('C:/Office/STG/src/screens/InboxScreen.tsx', 'utf8');

// Update styles
content = content.replace(
  "modalOverlayFull: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },",
  "modalOverlayFull: { flex: 1, backgroundColor: '#FFFFFF' },"
);
content = content.replace(
  "modalContentFull: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, height: '80%' },",
  "modalContentFull: { flex: 1, backgroundColor: '#FFFFFF', padding: 20, paddingTop: 40 },"
);

// Remove modalHandle (the small horizontal bar at the top)
content = content.replace(
  "<View style={styles.modalHandle} />",
  ""
);

fs.writeFileSync('C:/Office/STG/src/screens/InboxScreen.tsx', content, 'utf8');
console.log('Made New Chat modal full screen');
