import React, { useState, useEffect, useMemo, useContext } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Image, Alert, Modal, StatusBar, ScrollView, Linking,
  ActivityIndicator
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from '../utils/SafeImagePicker';
import { colors } from '../theme/colors';
import { AppContext } from '../context/AppContext';
import { TournamentCalendarView } from '../components/TournamentCalendarView';
import { apiService } from '../api/index';

interface Player {
  id: string;
  gameId: string;
  gameName: string;
}

const TeamRegistrationScreen = ({ navigation, route }: any) => {
  const { tournamentId, tournamentName } = route?.params || {};
  const { registerTeam, globalTournaments, teamRegistrations, userProfile, currentUserId } = useContext(AppContext);
  const tournament = globalTournaments.find(t => t.id === tournamentId);

  const [teamName, setTeamName] = useState('');
  const [teamBanner, setTeamBanner] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', gameId: '', gameName: '' },
    { id: '2', gameId: '', gameName: '' },
    { id: '3', gameId: '', gameName: '' },
    { id: '4', gameId: '', gameName: '' },
    { id: '5', gameId: '', gameName: '' },
    { id: '6', gameId: '', gameName: '' }
  ]);
  const [hasJoinedGroup, setHasJoinedGroup] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [apiTeams, setApiTeams] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cleanTid = String(tournamentId || '').replace('tourney_', '');

  useEffect(() => {
    let isMounted = true;
    const fetchRegistered = async () => {
      try {
        const teams = await apiService.getRegisteredTeams(cleanTid || tournamentId);
        if (isMounted && Array.isArray(teams)) {
          setApiTeams(teams);
        }
      } catch (err) {
        console.log('Error fetching registered teams', err);
      }
    };
    if (cleanTid || tournamentId) {
      fetchRegistered();
    }
    return () => { isMounted = false; };
  }, [cleanTid, tournamentId]);

  const existingTournamentTeams = useMemo(() => {
    const combined: any[] = [];
    const seen = new Set<string>();

    (apiTeams || []).forEach(t => {
      const idKey = String(t.id || t.teamName);
      if (!seen.has(idKey)) {
        seen.add(idKey);
        combined.push(t);
      }
    });

    (teamRegistrations || []).filter(t => String(t.tournamentId || '').replace('tourney_', '') === cleanTid).forEach(t => {
      const idKey = String(t.id || t.teamName);
      if (!seen.has(idKey)) {
        seen.add(idKey);
        combined.push(t);
      }
    });

    return combined;
  }, [apiTeams, teamRegistrations, cleanTid]);

  const tAny = tournament as any;
  const totalSlots = parseInt(tAny?.totalSlots || tAny?.total_slots || tAny?.teamsLimit || tAny?.teams_limit || '25', 10) || 25;

  const bookedSlotsMap = useMemo(() => {
    const map: Record<string, string> = {};
    existingTournamentTeams.forEach(t => {
      const s = String(t.slot || '').replace(/[^0-9]/g, '');
      if (s) {
        map[s] = t.teamName || 'Booked';
      }
    });
    return map;
  }, [existingTournamentTeams]);

  // Pre-select first available slot
  useEffect(() => {
    if (!selectedSlot || bookedSlotsMap[selectedSlot]) {
      for (let i = 1; i <= totalSlots; i++) {
        const sStr = i.toString();
        if (!bookedSlotsMap[sStr]) {
          setSelectedSlot(sStr);
          break;
        }
      }
    }
  }, [bookedSlotsMap, totalSlots, selectedSlot]);

  const isFormValid = useMemo(() => {
    if (!teamName.trim()) return false;
    const requiredPlayers = players.slice(0, 4);
    const emptyRequiredPlayer = requiredPlayers.find(p => !p.gameId.trim() || !p.gameName.trim());
    return !emptyRequiredPlayer;
  }, [teamName, players]);

  const handleImagePick = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 500,
        height: 500,
        cropping: true,
        cropperCircleOverlay: false,
        mediaType: 'photo'
      });
      if (image && image.path) {
        setTeamBanner(image.path);
      }
    } catch (error: any) {
      if (error.message !== 'User cancelled image selection') {
        console.error(error);
        Alert.alert('Error', 'Something went wrong while picking the image.');
      }
    }
  };

  const updatePlayer = (id: string, field: 'gameId' | 'gameName', value: string) => {
    setPlayers(players.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleSubmit = async () => {
    if (!teamName.trim()) {
      Alert.alert('Error', 'Please enter a TEAM NAME.');
      return;
    }
    const requiredPlayers = players.slice(0, 4);
    const emptyRequiredPlayer = requiredPlayers.find(p => !p.gameId.trim() || !p.gameName.trim());
    if (emptyRequiredPlayer) {
      Alert.alert('Error', 'Please fill in IN GAME ID and IN GAME NAME for the first 4 players.');
      return;
    }

    let slotToBook = selectedSlot;
    if (!slotToBook) {
      // Find first free slot
      for (let i = 1; i <= totalSlots; i++) {
        if (!bookedSlotsMap[i.toString()]) {
          slotToBook = i.toString();
          break;
        }
      }
    }
    if (!slotToBook) {
      slotToBook = (existingTournamentTeams.length + 1).toString();
    }

    setIsSubmitting(true);
    try {
      const currentUid = (userProfile?.id || currentUserId || '1').toString().replace('user_', '');
      await registerTeam({
        id: Date.now().toString(),
        tournamentId: tournamentId,
        teamName: teamName.trim(),
        teamBanner,
        slot: slotToBook,
        map: 'Erangel',
        players: players.filter(p => p.gameId.trim() && p.gameName.trim()),
        user_id: currentUid,
        userId: currentUid,
        tournament: tournament
      });

      setIsSubmitting(false);
      Alert.alert(
        'Registration Confirmed!',
        `Your team "${teamName}" is registered in Slot #${slotToBook} for ${tournamentName || 'this tournament'}!`,
        [
          {
            text: 'View My Matches',
            onPress: () => {
              navigation.navigate('MainTabs', {
                screen: 'Matches',
                params: { initialTab: 'Matches' }
              });
            }
          }
        ]
      );
    } catch (e: any) {
      setIsSubmitting(false);
      Alert.alert('Registration Failed', e?.message || 'Something went wrong while booking the slot.');
    }
  };

  const configuredGroups = Math.max(1, parseInt(tournament?.numberOfGroups || '1', 10) || 1);

  return (
    <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Register Team & Slot</Text>
        </View>
      </SafeAreaView>

      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 60, paddingHorizontal: 20, paddingTop: 16 }}
        enableOnAndroid={true}
        extraScrollHeight={20}
        showsVerticalScrollIndicator={false}
      >
        {tournamentName && (
          <View style={styles.tournamentInfoCard}>
            <Icon name="trophy-outline" size={22} color={colors.primary} style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.tournamentNameText}>{tournamentName}</Text>
              <Text style={styles.tournamentSubText}>Select your slot & register team line-up</Text>
            </View>
          </View>
        )}

        {tournament && (tournament.matchDatesObj || tournament.regStartDate) && (
          <View style={[styles.sectionCard, { marginTop: 5 }]}>
            <Text style={styles.sectionHeaderTitle}>Tournament Schedule</Text>
            <TournamentCalendarView 
              matchDatesObj={tournament.matchDatesObj}
              regStartDate={tournament.regStartDate}
              regEndDate={tournament.regEndDate}
            />
          </View>
        )}

        {/* TEAM IDENTITY SECTION */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeaderTitle}>Team Identity</Text>
          {/* Banner Image */}
          <TouchableOpacity style={styles.uploadSection} onPress={handleImagePick}>
            {teamBanner ? (
              <Image source={{ uri: teamBanner }} style={styles.bannerImage} />
            ) : (
              <View style={styles.uploadBox}>
                <View style={styles.iconCircle}>
                  <Icon name="image-outline" size={28} color={colors.primary} />
                </View>
                <Text style={styles.uploadText}>Upload Team Logo/Banner</Text>
                <Text style={styles.uploadSubText}>Recommended size 500x500</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Team Details */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Team Name <Text style={{color: '#E51025'}}>*</Text></Text>
            <View style={styles.inputContainer}>
              <Icon name="shield-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                placeholder="Enter your team name (e.g. Team Phoenix)" 
                placeholderTextColor="#9CA3AF" 
                value={teamName} 
                onChangeText={setTeamName} 
              />
            </View>
          </View>
        </View>

        {/* PLAYERS ROSTER SECTION */}
        <View style={styles.playersSectionHeader}>
          <Text style={styles.sectionHeaderTitle}>Roster Details</Text>
          <Text style={styles.sectionSubTitle}>First 4 players are required</Text>
        </View>

        {players.map((player, index) => (
          <View key={player.id} style={styles.playerCard}>
            <View style={styles.playerCardHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={[styles.playerNumberBadge, index < 4 ? { backgroundColor: colors.primary } : { backgroundColor: '#9CA3AF' }]}>
                  <Text style={styles.playerNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.playerIndex}>Player {index + 1} {index < 4 ? '(Main)' : '(Sub)'}</Text>
              </View>
            </View>
            <View style={styles.playerInputsRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10, marginBottom: 0 }]}>
                <Text style={styles.label}>IN GAME ID {index < 4 && <Text style={{color: '#E51025'}}>*</Text>}</Text>
                <View style={styles.inputContainer}>
                  <TextInput 
                    style={styles.input} 
                    placeholder="e.g. 512345678" 
                    placeholderTextColor="#9CA3AF" 
                    value={player.gameId} 
                    keyboardType="numeric"
                    onChangeText={(val) => updatePlayer(player.id, 'gameId', val)} 
                  />
                </View>
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginBottom: 0 }]}>
                <Text style={styles.label}>IN GAME NAME {index < 4 && <Text style={{color: '#E51025'}}>*</Text>}</Text>
                <View style={styles.inputContainer}>
                  <TextInput 
                    style={styles.input} 
                    placeholder="e.g. UPMIxPlayer" 
                    placeholderTextColor="#9CA3AF" 
                    value={player.gameName} 
                    onChangeText={(val) => updatePlayer(player.id, 'gameName', val)} 
                  />
                </View>
              </View>
            </View>
          </View>
        ))}

        {/* TOURNAMENT GROUPS */}
        <View style={styles.groupsContainer}>
          <Text style={styles.sectionHeaderTitle}>Tournament Groups</Text>
          {Array.from({ length: configuredGroups }).map((_, idx) => {
            const groupNum = idx + 1;
            const teamsPerGrp = parseInt(tournament?.teamsPerGroup || '25', 10) || 25;
            const totalJoined = existingTournamentTeams.length;
            
            const currentGroupJoined = Math.min(Math.max(totalJoined - (idx * teamsPerGrp), 0), teamsPerGrp);
            const isFull = currentGroupJoined >= teamsPerGrp;
            
            const firstAvailableGroupIdx = Math.floor(totalJoined / teamsPerGrp);
            const isActive = idx === firstAvailableGroupIdx || configuredGroups === 1;
            
            let statusText = '';
            if (isFull) statusText = 'Full';
            else if (isActive) statusText = hasJoinedGroup ? 'Joined' : 'Join';
            else statusText = 'Locked';

            return (
              <View key={groupNum} style={[styles.groupLinkCard, { opacity: (isActive || isFull) ? 1 : 0.6, borderColor: isActive ? '#10B981' : '#E5E7EB', flexDirection: 'row', justifyContent: 'space-between' }]}>
                <View style={{ flex: 1, alignItems: 'flex-start' }}>
                  <Text style={styles.groupLinkTitle}>Group {groupNum}</Text>
                  <Text style={styles.groupLinkDesc}>{currentGroupJoined} / {teamsPerGrp} Teams Joined</Text>
                </View>
                <TouchableOpacity 
                  style={[
                    styles.joinBtn, 
                    { backgroundColor: isFull ? '#E51025' : (isActive && hasJoinedGroup ? '#10B981' : (isActive ? '#25D366' : '#9CA3AF')) },
                    (isFull || !isActive || (isActive && hasJoinedGroup)) && { opacity: 0.85 }
                  ]} 
                  disabled={isFull || !isActive || (isActive && hasJoinedGroup)}
                  onPress={() => {
                    setHasJoinedGroup(true);
                  }}
                >
                  {!isFull && <Icon name={isActive && hasJoinedGroup ? "checkmark" : "chatbubbles-outline"} size={16} color="#FFF" />}
                  <Text style={styles.joinBtnText}>{statusText}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* SUBMIT BUTTON */}
        <TouchableOpacity 
          style={[styles.submitButton, (!isFormValid || isSubmitting) && { opacity: 0.6 }]} 
          onPress={() => {
            if (!isFormValid) {
              Alert.alert('Error', 'Please fill in Team Name and the first 4 players.');
              return;
            }
            if (!hasJoinedGroup) {
              setHasJoinedGroup(true);
            }
            handleSubmit();
          }} 
          activeOpacity={0.85}
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
          ) : null}
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Submitting Registration...' : 'Submit Registration'}
          </Text>
          {!isSubmitting && <Icon name="arrow-forward-outline" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />}
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.primary,
    borderBottomWidth: 0,
    elevation: 4,
    zIndex: 10,
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  container: {
    flex: 1,
  },
  tournamentInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(220, 38, 38, 0.08)',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.2)',
  },
  tournamentNameText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
  },
  tournamentSubText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeaderTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  sectionSubTitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  selectedSlotPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E51025',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  selectedSlotPillText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  slotLegendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  legendText: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '500',
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-start',
  },
  slotBox: {
    width: '23%',
    aspectRatio: 1.15,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  slotBoxBooked: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
    opacity: 0.55,
  },
  slotBoxSelected: {
    backgroundColor: '#E51025',
    borderColor: '#B91C1C',
    shadowColor: '#E51025',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  slotNumberText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  slotNumberTextBooked: {
    color: '#9CA3AF',
  },
  slotNumberTextSelected: {
    color: '#FFFFFF',
  },
  slotAvailableLabel: {
    fontSize: 9,
    color: '#10B981',
    fontWeight: '600',
    marginTop: 2,
  },
  slotBookedLabel: {
    fontSize: 8,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 2,
  },
  slotSelectedLabel: {
    fontSize: 9,
    color: '#FFFFFF',
    fontWeight: '700',
    marginTop: 2,
  },
  uploadSection: {
    marginVertical: 14,
  },
  uploadBox: {
    height: 120,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  uploadText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  uploadSubText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  bannerImage: {
    width: '100%',
    height: 140,
    borderRadius: 12,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 44,
    color: '#1F2937',
    fontSize: 14,
  },
  playersSectionHeader: {
    marginBottom: 10,
    marginTop: 4,
  },
  playerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  playerCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  playerNumberBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  playerNumberText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  playerIndex: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  playerInputsRow: {
    flexDirection: 'row',
  },
  groupsContainer: {
    marginBottom: 16,
    marginTop: 6,
  },
  groupLinkCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  groupLinkTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  groupLinkDesc: {
    fontSize: 12,
    color: '#6B7280',
  },
  joinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#25D366',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 6,
  },
  joinBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default TeamRegistrationScreen;
