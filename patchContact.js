const fs = require('fs');
let content = fs.readFileSync('src/screens/LookingScreen.tsx', 'utf8');

const oldFooter =               <View style={styles.cardFooter}>
                <Text style={styles.footerTime}>{card.postedAgo}</Text>
                <View style={styles.footerRight}>
                  {card.category === 'Organisation' ? (
                    <TouchableOpacity 
                      style={styles.contactAction}
                      onPress={() => navigation.navigate('ChatScreen', { userId: card.id, userName: card.name, isGroup: true, isCreator: true })}
                    >
                      <Icon name="people-outline" size={15} color="#E51025" style={{ marginTop: 1 }} />
                      <Text style={styles.contactActionText}>Join Group</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity 
                      style={styles.contactAction}
                      onPress={() => {
                        const chatUserName = card.category === 'Team' && card.players && card.players.length > 0 ? card.players[0].name : card.name;
                        navigation.navigate('ChatScreen', { userId: card.id, userName: chatUserName, isGroup: false });
                      }}
                    >
                      <Icon name="chatbubble-outline" size={15} color="#E51025" style={{ marginTop: 1 }} />
                      <Text style={styles.contactActionText}>Contact</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>;

const newFooter =               <View style={styles.cardFooter}>
                <Text style={styles.footerTime}>{card.postedAgo || card.posted_ago}</Text>
                <View style={styles.footerRight}>
                  {card.category === 'Organisation' ? (
                    <TouchableOpacity 
                      style={styles.contactAction}
                      onPress={() => navigation.navigate('ChatScreen', { userId: card.user_id, userName: card.creator_username || card.name, isGroup: false })}
                    >
                      <Icon name="chatbubble-outline" size={15} color="#E51025" style={{ marginTop: 1 }} />
                      <Text style={styles.contactActionText}>Contact</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity 
                      style={styles.contactAction}
                      onPress={() => {
                        const chatUserName = card.creator_username || (card.category === 'Team' && card.players && card.players.length > 0 ? card.players[0].name : card.name);
                        navigation.navigate('ChatScreen', { userId: card.user_id, userName: chatUserName, isGroup: false });
                      }}
                    >
                      <Icon name="chatbubble-outline" size={15} color="#E51025" style={{ marginTop: 1 }} />
                      <Text style={styles.contactActionText}>Contact</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>;

content = content.replace(oldFooter, newFooter);
fs.writeFileSync('src/screens/LookingScreen.tsx', content, 'utf8');
console.log("Updated contact action successfully.");
