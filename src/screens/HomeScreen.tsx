import React, { useState, useRef, useContext, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, useWindowDimensions, ImageBackground, FlatList, StatusBar, Linking, Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../theme/colors';
import { AppContext } from '../context/AppContext';
import { apiService } from '../api/index';
import { MEDIA_URL } from '../api/config';

const HomeScreen = ({ route, navigation }: any) => {
  const userName = route?.params?.userName || 'Guest';
  const { width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState<'foryou' | 'proclub'>('foryou');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageAspectRatios, setImageAspectRatios] = useState<Record<string, number>>({});
  const slideRef = useRef<ScrollView>(null);
  const { globalTournaments, userProfile, fetchTournaments } = useContext(AppContext);

  const [apiCarousel, setApiCarousel] = useState<any[]>([]);
  
  useEffect(() => {
    apiService.getHomeData().then(data => {
      if (data && data.carousel) setApiCarousel(data.carousel);
    }).catch(e => console.log('Home API error:', e));
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (fetchTournaments) fetchTournaments();
    }, [])
  );

  const dummyCarousel = [
    { id: '1', image: require('../assets/images/bgmi_banner1.jpg'), tag: '🔥 SUPER ULTRA', title: 'BATTLEGROUNDS WARZONE', subtitle: 'Action Packed Esports' },
    { id: '2', image: require('../assets/images/bgmi_banner2.jpg'), tag: '⚡ LIVE SCRIMS', title: 'ULTIMATE SHOWDOWN', subtitle: 'Compete with the Best' },
  ];

  const carouselItems = apiCarousel.length > 0 ? apiCarousel : dummyCarousel;

  useEffect(() => {
    const timer = setInterval(() => {
      if (carouselItems.length > 0) {
        const nextSlide = (currentSlide + 1) % carouselItems.length;
        slideRef.current?.scrollTo({ x: nextSlide * width, animated: true });
        setCurrentSlide(nextSlide);
      }
    }, 4000);
    return () => clearInterval(timer);
  }, [currentSlide, width, carouselItems.length]);

  const handleSocialLink = (platform: string, link: string) => {
    if (!link) return;
    let url = link.trim();
    if (platform === 'instagram' && !url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://instagram.com/${url.replace('@', '')}`;
    } else if (platform === 'youtube' && !url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://youtube.com/@${url.replace('@', '')}`;
    } else if (platform === 'discord' && !url.startsWith('http://') && !url.startsWith('https://')) {
      Alert.alert('Discord Tag', `Discord ID: ${link}`);
      return;
    }
    Linking.openURL(url).catch(() => Alert.alert('Social Link', `${platform}: ${link}`));
  };

  const getStatusConfig = (st?: string) => {
    const s = (st || 'Active').toLowerCase();
    if (s === 'live' || s === 'running') {
      return { label: 'LIVE', bg: '#E51025', showDot: true };
    }
    if (s === 'completed' || s === 'closed' || s === 'finished' || s === 'ended') {
      return { label: 'CLOSED', bg: '#4B5563', showDot: false };
    }
    return { label: 'UPCOMING', bg: '#16A34A', showDot: true };
  };

  const renderTournamentCard = ({ item: tournament }: any) => {
    const statusCfg = getStatusConfig(tournament.status);
    const totalSlots = tournament.totalSlots || tournament.teamsLimit || '100';
    const isFree = !tournament.entryFee || tournament.entryFee === '0' || tournament.entryFee.toLowerCase?.() === 'free';

    return (
      <TouchableOpacity 
        style={styles.tournamentCard} 
        onPress={() => navigation.navigate('TeamRegistration', { tournamentId: tournament.id, tournamentName: tournament.name })} 
        activeOpacity={0.9}
      >
        {/* POSTER BANNER (FITTED FOR MOBILE) */}
        {tournament.bannerImage ? (
          <View style={styles.bannerContainer}>
            <Image
              source={typeof tournament.bannerImage === 'string' ? { uri: tournament.bannerImage } : tournament.bannerImage}
              style={[styles.cardBanner, { aspectRatio: imageAspectRatios[tournament.id] || 16 / 9 }]}
              resizeMode="cover"
              onLoad={(e) => {
                if (e.nativeEvent.source) {
                  const { width: w, height: h } = e.nativeEvent.source;
                  if (w && h) {
                    const ratio = Math.min(2.1, Math.max(1.3, w / h));
                    setImageAspectRatios(prev => ({ ...prev, [tournament.id]: ratio }));
                  }
                }
              }}
            />
          </View>
        ) : null}

        {/* TOP BADGES ROW */}
        <View style={styles.cardTopRow}>
          <View style={styles.cardBadge}>
            <Text style={styles.cardBadgeText}>{tournament.game || 'BGMI'}</Text>
          </View>

          {/* FREE / PAID SLOTS BADGE */}
          <View style={[styles.entryBadge, { backgroundColor: isFree ? '#DCFCE7' : '#FEF3C7' }]}>
            <Icon name={isFree ? "gift-outline" : "ticket-outline"} size={12} color={isFree ? '#16A34A' : '#D97706'} style={{ marginRight: 3 }} />
            <Text style={[styles.entryBadgeText, { color: isFree ? '#16A34A' : '#D97706' }]}>
              {isFree ? 'FREE SLOTS' : 'PAID SLOTS'}
            </Text>
          </View>

          {/* DYNAMIC STATUS BADGE */}
          <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
            {statusCfg.showDot && <View style={styles.statusDot} />}
            <Text style={styles.statusText}>{statusCfg.label}</Text>
          </View>
        </View>

        {/* ORGANISATION NAME (BIGGER & SEPARATELY HIGHLIGHTED) */}
        <View style={styles.orgRow}>
          <Icon name="shield-checkmark" size={16} color="#E51025" style={{ marginRight: 6 }} />
          <Text style={styles.orgName} numberOfLines={1}>
            {(tournament.organiserName || 'UPMI ESPORTS').toUpperCase()}
          </Text>
          <View style={styles.presentsPill}>
            <Text style={styles.presentsText}>PRESENTS</Text>
          </View>
        </View>

        {/* TOURNAMENT NAME (PROMINENT HIGHLIGHT) */}
        <Text style={styles.tournamentName} numberOfLines={2}>
          {tournament.name}
        </Text>

        {/* REGISTRATION DATES (OPENING & END DATE) */}
        <View style={styles.datesRow}>
          <View style={styles.dateCol}>
            <Icon name="calendar-outline" size={13} color="#2563EB" style={{ marginRight: 4 }} />
            <Text style={styles.dateLabel}>Opens: </Text>
            <Text style={styles.dateValue}>{tournament.regStartDate || 'Open Now'}</Text>
          </View>
          <View style={styles.dateCol}>
            <Icon name="time-outline" size={13} color="#DC2626" style={{ marginRight: 4 }} />
            <Text style={styles.dateLabel}>Ends: </Text>
            <Text style={styles.dateValue}>{tournament.regEndDate || tournament.time || 'Closing Soon'}</Text>
          </View>
        </View>

        {/* PRIZE POOL & SLOTS (SEPARATELY HIGHLIGHTED) */}
        <View style={styles.prizePill}>
          <View style={styles.trophyIconBox}>
            <Icon name="trophy" size={20} color="#D97706" />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.prizeLabel}>TOTAL PRIZE POOL</Text>
            <Text style={styles.prizeText}>{tournament.prize || 'Prize TBD'}</Text>
          </View>
          <View style={styles.slotsChip}>
            <Icon name="people" size={13} color="#FFF" style={{ marginRight: 4 }} />
            <Text style={styles.slotsText}>{totalSlots} Slots</Text>
            <Text style={styles.slotsSubText}>(Limited)</Text>
          </View>
        </View>

        {/* SOCIAL MEDIA CHANNELS ON TOURNAMENT POSTER */}
        {(() => {
          const ig = tournament.socialMedia1 || (tournament.socialMedia && tournament.socialMedia[0]);
          const yt = tournament.socialMedia2 || (tournament.socialMedia && tournament.socialMedia[1]);
          const dc = tournament.socialMedia3 || (tournament.socialMedia && tournament.socialMedia[2]);
          if (!ig && !yt && !dc) return null;
          return (
            <View style={styles.socialMediaRow}>
              <Text style={styles.socialMediaLabel}>Official Links:</Text>
              <View style={styles.socialBadgesGroup}>
                {!!ig && (
                  <TouchableOpacity 
                    style={[styles.socialPill, { borderColor: '#E1306C' }]} 
                    onPress={() => handleSocialLink('instagram', ig)}
                    activeOpacity={0.7}
                  >
                    <Icon name="logo-instagram" size={13} color="#E1306C" style={{ marginRight: 4 }} />
                    <Text style={[styles.socialPillText, { color: '#E1306C' }]}>Instagram</Text>
                  </TouchableOpacity>
                )}
                {!!yt && (
                  <TouchableOpacity 
                    style={[styles.socialPill, { borderColor: '#FF0000' }]} 
                    onPress={() => handleSocialLink('youtube', yt)}
                    activeOpacity={0.7}
                  >
                    <Icon name="logo-youtube" size={13} color="#FF0000" style={{ marginRight: 4 }} />
                    <Text style={[styles.socialPillText, { color: '#FF0000' }]}>YouTube</Text>
                  </TouchableOpacity>
                )}
                {!!dc && (
                  <TouchableOpacity 
                    style={[styles.socialPill, { borderColor: '#5865F2' }]} 
                    onPress={() => handleSocialLink('discord', dc)}
                    activeOpacity={0.7}
                  >
                    <Icon name="logo-discord" size={13} color="#5865F2" style={{ marginRight: 4 }} />
                    <Text style={[styles.socialPillText, { color: '#5865F2' }]}>Discord</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })()}

        {/* REGISTER BUTTON */}
        <TouchableOpacity
          style={styles.registerBtn}
          onPress={() => navigation.navigate('TeamRegistration', { tournamentId: tournament.id, tournamentName: tournament.name })}
          activeOpacity={0.85}
        >
          <Text style={styles.registerBtnText}>REGISTER NOW</Text>
          <Icon name="chevron-forward" size={16} color="#FFF" style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F5F7' }}>
      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[1]}>
        
        {/* CAROUSEL */}
        <View>
          <ScrollView
            ref={slideRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onMomentumScrollEnd={(e) => {
              const slide = Math.round(e.nativeEvent.contentOffset.x / width);
              setCurrentSlide(slide);
            }}
          >
            {carouselItems.map((item, index) => (
              <View key={item.id || index} style={{ width, height: 180, paddingHorizontal: 15, paddingTop: 10 }}>
                <ImageBackground
                  source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                  style={styles.bannerCard}
                  imageStyle={{ borderRadius: 16 }}
                >
                  <View style={styles.bannerOverlay}>
                    {item.tag && <Text style={styles.tagText}>{item.tag}</Text>}
                    <Text style={styles.bannerTitle}>{item.title}</Text>
                    <Text style={styles.bannerSub}>{item.subtitle}</Text>
                    <TouchableOpacity style={styles.bannerBtn}>
                      <Text style={styles.bannerBtnText}>JOIN NOW</Text>
                      <Icon name="chevron-forward" size={14} color="#000" style={{ marginLeft: 2 }} />
                    </TouchableOpacity>
                  </View>
                </ImageBackground>
              </View>
            ))}
          </ScrollView>

          {/* Dots Indicator */}
          <View style={styles.dotsContainer}>
            {carouselItems.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  currentSlide === i ? styles.dotActive : styles.dotInactive
                ]}
              />
            ))}
          </View>
        </View>

        {/* STICKY SEGMENTED TABS */}
        <View style={styles.tabContainerWrapper}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'foryou' && styles.tabBtnActive]}
              onPress={() => setActiveTab('foryou')}
            >
              <Text style={[styles.tabText, activeTab === 'foryou' && styles.tabTextActive]}>For You</Text>
              {activeTab === 'foryou' && <View style={styles.tabDot} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'proclub' && styles.tabBtnActive]}
              onPress={() => setActiveTab('proclub')}
            >
              <Text style={[styles.tabText, activeTab === 'proclub' && styles.tabTextActive]}>PRO Club</Text>
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>NEW</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* TAB CONTENTS */}
        {activeTab === 'foryou' ? (
          <>
            {/* Tournaments near you */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Tournaments near you</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Matches', { initialTab: 'Tournaments' })}>
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            </View>

            {globalTournaments.length > 0 ? (
              <FlatList
                data={globalTournaments}
                renderItem={renderTournamentCard}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 20 }}
                ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.emptyCard}>
                <Icon name="trophy-outline" size={40} color="#D1D5DB" />
                <Text style={styles.emptyText}>No tournaments available right now.</Text>
              </View>
            )}

            <View style={{ height: 30 }} />
          </>
                ) : (
          /* PRO CLUB COMING SOON STATIC POSTER */
          <View style={styles.proComingSoonContainer}>
            <View style={styles.proPosterCard}>
              <View style={styles.proIconCircle}>
                <Icon name="shield-checkmark" size={44} color="#E51025" />
              </View>

              <View style={styles.proTagBadge}>
                <View style={styles.proTagDot} />
                <Text style={styles.proTagText}>UPMI EXCLUSIVE</Text>
              </View>

              <Text style={styles.proBrandTitle}>PRO CLUB</Text>
              
              <View style={styles.proDivider} />

              <Text style={styles.proComingSoonText}>COMING SOON</Text>
              
              <Text style={styles.proSubtitle}>
                Exclusive Tier 1 Scrims, Verified Tournaments & Esports Pass
              </Text>

              <View style={styles.proFooterNote}>
                <Icon name="sparkles" size={15} color="#F59E0B" style={{ marginRight: 6 }} />
                <Text style={styles.proFooterNoteText}>Launching Soon • Stay Tuned</Text>
              </View>
            </View>
          </View>
        )}

</ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  /* BANNER */
  bannerCard: { width: '100%', height: '100%', overflow: 'hidden' },
  bannerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 16, padding: 16, justifyContent: 'center' },
  tagText: { color: '#FF3B30', fontSize: 11, fontWeight: '800', marginBottom: 4, letterSpacing: 0.5 },
  bannerTitle: { color: '#FFD700', fontSize: 18, fontWeight: '900', letterSpacing: 0.5 },
  bannerSub: { color: '#D1D5DB', fontSize: 12, marginBottom: 12 },
  bannerBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FBBF24', alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  bannerBtnText: { color: '#000', fontSize: 11, fontWeight: '900' },

  /* DOTS */
  dotsContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10, gap: 6 },
  dot: { height: 6, borderRadius: 3 },
  dotActive: { width: 18, backgroundColor: colors.primary },
  dotInactive: { width: 6, backgroundColor: '#D1D5DB' },

  /* TABS */
  tabContainerWrapper: { backgroundColor: '#F4F5F7', paddingHorizontal: 15, paddingVertical: 12 },
  tabContainer: { flexDirection: 'row', backgroundColor: '#E5E7EB', borderRadius: 14, padding: 4 },
  tabBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 10 },
  tabBtnActive: { backgroundColor: colors.primary, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 4 },
  tabText: { fontSize: 14, fontWeight: '700', color: '#6B7280' },
  tabTextActive: { color: '#fff' },
  tabDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#FBBF24', marginLeft: 6 },
  newBadge: { backgroundColor: '#FBBF24', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginLeft: 6 },
  newBadgeText: { color: '#000', fontSize: 9, fontWeight: '900' },

  /* SECTION */
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginTop: 15, marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: '#111827' },
  viewAll: { fontSize: 13, color: colors.primary, fontWeight: '700' },

  /* TOURNAMENT CARD */
  tournamentCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
    width: '100%'
  },
  bannerContainer: { width: '100%', borderRadius: 14, overflow: 'hidden', marginBottom: 12 },
  cardBanner: { width: '100%', minHeight: 160 },
  
  cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  cardBadge: { backgroundColor: '#FEF2F2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: '#FEE2E2' },
  cardBadgeText: { color: colors.primary, fontSize: 11, fontWeight: '800' },
  entryBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  entryBadgeText: { fontSize: 10, fontWeight: '800' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff', marginRight: 5 },
  statusText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },

  /* ORGANIZATION HIGHLIGHT */
  orgRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  orgName: { fontSize: 15, color: '#E51025', fontWeight: '900', letterSpacing: 0.3, flexShrink: 1 },
  presentsPill: { backgroundColor: '#FEE2E2', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginLeft: 6 },
  presentsText: { color: '#DC2626', fontSize: 9, fontWeight: '800' },

  tournamentName: { fontSize: 20, fontWeight: '900', color: '#111827', marginBottom: 8, lineHeight: 26 },

  /* DATES */
  datesRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    backgroundColor: '#F9FAFB', 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 10,
    marginBottom: 10
  },
  dateCol: { flexDirection: 'row', alignItems: 'center' },
  dateLabel: { fontSize: 11, color: '#6B7280', fontWeight: '700' },
  dateValue: { fontSize: 11, color: '#111827', fontWeight: '800' },

  /* PRIZE POOL */
  prizePill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFBEB', paddingHorizontal: 12, paddingVertical: 10,
    borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#FDE68A',
  },
  trophyIconBox: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FEF3C7', justifyContent: 'center', alignItems: 'center' },
  prizeLabel: { fontSize: 10, color: '#92400E', fontWeight: '800', letterSpacing: 0.5 },
  prizeText: { fontSize: 16, fontWeight: '900', color: '#B45309' },
  slotsChip: { backgroundColor: '#1F2937', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, alignItems: 'center' },
  slotsText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  slotsSubText: { color: '#9CA3AF', fontSize: 9, fontWeight: '600' },

  /* SOCIAL MEDIA */
  socialMediaRow: { marginBottom: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 10 },
  socialMediaLabel: { fontSize: 11, fontWeight: '700', color: '#6B7280', marginBottom: 6 },
  socialBadgesGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  socialPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16, borderWidth: 1, backgroundColor: '#FAFAFA' },
  socialPillText: { fontSize: 11, fontWeight: '700' },

  /* REGISTER BUTTON */
  registerBtn: {
    backgroundColor: colors.primary, 
    borderRadius: 30, 
    paddingVertical: 13, 
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary, 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.35, 
    shadowRadius: 8, 
    elevation: 4,
  },
  registerBtnText: { color: '#fff', fontWeight: '900', fontSize: 14, letterSpacing: 0.5 },

  /* EMPTY */
  emptyCard: {
    marginHorizontal: 15, backgroundColor: '#fff', borderRadius: 16, padding: 40,
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  emptyText: { marginTop: 12, color: '#9CA3AF', fontSize: 14, fontWeight: '500' },

    /* PRO CLUB COMING SOON */
  proComingSoonContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 60,
    alignItems: 'center',
  },
  proPosterCard: {
    width: '100%',
    backgroundColor: '#131722',
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#262D40',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  proIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1C1522',
    borderWidth: 2,
    borderColor: '#E51025',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    shadowColor: '#E51025',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
  },
  proTagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E2333',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#374151',
    marginBottom: 14,
  },
  proTagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E51025',
    marginRight: 6,
  },
  proTagText: {
    color: '#9CA3AF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  proBrandTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
    textAlign: 'center',
  },
  proDivider: {
    width: 44,
    height: 3,
    backgroundColor: '#E51025',
    borderRadius: 2,
    marginVertical: 14,
  },
  proComingSoonText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#E51025',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 10,
  },
  proSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
    marginBottom: 22,
  },
  proFooterNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1F2C',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  proFooterNoteText: {
    color: '#F3F4F6',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default HomeScreen;
