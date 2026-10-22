import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Image, Alert, ActivityIndicator } from 'react-native';
import RNFS from 'react-native-fs';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../theme/colors';
import { AppContext } from '../context/AppContext';
import { API_ENDPOINTS } from '../api/config';
import WizardProgressIndicator from '../components/WizardProgressIndicator';

const TournamentConfirmationScreen = ({ route, navigation }: any) => {
  const { finalTournament } = route.params;
  const { setDraftTournament, addTournament, updateTournament, userProfile, currentUserId, addMultipleChats, fetchTournaments } = useContext(AppContext);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePost = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      const appendIfPresent = (key: string, value: any) => {
        if (value !== undefined && value !== null) {
          if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      };

      appendIfPresent('name', finalTournament.name);
      appendIfPresent('organiser_name', finalTournament.organiserName);
      appendIfPresent('sponsor_name', finalTournament.sponsorName);
      appendIfPresent('manage_by', finalTournament.manageBy);
      
      if (finalTournament.socialMedia && Array.isArray(finalTournament.socialMedia)) {
        appendIfPresent('social_media_1', finalTournament.socialMedia[0]);
        appendIfPresent('social_media_2', finalTournament.socialMedia[1]);
        appendIfPresent('social_media_3', finalTournament.socialMedia[2]);
        appendIfPresent('social_media_4', finalTournament.socialMedia[3]);
      }
      
      appendIfPresent('game', finalTournament.game);
      appendIfPresent('prize', finalTournament.prize);
      appendIfPresent('teams_limit', parseInt(finalTournament.teamsLimit, 10) || 0);
      appendIfPresent('total_slots', parseInt(finalTournament.totalSlots, 10) || 0);
      appendIfPresent('teams_per_group', parseInt(finalTournament.teamsPerGroup, 10) || 0);
      appendIfPresent('number_of_groups', parseInt(finalTournament.numberOfGroups, 10) || 0);
      appendIfPresent('registration_start_date', finalTournament.regStartDate);
      appendIfPresent('registration_end_date', finalTournament.regEndDate);
      appendIfPresent('roadmap', finalTournament.roadmap);
      appendIfPresent('rules', finalTournament.rules);
      appendIfPresent('time', finalTournament.time);
      appendIfPresent('match_date', finalTournament.matchDate);
      appendIfPresent('status', finalTournament.status);
      const uid = (userProfile?.id || currentUserId || '1').toString().replace('user_', '');
      formData.append('user_id', uid);
      
      appendIfPresent('selected_flyers', finalTournament.selectedFlyers);
      appendIfPresent('stages', finalTournament.stages);
      appendIfPresent('match_dates_obj', finalTournament.matchDatesObj);
      appendIfPresent('kills_point', finalTournament.killsPoint);
      appendIfPresent('positions', finalTournament.positions);

      if (finalTournament.bannerImage && !finalTournament.bannerImage.startsWith('http')) {
        formData.append('banner_image', {
          uri: finalTournament.bannerImage,
          name: `banner_${Date.now()}.jpg`,
          type: 'image/jpeg'
        } as any);
      }

      const isEdit = route.params?.isEdit || finalTournament.isEdit;
      const endpoint = isEdit ? API_ENDPOINTS.TOURNAMENT_UPDATE(finalTournament.id) : API_ENDPOINTS.TOURNAMENT_CREATE;
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        body: formData,
        headers: {
          'Accept': 'application/json',
        }
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.status !== false) {
        // Extract inner data block if present, else use data itself
        const responseData = data?.data || data;
        const tournamentId = responseData?.id || data?.id || Date.now().toString();

        if (isEdit) {
          updateTournament(finalTournament.id, finalTournament);
          Alert.alert('Success', 'Tournament updated successfully!');
        } else {
          addTournament({ ...finalTournament, id: tournamentId });
          
          // Auto-fetch/add generated inbox groups from backend
          if (responseData?.inbox_groups && Array.isArray(responseData.inbox_groups)) {
             const newChats = responseData.inbox_groups.map((grp: any) => ({
                id: grp.id || `grp_${Date.now()}_${Math.random()}`,
                name: grp.name || 'Tournament Group',
                lastMessage: 'Group created automatically',
                time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                unread: 0,
                isGroup: true
             }));
             addMultipleChats(newChats);
          }
          
          Alert.alert('Success', 'Tournament created successfully!');
        }
        setDraftTournament(null);
        if (fetchTournaments) {
          fetchTournaments();
        }
        navigation.navigate('MainTabs', { screen: 'Matches', params: { initialTab: 'Tournaments' } });
      } else {
        throw new Error(data?.message || 'API request failed');
      }
    } catch (error: any) {
      console.error('Error saving tournament:', error);
      Alert.alert('Error', error?.message || 'An error occurred while saving the tournament.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async (uri: string, category: string) => {
    try {
      const fileName = `Flyer_${category.replace(/\s+/g, '_')}_${Date.now()}.jpg`;
      const destPath = `${RNFS.PicturesDirectoryPath}/${fileName}`;
      await RNFS.copyFile(uri, destPath);
      if (RNFS.scanFile) {
        await RNFS.scanFile(destPath);
      }
      Alert.alert('Success', 'Flyer saved to Gallery!');
    } catch (err) {
      console.log('Download Error:', err);
      Alert.alert('Error', 'Failed to download flyer.');
    }
  };

  const renderDetailRow = (label: string, value: string) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <SafeAreaView style={{ backgroundColor: colors.primary }} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.title}>Confirm Tournament</Text>
        </View>
      </SafeAreaView>

      <WizardProgressIndicator currentStep={3} />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>Tournament Details</Text>
        
        <View style={styles.card}>
          {renderDetailRow('Tournament Name', finalTournament.name)}
          {renderDetailRow('Organiser', finalTournament.organiserName)}
          {renderDetailRow('Game', finalTournament.game || 'N/A')}
          {renderDetailRow('Prize Pool', finalTournament.prize || 'N/A')}
          {renderDetailRow('Total Slots', finalTournament.teamsLimit ? finalTournament.teamsLimit.toString() : 'N/A')}
          {renderDetailRow('Teams per Group', finalTournament.teamsPerGroup ? finalTournament.teamsPerGroup.toString() : 'N/A')}
          {renderDetailRow('Number of Groups', finalTournament.numberOfGroups ? finalTournament.numberOfGroups.toString() : 'N/A')}
          {renderDetailRow('Time', finalTournament.time || 'N/A')}
          {renderDetailRow('Match Date', finalTournament.matchDate || 'N/A')}
        </View>

        <Text style={styles.sectionTitle}>Selected Flyers</Text>
        {finalTournament.selectedFlyers && Object.keys(finalTournament.selectedFlyers).length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
             {Object.entries(finalTournament.selectedFlyers).map(([category, flyerData]: any) => (
                <View key={category} style={{ marginRight: 15, alignItems: 'center' }}>
                  <View style={{ width: 140, height: 140 }}>
                    <Image source={{ uri: flyerData.uri }} style={{ width: '100%', height: '100%', borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', resizeMode: 'cover' }} />
                    <TouchableOpacity 
                      onPress={() => handleDownload(flyerData.uri, category)}
                      style={{ position: 'absolute', bottom: 5, right: 5, backgroundColor: 'rgba(0,0,0,0.5)', padding: 6, borderRadius: 20 }}
                    >
                      <Icon name="download-outline" size={18} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                  <Text style={{ marginTop: 8, fontSize: 13, color: '#4B5563', fontWeight: '600' }}>{category}</Text>
                </View>
             ))}
          </ScrollView>
        ) : (
          <View style={styles.card}>
            {finalTournament.flyerImage ? (
               <Image 
                  source={typeof finalTournament.flyerImage === 'string' ? { uri: finalTournament.flyerImage } : finalTournament.flyerImage} 
                  style={styles.flyerPreview} 
                  resizeMode="cover"
               />
            ) : (
              <Text style={{ color: '#666' }}>No flyers selected.</Text>
            )}
          </View>
        )}

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.postButton} onPress={handlePost} disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <Text style={styles.postButtonText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15, 
    backgroundColor: colors.primary,
  },
  backButton: { 
    marginRight: 15 
  },
  title: { 
    color: colors.white, 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginTop: 10,
  },
  card: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    flex: 2,
    textAlign: 'right',
  },
  flyerPreview: {
    width: '100%',
    aspectRatio: 0.75,
    borderRadius: 8,
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  postButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  postButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default TournamentConfirmationScreen;

