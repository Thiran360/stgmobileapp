const fs = require('fs');
let c = fs.readFileSync('src/screens/LookingScreen.tsx', 'utf8');
const lines = c.split('\n');

const teamIdx = lines.findIndex((l, i) => l.includes('<TouchableOpacity onPress={handleImagePick}') && lines[i+1] && lines[i+1].includes('camera-outline'));
if (teamIdx > -1) {
  lines.splice(teamIdx, 4,
    '                        <TouchableOpacity onPress={handleImagePick} style={{ height: 80, width: 80, borderRadius: 40, backgroundColor: bannerImage ? "transparent" : "#F3F4F6", justifyContent: "center", alignItems: "center", borderWidth: bannerImage ? 0 : 1.5, borderColor: "#D1D5DB", borderStyle: "dashed", overflow: "hidden" }}>',
    '                          {bannerImage ? (',
    '                            <Image source={{ uri: bannerImage }} style={{ width: "100%", height: "100%", resizeMode: "cover" }} />',
    '                          ) : (',
    '                            <>',
    '                              <Icon name="camera-outline" size={30} color="#9CA3AF" />',
    '                              <Text style={{ fontSize: 10, color: "#9CA3AF", marginTop: 4, fontWeight: "bold" }}>LOGO</Text>',
    '                            </>',
    '                          )}',
    '                        </TouchableOpacity>'
  );
}

const orgIdx = lines.findIndex((l, i) => l.includes('<TouchableOpacity onPress={handleImagePick}') && lines[i+1] && lines[i+1].includes('business-outline'));
if (orgIdx > -1) {
  lines.splice(orgIdx, 4,
    '                        <TouchableOpacity onPress={handleImagePick} style={{ height: 80, width: 80, borderRadius: 40, backgroundColor: bannerImage ? "transparent" : "#F3F4F6", justifyContent: "center", alignItems: "center", borderWidth: bannerImage ? 0 : 1.5, borderColor: "#D1D5DB", borderStyle: "dashed", overflow: "hidden" }}>',
    '                          {bannerImage ? (',
    '                            <Image source={{ uri: bannerImage }} style={{ width: "100%", height: "100%", resizeMode: "cover" }} />',
    '                          ) : (',
    '                            <>',
    '                              <Icon name="business-outline" size={30} color="#9CA3AF" />',
    '                              <Text style={{ fontSize: 10, color: "#9CA3AF", marginTop: 4, fontWeight: "bold" }}>LOGO</Text>',
    '                            </>',
    '                          )}',
    '                        </TouchableOpacity>'
  );
}

fs.writeFileSync('src/screens/LookingScreen.tsx', lines.join('\n'), 'utf8');
console.log('Fixed Image Picker');
