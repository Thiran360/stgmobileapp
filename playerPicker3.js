const fs = require('fs');
const lines = fs.readFileSync('src/screens/LookingScreen.tsx', 'utf8').split('\n');
const idx = lines.findIndex(l => l.includes("activeChip === 'Players' ? ("));
if (idx > -1) {
  lines.splice(idx + 1, 0, 
    '                    <>',
    '                      <View style={{ alignItems: "center", marginBottom: 20, marginTop: 10 }}>',
    '                        <TouchableOpacity onPress={handleImagePick} style={{ height: 80, width: 80, borderRadius: 40, backgroundColor: bannerImage ? "transparent" : "#F3F4F6", justifyContent: "center", alignItems: "center", borderWidth: bannerImage ? 0 : 1.5, borderColor: "#D1D5DB", borderStyle: "dashed", overflow: "hidden" }}>',
    '                          {bannerImage ? (',
    '                            <Image source={{ uri: bannerImage }} style={{ width: "100%", height: "100%", resizeMode: "cover" }} />',
    '                          ) : (',
    '                            <>',
    '                              <Icon name="person-outline" size={30} color="#9CA3AF" />',
    '                              <Text style={{ fontSize: 10, color: "#9CA3AF", marginTop: 4, fontWeight: "bold" }}>PHOTO</Text>',
    '                            </>',
    '                          )}',
    '                        </TouchableOpacity>',
    '                      </View>'
  );
  
  const emptyTagIdx = lines.findIndex((l, i) => i > idx && l.trim() === '<>');
  if (emptyTagIdx > -1) lines.splice(emptyTagIdx, 1);
}
fs.writeFileSync('src/screens/LookingScreen.tsx', lines.join('\n'), 'utf8');
console.log('Done');
