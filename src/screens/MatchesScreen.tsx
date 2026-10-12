import React, { useState, useContext, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, Modal, Alert, Image, FlatList, StatusBar
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../theme/colors';
import { AppContext } from '../context/AppContext';

  const MatchesScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();
    const { userProfile, currentUserId, globalTournaments, fetchTournaments, registeredMatches, fetchMyMatches, addTournament, addMatch } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState<'Matches' | 'Tournaments'>('Matches');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTournamentModalVisible, setIsTournamentModalVisible] = useState(false);
  const [myTournaments, setMyTournaments] = useState<any[]>([]);
  const [imageAspectRatios, setImageAspectRatios] = useState<Record<string, number>>({});

  // Match form
  const [teamAName, setTeamAName] = useState('Team Strikers');
  const [teamBName, setTeamBName] = useState('');
  const [matchType, setMatchType] = useState('T1 Scrims');
  const [mapVenue, setMapVenue] = useState('Erangel');
  const [dateTime, setDateTime] = useState('Today, 6:00 PM');

  // Tournament form
  const [organisationName, setOrganisationName] = useState('');
  const [tournamentName, setTournamentName] = useState('');
  const [sponsorName, setSponsorName] = useState('');
  const [manageBy, setManageBy] = useState('');
  const [socialMedia1, setSocialMedia1] = useState('');
  const [socialMedia2, setSocialMedia2] = useState('');
  const [socialMedia3, setSocialMedia3] = useState('');
  const [socialMedia4, setSocialMedia4] = useState('');
  const [prizePool, setPrizePool] = useState('');
  const [pointsSystem, setPointsSystem] = useState('');
  const [totalSlots, setTotalSlots] = useState('');
  const [teamsPerGroup, setTeamsPerGroup] = useState('');
  const [numberOfGroups, setNumberOfGroups] = useState('');
  const [regStarts, setRegStarts] = useState('');
  const [regEnds, setRegEnds] = useState('');

  useFocusEffect(
    useCallback(() => {
      fetchTournaments();
      fetchMyMatches();
      const uid = userProfile?.id || currentUserId;
      setMyTournaments(globalTournaments.filter(t => String(t.user_id) === String(uid)));
    }, [])
  );

  React.useEffect(() => {
    const uid = userProfile?.id || currentUserId;
    setMyTournaments(globalTournaments.filter(t => String(t.user_id) === String(uid)));
  }, [globalTournaments]);

  const handleEditTournament = (item: any) => {
    const mapped = {
      id: item.id.toString(), name: item.name || '',
      organiserName: item.organiser_name || item.organiserName || '',
      game: item.game || '', prize: item.prize || '',
      teamsLimit: item.teams_limit?.toString() || item.teamsLimit?.toString() || '0',
      totalSlots: item.total_slots?.toString() || item.totalSlots?.toString() || '0',
      teamsPerGroup: item.teams_per_group?.toString() || item.teamsPerGroup?.toString() || '0',
      numberOfGroups: item.number_of_groups?.toString() || item.numberOfGroups?.toString() || '0',
      regStartDate: item.registration_start_date || item.regStartDate || '',
      regEndDate: item.registration_end_date || item.regEndDate || '',
      roadmap: item.roadmap || '', time: item.time || '',
      matchDate: item.match_date || item.matchDate || '',
      bannerImage: item.banner_image || item.bannerImage || null,
      status: item.status || 'upcoming',
      selectedFlyers: item.selected_flyers || item.selectedFlyers || {},
      stages: item.stages || [], matchDatesObj: item.match_dates_obj || item.matchDatesObj || {},
      killsPoint: item.kills_point || item.killsPoint || 1, positions: item.positions || []
    };
    navigation.navigate('CreateTournament', { isEdit: true, tournament: mapped });
  };

  const handleStartMatch = () => {
    if (!teamAName.trim() || !teamBName.trim()) { Alert.alert('Error', 'Both team names are required'); return; }
    addMatch({ id: Date.now().toString(), league: matchType, teamA: teamAName, teamB: teamBName, time: dateTime, venue: mapVenue, isLive: true });
    setIsModalVisible(false);
    setTeamBName('');
    Alert.alert('âœ… Success', 'Match started!');
  };

  const handleStartTournament = () => {
    if (!tournamentName.trim() || !organisationName.trim()) { Alert.alert('Error', 'Tournament & Organisation name required'); return; }
    addTournament({ 
      id: Date.now().toString(), 
      name: tournamentName, 
      organiser_name: organisationName,
      prize: prizePool, 
      teamsLimit: totalSlots, 
      time: `Reg ends ${regEnds}`, 
      status: 'REGISTRATIONS OPEN' 
    });
    setIsTournamentModalVisible(false);
    setTournamentName('');
    Alert.alert('âœ… Success', 'Tournament created!');
  };

  const requireLogin = (cb: () => void) => {
    if (!userProfile || userProfile.id === 'guest') {
      Alert.alert('Login Required', 'Please login first');
    } else { cb(); }
  };

  const InputField = ({ label, value, onChange, placeholder, multiline = false, keyboardType = 'default' }: any) => (
    <View style={s.inputGroup}>
      <Text style={s.inputLabel}>{label}</Text>
      <TextInput
        style={[s.input, multiline && { height: 80, textAlignVertical: 'top' }]}
        value={value} onChangeText={onChange} placeholder={placeholder}
        placeholderTextColor="#9CA3AF" multiline={multiline} keyboardType={keyboardType}
      />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F5F7' }}>

      {/* â”€â”€ HERO HEADER â”€â”€ */}
      <View style={s.heroHeader}>
        <View>
          <Text style={s.heroTitle}>My {activeTab}</Text>
          <Text style={s.heroSub}>{activeTab === 'Matches' ? 'Track your live matches & scrims' : 'Manage your tournaments'}</Text>
        </View>
      </View>

      {/* â”€â”€ SEGMENTED TABS â”€â”€ */}
      <View style={s.tabWrap}>
        <View style={s.segControl}>
          {(['Matches', 'Tournaments'] as const).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[s.segBtn, activeTab === tab && s.segBtnActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Icon
                name={tab === 'Matches' ? 'game-controller-outline' : 'trophy-outline'}
                size={15} color={activeTab === tab ? '#fff' : '#9CA3AF'}
                style={{ marginRight: 6 }}
              />
              <Text style={[s.segText, activeTab === tab && s.segTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* â”€â”€ CONTENT â”€â”€ */}
      <ScrollView contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 40, paddingTop: 10 }} showsVerticalScrollIndicator={false}>

        {activeTab === 'Matches' ? (
          registeredMatches.length > 0 ? (
            <>
              <Text style={s.sectionLabel}>Active Registrations</Text>
              {registeredMatches.map((match, i) => (
                <View key={match.id || i} style={s.card}>
                  {/* Card top badge row */}
                  <View style={s.cardTopRow}>
                    <View style={s.gameBadge}><Text style={s.gameBadgeText}>{match.league}</Text></View>
                    <View style={s.liveBadge}>
                      <View style={s.liveDot} />
                      <Text style={s.liveText}>LIVE</Text>
                    </View>
                  </View>
                  <Text style={s.cardTitle}>{match.teamA} vs {match.teamB}</Text>
                  <Text style={s.cardSub}><Icon name="time-outline" size={12} color="#6B7280" /> {match.time} Â· {match.venue}</Text>
                  <View style={s.vsRow}>
                    <View style={s.teamBox}>
                      <Icon name="people-outline" size={20} color={colors.primary} />
                      <Text style={s.teamBoxName}>{match.teamA}</Text>
                      <Text style={s.teamBoxSub}>You</Text>
                    </View>
                    <View style={s.vsBadge}><Text style={s.vsText}>VS</Text></View>
                    <View style={s.teamBox}>
                      <Icon name="people-outline" size={20} color="#374151" />
                      <Text style={s.teamBoxName}>{match.teamB}</Text>
                      <Text style={s.teamBoxSub}>Opponent</Text>
                    </View>
                  </View>
                  <View style={s.waitingRow}>
                    <Icon name="hourglass-outline" size={14} color="#9CA3AF" />
                    <Text style={s.waitingText}>  Waiting for results...</Text>
                  </View>
                </View>
              ))}
            </>
          ) : (
            /* Empty state â€“ Matches */
            <View style={s.emptyWrap}>
              <View style={s.emptyIconCircle}>
                <Icon name="game-controller-outline" size={42} color={colors.primary} />
                <View style={s.emptyVsBadge}><Text style={s.emptyVsText}>VS</Text></View>
              </View>
              <Text style={s.emptyTitle}>No matches found</Text>
              <Text style={s.emptyCaption}>You haven't played any matches yet.</Text>
            </View>
          )
        ) : (
          myTournaments.length > 0 ? (
            <>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 4 }}>
                <Text style={[s.sectionLabel, { marginBottom: 0, marginTop: 0 }]}>Active Tournaments</Text>
                <TouchableOpacity onPress={() => requireLogin(() => navigation.navigate('CreateTournament'))} style={{ backgroundColor: '#E51025', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="add" size={16} color="#fff" style={{ marginRight: 2 }} />
                  <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>Create</Text>
                </TouchableOpacity>
              </View>
              {myTournaments.map((t, i) => (
                <TouchableOpacity key={t.id || i} style={s.card} onPress={() => navigation.navigate('RegisteredTeams', { tournamentId: t.id, tournamentName: t.name })} activeOpacity={0.9}>
                  {t.bannerImage && (
                    <Image
                      source={{ uri: t.bannerImage }}
                      style={[s.cardBanner, { aspectRatio: imageAspectRatios[t.id] || 16 / 9 }]}
                      onLoad={(e) => {
                        const { width: w, height: h } = e.nativeEvent.source;
                        if (w && h) setImageAspectRatios(p => ({ ...p, [t.id]: w / h }));
                      }}
                    />
                  )}
                  <View style={s.cardTopRow}>
                    <View style={s.gameBadge}><Text style={s.gameBadgeText}>{t.game || 'BGMI'}</Text></View>
                    <View style={[s.statusBadge, { backgroundColor: t.status === 'upcoming' ? '#16A34A' : '#E51025' }]}>
                      <Text style={s.statusText}>{(t.status || 'OPEN').toUpperCase()}</Text>
                    </View>
                  </View>
                  <Text style={s.orgLabel}>{t.organiser_name || t.organiserName || 'UPMI Esports'} PRESENTS</Text>
                  <Text style={s.cardTitle}>{t.name}</Text>
                  {t.time ? <Text style={s.cardSub}><Icon name="time-outline" size={12} color="#6B7280" /> {t.time}</Text> : null}

                  <View style={s.prizePill}>
                    <Icon name="trophy" size={16} color="#D97706" />
                    <Text style={s.prizeText}>{t.prize || 'TBD'}</Text>
                    <View style={s.slotChip}><Text style={s.slotText}>{t.teams_limit || t.teamsLimit || 0} Slots</Text></View>
                  </View>

                  <View style={s.actionRow}>
                    <TouchableOpacity style={s.actionBtnPrimary} onPress={() => navigation.navigate('RegisteredTeams', { tournamentId: t.id, tournamentName: t.name })}>
                      <Text style={s.actionBtnPrimaryText}>Details</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={s.actionBtnOutline} onPress={() => handleEditTournament(t)}>
                      <Icon name="pencil-outline" size={14} color="#374151" style={{ marginRight: 4 }} />
                      <Text style={s.actionBtnOutlineText}>Edit</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          ) : (
            /* Empty state â€“ Tournaments */
            <View style={s.emptyWrap}>
              <View style={[s.emptyIconCircle, { backgroundColor: 'rgba(251,191,36,0.15)' }]}>
                <Icon name="trophy-outline" size={42} color="#D97706" />
                <View style={[s.emptyVsBadge, { backgroundColor: '#D97706' }]}>
                  <Icon name="star" size={10} color="#fff" />
                </View>
              </View>
              <Text style={s.emptyTitle}>UPMI Championship Cup</Text>
              <Text style={s.emptySub}>Join existing leagues or register a new series bracket</Text>
              <Text style={s.emptyCaption}>You haven't registered any tournaments yet. Create a new bracket and invite teams!</Text>
              <TouchableOpacity style={s.emptyBtn} onPress={() => requireLogin(() => navigation.navigate('CreateTournament'))}>
                <Icon name="add-circle-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
                <Text style={s.emptyBtnText}>Create Tournament</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.emptyBtnOutline} onPress={() => navigation.navigate('Looking')}>
                <Text style={s.emptyBtnOutlineText}>Looking for a Team</Text>
              </TouchableOpacity>
            </View>
          )
        )}
      </ScrollView>

      {/* â”€â”€ MATCH MODAL â”€â”€ */}
      <Modal visible={isModalVisible} animationType="slide" presentationStyle="formSheet" onRequestClose={() => setIsModalVisible(false)}>
        <View style={[s.modalWrap, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
          <View style={s.modalHeader}>
            <TouchableOpacity onPress={() => setIsModalVisible(false)} style={s.modalBackBtn}>
              <Icon name="close" size={20} color="#374151" />
            </TouchableOpacity>
            <Text style={s.modalTitle}>Start a Match</Text>
            <View style={{ width: 36 }} />
          </View>
          <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
            <InputField label="My Team Name *" value={teamAName} onChange={setTeamAName} placeholder="Enter my team name" />
            <InputField label="Opponent Team Name *" value={teamBName} onChange={setTeamBName} placeholder="Enter opponent team name" />
            <InputField label="Match Type *" value={matchType} onChange={setMatchType} placeholder="e.g. T1 Scrims, Tournament, Friendly" />
            <InputField label="Map / Venue *" value={mapVenue} onChange={setMapVenue} placeholder="e.g. Erangel, Miramar, Sanhok" />
            <InputField label="Date & Time *" value={dateTime} onChange={setDateTime} placeholder="e.g. Today, 6:00 PM" />
          </ScrollView>
          <View style={s.modalFooter}>
            <TouchableOpacity style={s.modalCancelBtn} onPress={() => setIsModalVisible(false)}>
              <Text style={s.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.modalPublishBtn} onPress={handleStartMatch}>
              <Text style={s.modalPublishText}>Publish</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* â”€â”€ TOURNAMENT MODAL â”€â”€ */}
      <Modal visible={isTournamentModalVisible} animationType="slide" presentationStyle="formSheet" onRequestClose={() => setIsTournamentModalVisible(false)}>
        <View style={[s.modalWrap, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
          <View style={s.modalHeader}>
            <TouchableOpacity onPress={() => setIsTournamentModalVisible(false)} style={s.modalBackBtn}>
              <Icon name="close" size={20} color="#374151" />
            </TouchableOpacity>
            <Text style={s.modalTitle}>Start a Tournament</Text>
            <View style={{ width: 36 }} />
          </View>
          <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
            <InputField label="Organisation Name *" value={organisationName} onChange={setOrganisationName} placeholder="Enter organisation name" />
            <InputField label="Tournament Name *" value={tournamentName} onChange={setTournamentName} placeholder="Enter tournament name" />
            <InputField label="Sponsor Name" value={sponsorName} onChange={setSponsorName} placeholder="Enter sponsor name" />
            <InputField label="Manage by" value={manageBy} onChange={setManageBy} placeholder="Enter manager name" />
            <InputField label="Social Media Link 1" value={socialMedia1} onChange={setSocialMedia1} placeholder="Instagram URL" />
            <InputField label="Social Media Link 2" value={socialMedia2} onChange={setSocialMedia2} placeholder="YouTube URL" />
            <InputField label="Social Media Link 3" value={socialMedia3} onChange={setSocialMedia3} placeholder="Discord URL" />
            <InputField label="Social Media Link 4" value={socialMedia4} onChange={setSocialMedia4} placeholder="Twitter/WhatsApp URL" />
            <InputField label="Prize pool *" value={prizePool} onChange={setPrizePool} placeholder="e.g. â‚¹10,000" />
            <InputField label="Points System" value={pointsSystem} onChange={setPointsSystem} placeholder="e.g. 1st - 10pts, 2nd - 5pts" />
            <InputField label="Total Slots" value={totalSlots} onChange={setTotalSlots} placeholder="e.g. 100" keyboardType="numeric" />
            <InputField label="Team per group" value={teamsPerGroup} onChange={setTeamsPerGroup} placeholder="e.g. 20" keyboardType="numeric" />
            <InputField label="Number of group" value={numberOfGroups} onChange={setNumberOfGroups} placeholder="e.g. 5" keyboardType="numeric" />
            <InputField label="Registration starts" value={regStarts} onChange={setRegStarts} placeholder="e.g. 10th Oct" />
            <InputField label="Registration end" value={regEnds} onChange={setRegEnds} placeholder="e.g. 15th Oct" />
          </ScrollView>
          <View style={s.modalFooter}>
            <TouchableOpacity style={s.modalCancelBtn} onPress={() => setIsTournamentModalVisible(false)}>
              <Text style={s.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.modalPublishBtn} onPress={handleStartTournament}>
              <Text style={s.modalPublishText}>Publish</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const s = StyleSheet.create({
  /* HERO */
  heroHeader: {
    backgroundColor: '#E51025', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 22,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  heroTitle: { fontSize: 24, fontWeight: '900', color: '#fff' },
  heroSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 3 },
  createBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 30,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)',
  },
  createBtnText: { color: '#fff', fontWeight: '800', fontSize: 14, marginLeft: 4 },

  /* TABS */
  tabWrap: {
    backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  segControl: { flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 14, padding: 4 },
  segBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 10 },
  segBtnActive: { backgroundColor: colors.primary, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 5 },
  segText: { fontSize: 14, fontWeight: '700', color: '#9CA3AF' },
  segTextActive: { color: '#fff' },

  /* SECTION LABEL */
  sectionLabel: { fontSize: 17, fontWeight: '800', color: '#111827', marginBottom: 12, marginTop: 4 },

  /* CARD */
  card: {
    backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.07, shadowRadius: 14, elevation: 4,
  },
  cardBanner: { width: '100%', borderRadius: 12, marginBottom: 12, resizeMode: 'cover' },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  gameBadge: { backgroundColor: '#FEF2F2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  gameBadgeText: { color: colors.primary, fontSize: 11, fontWeight: '800' },
  liveBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16A34A', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff', marginRight: 5 },
  liveText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  cardTitle: { fontSize: 18, fontWeight: '900', color: '#111827', marginBottom: 4 },
  cardSub: { fontSize: 12, color: '#6B7280', marginBottom: 10 },
  orgLabel: { fontSize: 10, color: colors.primary, fontWeight: '800', textTransform: 'uppercase', marginBottom: 4 },

  /* VS ROW */
  vsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 12, backgroundColor: '#F9FAFB', borderRadius: 14, padding: 12 },
  teamBox: { flex: 1, alignItems: 'center', gap: 4 },
  teamBoxName: { fontSize: 13, fontWeight: '800', color: '#111827', textAlign: 'center' },
  teamBoxSub: { fontSize: 11, color: '#9CA3AF' },
  vsBadge: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  vsText: { color: '#fff', fontWeight: '900', fontSize: 12 },
  waitingRow: { flexDirection: 'row', alignItems: 'center', paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  waitingText: { fontSize: 12, color: '#9CA3AF' },

  /* PRIZE */
  prizePill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(251,191,36,0.12)', paddingHorizontal: 12, paddingVertical: 10,
    borderRadius: 12, marginVertical: 10, borderWidth: 1, borderColor: 'rgba(251,191,36,0.3)',
  },
  prizeText: { flex: 1, fontSize: 14, fontWeight: '800', color: '#D97706', marginLeft: 8 },
  slotChip: { backgroundColor: '#374151', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  slotText: { color: '#fff', fontSize: 11, fontWeight: '700' },

  /* ACTION ROW */
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  actionBtnPrimary: { flex: 1, backgroundColor: colors.primary, paddingVertical: 12, borderRadius: 30, alignItems: 'center', shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 4 },
  actionBtnPrimaryText: { color: '#fff', fontWeight: '900', fontSize: 13 },
  actionBtnOutline: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#D1D5DB', paddingVertical: 12, borderRadius: 30 },
  actionBtnOutlineText: { color: '#374151', fontWeight: '700', fontSize: 13 },

  /* EMPTY */
  emptyWrap: { alignItems: 'center', paddingTop: 30 },
  emptyIconCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#FEF2F2', justifyContent: 'center', alignItems: 'center',
    marginBottom: 20, position: 'relative',
  },
  emptyVsBadge: { position: 'absolute', bottom: -4, right: 8, backgroundColor: colors.primary, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  emptyVsText: { color: '#fff', fontSize: 9, fontWeight: '900' },
  emptyTitle: { fontSize: 20, fontWeight: '900', color: '#111827', marginBottom: 6 },
  emptySub: { fontSize: 13, color: '#6B7280', textAlign: 'center', marginBottom: 12, paddingHorizontal: 20 },
  emptyCaption: { fontSize: 12, color: '#9CA3AF', textAlign: 'center', marginBottom: 24, paddingHorizontal: 30, lineHeight: 18 },
  emptyBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, paddingHorizontal: 28, paddingVertical: 14, borderRadius: 30, marginBottom: 12, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 4 },
  emptyBtnText: { color: '#fff', fontWeight: '900', fontSize: 14 },
  emptyBtnOutline: { borderWidth: 1.5, borderColor: '#D1D5DB', paddingHorizontal: 28, paddingVertical: 12, borderRadius: 30 },
  emptyBtnOutlineText: { color: '#6B7280', fontWeight: '700', fontSize: 14 },

  /* MODAL */
  modalWrap: { flex: 1, backgroundColor: '#fff' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  modalBackBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  modalTitle: { fontSize: 17, fontWeight: '800', color: '#111827' },
  inputGroup: { marginBottom: 18 },
  inputLabel: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 8 },
  input: {
    backgroundColor: '#F9FAFB', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 15, color: '#111827', borderWidth: 1, borderColor: '#E5E7EB',
  },
  modalFooter: { flexDirection: 'row', gap: 12, padding: 20, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  modalCancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 30, borderWidth: 1.5, borderColor: '#D1D5DB', alignItems: 'center' },
  modalCancelText: { color: '#6B7280', fontWeight: '700', fontSize: 14 },
  modalPublishBtn: { flex: 2, paddingVertical: 14, borderRadius: 30, backgroundColor: colors.primary, alignItems: 'center', shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 4 },
  modalPublishText: { color: '#fff', fontWeight: '900', fontSize: 14 },
});

export default MatchesScreen;




