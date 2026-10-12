const fs = require('fs');
let c = fs.readFileSync('src/screens/LookingScreen.tsx', 'utf8');

const tSearch = '<TouchableOpacity onPress={handleImagePick} style={{ height: 80, width: 80, borderRadius: 40, backgroundColor: bannerImage ? "transparent" : "#F3F4F6", justifyContent: "center", alignItems: "center", borderWidth: bannerImage ? 0 : 1.5, borderColor: "#D1D5DB", borderStyle: "dashed" }}>\n                          <Icon name="camera-outline" size={30} color="#9CA3AF" />\n                          <Text style={{ fontSize: 10, color: "#9CA3AF", marginTop: 4, fontWeight: "bold" }}>LOGO</Text>\n                        </TouchableOpacity>';

const tRep = '<TouchableOpacity onPress={handleImagePick} style={{ height: 80, width: 80, borderRadius: 40, backgroundColor: bannerImage ? "transparent" : "#F3F4F6", justifyContent: "center", alignItems: "center", borderWidth: bannerImage ? 0 : 1.5, borderColor: "#D1D5DB", borderStyle: "dashed", overflow: "hidden" }}>\n                          {bannerImage ? (\n                            <Image source={{ uri: bannerImage }} style={{ width: "100%", height: "100%", resizeMode: "cover" }} />\n                          ) : (\n                            <>\n                              <Icon name="camera-outline" size={30} color="#9CA3AF" />\n                              <Text style={{ fontSize: 10, color: "#9CA3AF", marginTop: 4, fontWeight: "bold" }}>LOGO</Text>\n                            </>\n                          )}\n                        </TouchableOpacity>';

c = c.replace(tSearch, tRep);
c = c.replace(tSearch.replace(/\n/g, '\r\n'), tRep.replace(/\n/g, '\r\n'));

const oSearch = '<TouchableOpacity onPress={handleImagePick} style={{ height: 80, width: 80, borderRadius: 40, backgroundColor: bannerImage ? "transparent" : "#F3F4F6", justifyContent: "center", alignItems: "center", borderWidth: bannerImage ? 0 : 1.5, borderColor: "#D1D5DB", borderStyle: "dashed" }}>\n                          <Icon name="business-outline" size={30} color="#9CA3AF" />\n                          <Text style={{ fontSize: 10, color: "#9CA3AF", marginTop: 4, fontWeight: "bold" }}>LOGO</Text>\n                        </TouchableOpacity>';

const oRep = '<TouchableOpacity onPress={handleImagePick} style={{ height: 80, width: 80, borderRadius: 40, backgroundColor: bannerImage ? "transparent" : "#F3F4F6", justifyContent: "center", alignItems: "center", borderWidth: bannerImage ? 0 : 1.5, borderColor: "#D1D5DB", borderStyle: "dashed", overflow: "hidden" }}>\n                          {bannerImage ? (\n                            <Image source={{ uri: bannerImage }} style={{ width: "100%", height: "100%", resizeMode: "cover" }} />\n                          ) : (\n                            <>\n                              <Icon name="business-outline" size={30} color="#9CA3AF" />\n                              <Text style={{ fontSize: 10, color: "#9CA3AF", marginTop: 4, fontWeight: "bold" }}>LOGO</Text>\n                            </>\n                          )}\n                        </TouchableOpacity>';

c = c.replace(oSearch, oRep);
c = c.replace(oSearch.replace(/\n/g, '\r\n'), oRep.replace(/\n/g, '\r\n'));

// Now for the Feed Avatar
const avatarSearch = '<View style={styles.avatarContainer}>\n                  <Image source={{ uri: \\https://i.pravatar.cc/150?img=\\\\ }} style={styles.avatar} />\n                  {card.isPro && (\n                    <View style={styles.cardProBadge}>\n                      <Text style={styles.cardProText}>PRO</Text>\n                    </View>\n                  )}\n                </View>';

const avatarRep = '{ (card.banner_image || card.creator_avatar) && (\n                  <View style={styles.avatarContainer}>\n                    <Image source={{ uri: card.banner_image || card.creator_avatar }} style={styles.avatar} />\n                    {card.isPro && (\n                      <View style={styles.cardProBadge}>\n                        <Text style={styles.cardProText}>PRO</Text>\n                      </View>\n                    )}\n                  </View>\n                )}';

c = c.replace(avatarSearch, avatarRep);
c = c.replace(avatarSearch.replace(/\n/g, '\r\n'), avatarRep.replace(/\n/g, '\r\n'));

fs.writeFileSync('src/screens/LookingScreen.tsx', c, 'utf8');
console.log('Fixed LOGO picker and Avatar');
