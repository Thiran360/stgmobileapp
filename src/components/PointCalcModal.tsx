import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export interface PointCalcTeam {
  id: string;
  rank: number;
  name: string;
  matches: number;
  wwcd: number;
  placePts: number;
  kills: number;
  totalPts: number;
}

export interface PointCalcData {
  systemType: '10_pts' | '15_pts' | 'custom';
  killPoints: number;
  matchNumber: string;
  mapName: string;
  teams: PointCalcTeam[];
}

const DEFAULT_10_PTS_SYSTEM: Record<number, number> = {
  1: 10,
  2: 6,
  3: 5,
  4: 4,
  5: 3,
  6: 2,
  7: 1,
  8: 1,
  9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0
};

const DEFAULT_15_PTS_SYSTEM: Record<number, number> = {
  1: 15,
  2: 12,
  3: 10,
  4: 8,
  5: 6,
  6: 4,
  7: 2,
  8: 1, 9: 1, 10: 1, 11: 1, 12: 1,
  13: 0, 14: 0, 15: 0, 16: 0
};

export const INITIAL_TEAMS: PointCalcTeam[] = [
  { id: '1', rank: 1, name: 'Team Soul', matches: 5, wwcd: 2, placePts: 26, kills: 28, totalPts: 54 },
  { id: '2', rank: 2, name: 'GodLike Esports', matches: 5, wwcd: 1, placePts: 22, kills: 25, totalPts: 47 },
  { id: '3', rank: 3, name: 'Team XSpark', matches: 5, wwcd: 1, placePts: 18, kills: 21, totalPts: 39 },
  { id: '4', rank: 4, name: 'Blind Esports', matches: 5, wwcd: 1, placePts: 15, kills: 18, totalPts: 33 },
  { id: '5', rank: 5, name: 'Gladiators Esports', matches: 5, wwcd: 0, placePts: 14, kills: 16, totalPts: 30 },
  { id: '6', rank: 6, name: 'Reckoning Esports', matches: 5, wwcd: 0, placePts: 11, kills: 14, totalPts: 25 },
  { id: '7', rank: 7, name: 'Medal Esports', matches: 5, wwcd: 0, placePts: 9, kills: 13, totalPts: 22 },
  { id: '8', rank: 8, name: 'Global Esports', matches: 5, wwcd: 0, placePts: 8, kills: 12, totalPts: 20 },
  { id: '9', rank: 9, name: 'Entity Gaming', matches: 5, wwcd: 0, placePts: 6, kills: 10, totalPts: 16 },
  { id: '10', rank: 10, name: 'Orangutan', matches: 5, wwcd: 0, placePts: 5, kills: 9, totalPts: 14 },
];

interface PointCalcModalProps {
  visible: boolean;
  initialData?: Partial<PointCalcData>;
  onClose: () => void;
  onSave: (data: PointCalcData) => void;
}

const PointCalcModal: React.FC<PointCalcModalProps> = ({
  visible,
  initialData,
  onClose,
  onSave
}) => {
  const [systemType, setSystemType] = useState<'10_pts' | '15_pts' | 'custom'>(
    initialData?.systemType || '10_pts'
  );
  const [killPoints, setKillPoints] = useState<number>(initialData?.killPoints || 1);
  const [matchNumber, setMatchNumber] = useState<string>(initialData?.matchNumber || 'Match 5');
  const [mapName, setMapName] = useState<string>(initialData?.mapName || 'Erangel');
  const [teams, setTeams] = useState<PointCalcTeam[]>(
    initialData?.teams && initialData.teams.length > 0 ? initialData.teams : INITIAL_TEAMS
  );

  const calculateAndSort = () => {
    const scoringMap = systemType === '15_pts' ? DEFAULT_15_PTS_SYSTEM : DEFAULT_10_PTS_SYSTEM;

    const recalculated = teams.map(t => {
      const place = t.placePts !== undefined ? Number(t.placePts) : (scoringMap[t.rank] || 0);
      const kills = Number(t.kills) || 0;
      const total = place + (kills * killPoints);
      return {
        ...t,
        placePts: place,
        kills: kills,
        totalPts: total
      };
    });

    // Sort by Total Points (desc), then WWCD (desc), then Kills (desc)
    recalculated.sort((a, b) => {
      if (b.totalPts !== a.totalPts) return b.totalPts - a.totalPts;
      if (b.wwcd !== a.wwcd) return b.wwcd - a.wwcd;
      return b.kills - a.kills;
    });

    // Re-rank 1 to N
    const reRanked = recalculated.map((t, idx) => ({
      ...t,
      rank: idx + 1
    }));

    setTeams(reRanked);
    return reRanked;
  };

  const handleUpdateTeam = (id: string, field: keyof PointCalcTeam, value: any) => {
    setTeams(prev =>
      prev.map(t => {
        if (t.id === id) {
          const updated = { ...t, [field]: value };
          if (field === 'kills' || field === 'placePts') {
            const kills = field === 'kills' ? Number(value) || 0 : t.kills;
            const place = field === 'placePts' ? Number(value) || 0 : t.placePts;
            updated.totalPts = place + (kills * killPoints);
          }
          return updated;
        }
        return t;
      })
    );
  };

  const handleAddTeam = () => {
    const nextRank = teams.length + 1;
    const newTeam: PointCalcTeam = {
      id: `team_${Date.now()}`,
      rank: nextRank,
      name: `Team #${nextRank}`,
      matches: 1,
      wwcd: 0,
      placePts: 0,
      kills: 0,
      totalPts: 0
    };
    setTeams(prev => [...prev, newTeam]);
  };

  const handleRemoveTeam = (id: string) => {
    setTeams(prev => prev.filter(t => t.id !== id).map((t, idx) => ({ ...t, rank: idx + 1 })));
  };

  const handleSaveData = () => {
    const sorted = calculateAndSort();
    const data: PointCalcData = {
      systemType,
      killPoints,
      matchNumber,
      mapName,
      teams: sorted
    };
    onSave(data);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheetContainer}
        >
          {/* Drag Pill */}
          <View style={styles.pillContainer}>
            <View style={styles.dragPill} />
          </View>

          {/* Header */}
          <View style={styles.headerRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.pointCalcIconBadge}>
                <Icon name="calculator" size={16} color="#FFF" />
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.title}>PointCalc Match Standings</Text>
                <Text style={styles.subTitle}>Esports Points Table & Results Maker</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Icon name="close" size={22} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* System Presets */}
            <View style={styles.sectionWrap}>
              <Text style={styles.sectionLabel}>Scoring System</Text>
              <View style={styles.systemPresetRow}>
                <TouchableOpacity
                  style={[styles.presetChip, systemType === '10_pts' && styles.presetChipActive]}
                  onPress={() => setSystemType('10_pts')}
                >
                  <Text style={[styles.presetChipText, systemType === '10_pts' && styles.presetChipTextActive]}>
                    Official 10-Pts (BGMI)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.presetChip, systemType === '15_pts' && styles.presetChipActive]}
                  onPress={() => setSystemType('15_pts')}
                >
                  <Text style={[styles.presetChipText, systemType === '15_pts' && styles.presetChipTextActive]}>
                    Classic 15-Pts
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Match info row */}
            <View style={styles.metaRow}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.metaLabel}>Match / Day</Text>
                <TextInput
                  style={styles.metaInput}
                  value={matchNumber}
                  onChangeText={setMatchNumber}
                  placeholder="e.g. Overall / Match 5"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.metaLabel}>Map Name</Text>
                <TextInput
                  style={styles.metaInput}
                  value={mapName}
                  onChangeText={setMapName}
                  placeholder="e.g. Erangel"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Teams Header */}
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.thText, { width: 32 }]}>#</Text>
              <Text style={[styles.thText, { flex: 1.5, textAlign: 'left', paddingLeft: 4 }]}>Team</Text>
              <Text style={[styles.thText, { width: 44 }]}>WWCD</Text>
              <Text style={[styles.thText, { width: 44 }]}>Place</Text>
              <Text style={[styles.thText, { width: 44 }]}>Kills</Text>
              <Text style={[styles.thText, { width: 48, color: '#B57EDC' }]}>Total</Text>
              <Text style={[styles.thText, { width: 28 }]}></Text>
            </View>

            {/* Team Rows */}
            {teams.map((team, idx) => (
              <View key={team.id} style={[styles.teamRow, idx % 2 === 1 && styles.teamRowAlt]}>
                <View style={[styles.rankBox, team.rank === 1 && styles.rankGold]}>
                  <Text style={[styles.rankText, team.rank === 1 && styles.rankTextGold]}>
                    #{team.rank}
                  </Text>
                </View>

                <TextInput
                  style={styles.teamNameInput}
                  value={team.name}
                  onChangeText={val => handleUpdateTeam(team.id, 'name', val)}
                  placeholder="Team Name"
                  placeholderTextColor="#9CA3AF"
                />

                <TextInput
                  style={styles.numInput}
                  value={String(team.wwcd)}
                  keyboardType="numeric"
                  onChangeText={val => handleUpdateTeam(team.id, 'wwcd', parseInt(val, 10) || 0)}
                />

                <TextInput
                  style={styles.numInput}
                  value={String(team.placePts)}
                  keyboardType="numeric"
                  onChangeText={val => handleUpdateTeam(team.id, 'placePts', parseInt(val, 10) || 0)}
                />

                <TextInput
                  style={styles.numInput}
                  value={String(team.kills)}
                  keyboardType="numeric"
                  onChangeText={val => handleUpdateTeam(team.id, 'kills', parseInt(val, 10) || 0)}
                />

                <View style={styles.totalBox}>
                  <Text style={styles.totalText}>{team.totalPts}</Text>
                </View>

                <TouchableOpacity
                  style={styles.removeRowBtn}
                  onPress={() => handleRemoveTeam(team.id)}
                >
                  <Icon name="trash-outline" size={14} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}

            {/* Add Team & Auto-Sort Actions */}
            <View style={styles.calcActionsRow}>
              <TouchableOpacity style={styles.addTeamBtn} onPress={handleAddTeam}>
                <Icon name="add" size={16} color="#475569" style={{ marginRight: 4 }} />
                <Text style={styles.addTeamBtnText}>Add Team</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.sortBtn} onPress={calculateAndSort}>
                <Icon name="swap-vertical" size={16} color="#FFF" style={{ marginRight: 4 }} />
                <Text style={styles.sortBtnText}>Auto-Calculate & Sort</Text>
              </TouchableOpacity>
            </View>

            <View style={{ height: 30 }} />
          </ScrollView>

          {/* Footer Save Button */}
          <View style={styles.footerContainer}>
            <TouchableOpacity style={styles.saveBtn} activeOpacity={0.88} onPress={handleSaveData}>
              <Icon name="checkmark-done" size={18} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.saveBtnText}>Apply Standings to Flyer</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  pillContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  dragPill: {
    width: 44,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#CBD5E1',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  pointCalcIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#B57EDC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  subTitle: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  sectionWrap: {
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
  },
  systemPresetRow: {
    flexDirection: 'row',
    gap: 8,
  },
  presetChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  presetChipActive: {
    backgroundColor: '#B57EDC',
    borderColor: '#B57EDC',
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  presetChipTextActive: {
    color: '#FFFFFF',
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 4,
  },
  metaInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '600',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 6,
  },
  thText: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginBottom: 4,
  },
  teamRowAlt: {
    backgroundColor: '#F8FAFC',
  },
  rankBox: {
    width: 28,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  rankGold: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  rankText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
  },
  rankTextGold: {
    color: '#B45309',
  },
  teamNameInput: {
    flex: 1.5,
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    paddingVertical: 4,
    paddingHorizontal: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    marginRight: 6,
  },
  numInput: {
    width: 38,
    height: 30,
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    marginRight: 4,
    padding: 0,
  },
  totalBox: {
    width: 44,
    height: 30,
    borderRadius: 6,
    backgroundColor: 'rgba(181, 126, 220, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  totalText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#7C3AED',
  },
  removeRowBtn: {
    padding: 4,
    marginLeft: 2,
  },
  calcActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
  },
  addTeamBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingVertical: 10,
    flex: 1,
  },
  addTeamBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 10,
    paddingVertical: 10,
    flex: 1.4,
  },
  sortBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  footerContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B57EDC',
    borderRadius: 14,
    paddingVertical: 14,
    shadowColor: '#B57EDC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});

export default PointCalcModal;
