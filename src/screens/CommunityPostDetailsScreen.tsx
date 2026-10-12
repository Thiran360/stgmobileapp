import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../theme/colors';

const CommunityPostDetailsScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { post, category } = route.params;

    const openLink = (url: string) => {
    if (!url) return;
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    Linking.openURL(formattedUrl).catch(err => console.log('Error opening link:', err));
  };

  const handleContact = () => {
    // Navigate to ChatScreen with dummy user info
    navigation.navigate('ChatScreen', { userId: Math.random().toString(), userName: post.postedBy || post.name, isGroup: false });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.textBlack} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post Details</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topSection}>
          {post.logo ? (
            <Image source={{ uri: post.logo }} style={styles.avatarLarge} />
          ) : (
            <View style={[styles.avatarLarge, { backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' }]}>
              <Icon name="business" size={40} color="#9CA3AF" />
            </View>
          )}
          <Text style={styles.name}>{post.name || post.orgName}</Text>
          {(post.name && post.orgName) ? <Text style={styles.subName}>{post.orgName} - Owner: {post.ownerName}</Text> : null}
          {(!post.name && post.ownerName) ? <Text style={styles.subName}>Owner: {post.ownerName}</Text> : null}
          <Text style={styles.badgeText}>{category}</Text>
          <Text style={styles.postedByText}>Posted by: <Text style={{ fontWeight: 'bold' }}>{post.postedBy || 'Anonymous'}</Text></Text>
        </View>

        <View style={styles.infoRow}>
          {(post.experience || post.lanExperience) && (
            <View style={styles.infoBox}>
              <Icon name="briefcase-outline" size={20} color="#E51025" />
              <Text style={styles.infoBoxText}>{post.experience || post.lanExperience} Exp</Text>
            </View>
          )}
          {post.since && (
            <View style={styles.infoBox}>
              <Icon name="calendar-outline" size={20} color="#E51025" />
              <Text style={styles.infoBoxText}>Since {post.since}</Text>
            </View>
          )}
          {post.overallPlayers && (
            <View style={styles.infoBox}>
              <Icon name="people-outline" size={20} color="#E51025" />
              <Text style={styles.infoBoxText}>{post.overallPlayers}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{post.description || 'No description provided.'}</Text>
        </View>

          {post.previousWork ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {category === 'Production house' ? 'Work Details' : (category === 'Scrims Organizer' || category === 'Tournament Organizer' ? `Previous ${category} Details` : 'Previous Work Details')}
            </Text>
            <View style={styles.detailsBox}>
              <Text style={styles.detailsText}>{post.previousWork}</Text>
            </View>
          </View>
        ) : null}

        {post.achievements ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <View style={styles.detailsBox}>
              <Text style={styles.detailsText}>{post.achievements}</Text>
            </View>
          </View>
        ) : null}

        {(post.youtube || post.instagram || post.discord || post.website) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{post.ownerName ? 'Org Socials' : 'Social Media'}</Text>
            <View style={styles.socialCol}>
              {post.youtube ? (
                <TouchableOpacity style={styles.socialLinkRow} onPress={() => openLink(post.youtube)}>
                  <Icon name="logo-youtube" size={24} color="#FF0000" />
                  <Text style={[styles.socialLinkText, styles.linkText]}>{post.youtube}</Text>
                </TouchableOpacity>
              ) : null}
              {post.instagram ? (
                <TouchableOpacity style={styles.socialLinkRow} onPress={() => openLink(post.instagram)}>
                  <Icon name="logo-instagram" size={24} color="#E1306C" />
                  <Text style={[styles.socialLinkText, styles.linkText]}>{post.instagram}</Text>
                </TouchableOpacity>
              ) : null}
              {post.discord ? (
                <TouchableOpacity style={styles.socialLinkRow} onPress={() => openLink(post.discord)}>
                  <Icon name="logo-discord" size={24} color="#5865F2" />
                  <Text style={[styles.socialLinkText, styles.linkText]}>{post.discord}</Text>
                </TouchableOpacity>
              ) : null}
              {post.website ? (
                <TouchableOpacity style={styles.socialLinkRow} onPress={() => openLink(post.website)}>
                  <Icon name="globe-outline" size={24} color="#0284C7" />
                  <Text style={[styles.socialLinkText, styles.linkText]}>{post.website}</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        )}

        {(post.ownerYoutube || post.ownerInstagram || post.ownerDiscord || post.ownerWebsite) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Owner Socials</Text>
            <View style={styles.socialCol}>
              {post.ownerYoutube ? (
                <TouchableOpacity style={styles.socialLinkRow} onPress={() => openLink(post.ownerYoutube)}>
                  <Icon name="logo-youtube" size={24} color="#FF0000" />
                  <Text style={[styles.socialLinkText, styles.linkText]}>{post.ownerYoutube}</Text>
                </TouchableOpacity>
              ) : null}
              {post.ownerInstagram ? (
                <TouchableOpacity style={styles.socialLinkRow} onPress={() => openLink(post.ownerInstagram)}>
                  <Icon name="logo-instagram" size={24} color="#E1306C" />
                  <Text style={[styles.socialLinkText, styles.linkText]}>{post.ownerInstagram}</Text>
                </TouchableOpacity>
              ) : null}
              {post.ownerDiscord ? (
                <TouchableOpacity style={styles.socialLinkRow} onPress={() => openLink(post.ownerDiscord)}>
                  <Icon name="logo-discord" size={24} color="#5865F2" />
                  <Text style={[styles.socialLinkText, styles.linkText]}>{post.ownerDiscord}</Text>
                </TouchableOpacity>
              ) : null}
              {post.ownerWebsite ? (
                <TouchableOpacity style={styles.socialLinkRow} onPress={() => openLink(post.ownerWebsite)}>
                  <Icon name="globe-outline" size={24} color="#0284C7" />
                  <Text style={[styles.socialLinkText, styles.linkText]}>{post.ownerWebsite}</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.contactBtn} onPress={handleContact}>
          <Icon name="chatbubble-ellipses" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.contactBtnText}>Chat with {post.name}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginLeft: 15 },
  content: { padding: 20 },
  topSection: { alignItems: 'center', marginBottom: 25 },
  avatarLarge: { width: 100, height: 100, borderRadius: 50, marginBottom: 15, backgroundColor: '#FEF2F2' },
  name: { fontSize: 22, fontWeight: 'bold', color: '#111827', textAlign: 'center' },
  subName: { fontSize: 15, color: '#4B5563', marginTop: 4, textAlign: 'center' },
  badgeText: { fontSize: 12, fontWeight: 'bold', color: '#E51025', backgroundColor: '#FEF2F2', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginTop: 10, overflow: 'hidden' },
  postedByText: { fontSize: 13, color: '#6B7280', marginTop: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 25 },
  infoBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#F3F4F6' },
  infoBoxText: { fontSize: 13, fontWeight: '600', color: '#374151', marginLeft: 6 },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 10 },
  description: { fontSize: 15, color: '#4B5563', lineHeight: 22 },
  detailsBox: { backgroundColor: '#F9FAFB', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#F3F4F6' },
  detailsText: { fontSize: 14, color: '#1F2937', lineHeight: 22 },
  socialCol: { gap: 12, marginTop: 5 },
  socialLinkRow: { flexDirection: 'row', alignItems: 'center' },
  socialLinkText: { fontSize: 14, color: '#1F2937', marginLeft: 10 },
  linkText: { color: '#E51025', textDecorationLine: 'underline' },
  socialIcon: { opacity: 0.9 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 15, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  contactBtn: { flexDirection: 'row', backgroundColor: '#E51025', paddingVertical: 14, borderRadius: 12, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  contactBtnText: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' }
});

export default CommunityPostDetailsScreen;










