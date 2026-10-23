import React, { useContext, useState, useRef, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, StatusBar, ImageBackground, Alert, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import ViewShot from 'react-native-view-shot';
import Share from '../utils/SafeShare';
import { colors } from '../theme/colors';
import { AppContext } from '../context/AppContext';
import { apiService } from '../api/index';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const RegisteredTeamsScreen = ({ route, navigation }: any) => {
  const { tournamentId, tournamentName: routeTournamentName, tournament: routeTournament } = route?.params || {};
  const { teamRegistrations, globalTournaments } = useContext(AppContext);
  const [apiTeams, setApiTeams] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'flyer' | 'list'>('flyer');
  const [selectedGroupIndex, setSelectedGroupIndex] = useState<number>(0);
  const viewShotRef = useRef<any>(null);

  const cleanTid = String(tournamentId || '').replace('tourney_', '');

  const tournament = useMemo(() => {
    return routeTournament || 
      globalTournaments.find(t => String(t.id).replace('tourney_', '') === cleanTid) || 
      {};
  }, [routeTournament, globalTournaments, cleanTid]);

  const tName = tournament.name || routeTournamentName || 'Tournament Match';
  const orgName = tournament.organiser_name || tournament.organiserName || 'UPMI Esports';

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teams = await apiService.getRegisteredTeams(cleanTid || tournamentId);
        if (teams && Array.isArray(teams)) {
          setApiTeams(teams);
        }
      } catch (e) {
        console.log('Failed to fetch teams', e);
      }
    };
    if (cleanTid || tournamentId) {
      fetchTeams();
    }
  }, [cleanTid, tournamentId]);

  // Merge API teams and local Context registrations in sequential order
  const registeredTeams = useMemo(() => {
    const merged: any[] = [];
    const seenIds = new Set<string>();

    (apiTeams || []).forEach((t: any) => {
      const idKey = String(t.id || t.teamName);
      if (!seenIds.has(idKey)) {
        seenIds.add(idKey);
        merged.push(t);
      }
    });

    (teamRegistrations || []).forEach((reg: any) => {
      const regTid = String(reg.tournamentId || '').replace('tourney_', '');
      if (regTid === cleanTid) {
        const idKey = String(reg.id || reg.teamName);
        if (!seenIds.has(idKey)) {
          seenIds.add(idKey);
          merged.push(reg);
        }
      }
    });

    return merged;
  }, [apiTeams, teamRegistrations, cleanTid]);

  // Grouping configuration: 25 teams per group
  const teamsPerGroup = parseInt(tournament?.teams_per_group || tournament?.teamsPerGroup || '25', 10) || 25;
  const configuredNumberOfGroups = parseInt(tournament?.number_of_groups || tournament?.numberOfGroups || '1', 10) || 1;
  
  let calculatedTotalSlots = parseInt(tournament?.teams_limit || tournament?.teamsLimit || tournament?.total_slots || tournament?.totalSlots || '25', 10) || 25;
  calculatedTotalSlots = Math.max(calculatedTotalSlots, configuredNumberOfGroups * teamsPerGroup, registeredTeams.length, 25);

  // Generate Slots mapping teams to their actual booked slot numbers
  const displaySlots = useMemo(() => {
    const slots = [];
    const totalCount = Math.max(calculatedTotalSlots, registeredTeams.length, 25);
    const slotMap = new Map<number, any>();
    const unslottedTeams: any[] = [];

    registeredTeams.forEach((t: any) => {
      const parsedSlot = parseInt(String(t.slot || '').replace(/[^0-9]/g, ''), 10);
      if (parsedSlot && !slotMap.has(parsedSlot)) {
        slotMap.set(parsedSlot, t);
      } else {
        unslottedTeams.push(t);
      }
    });

    for (let i = 1; i <= totalCount; i++) {
      let team = slotMap.get(i) || null;
      if (!team && unslottedTeams.length > 0) {
        team = unslottedTeams.shift();
      }
      slots.push({
        slotNumber: i,
        slotStr: i < 10 ? `0${i}` : `${i}`,
        team: team
      });
    }
    // Pad to multiple of teamsPerGroup
    while (slots.length % teamsPerGroup !== 0) {
      const nextNum: number = slots.length + 1;
      slots.push({
        slotNumber: nextNum,
        slotStr: nextNum < 10 ? `0${nextNum}` : `${nextNum}`,
        team: null
      });
    }
    return slots;
  }, [calculatedTotalSlots, registeredTeams, teamsPerGroup]);

  // Chunk into groups of 25
  const groups = useMemo(() => {
    const grps = [];
    for (let i = 0; i < displaySlots.length; i += teamsPerGroup) {
      grps.push(displaySlots.slice(i, i + teamsPerGroup));
    }
    return grps.length > 0 ? grps : [displaySlots];
  }, [displaySlots, teamsPerGroup]);

  const currentGroupSlots = groups[selectedGroupIndex] || groups[0] || [];

  // Split current group slots into 2 columns (e.g. 13 in col 1, 12 in col 2 for 25 total)
  const half = Math.ceil(currentGroupSlots.length / 2);
  const leftColumnSlots = currentGroupSlots.slice(0, half);
  const rightColumnSlots = currentGroupSlots.slice(half);

  const handleShareFlyer = async () => {
    try {
      if (viewShotRef.current) {
        const uri = await viewShotRef.current.capture();
        await Share.open({
          url: uri,
          title: `${tName} - Group ${selectedGroupIndex + 1} Slot List`
        });
      }
    } catch (err) {
      console.log('Error sharing flyer:', err);
    }
  };

  const handleDownloadFlyer = async () => {
    try {
      if (viewShotRef.current) {
        const uri = await viewShotRef.current.capture();
        const RNFS = require('../utils/SafeRNFS').default;
        const { PermissionsAndroid } = require('react-native');
        
        if (Platform.OS === 'android') {
          try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
            if (granted !== PermissionsAndroid.RESULTS.GRANTED && Platform.Version < 33) {
              Alert.alert('Permission Denied', 'Storage permission is required to save posters.');
              return;
            }
          } catch (err) {}
        }
        
        const filename = `UPMI_SlotList_Group_${selectedGroupIndex + 1}_${Date.now()}.jpg`;
        const destPath = Platform.OS === 'android' 
          ? `${RNFS.PicturesDirectoryPath}/${filename}`
          : `${RNFS.DocumentDirectoryPath}/${filename}`;
          
        await RNFS.copyFile(uri, destPath);
        
        if (Platform.OS === 'android') {
          await RNFS.scanFile(destPath);
          Alert.alert('Success', 'Slot List Flyer saved to your phone Gallery (Pictures folder)!');
        } else {
          Alert.alert('Success', 'Slot List Flyer saved to your device Documents!');
        }
      }
    } catch (e) {
      Alert.alert('Error', 'Could not save flyer image. Try sharing it instead.');
    }
  };

  const renderSlotRow = (item: any) => {
    const isRegistered = !!item.team;
    const teamName = isRegistered ? (item.team.teamName || item.team.name || `Team ${item.slotNumber}`) : '';

    return (
      <View key={`slot-${item.slotNumber}`} style={[st.slotCard, !isRegistered && st.slotCardEmpty]}>
        {/* Slot Number Label */}
        <Text style={[st.slotNumberText, !isRegistered && { color: '#94A3B8' }]}>
          {item.slotStr}
        </Text>

        {/* Team Name or Available */}
        <View style={st.teamNameBox}>
          {isRegistered ? (
            <Text style={st.teamNameText} numberOfLines={1}>
              {teamName}
            </Text>
          ) : (
            <Text style={st.emptySlotText} numberOfLines={1}>
              Open Slot
            </Text>
          )}
        </View>

        {/* Dark Slot Badge on Right */}
        <View style={[st.slotDarkBadge, isRegistered ? st.slotDarkBadgeActive : st.slotDarkBadgeEmpty]}>
          <Text style={st.slotDarkBadgeText}>
            {item.slotStr}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0B0F19' }}>
      <StatusBar backgroundColor="#E51025" barStyle="light-content" />
      
      {/* ── HEADER ── */}
      <SafeAreaView style={st.safeArea} edges={['top']}>
        <View style={st.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={st.backBtn}>
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={st.topBarTitle} numberOfLines={1}>{tName}</Text>
            <Text style={st.topBarSub}>Official Slot List & Flyer</Text>
          </View>
          <View style={st.totalBadge}>
            <Text style={st.totalBadgeText}>{registeredTeams.length} / {calculatedTotalSlots}</Text>
          </View>
        </View>
      </SafeAreaView>

      {/* ── VIEW TOGGLE (FLYER / LIST) ── */}
      <View style={st.toggleWrap}>
        <View style={st.toggleBar}>
          <TouchableOpacity
            style={[st.toggleBtn, activeTab === 'flyer' && st.toggleBtnActive]}
            onPress={() => setActiveTab('flyer')}
          >
            <Icon name="image-outline" size={15} color={activeTab === 'flyer' ? '#fff' : '#94A3B8'} style={{ marginRight: 6 }} />
            <Text style={[st.toggleBtnText, activeTab === 'flyer' && st.toggleBtnTextActive]}>Flyer View</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[st.toggleBtn, activeTab === 'list' && st.toggleBtnActive]}
            onPress={() => setActiveTab('list')}
          >
            <Icon name="list-outline" size={15} color={activeTab === 'list' ? '#fff' : '#94A3B8'} style={{ marginRight: 6 }} />
            <Text style={[st.toggleBtnText, activeTab === 'list' && st.toggleBtnTextActive]}>Roster List</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── GROUP SELECTOR (IF MULTIPLE GROUPS) ── */}
      {groups.length > 1 && (
        <View style={st.groupsBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 15, gap: 8 }}>
            {groups.map((_, idx) => (
              <TouchableOpacity
                key={`grp-${idx}`}
                style={[st.groupChip, selectedGroupIndex === idx && st.groupChipActive]}
                onPress={() => setSelectedGroupIndex(idx)}
              >
                <Icon name="layers-outline" size={13} color={selectedGroupIndex === idx ? '#fff' : '#64748B'} style={{ marginRight: 4 }} />
                <Text style={[st.groupChipText, selectedGroupIndex === idx && st.groupChipTextActive]}>
                  Group {idx + 1} ({teamsPerGroup} Slots)
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* ── MAIN CONTENT ── */}
      <ScrollView contentContainerStyle={st.scrollContent} showsVerticalScrollIndicator={false}>

        {activeTab === 'flyer' ? (
          <View style={st.flyerContainer}>
            {/* ── THE CAPTURABLE FLYER ── */}
            <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 1.0 }}>
              <View collapsable={false} style={st.flyerCard}>
                
                {/* FLYER HEADER */}
                <View style={st.flyerHeader}>
                  <View style={st.flyerLogoPlaceholder}>
                    <Icon name="shield" size={18} color="#E51025" />
                    <Text style={st.flyerLogoText}>UPMI</Text>
                  </View>
                  <Text style={st.flyerOrgText}>{orgName.toUpperCase()}</Text>
                  <Text style={st.flyerTitleText} numberOfLines={2}>{tName.toUpperCase()}</Text>
                  <View style={st.flyerPillBadge}>
                    <Text style={st.flyerPillBadgeText}>
                      STANDINGS TABLE • GROUP {selectedGroupIndex + 1}
                    </Text>
                  </View>
                </View>

                {/* TABLE HEADERS */}
                <View style={st.tableHeaderRow}>
                  <View style={st.tableHeaderCol}>
                    <Text style={st.colHeadNum}>#</Text>
                    <Text style={st.colHeadName}>TEAM NAME</Text>
                    <Text style={st.colHeadSlot}>SLOT</Text>
                  </View>
                  <View style={st.tableHeaderDivider} />
                  <View style={st.tableHeaderCol}>
                    <Text style={st.colHeadNum}>#</Text>
                    <Text style={st.colHeadName}>TEAM NAME</Text>
                    <Text style={st.colHeadSlot}>SLOT</Text>
                  </View>
                </View>

                {/* TWO COLUMNS OF SLOTS (TOTAL 25 SLOTS FITTED PERFECTLY) */}
                <View style={st.twoColumnsWrapper}>
                  {/* Left Column */}
                  <View style={st.columnSide}>
                    {leftColumnSlots.map(renderSlotRow)}
                  </View>

                  {/* Vertical Divider */}
                  <View style={st.columnDivider} />

                  {/* Right Column */}
                  <View style={st.columnSide}>
                    {rightColumnSlots.map(renderSlotRow)}
                  </View>
                </View>

                {/* FLYER FOOTER */}
                <View style={st.flyerFooter}>
                  <Text style={st.flyerFooterBy}>BY</Text>
                  <Text style={st.flyerFooterBrand}>POINTCALC</Text>
                </View>

              </View>
            </ViewShot>

            {/* ACTION BUTTONS (SHARE & DOWNLOAD) */}
            <View style={st.actionRow}>
              <TouchableOpacity style={st.shareBtn} onPress={handleShareFlyer} activeOpacity={0.85}>
                <Icon name="share-social-outline" size={18} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={st.shareBtnText}>Share Flyer</Text>
              </TouchableOpacity>

              <TouchableOpacity style={st.downloadBtn} onPress={handleDownloadFlyer} activeOpacity={0.85}>
                <Icon name="download-outline" size={18} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={st.downloadBtnText}>Save to Gallery</Text>
              </TouchableOpacity>
            </View>

          </View>
        ) : (
          /* ── ROSTER LIST VIEW ── */
          <View style={st.listContainer}>
            {registeredTeams.length > 0 ? (
              registeredTeams.map((team, idx) => {
                const sNum = team.slot || (idx + 1);
                const playersList = Array.isArray(team.players) ? team.players : [];
                return (
                  <View key={team.id || idx} style={st.rosterCard}>
                    <View style={st.rosterHeader}>
                      <View style={st.rosterSlotCircle}>
                        <Text style={st.rosterSlotCircleText}>#{sNum}</Text>
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={st.rosterTeamName}>{team.teamName || `Team ${sNum}`}</Text>
                        <Text style={st.rosterMapText}>Map: {team.map || 'Erangel'}</Text>
                      </View>
                      <View style={st.rosterCountPill}>
                        <Icon name="person" size={12} color="#16A34A" style={{ marginRight: 4 }} />
                        <Text style={st.rosterCountText}>{playersList.length || 4} Players</Text>
                      </View>
                    </View>

                    {playersList.length > 0 && (
                      <View style={st.rosterPlayersBox}>
                        {playersList.map((p: any, pIdx: number) => (
                          <View key={pIdx} style={st.playerChip}>
                            <Icon name="game-controller-outline" size={12} color="#4B5563" style={{ marginRight: 4 }} />
                            <Text style={st.playerChipName}>{p.gameName || p.name || `Player ${pIdx + 1}`}</Text>
                            {p.role ? <Text style={st.playerChipRole}>({p.role})</Text> : null}
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                );
              })
            ) : (
              <View style={st.emptyWrap}>
                <Icon name="people-outline" size={48} color="#475569" />
                <Text style={st.emptyTitle}>No Registered Teams</Text>
                <Text style={st.emptySub}>Teams that register for this tournament will appear here in their assigned slots.</Text>
              </View>
            )}
          </View>
        )}

      </ScrollView>
    </View>
  );
};

const st = StyleSheet.create({
  safeArea: { backgroundColor: '#E51025' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#E51025',
  },
  backBtn: { marginRight: 12, padding: 4 },
  topBarTitle: { color: '#FFF', fontSize: 18, fontWeight: '900' },
  topBarSub: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '600' },
  totalBadge: { backgroundColor: '#111827', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  totalBadgeText: { color: '#FFF', fontSize: 12, fontWeight: '800' },

  /* TOGGLE BAR */
  toggleWrap: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#111827' },
  toggleBar: { flexDirection: 'row', backgroundColor: '#1E293B', borderRadius: 10, padding: 4 },
  toggleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, borderRadius: 8 },
  toggleBtnActive: { backgroundColor: '#E51025' },
  toggleBtnText: { color: '#94A3B8', fontSize: 13, fontWeight: '700' },
  toggleBtnTextActive: { color: '#FFF', fontWeight: '900' },

  /* GROUPS BAR */
  groupsBar: { paddingVertical: 8, backgroundColor: '#0B0F19' },
  groupChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
  groupChipActive: { backgroundColor: '#E51025' },
  groupChipText: { color: '#94A3B8', fontSize: 12, fontWeight: '700' },
  groupChipTextActive: { color: '#FFF', fontWeight: '900' },

  scrollContent: { paddingHorizontal: 12, paddingBottom: 40, paddingTop: 10 },

  /* FLYER STYLING (MATCHING media_1792695657919_4124967e.png) */
  flyerContainer: { alignItems: 'center' },
  flyerCard: {
    width: SCREEN_WIDTH - 24,
    backgroundColor: '#F3F4F8',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingTop: 16,
    paddingBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  flyerHeader: { alignItems: 'center', marginBottom: 12 },
  flyerLogoPlaceholder: { position: 'absolute', left: 4, top: 0, flexDirection: 'row', alignItems: 'center' },
  flyerLogoText: { fontSize: 11, fontWeight: '900', color: '#111827', marginLeft: 3 },
  flyerOrgText: { fontSize: 12, fontWeight: '800', color: '#4B5563', letterSpacing: 1, marginTop: 4 },
  flyerTitleText: { fontSize: 24, fontWeight: '900', color: '#0F172A', letterSpacing: 0.5, marginTop: 2, textAlign: 'center' },
  flyerPillBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  flyerPillBadgeText: { fontSize: 10, fontWeight: '900', color: '#334155', letterSpacing: 0.8 },

  /* TABLE HEADERS */
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#E6E9F0',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 6,
    marginBottom: 6,
  },
  tableHeaderCol: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  tableHeaderDivider: { width: 8 },
  colHeadNum: { width: 22, fontSize: 10, fontWeight: '900', color: '#475569', textAlign: 'center' },
  colHeadName: { flex: 1, fontSize: 10, fontWeight: '900', color: '#475569', paddingLeft: 4 },
  colHeadSlot: { width: 32, fontSize: 9, fontWeight: '900', color: '#475569', textAlign: 'center' },

  /* TWO COLUMNS */
  twoColumnsWrapper: { flexDirection: 'row' },
  columnSide: { flex: 1 },
  columnDivider: { width: 6 },

  /* SLOT ROW (WHITE BOX WITH RIGHT DARK BADGE) */
  slotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    height: 33,
    paddingLeft: 4,
    paddingRight: 3,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  slotCardEmpty: {
    backgroundColor: '#FAFBFD',
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  slotNumberText: {
    width: 22,
    fontSize: 10,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
  },
  teamNameBox: { flex: 1, paddingHorizontal: 4 },
  teamNameText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },
  emptySlotText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  slotDarkBadge: {
    width: 28,
    height: 25,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotDarkBadgeActive: {
    backgroundColor: '#1E232F',
  },
  slotDarkBadgeEmpty: {
    backgroundColor: '#334155',
  },
  slotDarkBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  /* FOOTER */
  flyerFooter: { alignItems: 'center', marginTop: 10, paddingTop: 4 },
  flyerFooterBy: { fontSize: 8, fontWeight: '800', color: '#64748B', letterSpacing: 1 },
  flyerFooterBrand: { fontSize: 11, fontWeight: '900', color: '#1E293B', letterSpacing: 0.5 },

  /* BUTTONS */
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    width: SCREEN_WIDTH - 24,
  },
  shareBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E51025',
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#E51025',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  shareBtnText: { color: '#FFF', fontSize: 14, fontWeight: '900' },
  downloadBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  downloadBtnText: { color: '#FFF', fontSize: 14, fontWeight: '900' },

  /* ROSTER LIST VIEW */
  listContainer: { width: SCREEN_WIDTH - 24 },
  rosterCard: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  rosterHeader: { flexDirection: 'row', alignItems: 'center' },
  rosterSlotCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E51025',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rosterSlotCircleText: { color: '#FFF', fontSize: 13, fontWeight: '900' },
  rosterTeamName: { color: '#FFF', fontSize: 15, fontWeight: '800' },
  rosterMapText: { color: '#94A3B8', fontSize: 11, fontWeight: '600', marginTop: 2 },
  rosterCountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F291E',
    borderWidth: 1,
    borderColor: '#16A34A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rosterCountText: { color: '#4ADE80', fontSize: 11, fontWeight: '700' },
  rosterPlayersBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  playerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  playerChipName: { color: '#E2E8F0', fontSize: 11, fontWeight: '600' },
  playerChipRole: { color: '#94A3B8', fontSize: 10, marginLeft: 4 },

  emptyWrap: { alignItems: 'center', paddingVertical: 40 },
  emptyTitle: { color: '#FFF', fontSize: 17, fontWeight: '800', marginTop: 12 },
  emptySub: { color: '#94A3B8', fontSize: 12, textAlign: 'center', marginTop: 6, paddingHorizontal: 30 },
});

export default RegisteredTeamsScreen;
