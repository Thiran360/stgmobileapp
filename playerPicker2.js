const fs = require('fs');
let c = fs.readFileSync('src/screens/LookingScreen.tsx', 'utf8');

c = c.replace("f.append('banner_image'", "f.append('creator_avatar'");

const playerPicker = "                      <View style={{ alignItems: 'center', marginBottom: 20, marginTop: 10 }}>\n                        <TouchableOpacity onPress={handleImagePick} style={{ height: 80, width: 80, borderRadius: 40, backgroundColor: bannerImage ? \"transparent\" : \"#F3F4F6\", justifyContent: \"center\", alignItems: \"center\", borderWidth: bannerImage ? 0 : 1.5, borderColor: \"#D1D5DB\", borderStyle: \"dashed\", overflow: \"hidden\" }}>\n                          {bannerImage ? (\n                            <Image source={{ uri: bannerImage }} style={{ width: \"100%\", height: \"100%\", resizeMode: \"cover\" }} />\n                          ) : (\n                            <>\n                              <Icon name=\"person-outline\" size={30} color=\"#9CA3AF\" />\n                              <Text style={{ fontSize: 10, color: \"#9CA3AF\", marginTop: 4, fontWeight: \"bold\" }}>PHOTO</Text>\n                            </>\n                          )}\n                        </TouchableOpacity>\n                      </View>";

c = c.replace("                  ) : activeChip === 'Players' ? (\n                    <>", "                  ) : activeChip === 'Players' ? (\n                    <>\n" + playerPicker);
c = c.replace("                  ) : activeChip === 'Players' ? (\r\n                    <>", "                  ) : activeChip === 'Players' ? (\r\n                    <>\r\n" + playerPicker);

// In case the user doesn't pick an image, I should delete creator_avatar string if bannerImage is present!
c = c.replace(
  '            creator_avatar: userProfile?.profilePicture || "https://via.placeholder.com/150",',
  '            creator_avatar: bannerImage ? "" : (userProfile?.profilePicture || "https://via.placeholder.com/150"),'
);

fs.writeFileSync('src/screens/LookingScreen.tsx', c, 'utf8');
console.log('Done');
