import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert, Modal, StatusBar, ScrollView, Linking } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import { colors } from '../theme/colors';
import { AppContext } from '../context/AppContext';
import { TournamentCalendarView } from '../components/TournamentCalendarView';

interface Player {
  id: string;
  gameId: string;
  gameName: string;
}

const TeamRegistrationScreen = ({ navigation, route }: any) => {
  const { tournamentId, tournamentName } = route?.params || {};
  const { registerTeam, globalTournaments, teamRegistrations } = React.useContext(AppContext);
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

  const isFormValid = React.useMemo(() => {
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

  const existingTournamentTeams = React.useMemo(() => {
    return teamRegistrations.filter(t => t.tournamentId === tournamentId);
  }, [teamRegistrations, tournamentId]);

  const handleSubmit = () => {
    if (!teamName.trim()) {
      Alert.alert('Error', 'Please enter a TEAM NAME.');
      return;
    }
    const requiredPlayers = players.slice(0, 4); // First 4 players usually required in BGMI
    const emptyRequiredPlayer = requiredPlayers.find(p => !p.gameId.trim() || !p.gameName.trim());
    if (emptyRequiredPlayer) {
      Alert.alert('Error', 'Please fill in IN GAME ID and IN GAME NAME for the first 4 players.');
      return;
    }
    
    // Process registration logic here
    let nextSlotNum = 1;
    while (existingTournamentTeams.some(t => t.slot === nextSlotNum.toString())) {
      nextSlotNum++;
    }

    registerTeam({
      id: Date.now().toString(),
      tournamentId,
      teamName,
      teamBanner,
      slot: nextSlotNum.toString(),
      players: players.filter(p => p.gameId.trim() && p.gameName.trim())
    });

    Alert.alert('Success', 'Team registered successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Register Team</Text>
        </View>
      </SafeAreaView>

      <KeyboardAwareScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50, paddingHorizontal: 20, paddingTop: 20 }} enableOnAndroid={true} extraScrollHeight={20} showsVerticalScrollIndicator={false}>
        
        {tournamentName && (
          <View style={styles.tournamentInfoCard}>
             <Icon name="trophy-outline" size={20} color={colors.primary} style={{ marginRight: 10 }} />
             <Text style={styles.tournamentNameText}>{tournamentName}</Text>
          </View>
        )}

        {tournament && (tournament.matchDatesObj || tournament.regStartDate) && (
          <View style={[styles.sectionCard, { marginTop: 15 }]}>
            <Text style={styles.sectionHeaderTitle}>Tournament Schedule</Text>
            <TournamentCalendarView 
              matchDatesObj={tournament.matchDatesObj}
              regStartDate={tournament.regStartDate}
              regEndDate={tournament.regEndDate}
            />
          </View>
        )}

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
                placeholder="Enter your team name" 
                placeholderTextColor="#9CA3AF" 
                value={teamName} 
                onChangeText={setTeamName} 
              />
            </View>
          </View>
        </View>

        {/* Players List */}
        <View style={styles.playersSectionHeader}>
          <Text style={styles.sectionHeaderTitle}>Roster Details</Text>
        </View>

        {players.map((player, index) => (
          <View key={player.id} style={styles.playerCard}>
            <View style={styles.playerCardHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.playerNumberBadge}>
                  <Text style={styles.playerNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.playerIndex}>Player {index + 1}</Text>
              </View>
            </View>
            <View style={styles.playerInputsRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 12, marginBottom: 0 }]}>
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

        <View style={styles.groupsContainer}>
          <Text style={styles.sectionHeaderTitle}>Select Group to Join</Text>
          {Array.from({ length: parseInt(tournament?.numberOfGroups || '1', 10) }).map((_, idx) => {
            const groupNum = idx + 1;
            const teamsPerGrp = parseInt(tournament?.teamsPerGroup || '20', 10);
            const totalJoined = existingTournamentTeams.length;
            
            const currentGroupJoined = Math.min(Math.max(totalJoined - (idx * teamsPerGrp), 0), teamsPerGrp);
            const isFull = currentGroupJoined >= teamsPerGrp;
            
            const firstAvailableGroupIdx = Math.floor(totalJoined / teamsPerGrp);
            const isActive = idx === firstAvailableGroupIdx;
            
            let statusText = '';
            if (isFull) statusText = 'Full';
            else if (isActive) statusText = hasJoinedGroup ? 'Joined' : 'Join';
            else statusText = 'Locked';

            return (
              <View key={groupNum} style={[styles.groupLinkCard, { opacity: (isActive || isFull) ? 1 : 0.5, borderColor: isActive ? '#10B981' : '#E5E7EB', flexDirection: 'row', justifyContent: 'space-between' }]}>
                <View style={{ flex: 1, alignItems: 'flex-start' }}>
                  <Text style={styles.groupLinkTitle}>Group {groupNum}</Text>
                  <Text style={styles.groupLinkDesc}>{currentGroupJoined} / {teamsPerGrp} Teams Joined</Text>
                </View>
                <TouchableOpacity 
                  style={[
                    styles.joinBtn, 
                    { backgroundColor: isFull ? '#E51025' : (isActive && hasJoinedGroup ? '#10B981' : (isActive ? '#25D366' : '#9CA3AF')) },
                    (isFull || !isActive || (isActive && hasJoinedGroup)) && { opacity: 0.8 }
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

        <TouchableOpacity 
          style={[styles.submitButton, (!isFormValid || !hasJoinedGroup) && { opacity: 0.5 }]} 
          onPress={() => {
            if (!isFormValid) {
              Alert.alert('Error', 'Please fill all required fields first.');
              return;
            }
            if (!hasJoinedGroup) {
              Alert.alert('Error', 'Please join the Tournament group first.');
              return;
            }
            handleSubmit();
          }} 
          activeOpacity={0.9}
          disabled={!isFormValid || !hasJoinedGroup}
        >
          <Text style={styles.submitButtonText}>Submit Registration</Text>
          <Icon name="arrow-forward-outline" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.2)',
  },
  tournamentNameText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
    flex: 1,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  uploadSection: {
    marginBottom: 20,
  },
  uploadBox: {
    height: 140,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadText: {
    color: '#4B5563',
    fontSize: 15,
    fontWeight: '600',
  },
  uploadSubText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 4,
  },
  bannerImage: {
    width: '100%',
    height: 140,
    borderRadius: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: '#4B5563',
    fontSize: 13,
    marginBottom: 8,
    fontWeight: '700',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#1F2937',
    paddingVertical: 14,
    fontSize: 15,
  },
  playersSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  playerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  playerCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  playerNumberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  playerNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4B5563',
  },
  playerIndex: {
    color: '#1F2937',
    fontSize: 15,
    fontWeight: 'bold',
  },
  removePlayerBtn: {
    padding: 4,
    backgroundColor: '#FEF2F2',
    borderRadius: 20,
  },
  playerInputsRow: {
    flexDirection: 'row',
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  groupsContainer: {
    marginBottom: 20,
    marginTop: 10,
  },
  groupLinkCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    alignItems: 'center'
  },
  groupLinkTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8
  },
  groupLinkDesc: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18
  },
  joinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#25D366',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    gap: 8
  },
  joinBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: '#1F2937',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalOptionText: {
    color: '#4B5563',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default TeamRegistrationScreen;



