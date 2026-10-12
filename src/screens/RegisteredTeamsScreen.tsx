import React, { useContext, useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, StatusBar, ImageBackground, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import { colors } from '../theme/colors';
import { AppContext } from '../context/AppContext';
import { apiService } from '../api/index';
import { FREE_TEMPLATES, PRO_TEMPLATES, CATEGORIES } from './TournamentFlyersScreen';

const RegisteredTeamsScreen = ({ route, navigation }: any) => {
  const { tournamentId, tournamentName } = route?.params || {};
  const { teamRegistrations, globalTournaments } = useContext(AppContext);
  const [apiTeams, setApiTeams] = useState<any[]>([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teams = await apiService.getRegisteredTeams(tournamentId);
        if (teams && Array.isArray(teams)) {
          setApiTeams(teams);
        }
      } catch(e) {
        console.log('Failed to fetch teams', e);
      }
    };
    fetchTeams();
  }, [tournamentId]);
  const [expandedGroup, setExpandedGroup] = useState<number>(0);
  const viewShotRefs = useRef<any[]>([]);
  
  const handleShareGroupFlyer = async (index: number) => {
    try {
      if (viewShotRefs.current[index]) {
        const uri = await viewShotRefs.current[index].capture();
        await Share.open({
          url: uri,
          title: `Share Group ${index + 1} Flyer`
        });
      }
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };
  
  const tournament = globalTournaments.find(t => t.id === tournamentId);
  const slotlistFlyerData = tournament?.selectedFlyers?.['Slotlist'];
  const flyerImage = slotlistFlyerData?.uri || tournament?.flyerImage;
  const templateIdToUse = slotlistFlyerData?.templateId || tournament?.templateId;

  // Find slotConfig
  const template = [...FREE_TEMPLATES, ...PRO_TEMPLATES].find(t => t.id === templateIdToUse);
  const slotConfig = template?.slotConfig || {
    top: '47%',
    bottom: '9%',
    left: '11%',
    right: '11%',
    paddingLeft: '16%',
    columns: 2
  };
  const textColor = template?.defaultTextColor || '#FFFFFF';

  // Filter registrations by tournamentId
  const registeredTeams = tournamentId ? teamRegistrations.filter(reg => reg.tournamentId === tournamentId) : [];

  const teamsPerGroup = parseInt(tournament?.teamsPerGroup || '25', 10);
  const configuredNumberOfGroups = tournament?.numberOfGroups ? parseInt(tournament.numberOfGroups, 10) : 0;
  
  let calculatedTotalSlots = parseInt(tournament?.teamsLimit || tournament?.totalSlots || '0', 10) || 0;
  if (configuredNumberOfGroups > 0) {
     calculatedTotalSlots = Math.max(calculatedTotalSlots, configuredNumberOfGroups * teamsPerGroup);
  }

  // Generate Slots
  const totalSlotsCount = Math.max(calculatedTotalSlots, registeredTeams.length);
  const displaySlots = [];

  for (let i = 1; i <= totalSlotsCount; i++) {
    const slotStr = i.toString();
    const team = registeredTeams[i - 1]; // Sequential assignment based on registration order
    
    if (team) {
      displaySlots.push({ slot: slotStr, team: team });
    } else {
      displaySlots.push({ slot: slotStr, team: null });
    }
  }

  // Pad to ensure we always render full groups, especially for flyer flex layout
  while (displaySlots.length % teamsPerGroup !== 0 || displaySlots.length === 0) {
    const nextSlot = (displaySlots.length + 1).toString();
    displaySlots.push({ slot: nextSlot, team: null });
  }

  const chunkedSlots = [];
  for (let i = 0; i < displaySlots.length; i += teamsPerGroup) {
    chunkedSlots.push(displaySlots.slice(i, i + teamsPerGroup));
  }
  if (chunkedSlots.length === 0) chunkedSlots.push([]);

  return (
    <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Registered Teams</Text>
        </View>
      </SafeAreaView>

      {tournament?.selectedFlyers && Object.keys(tournament.selectedFlyers).length > 0 && (
         <View style={{ backgroundColor: '#FFF', paddingVertical: 15, paddingHorizontal: 20, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
           <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 10 }}>Tournament Posters</Text>
           <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {CATEGORIES.map((category) => {
                 const flyerData = tournament.selectedFlyers?.[category];
                 if (!flyerData) return null;
                 return (
                   <View key={category} style={{ marginRight: 15, alignItems: 'center' }}>
                     <Image source={{ uri: flyerData.uri }} style={{ width: 120, height: 120, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', resizeMode: 'cover' }} />
                     <Text style={{ marginTop: 8, fontSize: 12, color: '#4B5563', fontWeight: '600' }}>{category}</Text>
                   </View>
                 );
              })}
           </ScrollView>
         </View>
      )}

      {flyerImage ? (
        <ScrollView style={styles.flyerScrollView} contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          {chunkedSlots.map((groupSlots, groupIndex) => {
            const isExpanded = expandedGroup === groupIndex;
            return (
              <View key={`group-${groupIndex}`} style={styles.groupContainer}>
                {chunkedSlots.length > 1 && (
                  <TouchableOpacity 
                    style={[styles.collapsibleHeader, isExpanded && styles.collapsibleHeaderActive]} 
                    onPress={() => setExpandedGroup(isExpanded ? -1 : groupIndex)}
                    activeOpacity={0.9}
                  >
                    <View style={styles.groupTitleRow}>
                      <View style={[styles.groupBadge, isExpanded && styles.groupBadgeActive]}>
                        <Icon name="layers" size={14} color={isExpanded ? colors.primary : '#FFF'} />
                      </View>
                      <Text style={[styles.collapsibleTitle, isExpanded && styles.collapsibleTitleActive]}>
                        Group {groupIndex + 1}
                      </Text>
                    </View>
                    <View style={[styles.collapsibleIconWrapper, isExpanded && styles.collapsibleIconWrapperActive]}>
                      <Icon name={isExpanded ? "chevron-up" : "chevron-down"} size={18} color={isExpanded ? '#FFF' : '#6B7280'} />
                    </View>
                  </TouchableOpacity>
                )}
                
                {(isExpanded || chunkedSlots.length === 1) && (
                  <View>
                    <ViewShot 
                      ref={(el) => { viewShotRefs.current[groupIndex] = el; }} 
                      options={{ format: 'jpg', quality: 1.0 }}
                    >
                      <View collapsable={false} style={{ width: '100%', aspectRatio: 0.75 }}>
                        <ImageBackground 
                          source={typeof flyerImage === 'string' ? { uri: flyerImage } : flyerImage} 
                          style={styles.flyerImageBackground}
                          resizeMode="contain"
                        >
                        <View style={[
                          styles.flyerSlotsContainer,
                          {
                            top: slotConfig.top,
                            bottom: slotConfig.bottom,
                            left: slotConfig.left,
                            right: slotConfig.right
                          }
                        ]}>
                          {groupSlots.length > 0 ? (
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                {Array.from({ length: slotConfig.columns }).map((_, colIndex) => {
                                  const itemsPerCol = Math.ceil(groupSlots.length / slotConfig.columns);
                                  const columnSlots = groupSlots.slice(colIndex * itemsPerCol, (colIndex + 1) * itemsPerCol);
                                  
                                  // Pad the column to ensure equal flex distribution
                                  while (columnSlots.length < itemsPerCol) {
                                    columnSlots.push({ slot: `dummy-${colIndex}-${columnSlots.length}`, team: null });
                                  }
                                  
                                  return (
                                    <View key={`col-${colIndex}`} style={[styles.flyerColumn, { width: slotConfig.columns > 1 ? `${100 / slotConfig.columns - 4}%` : '100%' }]}>
                                    {columnSlots.map((item, index) => (
                                      <View key={`slot-${item.slot}`} style={[styles.flyerTeamRow, { paddingLeft: slotConfig.paddingLeft }, !item.team && { opacity: 0.85 }]}>
                                        {item.team?.teamBanner && (
                                          <Image source={{ uri: item.team?.teamBanner }} style={styles.flyerTeamLogo} />
                                        )}
                                        
                                        <Text style={[
                                          styles.flyerTeamName, 
                                          { 
                                            color: textColor,
                                            textShadowColor: 'rgba(0, 0, 0, 0.75)',
                                            textShadowOffset: { width: 0, height: 1 },
                                            textShadowRadius: 2,
                                            fontSize: 11
                                          }, 
                                          !item.team && { color: '#9CA3AF', fontStyle: 'italic', textShadowColor: 'transparent' }
                                        ]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.5}>
                                          {item.team ? item.team.teamName : ''}
                                        </Text>
                                      </View>
                                    ))}
                                  </View>
                                );
                              })}
                            </View>
                          ) : (
                             <View style={styles.emptyFlyerState}>
                               <Text style={styles.emptyFlyerText}>No teams registered yet.</Text>
                             </View>
                          )}
                        </View>
                      </ImageBackground>
                      </View>
                    </ViewShot>
                    <View style={{ padding: 15, borderTopWidth: 1, borderTopColor: '#F3F4F6', flexDirection: 'row', justifyContent: 'space-between' }}>
                      <TouchableOpacity 
                        style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, paddingVertical: 12, borderRadius: 8, marginRight: 5 }}
                        onPress={() => handleShareGroupFlyer(groupIndex)}
                      >
                        <Icon name="share-social" size={20} color="#FFF" style={{ marginRight: 8 }} />
                        <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 13 }}>Share</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#10B981', paddingVertical: 12, borderRadius: 8, marginLeft: 5 }}
                        onPress={async () => {
                          try {
                            if (viewShotRefs.current[groupIndex]) {
                              const uri = await viewShotRefs.current[groupIndex].capture();
                              const RNFS = require('react-native-fs');
                              const { PermissionsAndroid, Platform } = require('react-native');
                              
                              if (Platform.OS === 'android') {
                                try {
                                  const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
                                  if (granted !== PermissionsAndroid.RESULTS.GRANTED && Platform.Version < 33) {
                                    Alert.alert('Permission Denied', 'Storage permission is required to save posters.');
                                    return;
                                  }
                                } catch (err) {}
                              }
                              
                              const filename = `UPMI_Group_${groupIndex + 1}_${Date.now()}.jpg`;
                              const destPath = Platform.OS === 'android' 
                                ? `${RNFS.PicturesDirectoryPath}/${filename}`
                                : `${RNFS.DocumentDirectoryPath}/${filename}`;
                                
                              await RNFS.copyFile(uri, destPath);
                              
                              if (Platform.OS === 'android') {
                                await RNFS.scanFile(destPath);
                                Alert.alert('Success', 'Poster saved to your phone Gallery (Pictures folder)!');
                              } else {
                                Alert.alert('Success', 'Poster saved to your device Documents!');
                              }
                            }
                          } catch (e) {
                            Alert.alert('Error', 'Could not save poster. Try sharing it instead.');
                          }
                        }}
                      >
                        <Icon name="download-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
                        <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 13 }}>Download</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }} showsVerticalScrollIndicator={false}>
          {tournamentName && (
            <View style={styles.tournamentInfoCard}>
               <Icon name="trophy-outline" size={20} color={colors.primary} style={{ marginRight: 10 }} />
               <Text style={styles.tournamentNameText}>{tournamentName}</Text>
            </View>
          )}

          {chunkedSlots.length > 0 && chunkedSlots[0].length > 0 ? (
            chunkedSlots.map((groupSlots, groupIndex) => {
              const isExpanded = expandedGroup === groupIndex;
              const groupTeams = groupSlots.filter(item => item.team).map(item => item.team);
              return (
                <View key={`group-${groupIndex}`} style={styles.groupContainer}>
                  {chunkedSlots.length > 1 && (
                    <TouchableOpacity 
                      style={[styles.collapsibleHeader, isExpanded && styles.collapsibleHeaderActive]} 
                      onPress={() => setExpandedGroup(isExpanded ? -1 : groupIndex)}
                      activeOpacity={0.9}
                    >
                      <View style={styles.groupTitleRow}>
                        <View style={[styles.groupBadge, isExpanded && styles.groupBadgeActive]}>
                          <Icon name="layers" size={14} color={isExpanded ? colors.primary : '#FFF'} />
                        </View>
                        <Text style={[styles.collapsibleTitle, isExpanded && styles.collapsibleTitleActive]}>
                          Group {groupIndex + 1}
                        </Text>
                      </View>
                      <View style={[styles.collapsibleIconWrapper, isExpanded && styles.collapsibleIconWrapperActive]}>
                        <Icon name={isExpanded ? "chevron-up" : "chevron-down"} size={18} color={isExpanded ? '#FFF' : '#6B7280'} />
                      </View>
                    </TouchableOpacity>
                  )}
                  
                  {(isExpanded || chunkedSlots.length === 1) && (
                    <View style={{ padding: 15 }}>
                      {groupTeams.length > 0 ? (
                        groupTeams.map(team => (
                          <View key={team?.id} style={[styles.teamCard, { marginHorizontal: 0, marginBottom: 15 }]}>
                            <View style={styles.teamHeader}>
                              {team?.teamBanner ? (
                                <Image source={{ uri: team.teamBanner }} style={styles.teamBanner} />
                              ) : (
                                <View style={styles.teamBannerPlaceholder}>
                                  <Icon name="image-outline" size={24} color="#9CA3AF" />
                                </View>
                              )}
                              <View style={styles.teamInfo}>
                                <Text style={styles.teamName}>{team?.teamName}</Text>
                                <View style={styles.slotBadge}>
                                  <Icon name="keypad-outline" size={12} color={colors.primary} style={{ marginRight: 4 }} />
                                  <Text style={styles.slotText}>Slot {team?.slot || 'N/A'}</Text>
                                </View>
                              </View>
                            </View>
                            
                            <View style={styles.playersList}>
                              <Text style={styles.playersTitle}>Roster Details</Text>
                              {team?.players.map(player => (
                                <View key={player.id} style={styles.playerRow}>
                                  <View style={styles.playerIconContainer}>
                                    <Icon name="person" size={14} color="#6B7280" />
                                  </View>
                                  <Text style={styles.playerName}>{player.name}</Text>
                                  <View style={styles.roleBadge}>
                                    <Text style={styles.playerRole}>{player.role}</Text>
                                  </View>
                                </View>
                              ))}
                            </View>
                          </View>
                        ))
                      ) : (
                        <Text style={{ textAlign: 'center', color: '#9CA3AF', marginVertical: 10 }}>No teams assigned to this group yet.</Text>
                      )}
                    </View>
                  )}
                </View>
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconCircle}>
                <Icon name="people-outline" size={40} color={colors.primary} />
              </View>
              <Text style={styles.emptyTextTitle}>No Teams Yet</Text>
              <Text style={styles.emptyTextSub}>Teams registered for this tournament will appear here.</Text>
            </View>
          )}
        </ScrollView>
      )}
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
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  container: {
    flex: 1,
    padding: 15,
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
  teamCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  teamBanner: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 15,
  },
  teamBannerPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    color: '#1F2937',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  slotBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  slotText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  playersList: {},
  playersTitle: {
    color: '#4B5563',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  playerIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  playerName: {
    color: '#1F2937',
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  roleBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  playerRole: {
    color: '#D97706',
    fontSize: 11,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTextTitle: {
    color: '#1F2937',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyTextSub: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
  },
  flyerScrollView: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  flyerImageBackground: {
    width: '100%',
    aspectRatio: 0.75, // Matches the 3:4 ratio of the generated flyer templates
  },
  flyerSlotsContainer: {
    position: 'absolute',
    top: '44.8%', 
    bottom: '10.8%', 
    left: '8.5%',
    right: '8.5%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flyerColumn: {
    width: '48%',
    height: '100%',
  },
  flyerTeamRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  flyerTeamNumberBadge: {
    display: 'none',
  },
  flyerTeamNumber: {
    display: 'none',
  },
  flyerTeamLogo: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 6,
  },
  flyerTeamLogoPlaceholder: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  flyerTeamName: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
    flex: 1,
  },
  emptyFlyerState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  emptyFlyerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    opacity: 0.8,
  },
  groupContainer: {
    marginBottom: 20,
    marginHorizontal: 15,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  collapsibleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  collapsibleHeaderActive: {
    backgroundColor: colors.primary,
    borderBottomColor: 'transparent',
  },
  groupTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  groupBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  collapsibleTitle: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  collapsibleTitleActive: {
    color: '#FFFFFF',
  },
  collapsibleIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  collapsibleIconWrapperActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  }
});

export default RegisteredTeamsScreen;

