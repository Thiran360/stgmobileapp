import React, { useState, useRef, useContext, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, useWindowDimensions, ImageBackground, FlatList, StatusBar
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
    }).catch(e => console.log('API Home error', e));
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (fetchTournaments) fetchTournaments();
    }, [])
  );

  const dummyCarousel = [
    { id: '1', image: require('../assets/images/bgmi_banner1.jpg'), tag: 'Ã°Å¸â€Â¥ SUPER ULTRA', title: 'BATTLEGROUNDS WARZONE', subtitle: 'Action Packed Esports' },
    { id: '2', image: require('../assets/images/bgmi_banner2.jpg'), tag: 'Ã°Å¸Ââ€  CHAMPIONSHIP', title: 'ULTIMATE SHOWDOWN', subtitle: 'Compete in Tense Arenas' },
    { id: '3', image: require('../assets/images/banner3.jpg'), tag: 'Ã°Å¸â€Â´ LIVE NOW', title: 'SCRIMS FINALS', subtitle: 'Join the Ultimate Community' },
  ];

  useEffect(() => {
    const slideInterval = setInterval(() => {
      const activeCarousel = apiCarousel.length > 0 ? apiCarousel : dummyCarousel;
      const nextSlide = (currentSlide + 1) % activeCarousel.length;
      setCurrentSlide(nextSlide);
      slideRef.current?.scrollTo({ x: nextSlide * width, animated: true });
    }, 3500);
    return () => clearInterval(slideInterval);
  }, [currentSlide, width]);

  const renderTournamentCard = ({ item: tournament }: any) => (
    <TouchableOpacity style={[styles.tournamentCard, { width: '100%' }]} onPress={() => navigation.navigate('TeamRegistration', { tournamentId: tournament.id, tournamentName: tournament.name })} activeOpacity={0.9}>
      {tournament.bannerImage && (
        <Image
          source={typeof tournament.bannerImage === 'string' ? { uri: tournament.bannerImage } : tournament.bannerImage}
          style={styles.cardBanner}
          onLoad={(e) => {
            if (e.nativeEvent.source) {
              const { width: w, height: h } = e.nativeEvent.source;
              if (w && h) setImageAspectRatios(prev => ({ ...prev, [tournament.id]: w / h }));
            }
          }}
        />
      )}
      <View style={styles.cardTopRow}>
        <View style={styles.cardBadge}>
          <Text style={styles.cardBadgeText}>{tournament.game || 'BGMI'}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: tournament.status === 'upcoming' ? '#16A34A' : '#E51025' }]}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>{(tournament.status || 'OPEN').toUpperCase()}</Text>
        </View>
      </View>

      <Text style={styles.orgName}>{tournament.organiserName || 'UPMI Esports'}</Text>
      <Text style={styles.tournamentName}>{tournament.name}</Text>
      {tournament.time ? <Text style={styles.tournamentTime}><Icon name="time-outline" size={12} color="#6B7280" /> {tournament.time}</Text> : null}

      <View style={styles.prizePill}>
        <Icon name="trophy" size={16} color="#D97706" />
        <Text style={styles.prizeText}>{tournament.prize || 'Prize TBD'}</Text>
        <View style={styles.slotsChip}>
          <Text style={styles.slotsText}>{tournament.totalSlots || tournament.teamsLimit || 0} Slots</Text>
        </View>
      </View>

      {(tournament.regStartDate || tournament.regEndDate) && (
        <View style={styles.regRow}>
          <Icon name="calendar-outline" size={13} color="#16A34A" />
          <Text style={styles.regText}>
            {' Reg: '}{tournament.regStartDate || 'Now'} - {tournament.regEndDate || 'TBD'}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.registerBtn}
        onPress={() => navigation.navigate('TeamRegistration', { tournamentId: tournament.id, tournamentName: tournament.name })}
        activeOpacity={0.85}
      >
        <Text style={styles.registerBtnText}>REGISTER NOW</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

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
            onMomentumScrollEnd={(e) => {
              const x = e.nativeEvent.contentOffset.x;
              setCurrentSlide(Math.round(x / width));
            }}
          >
            {(apiCarousel.length > 0 ? apiCarousel : dummyCarousel).map((slide, index) => (
              <View key={slide.id} style={{ width, height: 210 }}>
                <ImageBackground 
                  source={
                    typeof slide.image === 'string' 
                      ? { uri: slide.image.startsWith('http') ? slide.image : `${MEDIA_URL}${slide.image}` } 
                      : slide.image
                  } 
                  style={{ flex: 1 }} 
                  imageStyle={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
                >
                  <View style={styles.bannerOverlay}>
                    <View style={styles.bannerTag}><Text style={styles.bannerTagText}>{slide.tag}</Text></View>
                    <View style={styles.bannerBottom}>
                      <Text style={styles.bannerTitle}>{slide.title}</Text>
                      <Text style={styles.bannerSub}>{slide.subtitle}</Text>
                      <TouchableOpacity style={styles.joinBtn}>
                        <Text style={styles.joinBtnText}>JOIN NOW</Text>
                        <Icon name="chevron-forward" size={16} color="#000" style={{ marginLeft: 4 }} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </ImageBackground>
              </View>
            ))}
          </ScrollView>
          
          <View style={styles.dots}>
            {(apiCarousel.length > 0 ? apiCarousel : dummyCarousel).map((_, i) => (
              <View key={i} style={[styles.dot, currentSlide === i && styles.dotActive]} />
            ))}
          </View>
        </View>

        {/* TAB BAR (Sticky, now index 1) */}
        <View style={styles.tabBar}>
          <View style={styles.segmentedControl}>
            <TouchableOpacity
              style={[styles.segmentBtn, activeTab === 'foryou' && styles.segmentBtnActive]}
              onPress={() => setActiveTab('foryou')}
              activeOpacity={0.8}
            >
              {activeTab === 'foryou' && <View style={styles.segmentGlow} />}
              <Text style={[styles.segmentText, activeTab === 'foryou' && styles.segmentTextActive]}>For You</Text>
              {activeTab === 'foryou' && <View style={styles.segmentDot} />}
            </TouchableOpacity>
            
            <View style={styles.segmentDivider} />
            
            <TouchableOpacity
              style={[styles.segmentBtn, activeTab === 'proclub' && styles.segmentBtnActive]}
              onPress={() => setActiveTab('proclub')}
              activeOpacity={0.8}
            >
              {activeTab === 'proclub' && <View style={styles.segmentGlow} />}
              <Text style={[styles.segmentText, activeTab === 'proclub' && styles.segmentTextActive]}>PRO Club</Text>
              <View style={styles.proBadgeChip}>
                <Text style={styles.proBadgeChipText}>NEW</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {activeTab === 'foryou' ? (
          <>
            {/* TOURNAMENTS SECTION */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Tournaments near you</Text>
              <TouchableOpacity>
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
                ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
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
          /* PRO CLUB TAB */
          <View style={styles.proContainer}>
            <View style={styles.proGlow} />
            <Icon name="star" size={60} color="#FBBF24" style={{ marginBottom: 16 }} />
            <Text style={styles.proTitle}>PRO Club</Text>
            <Text style={styles.proSub}>Unlock exclusive tournaments, scrims and pro-level features.</Text>
            <TouchableOpacity style={styles.upgradeBtn}>
              <Icon name="flash" size={16} color="#000" style={{ marginRight: 8 }} />
              <Text style={styles.upgradeBtnText}>Upgrade to PRO @ Ã¢â€šÂ¹1199</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  /* TAB BAR */
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  segmentedControl: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    padding: 4,
    alignItems: 'center',
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  segmentBtnActive: {
    backgroundColor: '#E51025',
    shadowColor: '#E51025',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  segmentGlow: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 10,
  },
  segmentText: { fontSize: 14, fontWeight: '700', color: '#9CA3AF' },
  segmentTextActive: { color: '#fff' },
  segmentDot: {
    width: 5, height: 5, borderRadius: 3,
    backgroundColor: '#FBBF24', marginLeft: 6,
  },
  segmentDivider: {
    width: 1, height: 22, backgroundColor: '#D1D5DB', marginHorizontal: 2,
  },
  proBadgeChip: {
    backgroundColor: '#FBBF24', paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: 6, marginLeft: 6,
  },
  proBadgeChipText: { fontSize: 9, fontWeight: '900', color: '#000' },
  tabPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 22, paddingVertical: 9, borderRadius: 30, backgroundColor: '#F3F4F6' },
  tabPillActive: { backgroundColor: colors.primary },
  tabPillText: { fontSize: 14, fontWeight: '700', color: '#6B7280' },

  /* BANNER */
  bannerOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  bannerTag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderBottomRightRadius: 14,
  },
  bannerTagText: { color: '#fff', fontSize: 11, fontWeight: '900', letterSpacing: 0.5 },
  bannerBottom: {
    padding: 20,
    backgroundColor: 'transparent',
  },
  bannerTitle: {
    fontSize: 20, fontWeight: '900', color: '#FBBF24', textTransform: 'uppercase',
    letterSpacing: 1, marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.9)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 6,
  },
  bannerSub: {
    fontSize: 13, color: '#fff', marginBottom: 14,
    textShadowColor: 'rgba(0,0,0,0.9)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4,
  },
  joinBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FBBF24', borderRadius: 30, paddingVertical: 12, paddingHorizontal: 24, alignSelf: 'flex-start',
  },
  joinBtnText: { fontWeight: '900', fontSize: 14, color: '#000' },
  dots: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 10, backgroundColor: '#fff', gap: 6 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#D1D5DB' },
  dotActive: { width: 22, backgroundColor: colors.primary },

  /* SECTION */
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginTop: 20, marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: '#111827' },
  viewAll: { fontSize: 13, color: colors.primary, fontWeight: '700' },

  /* TOURNAMENT CARD */
  tournamentCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
  },
  cardBanner: { width: '100%', height: 140, borderRadius: 12, marginBottom: 12, resizeMode: 'cover' },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardBadge: { backgroundColor: '#FEF2F2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  cardBadgeText: { color: colors.primary, fontSize: 11, fontWeight: '800' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff', marginRight: 5 },
  statusText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  orgName: { fontSize: 11, color: colors.primary, fontWeight: '800', textTransform: 'uppercase', marginBottom: 2 },
  tournamentName: { fontSize: 18, fontWeight: '900', color: '#111827', marginBottom: 4 },
  tournamentTime: { fontSize: 12, color: '#6B7280', marginBottom: 10 },
  prizePill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(251,191,36,0.12)', paddingHorizontal: 12, paddingVertical: 10,
    borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: 'rgba(251,191,36,0.3)',
  },
  prizeText: { flex: 1, fontSize: 14, fontWeight: '800', color: '#D97706', marginLeft: 8 },
  slotsChip: { backgroundColor: '#374151', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  slotsText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  regRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  regText: { fontSize: 12, color: '#16A34A', fontWeight: '600' },
  registerBtn: {
    backgroundColor: colors.primary, borderRadius: 30, paddingVertical: 14, alignItems: 'center',
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 4,
  },
  registerBtnText: { color: '#fff', fontWeight: '900', fontSize: 14, letterSpacing: 0.5 },

  /* EMPTY */
  emptyCard: {
    marginHorizontal: 15, backgroundColor: '#fff', borderRadius: 16, padding: 40,
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  emptyText: { marginTop: 12, color: '#9CA3AF', fontSize: 14, fontWeight: '500' },

  /* PRO CLUB */
  proContainer: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 30, paddingBottom: 60 },
  proGlow: {
    position: 'absolute', top: 20, width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(251,191,36,0.15)', alignSelf: 'center',
  },
  proTitle: { fontSize: 28, fontWeight: '900', color: '#111827', marginBottom: 10 },
  proSub: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 22, marginBottom: 30 },
  upgradeBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FBBF24', paddingHorizontal: 28, paddingVertical: 15,
    borderRadius: 30, shadowColor: '#FBBF24', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 10, elevation: 5,
  },
  upgradeBtnText: { fontSize: 15, fontWeight: '900', color: '#000' },
});

export default HomeScreen;











