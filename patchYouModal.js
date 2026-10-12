const fs = require('fs');
let content = fs.readFileSync('src/screens/LookingScreen.tsx', 'utf8');

// First, inject currentPost helper
content = content.replace('const [formData, setFormData] = useState<any>({});', 'const [formData, setFormData] = useState<any>({});\n\n  const currentPost = Array.isArray(myPost) ? myPost.find((p: any) => p.category === activeChip) : (myPost?.category === activeChip ? myPost : null);');

// Change the 'Post' button to conditionally show 'View My Post' or 'Create Group' or 'Post'
const oldPostBtn =               {activeChip !== 'All' && (
                <TouchableOpacity style={styles.postBtn} onPress={() => setPostModalVisible(true)}>
                  <Icon name="add-circle" size={16} color="#FFFFFF" />
                  <Text style={styles.postBtnText}>Post</Text>
                </TouchableOpacity>
              )};

const newPostBtn =               {activeChip !== 'All' && (
                currentPost ? (
                  <TouchableOpacity style={styles.postBtn} onPress={() => setYouModalVisible(true)}>
                    <Icon name="eye-outline" size={16} color="#FFFFFF" />
                    <Text style={styles.postBtnText}>View My Post</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.postBtn} onPress={() => setPostModalVisible(true)}>
                    <Icon name="add-circle" size={16} color="#FFFFFF" />
                    <Text style={styles.postBtnText}>Post</Text>
                  </TouchableOpacity>
                )
              )};

content = content.replace(oldPostBtn, newPostBtn);

// Rewrite the 'You' Modal content
const oldYouModalStart = <View style={{ width: '100%' }}>
                    {/* Item 1 */}
                    <View style={styles.youInfoCard}>;

const oldYouModalEnd =                     {/* Edit Button */}
                    <TouchableOpacity style={styles.youEditBtn} onPress={() => setYouModalVisible(false)}>
                      <Icon name="pencil" size={18} color="#E51025" style={{ marginRight: 8 }} />
                      <Text style={{ color: '#E51025', fontWeight: 'bold', fontSize: 16 }}>Edit Details</Text>
                    </TouchableOpacity>
  
                  </View>;

const newYouModalContent = <View style={{ width: '100%' }}>
                    {currentPost?.category === 'Team' && (
                      <>
                        <View style={styles.youInfoCard}>
                          <Icon name="people-outline" size={24} color="#4B5563" style={{ marginRight: 15 }} />
                          <View style={{ flex: 1 }}>
                            <Text style={styles.youInfoLabel}>TEAM NAME:</Text>
                            <Text style={styles.youInfoValue}>{currentPost.team_name || currentPost.name || 'N/A'}</Text>
                          </View>
                        </View>
                        <View style={styles.youInfoCard}>
                          <Icon name="document-text-outline" size={24} color="#4B5563" style={{ marginRight: 15 }} />
                          <View style={{ flex: 1 }}>
                            <Text style={styles.youInfoLabel}>DESCRIPTION:</Text>
                            <Text style={styles.youInfoValue}>{currentPost.description || currentPost.looking_for_text || 'N/A'}</Text>
                          </View>
                        </View>
                        {currentPost.players?.map((p: any, i: number) => (
                           <View key={i} style={styles.youInfoCard}>
                             <Icon name="person" size={24} color="#4B5563" style={{ marginRight: 15 }} />
                             <View style={{ flex: 1 }}>
                               <Text style={styles.youInfoLabel}>PLAYER {i+1}:</Text>
                               <Text style={styles.youInfoValue}>{p.name} ({p.role})</Text>
                             </View>
                           </View>
                        ))}
                      </>
                    )}

                    {currentPost?.category === 'Players' && (
                      <>
                        <View style={styles.youInfoCard}>
                          <Icon name="person-outline" size={24} color="#4B5563" style={{ marginRight: 15 }} />
                          <View style={{ flex: 1 }}>
                            <Text style={styles.youInfoLabel}>PLAYER NAME:</Text>
                            <Text style={styles.youInfoValue}>{currentPost.player_name || currentPost.name || 'N/A'}</Text>
                          </View>
                        </View>
                        <View style={styles.youInfoCard}>
                          <MaterialCommunityIcons name="target" size={24} color="#4B5563" style={{ marginRight: 15 }} />
                          <View style={{ flex: 1 }}>
                            <Text style={styles.youInfoLabel}>ROLE:</Text>
                            <Text style={styles.youInfoValue}>{currentPost.role || 'N/A'}</Text>
                          </View>
                        </View>
                        <View style={styles.youInfoCard}>
                          <Icon name="bar-chart-outline" size={24} color="#4B5563" style={{ marginRight: 15 }} />
                          <View style={{ flex: 1 }}>
                            <Text style={styles.youInfoLabel}>EXPERIENCE:</Text>
                            <Text style={styles.youInfoValue}>{currentPost.experience || 'N/A'}</Text>
                          </View>
                        </View>
                        <View style={styles.youInfoCard}>
                          <Icon name="phone-portrait-outline" size={24} color="#4B5563" style={{ marginRight: 15 }} />
                          <View style={{ flex: 1 }}>
                            <Text style={styles.youInfoLabel}>DEVICE:</Text>
                            <Text style={styles.youInfoValue}>{currentPost.device_model || 'N/A'}</Text>
                          </View>
                        </View>
                        <View style={styles.youInfoCard}>
                          <Icon name="document-text-outline" size={24} color="#4B5563" style={{ marginRight: 15 }} />
                          <View style={{ flex: 1 }}>
                            <Text style={styles.youInfoLabel}>DESCRIPTION:</Text>
                            <Text style={styles.youInfoValue}>{currentPost.description || currentPost.looking_for_text || 'N/A'}</Text>
                          </View>
                        </View>
                      </>
                    )}

                    {currentPost?.category === 'Organisation' && (
                      <>
                        <View style={styles.youInfoCard}>
                          <Icon name="business-outline" size={24} color="#4B5563" style={{ marginRight: 15 }} />
                          <View style={{ flex: 1 }}>
                            <Text style={styles.youInfoLabel}>ORG NAME:</Text>
                            <Text style={styles.youInfoValue}>{currentPost.org_name || currentPost.name || 'N/A'}</Text>
                          </View>
                        </View>
                        <View style={styles.youInfoCard}>
                          <Icon name="calendar-outline" size={24} color="#4B5563" style={{ marginRight: 15 }} />
                          <View style={{ flex: 1 }}>
                            <Text style={styles.youInfoLabel}>ESTABLISHED:</Text>
                            <Text style={styles.youInfoValue}>{currentPost.established_year || currentPost.established || 'N/A'}</Text>
                          </View>
                        </View>
                        <View style={styles.youInfoCard}>
                          <Icon name="document-text-outline" size={24} color="#4B5563" style={{ marginRight: 15 }} />
                          <View style={{ flex: 1 }}>
                            <Text style={styles.youInfoLabel}>DESCRIPTION:</Text>
                            <Text style={styles.youInfoValue}>{currentPost.description || currentPost.looking_for_text || 'N/A'}</Text>
                          </View>
                        </View>
                      </>
                    )}

                    {!['Team', 'Players', 'Organisation'].includes(currentPost?.category) && currentPost && (
                      <>
                         <View style={styles.youInfoCard}>
                          <Icon name="person-outline" size={24} color="#4B5563" style={{ marginRight: 15 }} />
                          <View style={{ flex: 1 }}>
                            <Text style={styles.youInfoLabel}>ING NAME:</Text>
                            <Text style={styles.youInfoValue}>{currentPost.player_name || currentPost.name || 'N/A'}</Text>
                          </View>
                        </View>
                        <View style={styles.youInfoCard}>
                          <MaterialCommunityIcons name="ghost-outline" size={24} color="#4B5563" style={{ marginRight: 15 }} />
                          <View style={{ flex: 1 }}>
                            <Text style={styles.youInfoLabel}>ING ID:</Text>
                            <Text style={styles.youInfoValue}>{currentPost.in_game_id || 'N/A'}</Text>
                          </View>
                        </View>
                        <View style={styles.youInfoCard}>
                          <Icon name="trophy-outline" size={24} color="#4B5563" style={{ marginRight: 15 }} />
                          <View style={{ flex: 1 }}>
                            <Text style={styles.youInfoLabel}>ACHIEVEMENTS:</Text>
                            <Text style={styles.youInfoValue}>{currentPost.achievements || currentPost.looking_for_text || 'N/A'}</Text>
                          </View>
                        </View>
                      </>
                    )}

                    {/* Action Buttons */}
                    <TouchableOpacity style={styles.youEditBtn} onPress={() => { /* TO DO: EDIT API */ }}>
                      <Icon name="pencil" size={18} color="#E51025" style={{ marginRight: 8 }} />
                      <Text style={{ color: '#E51025', fontWeight: 'bold', fontSize: 16 }}>Edit Post</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.youEditBtn, { borderColor: '#4B5563', marginTop: 10 }]} onPress={() => { /* TO DO: DELETE API */ }}>
                      <Icon name="trash-outline" size={18} color="#4B5563" style={{ marginRight: 8 }} />
                      <Text style={{ color: '#4B5563', fontWeight: 'bold', fontSize: 16 }}>Delete Post</Text>
                    </TouchableOpacity>
                  </View>;

let startIndex = content.indexOf(oldYouModalStart);
let endIndex = content.indexOf(oldYouModalEnd) + oldYouModalEnd.length;

if(startIndex !== -1 && endIndex !== -1) {
    content = content.substring(0, startIndex) + newYouModalContent + content.substring(endIndex);
    fs.writeFileSync('src/screens/LookingScreen.tsx', content, 'utf8');
    console.log("Successfully patched You Modal content.");
} else {
    console.log("Failed to find boundaries.");
}
