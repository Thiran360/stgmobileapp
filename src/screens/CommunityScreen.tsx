import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const CommunityScreen = () => {
  const navigation = useNavigation<any>();
  const [orgModalVisible, setOrgModalVisible] = useState(false);

  const handleOrganisationClick = () => {
    setOrgModalVisible(true);
  };

  const navigateToCategory = (catName: string) => {
    navigation.navigate('CommunityListScreen', { category: catName });
  };

  const categories = [
    { name: 'Organizer', icon: 'business-outline', action: handleOrganisationClick },
    { name: 'Editor', icon: 'cut-outline', action: () => navigateToCategory('Editor') },
    { name: 'Production house', icon: 'film-outline', action: () => navigateToCategory('Production house') },
    { name: 'Commentators', icon: 'mic-outline', action: () => navigateToCategory('Commentators') },
    { name: 'Streamers', icon: 'radio-outline', action: () => navigateToCategory('Streamers') },
    { name: 'Managers', icon: 'people-outline', action: () => navigateToCategory('Managers') },
    { name: 'Coach', icon: 'school-outline', action: () => navigateToCategory('Coach') },
    { name: 'Analysts', icon: 'stats-chart-outline', action: () => navigateToCategory('Analysts') },
    { name: 'Esports', icon: 'game-controller-outline', action: () => navigateToCategory('Esports') },
    { name: 'Academy', icon: 'library-outline', action: () => navigateToCategory('Academy') },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.gridContainer}>
          {categories.map((cat, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.card} 
              onPress={cat.action}
            >
              <View style={styles.iconContainer}>
                <Icon name={cat.icon} size={32} color="#E51025" />
              </View>
              <Text style={styles.cardText}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Modern Bottom Sheet Modal */}
      <Modal visible={orgModalVisible} transparent={true} animationType="slide" onRequestClose={() => setOrgModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setOrgModalVisible(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Choose Organizer</Text>
            <Text style={styles.modalSubtitle}>What type of organizer are you looking for?</Text>
            
            <View style={styles.modalOptionsContainer}>
              <TouchableOpacity style={styles.modalOptionCard} onPress={() => { setOrgModalVisible(false); navigateToCategory('Scrims Organizer'); }}>
                <View style={styles.modalOptionIconBg}>
                  <Icon name="shield-checkmark" size={28} color="#E51025" />
                </View>
                <View style={styles.modalOptionTextContainer}>
                  <Text style={styles.modalOptionTitle}>Scrims Organizer</Text>
                  <Text style={styles.modalOptionDesc}>Find organizers hosting scrims and practice matches.</Text>
                </View>
                <Icon name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalOptionCard} onPress={() => { setOrgModalVisible(false); navigateToCategory('Tournament Organizer'); }}>
                <View style={styles.modalOptionIconBg}>
                  <Icon name="trophy" size={28} color="#E51025" />
                </View>
                <View style={styles.modalOptionTextContainer}>
                  <Text style={styles.modalOptionTitle}>Tournament Organizer</Text>
                  <Text style={styles.modalOptionDesc}>Find organizers hosting major tournaments.</Text>
                </View>
                <Icon name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 30,
  },
  card: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: '1.5%',
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 12,
    color: '#1F2937',
    textAlign: 'center',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingTop: 12,
    minHeight: 300,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  modalOptionsContainer: {
    gap: 16,
  },
  modalOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  modalOptionIconBg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modalOptionTextContainer: {
    flex: 1,
  },
  modalOptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  modalOptionDesc: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  }
});

export default CommunityScreen;





