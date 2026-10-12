import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Image, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import { colors } from '../theme/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { AppContext } from '../context/AppContext';

const ROLES = [
  'IGL (In-Game Leader)',
  'Assaulter',
  'Sniper / DMR Specialist',
  'Support',
  'Scout',
  'Grenadier'
];

const ManageTeamsScreen = ({ navigation, route }: any) => {
  const { tournamentName = 'Unknown', gameType = 'BGMI', isRoundRobin, tournamentId } = route.params || {};
  const { teamRegistrations, registerTeam } = useContext(AppContext);

  // Filter registrations to show slots filled for this tournament
  const slots = tournamentId ? teamRegistrations.filter(t => t.tournamentId === tournamentId) : [];

  const [isAdding, setIsAdding] = useState(false);

  // Form state
  const [teamName, setTeamName] = useState('');
  const [slotNo, setSlotNo] = useState('');
  const [tags, setTags] = useState('');
  const [players, setPlayers] = useState([{ id: Date.now().toString(), name: '', role: '' }]);
  const [teamLogo, setTeamLogo] = useState<string | null>(null);

  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [currentEditingPlayerIndex, setCurrentEditingPlayerIndex] = useState<number | null>(null);

  const handleImagePick = async () => {
    try {
      const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
      if (result.didCancel) return;
      if (result.errorCode) {
        Alert.alert('Error', result.errorMessage || 'Failed to pick image');
        return;
      }
      if (result.assets && result.assets.length > 0) {
        setTeamLogo(result.assets[0].uri || null);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const handleAddPlayer = () => {
    if (players.length < 8) {
      setPlayers([...players, { id: Date.now().toString(), name: '', role: '' }]);
    } else {
      Alert.alert('Limit Reached', 'Maximum 8 players can be added.');
    }
  };

  const updatePlayer = (index: number, field: 'name' | 'role', value: string) => {
    const newPlayers = [...players];
    newPlayers[index][field as 'name' | 'role'] = value;
    setPlayers(newPlayers);
  };

  const removePlayer = (index: number) => {
    const newPlayers = [...players];
    newPlayers.splice(index, 1);
    setPlayers(newPlayers);
  };

  const handleSaveTeam = () => {
    if (!teamName.trim()) {
      Alert.alert('Error', 'Please enter a team name');
      return;
    }
    
    registerTeam({
      id: Date.now().toString(),
      tournamentId: tournamentId || 'draft',
      teamName,
      teamBanner: teamLogo,
      slot: slotNo || String(slots.length + 1),
      players
    });

    Alert.alert('Success', 'Team added successfully!');
    setIsAdding(false);
    // Reset form
    setTeamName('');
    setSlotNo('');
    setTags('');
    setPlayers([{ id: Date.now().toString(), name: '', role: '' }]);
    setTeamLogo(null);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => {
            if (isAdding) setIsAdding(false);
            else navigation.goBack();
          }} 
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color={colors.textBlack} />
        </TouchableOpacity>
        <Text style={styles.title}>{isAdding ? 'Add Team' : 'Manage Slots'}</Text>
      </View>

      {!isAdding ? (
        <ScrollView style={styles.container}>
          <View style={styles.listHeader}>
            <Text style={styles.listSubtitle}>Filled Slots ({slots.length})</Text>
            <TouchableOpacity onPress={() => setIsAdding(true)} style={styles.addButtonSm}>
              <Icon name="add" size={16} color={colors.textBlack} style={{ marginRight: 4 }} />
              <Text style={{ color: colors.textBlack, fontWeight: 'bold' }}>Add</Text>
            </TouchableOpacity>
          </View>

          {slots.length > 0 ? (
            slots.map((team, idx) => (
              <View key={team.id} style={styles.slotCard}>
                <View style={styles.slotHeader}>
                  <Text style={styles.slotBadge}>#{team.slot || idx + 1}</Text>
                  {team.teamBanner ? (
                    <Image source={{ uri: team.teamBanner }} style={styles.slotLogo} />
                  ) : (
                    <View style={styles.slotLogoPlaceholder}>
                      <Icon name="people" size={16} color="#757575" />
                    </View>
                  )}
                  <Text style={styles.slotTeamName}>{team.teamName}</Text>
                </View>
                <Text style={styles.slotPlayersText}>Players: {team.players.length}</Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Icon name="people-outline" size={48} color="#E0E0E0" style={{ marginBottom: 10 }} />
              <Text style={styles.emptyText}>No teams added yet.</Text>
            </View>
          )}

          <TouchableOpacity style={styles.addTeamButton} onPress={() => setIsAdding(true)}>
            <Icon name="add-circle-outline" size={20} color={colors.textBlack} style={{ marginRight: 8 }} />
            <Text style={styles.addTeamButtonText}>Add Team Manually</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <ScrollView style={styles.container}>
          <TouchableOpacity style={styles.uploadSection} onPress={handleImagePick}>
            <View style={styles.uploadBox}>
              {teamLogo ? (
                <Image source={{ uri: teamLogo }} style={{ width: 60, height: 60, borderRadius: 15 }} />
              ) : (
                <>
                  <Icon name="image-outline" size={30} color={colors.primary} />
                  <View style={styles.plusBadge}>
                    <Icon name="add" size={12} color={colors.textBlack} />
                  </View>
                </>
              )}
            </View>
            <View>
              <Text style={styles.uploadTitle}>Upload Team Logo</Text>
              <Text style={styles.uploadSub}>Optional Ã‚Â· PNG or JPG</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>TEAM NAME</Text>
            <View style={styles.inputRow}>
              <Icon name="people" size={20} color="#757575" style={{ marginRight: 10 }} />
              <TextInput 
                style={styles.input} 
                placeholder="Enter team name"
                placeholderTextColor="#757575"
                value={teamName}
                onChangeText={setTeamName}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputCard, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.inputLabel}>SLOT NO</Text>
              <TextInput 
                style={styles.input} 
                value={slotNo}
                onChangeText={setSlotNo}
                keyboardType="numeric"
                placeholder="e.g. 1"
                placeholderTextColor="#757575"
              />
            </View>
            <View style={[styles.inputCard, { flex: 1 }]}>
              <View style={styles.labelRow}>
                <Text style={styles.inputLabel}>TAGS</Text>
                <Icon name="information-circle-outline" size={16} color="#757575" />
              </View>
              <TextInput 
                style={styles.input} 
                placeholder="Add tags"
                placeholderTextColor="#757575"
                value={tags}
                onChangeText={setTags}
              />
            </View>
          </View>

          <View style={[styles.inputCard, { marginBottom: 15 }]}>
            <View style={styles.labelRow}>
              <Text style={styles.inputLabel}>PLAYERS ({players.length}/8)</Text>
              {players.length < 8 && (
                <TouchableOpacity onPress={handleAddPlayer}>
                  <Icon name="add-circle-outline" size={20} color={colors.primary} />
                </TouchableOpacity>
              )}
            </View>
            
            {players.map((player, index) => (
              <View key={player.id} style={{ marginTop: 15 }}>
                <View style={styles.row}>
                  <View style={{ flex: 2, marginRight: 10 }}>
                    <Text style={[styles.inputLabel, { fontSize: 10 }]}>PLAYER NAME</Text>
                    <TextInput 
                      style={[styles.input, { borderBottomWidth: 1, borderBottomColor: '#E0E0E0', paddingVertical: 5 }]} 
                      placeholder="Name"
                      placeholderTextColor="#757575"
                      value={player.name}
                      onChangeText={(val) => updatePlayer(index, 'name', val)}
                    />
                  </View>
                  <View style={{ flex: 1, marginRight: players.length > 1 ? 10 : 0 }}>
                    <Text style={[styles.inputLabel, { fontSize: 10 }]}>ROLE</Text>
                    <TouchableOpacity 
                      style={{ borderBottomWidth: 1, borderBottomColor: '#E0E0E0', paddingVertical: 5, minHeight: 30, justifyContent: 'center' }}
                      onPress={() => {
                        setCurrentEditingPlayerIndex(index);
                        setIsRoleModalVisible(true);
                      }}
                    >
                      <Text style={[styles.input, { color: player.role ? colors.white : '#757575', fontSize: 12 }]}>
                        {player.role || 'Select'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {players.length > 1 && (
                    <TouchableOpacity 
                      style={{ justifyContent: 'flex-end', paddingBottom: 5 }}
                      onPress={() => removePlayer(index)}
                    >
                      <Icon name="trash-outline" size={20} color="#E51025" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.createTourneyButton} onPress={handleSaveTeam}>
            <Text style={styles.createTourneyButtonText}>SAVE TEAM</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      <Modal
        visible={isRoleModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsRoleModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setIsRoleModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Role</Text>
            {ROLES.map((role) => (
              <TouchableOpacity 
                key={role} 
                style={styles.roleOption}
                onPress={() => {
                  if (currentEditingPlayerIndex !== null) {
                    updatePlayer(currentEditingPlayerIndex, 'role', role);
                  }
                  setIsRoleModalVisible(false);
                }}
              >
                <Text style={styles.roleOptionText}>{role}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  backButton: { marginRight: 15 },
  title: { color: colors.textBlack, fontSize: 20, fontWeight: 'bold' },
  container: { flex: 1, padding: 20 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  listSubtitle: { color: '#757575', fontSize: 16 },
  addButtonSm: { backgroundColor: colors.primary, flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, alignItems: 'center' },
  slotCard: { backgroundColor: '#F5F5F5', padding: 15, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#E0E0E0' },
  slotHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  slotBadge: { color: '#059669', fontWeight: 'bold', marginRight: 10 },
  slotLogo: { width: 30, height: 30, borderRadius: 15, marginRight: 10 },
  slotLogoPlaceholder: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  slotTeamName: { color: colors.textBlack, fontSize: 16, fontWeight: 'bold', flex: 1 },
  slotPlayersText: { color: '#757575', fontSize: 12, marginLeft: 40 },
  emptyState: { alignItems: 'center', marginTop: 50, marginBottom: 50 },
  emptyText: { color: '#757575', fontSize: 16 },
  addTeamButton: { backgroundColor: '#334155', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, borderRadius: 10, marginBottom: 40 },
  addTeamButtonText: { color: colors.white, fontWeight: 'bold', fontSize: 16 },
  uploadSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  uploadBox: { width: 60, height: 60, borderWidth: 1, borderColor: '#E0E0E0', borderStyle: 'dashed', borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  plusBadge: { position: 'absolute', bottom: -5, right: -5, backgroundColor: colors.primary, borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  uploadTitle: { color: colors.textBlack, fontSize: 16, fontWeight: 'bold' },
  uploadSub: { color: '#757575', fontSize: 12 },
  inputCard: { backgroundColor: '#F5F5F5', borderRadius: 10, padding: 15, marginBottom: 15 },
  inputLabel: { color: '#757575', fontSize: 12, marginBottom: 5, fontWeight: 'bold' },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  input: { color: colors.textBlack, fontSize: 16, padding: 0 },
  row: { flexDirection: 'row' },
  labelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  createTourneyButton: { backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, borderRadius: 10, width: '100%', marginBottom: 40, marginTop: 10 },
  createTourneyButtonText: { color: colors.white, fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#F5F5F5', borderRadius: 10, width: '80%', padding: 20 },
  modalTitle: { color: colors.textBlack, fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  roleOption: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  roleOptionText: { color: colors.textBlack, fontSize: 16, textAlign: 'center' }
});

export default ManageTeamsScreen;


