import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { apiService } from '../api/index';
import { AppContext } from '../context/AppContext';

const CommunityListScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { category } = route.params || { category: 'Community' };

  const [posts, setPosts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [youModalVisible, setYouModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { userProfile, currentUserId } = useContext(AppContext);

  const fetchPosts = React.useCallback(async () => {
    try {
      const apiPosts = await apiService.getCommunityPosts(category);
      const dataList = Array.isArray(apiPosts) ? apiPosts : (apiPosts?.data || []);
      if (dataList && Array.isArray(dataList)) {
        const mappedList = dataList.map((item: any) => ({
          ...item,
          postedBy: item.postedBy || item.posted_by,
          orgName: item.orgName || item.org_name,
          ownerName: item.ownerName || item.owner_name,
          previousWork: item.previousWork || item.previous_work,
          overallPlayers: item.overallPlayers || item.overall_players,
          ownerYoutube: item.ownerYoutube || item.owner_youtube,
          ownerInstagram: item.ownerInstagram || item.owner_instagram,
          ownerDiscord: item.ownerDiscord || item.owner_discord,
          ownerWebsite: item.ownerWebsite || item.owner_website,
        }));
        const matched = mappedList.filter((p: any) => p.category === category || p.type === category);
        setPosts(matched);
      }
    } catch(e) {
      console.log('Failed to fetch community posts', e);
    }
  }, [category]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts, route.params]);

  useFocusEffect(
    React.useCallback(() => {
      fetchPosts();
    }, [fetchPosts])
  );

  const isOwner = (post: any) => {
    if (!post) return false;
    const pUid = post.user_id ? String(post.user_id).replace('user_', '').trim() : '';
    const myUid = (userProfile?.id || currentUserId || '').toString().replace('user_', '').trim();
    if (pUid && myUid && pUid === myUid) return true;

    const pUser = (post.postedBy || post.posted_by || '').toString().toLowerCase().replace('@', '').trim();
    const myUser = (userProfile?.username || '').toString().toLowerCase().replace('@', '').trim();
    const myName = (userProfile?.fullName || '').toString().toLowerCase().trim();
    if (pUser && (pUser === myUser || pUser === myName)) return true;

    return false;
  };

  const myExistingPost = posts.find(p => isOwner(p));

  const filteredPosts = posts.filter(post => 
    (post.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (post.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (post.orgName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (post.ownerName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (post.postedBy?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (route.params?.newPost) {
      setPosts(prev => [route.params.newPost, ...prev]);
      navigation.setParams({ newPost: undefined });
    }
  }, [route.params?.newPost]);

  const handleDeletePost = () => {
    if (!myExistingPost) return;
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post? Once deleted, you can create a fresh post in this category.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              const res = await apiService.deleteCommunityPost(myExistingPost.id);
              if (res?.status !== false) {
                setYouModalVisible(false);
                setPosts(prev => prev.filter(p => p.id !== myExistingPost.id));
                Alert.alert('Deleted', 'Your post has been deleted successfully.');
                fetchPosts();
              } else {
                Alert.alert('Error', res?.message || 'Failed to delete post.');
              }
            } catch (err: any) {
              console.log('Error deleting community post:', err);
              Alert.alert('Error', err?.message || 'Network error occurred while deleting.');
            } finally {
              setIsDeleting(false);
            }
          }
        }
      ]
    );
  };

  const renderPost = ({ item }: { item: any }) => {
    const isMine = isOwner(item);

    return (
      <TouchableOpacity 
        style={styles.card} 
        activeOpacity={0.9} 
        onPress={() => {
          if (isMine) {
            setYouModalVisible(true);
          } else {
            navigation.navigate('CommunityPostDetailsScreen', { post: item, category });
          }
        }}
      >
        <View style={styles.cardHeader}>
          <View style={styles.avatarContainer}>
            {item.logo ? (
              <Image source={{ uri: item.logo }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, { backgroundColor: '#FEF2F2', justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#E51025' }}>
                  {(item.name || item.orgName || item.postedBy || 'U')[0].toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.headerInfo}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Text style={styles.name} numberOfLines={1}>{item.name || item.orgName || 'Anonymous'}</Text>
              <View style={[styles.categoryBadge, isMine && { backgroundColor: '#FEF2F2' }]}>
                <Text style={[styles.categoryBadgeText, isMine && { color: '#E51025' }]}>
                  {isMine ? 'YOU' : category}
                </Text>
              </View>
            </View>
            
            <Text style={styles.subName} numberOfLines={1}>
              <Icon name="person-outline" size={12} color="#6B7280" /> {item.postedBy || item.ownerName || 'Unknown'}
            </Text>
            
            {item.experience || item.lanExperience ? (
              <Text style={styles.experience}>
                <Icon name="briefcase-outline" size={12} color="#6B7280" /> {item.experience || item.lanExperience} Exp {item.since ? ' - Since ' + item.since : ''}
              </Text>
            ) : null}
          </View>
        </View>
        
        <Text style={styles.description} numberOfLines={3}>{item.description}</Text>
        
        <View style={styles.tagsContainer}>
          {item.previousWork ? (
            <View style={styles.tagPill}>
              <Icon name="folder-outline" size={12} color="#4B5563" style={{ marginRight: 4 }} />
              <Text style={styles.tagText} numberOfLines={1}>Prev: {item.previousWork}</Text>
            </View>
          ) : null}
          {item.achievements ? (
            <View style={styles.tagPill}>
              <Icon name="trophy-outline" size={12} color="#D97706" style={{ marginRight: 4 }} />
              <Text style={[styles.tagText, { color: '#D97706' }]} numberOfLines={1}>{item.achievements}</Text>
            </View>
          ) : null}
          {item.overallPlayers ? (
            <View style={styles.tagPill}>
              <Icon name="people-outline" size={12} color="#2563EB" style={{ marginRight: 4 }} />
              <Text style={[styles.tagText, { color: '#2563EB' }]} numberOfLines={1}>{item.overallPlayers} Players</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.cardFooter}>
          {isMine ? (
            <TouchableOpacity 
              style={[styles.chatButton, { backgroundColor: '#E51025', flex: 1, marginRight: 8 }]}
              onPress={() => setYouModalVisible(true)}
            >
              <Icon name="person" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.chatButtonText}>Your Posted Details</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.chatButton}
              onPress={() => navigation.navigate('ChatScreen', { userId: item.user_id || item.id?.toString(), userName: item.postedBy || item.name || 'User', isGroup: false })}
            >
              <Icon name="chatbubble-ellipses" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.chatButtonText}>Message</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="bookmark-outline" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.textBlack} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category}</Text>
        
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Post button only visible if user does not already have a post */}
          {!myExistingPost && (
            <TouchableOpacity
              style={styles.headerPostBtn}
              onPress={() => navigation.navigate('CommunityAddScreen', { category })}
            >
              <Icon name="add-circle" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.headerPostBtnText}>Post</Text>
            </TouchableOpacity>
          )}

          {/* You button */}
          <TouchableOpacity
            style={[styles.headerYouBtn, myExistingPost && styles.headerYouBtnActive]}
            onPress={() => setYouModalVisible(true)}
          >
            <Text style={[styles.headerYouBtnText, myExistingPost && styles.headerYouBtnTextActive]}>
              You
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, org, or details..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close-circle" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Feed List */}
      <FlatList
        data={filteredPosts}
        renderItem={renderPost}
        keyExtractor={(item, index) => (item.id || index).toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="albums-outline" size={60} color="#D1D5DB" />
            <Text style={styles.emptyText}>No posts yet.</Text>
            <Text style={styles.emptySubText}>Be the first to post in {category}!</Text>
            {!myExistingPost && (
              <TouchableOpacity
                style={styles.emptyActionBtn}
                onPress={() => navigation.navigate('CommunityAddScreen', { category })}
              >
                <Icon name="add-circle" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Create Post</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />

      {/* "YOUR POSTED DETAILS" MODAL (Matches Looking Page exactly) */}
      <Modal
        visible={youModalVisible}
        animationType="slide"
        onRequestClose={() => setYouModalVisible(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: '#E51025' }} edges={['top']}>
          {/* Red Header Bar */}
          <View style={styles.youHeader}>
            <TouchableOpacity onPress={() => setYouModalVisible(false)}>
              <Icon name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.youHeaderTitle}>Your Posted Details</Text>
            {myExistingPost ? (
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={() => {
                  setYouModalVisible(false);
                  navigation.navigate('CommunityAddScreen', { category, isEdit: true, post: myExistingPost });
                }}
              >
                <Icon name="pencil" size={14} color="#FFFFFF" />
                <Text style={{ color: '#FFFFFF', fontSize: 14, marginLeft: 4, fontWeight: 'bold' }}>
                  Edit
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={{ width: 24 }} />
            )}
          </View>

          {/* Modal Content */}
          <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
            <KeyboardAwareScrollView
              enableOnAndroid={true}
              extraScrollHeight={20}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ padding: 15, paddingBottom: 40 }}
            >
              {myExistingPost ? (
                <View style={styles.youCard}>
                  {/* Profile Avatar */}
                  <View style={styles.youAvatar}>
                    {myExistingPost.logo ? (
                      <Image
                        source={{ uri: myExistingPost.logo }}
                        style={{ width: 80, height: 80, borderRadius: 40 }}
                      />
                    ) : (
                      <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name="person" size={40} color="#9CA3AF" />
                      </View>
                    )}
                  </View>

                  {/* Name with Pencil */}
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
                    onPress={() => {
                      setYouModalVisible(false);
                      navigation.navigate('CommunityAddScreen', { category, isEdit: true, post: myExistingPost });
                    }}
                  >
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000000' }}>
                      {myExistingPost.name || myExistingPost.orgName || myExistingPost.postedBy || userProfile?.username || 'STG Member'}
                    </Text>
                    <Icon name="pencil" size={16} color="#6B7280" style={{ marginLeft: 8 }} />
                  </TouchableOpacity>

                  {/* Description Subtitle */}
                  <Text style={styles.youSubtitle}>
                    Here are the details you posted for {category}. Other players can contact you using this.
                  </Text>

                  {/* Info Cards List */}
                  <View style={{ width: '100%' }}>
                    {/* Category */}
                    <View style={styles.youInfoCard}>
                      <Icon name="grid-outline" size={24} color="#4B5563" style={{ marginRight: 15 }} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.youInfoLabel}>CATEGORY:</Text>
                        <Text style={styles.youInfoValue}>{myExistingPost.category || category}</Text>
                      </View>
                    </View>

                    {/* Org Name */}
                    {myExistingPost.orgName ? (
                      <View style={styles.youInfoCard}>
                        <Icon name="business-outline" size={24} color="#4B5563" style={{ marginRight: 15 }} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.youInfoLabel}>ORGANIZATION NAME:</Text>
                          <Text style={styles.youInfoValue}>{myExistingPost.orgName}</Text>
                        </View>
                      </View>
                    ) : null}

                    {/* Owner Name */}
                    {myExistingPost.ownerName ? (
                      <View style={styles.youInfoCard}>
                        <Icon name="person-circle-outline" size={24} color="#4B5563" style={{ marginRight: 15 }} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.youInfoLabel}>OWNER NAME:</Text>
                          <Text style={styles.youInfoValue}>{myExistingPost.ownerName}</Text>
                        </View>
                      </View>
                    ) : null}

                    {/* Name */}
                    {myExistingPost.name && !myExistingPost.orgName ? (
                      <View style={styles.youInfoCard}>
                        <Icon name="person-outline" size={24} color="#4B5563" style={{ marginRight: 15 }} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.youInfoLabel}>NAME:</Text>
                          <Text style={styles.youInfoValue}>{myExistingPost.name}</Text>
                        </View>
                      </View>
                    ) : null}

                    {/* Experience */}
                    {(myExistingPost.experience || myExistingPost.lanExperience) ? (
                      <View style={styles.youInfoCard}>
                        <Icon name="briefcase-outline" size={24} color="#4B5563" style={{ marginRight: 15 }} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.youInfoLabel}>EXPERIENCE:</Text>
                          <Text style={styles.youInfoValue}>{myExistingPost.experience || myExistingPost.lanExperience}</Text>
                        </View>
                      </View>
                    ) : null}

                    {/* Since */}
                    {myExistingPost.since ? (
                      <View style={styles.youInfoCard}>
                        <Icon name="calendar-outline" size={24} color="#4B5563" style={{ marginRight: 15 }} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.youInfoLabel}>SINCE:</Text>
                          <Text style={styles.youInfoValue}>{myExistingPost.since}</Text>
                        </View>
                      </View>
                    ) : null}

                    {/* Description */}
                    {myExistingPost.description ? (
                      <View style={styles.youInfoCard}>
                        <Icon name="document-text-outline" size={24} color="#4B5563" style={{ marginRight: 15 }} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.youInfoLabel}>DESCRIPTION:</Text>
                          <Text style={styles.youInfoValue}>{myExistingPost.description}</Text>
                        </View>
                      </View>
                    ) : null}

                    {/* Previous Work */}
                    {myExistingPost.previousWork ? (
                      <View style={styles.youInfoCard}>
                        <Icon name="folder-outline" size={24} color="#4B5563" style={{ marginRight: 15 }} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.youInfoLabel}>PREVIOUS WORK:</Text>
                          <Text style={styles.youInfoValue}>{myExistingPost.previousWork}</Text>
                        </View>
                      </View>
                    ) : null}

                    {/* Achievements */}
                    {myExistingPost.achievements ? (
                      <View style={styles.youInfoCard}>
                        <Icon name="trophy-outline" size={24} color="#4B5563" style={{ marginRight: 15 }} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.youInfoLabel}>ACHIEVEMENTS:</Text>
                          <Text style={styles.youInfoValue}>{myExistingPost.achievements}</Text>
                        </View>
                      </View>
                    ) : null}

                    {/* Overall Players */}
                    {myExistingPost.overallPlayers ? (
                      <View style={styles.youInfoCard}>
                        <Icon name="people-outline" size={24} color="#4B5563" style={{ marginRight: 15 }} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.youInfoLabel}>OVERALL PLAYERS:</Text>
                          <Text style={styles.youInfoValue}>{myExistingPost.overallPlayers}</Text>
                        </View>
                      </View>
                    ) : null}

                    {/* Posted Ago */}
                    <View style={styles.youInfoCard}>
                      <Icon name="time-outline" size={24} color="#4B5563" style={{ marginRight: 15 }} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.youInfoLabel}>POSTED AGO:</Text>
                        <Text style={styles.youInfoValue}>
                          {myExistingPost.created_at ? new Date(myExistingPost.created_at).toLocaleDateString() : 'N/A'}
                        </Text>
                      </View>
                    </View>

                    {/* Action Buttons */}
                    <TouchableOpacity
                      style={styles.youEditBtn}
                      onPress={() => {
                        setYouModalVisible(false);
                        navigation.navigate('CommunityAddScreen', { category, isEdit: true, post: myExistingPost });
                      }}
                    >
                      <Icon name="pencil" size={18} color="#E51025" style={{ marginRight: 8 }} />
                      <Text style={{ color: '#E51025', fontWeight: 'bold', fontSize: 16 }}>
                        Edit Post
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.youEditBtn, { borderColor: '#4B5563', marginTop: 10 }]}
                      onPress={handleDeletePost}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <ActivityIndicator size="small" color="#4B5563" />
                      ) : (
                        <>
                          <Icon name="trash-outline" size={18} color="#4B5563" style={{ marginRight: 8 }} />
                          <Text style={{ color: '#4B5563', fontWeight: 'bold', fontSize: 16 }}>
                            Delete Post
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                /* Empty state when user hasn't posted in this category */
                <View style={[styles.youCard, { paddingVertical: 40 }]}>
                  <View style={[styles.youAvatar, { backgroundColor: '#FEF2F2', justifyContent: 'center', alignItems: 'center' }]}>
                    <Icon name="albums-outline" size={40} color="#E51025" />
                  </View>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827', marginTop: 12 }}>
                    No Post in {category}
                  </Text>
                  <Text style={[styles.youSubtitle, { marginTop: 8 }]}>
                    You haven't posted any details for {category} yet. Create one to let players and organizations reach out to you.
                  </Text>

                  <TouchableOpacity
                    style={[styles.youEditBtn, { backgroundColor: '#E51025', borderColor: '#E51025', width: '100%', marginTop: 20 }]}
                    onPress={() => {
                      setYouModalVisible(false);
                      navigation.navigate('CommunityAddScreen', { category });
                    }}
                  >
                    <Icon name="add-circle" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 }}>
                      Create Post
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </KeyboardAwareScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default CommunityListScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111827', flex: 1, marginLeft: 12 },
  headerPostBtn: {
    backgroundColor: '#E51025',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10
  },
  headerPostBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 },
  headerYouBtn: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  headerYouBtnActive: {
    backgroundColor: '#111827',
  },
  headerYouBtnText: { color: '#4B5563', fontWeight: 'bold', fontSize: 12 },
  headerYouBtnTextActive: { color: '#FFFFFF' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginBottom: 4,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 46, fontSize: 15, color: '#111827' },
  listContainer: { padding: 16, paddingBottom: 120 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6'
  },
  cardHeader: { flexDirection: 'row', marginBottom: 12 },
  avatarContainer: { position: 'relative', marginRight: 12 },
  avatar: { width: 52, height: 52, borderRadius: 26, borderWidth: 1, borderColor: '#F3F4F6' },
  headerInfo: { flex: 1, justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: '800', color: '#111827', flex: 1, marginRight: 8 },
  categoryBadge: { backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  categoryBadgeText: { fontSize: 10, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5 },
  subName: { fontSize: 13, color: '#4B5563', marginTop: 4, fontWeight: '500' },
  experience: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  description: { fontSize: 14, color: '#374151', lineHeight: 22, marginBottom: 16 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  tagPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#F3F4F6' },
  tagText: { fontSize: 12, fontWeight: '600', color: '#4B5563' },
  cardFooter: { flexDirection: 'row', alignItems: 'center', paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  chatButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E51025',
    paddingVertical: 10,
    borderRadius: 8,
  },
  chatButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  iconButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginLeft: 10,
  },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#374151', marginTop: 12 },
  emptySubText: { fontSize: 14, color: '#9CA3AF', marginTop: 4, textAlign: 'center' },
  emptyActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E51025',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 20,
  },

  /* "YOUR POSTED DETAILS" MODAL STYLES (Matching Looking Screen exactly) */
  youHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#E51025',
  },
  youHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  youCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
  },
  youAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E7EB',
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  youSubtitle: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 12,
    marginBottom: 20,
    paddingHorizontal: 10,
    lineHeight: 18,
  },
  youInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    width: '100%',
  },
  youInfoLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  youInfoValue: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
  youEditBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 25,
    marginTop: 15,
    borderWidth: 1.5,
    borderColor: '#E51025',
    backgroundColor: '#FFFFFF',
    width: '100%',
  },
});
