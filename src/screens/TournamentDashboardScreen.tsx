import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../theme/colors';
import { AppContext } from '../context/AppContext';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2;

const DashboardCard = ({ title, icon, onPress }: any) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Icon name={icon} size={40} color={colors.primary} />
    <Text style={styles.cardTitle}>{title}</Text>
  </TouchableOpacity>
);

const TournamentDashboardScreen = ({ navigation }: any) => {
  const { addTournament, draftTournament, setDraftTournament } = useContext(AppContext);

  useEffect(() => {
    if (!draftTournament || !draftTournament.id) {
      setDraftTournament({
        ...(draftTournament || {}),
        id: `draft_${Date.now()}`
      });
    }
  }, [draftTournament, setDraftTournament]);

  const handlePostTournament = () => {
    const newTournament = {
      id: draftTournament?.id || Date.now().toString(),
      name: draftTournament?.name || 'My Custom Tournament',
      game: draftTournament?.game || 'BGMI',
      prize: draftTournament?.prize || 'TBD',
      teamsLimit: draftTournament?.teamsLimit || '32',
      time: draftTournament?.time || 'Starts Soon',
      status: 'REGISTRATIONS OPEN',
      totalSlots: draftTournament?.teamsLimit || '32',
      bannerImage: draftTournament?.bannerImage || null,
      organiserName: draftTournament?.organiserName || 'UPMI Esports',
      matchDate: draftTournament?.matchDate || '',
      selectedFlyers: draftTournament?.selectedFlyers || {}
    };
    addTournament(newTournament);
    setDraftTournament(null);
    Alert.alert('Success', 'Tournament posted to Home Page successfully!');
    // Go to MainTabs which contains Home
    navigation.navigate('MainTabs');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.textBlack} />
        </TouchableOpacity>
        <Text style={styles.title}>Tournament Dashboard</Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.welcomeText}>Manage your tournament</Text>

        <View style={styles.grid}>
          <DashboardCard
            title="Create/Edit Details"
            icon="create-outline"
            onPress={() => navigation.navigate('CreateTournament')}
          />
          <DashboardCard
            title="Points System"
            icon="stats-chart-outline"
            onPress={() => navigation.navigate('PointSystem')}
          />
          <DashboardCard
            title="Manage Slots"
            icon="people-outline"
            onPress={() => navigation.navigate('ManageTeams', { tournamentId: draftTournament?.id })}
          />
          <DashboardCard
            title="Flyers & Updates"
            icon="images-outline"
            onPress={() => navigation.navigate('TournamentFlyers')}
          />
        </View>

        {draftTournament?.selectedFlyers && Object.keys(draftTournament.selectedFlyers).length > 0 && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.textBlack, marginBottom: 12 }}>Selected Flyers</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {Object.entries(draftTournament.selectedFlyers).map(([category, flyerData]: any) => (
                <View key={category} style={{ marginRight: 15, alignItems: 'center' }}>
                  <Image source={{ uri: flyerData.uri }} style={{ width: 100, height: 100, borderRadius: 8, borderWidth: 1, borderColor: '#E0E0E0', resizeMode: 'cover' }} />
                  <Text style={{ marginTop: 8, fontSize: 12, color: '#4B5563', fontWeight: '600' }}>{category}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.bottomSection}>
          <TouchableOpacity style={styles.postButton} onPress={handlePostTournament}>
            <Icon name="rocket-outline" size={24} color={colors.white} style={{ marginRight: 10 }} />
            <Text style={styles.postButtonText}>Post Tournament</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    color: colors.textBlack,
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  welcomeText: {
    color: '#757575',
    fontSize: 16,
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#F5F5F5',
    width: cardWidth,
    height: cardWidth,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cardTitle: {
    color: colors.textBlack,
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 15,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  bottomSection: {
    marginTop: 'auto',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  postButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
  },
  postButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 18,
  }
});

export default TournamentDashboardScreen;

