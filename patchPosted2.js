
const fs = require("fs");
let content = fs.readFileSync("src/screens/LookingScreen.tsx", "utf8");

content = content.replace(
  "<TouchableOpacity style={styles.youEditBtn} onPress={handleEditTrigger}>",
  `<View style={styles.youInfoCard}>
                          <Icon name="time-outline" size={24} color="#4B5563" style={{ marginRight: 15 }} />
                          <View style={{ flex: 1 }}>
                            <Text style={styles.youInfoLabel}>POSTED AGO:</Text>
                            <Text style={styles.youInfoValue}>{currentPost.postedAgo || currentPost.posted_ago || "N/A"}</Text>
                          </View>
                        </View>
                        <TouchableOpacity style={styles.youEditBtn} onPress={handleEditTrigger}>`
);
fs.writeFileSync("src/screens/LookingScreen.tsx", content, "utf8");

