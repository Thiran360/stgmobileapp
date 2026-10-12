const fs = require('fs');
let c = fs.readFileSync('src/screens/LookingScreen.tsx', 'utf8');

c = c.replace(
  /<TouchableOpacity style={{ height: 80, width: 80, borderRadius: 40, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', borderWidth: 1\.5, borderColor: '#D1D5DB', borderStyle: 'dashed' }}>/g,
  '<TouchableOpacity onPress={handleImagePick} style={{ height: 80, width: 80, borderRadius: 40, backgroundColor: bannerImage ? "transparent" : "#F3F4F6", justifyContent: "center", alignItems: "center", borderWidth: bannerImage ? 0 : 1.5, borderColor: "#D1D5DB", borderStyle: "dashed" }}>'
);

c = c.replace(
  /<Icon name="camera-outline" size={30} color="#9CA3AF" \/>\s*<Text style={{ fontSize: 10, color: '#9CA3AF', marginTop: 4, fontWeight: 'bold' }}>LOGO<\/Text>/,
  '{bannerImage ? <Image source={{ uri: bannerImage }} style={{ width: 80, height: 80, borderRadius: 40 }} /> : <><Icon name="camera-outline" size={30} color="#9CA3AF" /><Text style={{ fontSize: 10, color: "#9CA3AF", marginTop: 4, fontWeight: "bold" }}>LOGO</Text></>}'
);

c = c.replace(
  /<Icon name="business-outline" size={30} color="#9CA3AF" \/>\s*<Text style={{ fontSize: 10, color: '#9CA3AF', marginTop: 4, fontWeight: 'bold' }}>LOGO<\/Text>/,
  '{bannerImage ? <Image source={{ uri: bannerImage }} style={{ width: 80, height: 80, borderRadius: 40 }} /> : <><Icon name="business-outline" size={30} color="#9CA3AF" /><Text style={{ fontSize: 10, color: "#9CA3AF", marginTop: 4, fontWeight: "bold" }}>LOGO</Text></>}'
);

fs.writeFileSync('src/screens/LookingScreen.tsx', c, 'utf8');
console.log('Patched UI');
