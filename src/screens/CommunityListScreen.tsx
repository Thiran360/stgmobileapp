import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, FlatList, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { apiService } from '../api/index';
import { AppContext } from '../context/AppContext';

const CommunityListScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { category } = route.params || { category: 'Community' };

  const [posts, setPosts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyMine, setShowOnlyMine] = useState(false);
  const { userProfile, currentUserId } = useContext(AppContext);
  useEffect(() => {
    const fetchPosts = async () => {
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
    };
    fetchPosts();
  }, [category, route.params]);

    const filteredPosts = posts.filter(post => {
    if (showOnlyMine && post.postedBy !== userProfile?.username && post.user_id !== (userProfile?.id || currentUserId)) return false;
    return true;
  }).filter(post => 
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

  const renderPost = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.9} 
      onPress={() => navigation.navigate('CommunityPostDetailsScreen', { post: item, category })}
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
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{category}</Text>
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
        <TouchableOpacity 
          style={styles.chatButton}
          onPress={() => navigation.navigate('ChatScreen', { userId: item.user_id || item.id?.toString(), userName: item.postedBy || item.name || 'User', isGroup: false })}
        >
          <Icon name="chatbubble-ellipses" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.chatButtonText}>Message</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="bookmark-outline" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { if (showOnlyMine) { setShowOnlyMine(false); } else { navigation.goBack(); } }}>
          <Icon name="arrow-back" size={24} color={colors.textBlack} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category}</Text>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          style={{ backgroundColor: '#E51025', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, flexDirection: 'row', alignItems: 'center', marginRight: 10 }}
          onPress={() => navigation.navigate('CommunityAddScreen', { category })}
        >
          <Icon name="add-circle" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
          <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 }}>Post</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ backgroundColor: showOnlyMine ? '#111827' : '#F3F4F6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 }}
          onPress={() => setShowOnlyMine(!showOnlyMine)}
        >
          <Text style={{ color: showOnlyMine ? '#FFFFFF' : '#4B5563', fontWeight: 'bold', fontSize: 12 }}>You</Text>
        </TouchableOpacity>
      </View>

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

      <FlatList
        data={filteredPosts}
        renderItem={renderPost}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
                ListHeaderComponent={
          showOnlyMine ? (
            <View style={{ alignItems: 'center', paddingVertical: 30, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', marginBottom: 15 }}>
              <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#FEF2F2', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
                <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#E51025' }}>
                  {(userProfile?.username || 'U')[0].toUpperCase()}
                </Text>
              </View>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827' }}>{userProfile?.username || 'Your Posts'}</Text>
              <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>{filteredPosts.length} Posts in {category}</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="albums-outline" size={60} color="#D1D5DB" />
            <Text style={styles.emptyText}>No posts yet.</Text>
            <Text style={styles.emptySubText}>Be the first to post in {category}!</Text>
          </View>
        }
      />

      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111827', flex: 1, marginLeft: 12 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', margin: 16, marginBottom: 4, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 46, fontSize: 15, color: '#111827' },
  listContainer: { padding: 16, paddingBottom: 120 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3, borderWidth: 1, borderColor: '#F3F4F6' },
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
  chatButton: { flex: 1, flexDirection: 'row', backgroundColor: '#E51025', paddingVertical: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  chatButtonText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  iconButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center' },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { fontSize: 18, fontWeight: '800', color: '#111827', marginTop: 16 },
  emptySubText: { fontSize: 14, color: '#6B7280', marginTop: 8 },
  fab: { position: 'absolute', right: 20, bottom: 40, width: 56, height: 56, borderRadius: 28, backgroundColor: '#E51025', justifyContent: 'center', alignItems: 'center', elevation: 4 },
});

export default CommunityListScreen;
























