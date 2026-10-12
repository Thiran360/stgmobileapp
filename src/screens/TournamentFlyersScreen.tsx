import React, { useState, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet,  TouchableOpacity, Image, Alert, FlatList, ScrollView, Modal, TextInput, KeyboardAvoidingView, Platform, StatusBar, PanResponder, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../theme/colors';
import { AppContext } from '../context/AppContext';
import { apiService } from '../api/index';
import { launchImageLibrary } from 'react-native-image-picker';
import ColorPicker from 'react-native-wheel-color-picker';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import WizardProgressIndicator from '../components/WizardProgressIndicator';


const SLOTLIST_FIELDS = [
  { name: 'organiserName', label: 'Organiser Name', default: '', y: '6%', x: 0, fontSize: 36, color: '#FFD700', fontWeight: 'bold' },
  { name: 'eventName', label: 'Event Name', default: '', y: '13%', x: 0, fontSize: 16, color: '#FFF', fontWeight: '900' }
];

const PROMO_FIELDS = [
  { name: 'organiserName', label: 'Organiser Name', default: '', y: '6%', x: 0, fontSize: 36, color: '#FFD700', fontWeight: 'bold' },
  { name: 'eventName', label: 'Event Name', default: '', y: '13%', x: 0, fontSize: 16, color: '#FFF', fontWeight: '900' },
  { name: 'prizePool', label: 'Prize Pool', default: 'Prize: ₹50,000', y: '30%', x: 0, fontSize: 24, color: '#FFD700', fontWeight: 'bold' },
  { name: 'date', label: 'Date', default: '25th Oct', y: '40%', x: 0, fontSize: 18, color: '#FFF' },
  { name: 'entryFee', label: 'Entry Fee', default: 'Entry: FREE', y: '50%', x: 0, fontSize: 18, color: '#FFF' }
];
const DEFAULT_SLOT_CONFIG = {
  top: '46%',
  bottom: '6%',
  left: '8.5%',
  right: '8.5%',
  paddingLeft: '18%',
  columns: 2
};
const SLOT_CONFIG_1 = { top: '31.5%', bottom: '8%', left: '13%', right: '13%', paddingLeft: '22%', columns: 2 };
const SLOT_CONFIG_2 = { top: '23%', bottom: '24.5%', left: '18%', right: '18%', paddingLeft: '18%', columns: 2 };
const SLOT_CONFIG_3 = { top: '26%', bottom: '8%', left: '17%', right: '17%', paddingLeft: '19%', columns: 2 };

export const FREE_TEMPLATES: any[] = [];

export const PRO_TEMPLATES: any[] = [];

export const CATEGORIES = [
  'Coming Soon',
  'All You Need to Know',
  'Prize Pool',
  'Prize Distribution',
  'Event Calender',
  'Event Road Map',
  'Map Schedule',
  'Live Casting',
  'Caster Reveal',
  'Team Preview'
];

const sectionToCategory = (section: string) => {
  const map: { [key: string]: string } = {
    'coming_soon': 'Coming Soon',
    'all_you_need_to_know': 'All You Need to Know',
    'prize_pool': 'Prize Pool',
    'prize_distribution': 'Prize Distribution',
    'event_calender': 'Event Calender',
    'event_road_map': 'Event Road Map',
    'map_schedule': 'Map Schedule',
    'live_casting': 'Live Casting',
    'caster_reveal': 'Caster Reveal',
    'team_preview': 'Team Preview'
  };
  return map[section] || section;
};

const TournamentFlyersScreen = ({ route, navigation }: any) => {
  const [activeCategory, setActiveCategory] = useState(route.params?.activeCategory || 'Coming Soon');
  const [activeTab, setActiveTab] = useState<'free' | 'pro'>('free');
  const [fetchedFreeTemplates, setFetchedFreeTemplates] = useState<any[]>([]);
  const [loadingFlyers, setLoadingFlyers] = useState(false);
  const categoryListRef = React.useRef<FlatList>(null);

  React.useEffect(() => {
    const index = CATEGORIES.indexOf(activeCategory);
    if (index !== -1 && categoryListRef.current) {
      try {
        categoryListRef.current.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
      } catch (e) {}
    }
  }, [activeCategory]);

  React.useEffect(() => {
    if (route.params?.activeCategory) {
      setActiveCategory(route.params.activeCategory);
    }
  }, [route.params?.activeCategory]);
  
  React.useEffect(() => {
      const fetchFlyers = async () => {
      setLoadingFlyers(true);
      try {
        const staticTemplates = [
          { id: 'cs_1', category: 'Coming Soon', image: require('../assets/images/flyers/1.png'), fields: [...genericFields, { name: 'tagline', label: 'Tagline', default: 'COMING SOON', y: '40%', x: 0, fontSize: 36, color: '#FF0000', fontWeight: 'bold' }] },
          { id: 'cs_2', category: 'Coming Soon', image: require('../assets/images/flyers/2.png'), fields: [...genericFields, { name: 'tagline', label: 'Tagline', default: 'GET READY', y: '50%', x: 0, fontSize: 40, color: '#00FFFF', fontWeight: 'bold' }] },
          { id: 'cs_3', category: 'Coming Soon', image: require('../assets/images/flyers/3.png'), fields: [...genericFields, { name: 'tagline', label: 'Tagline', default: 'STAY TUNED', y: '45%', x: 0, fontSize: 38, color: '#FFA500', fontWeight: 'bold' }] },
          // (Other templates omitted for brevity, keeping dummy as fallback)
        ];
        
        const apiData = await apiService.getFlyers();
        if (apiData && Array.isArray(apiData) && apiData.length > 0) {
           setFetchedFreeTemplates(apiData);
        } else {
           setFetchedFreeTemplates(staticTemplates);
        }
      } catch (error) {
        console.error('Error loading flyers API:', error);
      } finally {
        setLoadingFlyers(false);
      }
    };
    fetchFlyers();
  }, []);
  
  const { draftTournament, setDraftTournament } = useContext(AppContext);

  const handleSelectTemplate = (id: string, type: 'free' | 'pro') => {
    if (type === 'pro') {
      Alert.alert(
        'Pro Template',
        'This template requires a PRO subscription. Would you like to upgrade?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: () => console.log('Upgrade pressed') },
        ]
      );
      return;
    }

    const template = (type === 'free' ? fetchedFreeTemplates : PRO_TEMPLATES).find(t => t.id === id);
    if (template) {
      const existingData = draftTournament?.selectedFlyers?.[template.category] || {};
      const updatedSelectedFlyers = {
        ...(draftTournament?.selectedFlyers || {}),
        [template.category]: {
          ...existingData,
          templateId: template.id,
          uri: existingData.templateId === template.id ? existingData.uri : null,
        }
      };
      
      if (setDraftTournament) {
        setDraftTournament({ ...draftTournament, selectedFlyers: updatedSelectedFlyers });
      }

      navigation.navigate('TournamentFlyerEdit', {
        selectedTemplate: template,
        initialData: draftTournament?.selectedFlyers?.[template.category]?.data || {},
        activeCategory: template.category,
        flyerType: type
      });
    }
  };



  const renderTemplateItem = ({ item }: { item: any }) => {
    const isSelected = draftTournament?.selectedFlyers?.[item.category]?.templateId === item.id;
    const editedUri = isSelected ? draftTournament?.selectedFlyers?.[item.category]?.uri : null;
    const imageSource = (editedUri && typeof editedUri === 'string') ? { uri: editedUri } : (typeof item.image === 'string' ? { uri: item.image } : item.image);
    
    const showPreview = !editedUri;
    const globalData = draftTournament?.globalFlyerData || {};
    const specificData = draftTournament?.selectedFlyers?.[item.category]?.specificData || {};
    
    const defaultData: any = {};
    if (item.fields) {
      item.fields.forEach((f: any) => {
        defaultData[f.name] = f.default || '';
      });
    }
    
    const previewData = { ...defaultData, ...(draftTournament?.selectedFlyers?.[item.category]?.data || {}), ...(globalData.data || {}), ...(specificData.data || {}) };
    const fieldStyles = specificData.fieldStyles || globalData.fieldStyles || {};
    const gameLogo = specificData.gameLogo !== undefined ? specificData.gameLogo : globalData.gameLogo;
    const eventLogo = specificData.eventLogo !== undefined ? specificData.eventLogo : globalData.eventLogo;

    return (
      <TouchableOpacity 
        style={[styles.templateCard, isSelected && { borderWidth: 2, borderColor: '#10B981' }, { overflow: 'hidden' }]} 
        activeOpacity={0.8}
        onPress={() => handleSelectTemplate(item.id, activeTab)}
      >
        <Image source={imageSource} style={styles.templateImage} />
        
        {showPreview && eventLogo && (
          <View style={{ position: 'absolute', top: '5%', left: '75%', width: 20, height: 20, borderRadius: 10, overflow: 'hidden' }}>
            <Image source={{ uri: eventLogo }} style={{ width: '100%', height: '100%' }} />
          </View>
        )}

        {showPreview && gameLogo && (
          <View style={{ position: 'absolute', top: '5%', left: '5%', width: 25, height: 25, overflow: 'hidden' }}>
            <Image source={{ uri: gameLogo }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
          </View>
        )}

        
        {showPreview && (() => {
          const socials = specificData.socials || globalData.socials || {};
          const sColor = specificData.socialColor || globalData.socialColor || '#FFFFFF';
          const sSize = (specificData.socialSize || globalData.socialSize || 12) * 0.45;
          return (
            <View style={{ position: 'absolute', top: '85%', left: '30%', flexDirection: 'row', width: '100%' }}>
              {socials.instagram ? <Text style={{ color: sColor, fontSize: sSize, marginRight: 15 }}>IG: {socials.instagram}</Text> : null}
              {socials.youtube ? <Text style={{ color: sColor, fontSize: sSize, marginRight: 15 }}>YT: {socials.youtube}</Text> : null}
            </View>
          );
        })()}

        {showPreview && item.fields && item.fields.map((field: any) => {
          const textValue = previewData[field.name];
          if (!textValue) return null;
          
          let topVal = field.y || '10%';
          let leftVal = field.x || '25%';
          
          const customStyle = fieldStyles[field.name] || {};
          const fontSize = (customStyle.fontSize || field.fontSize || 20) * 0.45; 
          const color = customStyle.color || field.color || '#FFF';
          
          return (
            <View key={field.name} style={{ position: 'absolute', top: topVal, left: leftVal, width: '100%' }}>
              <Text style={{ color: color, fontSize: fontSize, fontWeight: field.fontWeight || 'bold', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3 }}>
                {textValue}
              </Text>
            </View>
          );
        })}
        
        
        
        {isSelected && (
          <View style={{ position: 'absolute', top: 8, right: 8, backgroundColor: '#10B981', padding: 4, borderRadius: 12 }}>
            <Icon name="checkmark" size={16} color="#FFF" />
          </View>
        )}
        
        {activeTab === 'pro' && (
          <View style={styles.proBadge}>
            <Icon name="lock-closed" size={12} color="#FFF" style={{ marginRight: 4 }} />
            <Text style={styles.proBadgeText}>PRO</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <SafeAreaView style={{ backgroundColor: colors.primary }} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.title}>Flyer Templates</Text>
        </View>
      </SafeAreaView>
      
      <WizardProgressIndicator currentStep={2} />

      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'free' && styles.activeTab]}
          onPress={() => setActiveTab('free')}
        >
          <Text style={[styles.tabText, activeTab === 'free' && styles.activeTabText]}>Free Flyers</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'pro' && styles.activeTab]}
          onPress={() => setActiveTab('pro')}
        >
          <Text style={[styles.tabText, activeTab === 'pro' && styles.activeTabText]}>Pro Flyers</Text>
        </TouchableOpacity>
      </View>

      <View>
        <FlatList
          ref={categoryListRef}
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollContainer}
          data={CATEGORIES}
          keyExtractor={(item) => item}
          onScrollToIndexFailed={(info) => {
            const wait = new Promise(resolve => setTimeout(() => resolve(true), 100));
            wait.then(() => {
              categoryListRef.current?.scrollToIndex({ index: info.index, animated: true, viewPosition: 0.5 });
            });
          }}
          renderItem={({ item: category }) => (
            <TouchableOpacity 
              style={[
                styles.categoryChip, 
                activeCategory === category && styles.activeCategoryChip
              ]}
              onPress={() => setActiveCategory(category)}
            >
              <Text style={[
                styles.categoryChipText,
                activeCategory === category && styles.activeCategoryChipText
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={(activeTab === 'free' ? fetchedFreeTemplates : PRO_TEMPLATES).filter(item => item.category === activeCategory)}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={[styles.listContainer, { paddingBottom: 80 }]}
        ListEmptyComponent={
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: '#999', fontSize: 16 }}>No templates in this category yet.</Text>
          </View>
        }
        renderItem={renderTemplateItem}
        showsVerticalScrollIndicator={false}
      />
      
      <View style={{ padding: 15, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E2E8F0', flexDirection: 'row', justifyContent: 'center' }}>
        <TouchableOpacity 
          style={{ width: '100%', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, backgroundColor: draftTournament?.selectedFlyers?.[activeCategory] ? colors.primary : '#F3F4F6', borderRadius: 8 }}
          onPress={() => {
            const currentIndex = CATEGORIES.indexOf(activeCategory);
            if (currentIndex !== -1 && currentIndex < CATEGORIES.length - 1) {
              setActiveCategory(CATEGORIES[currentIndex + 1]);
            } else {
              navigation.navigate('TournamentConfirmation', { finalTournament: draftTournament });
            }
          }}
        >
          <Text style={{ color: draftTournament?.selectedFlyers?.[activeCategory] ? '#FFF' : '#4B5563', fontWeight: 'bold', fontSize: 15 }}>
            {draftTournament?.selectedFlyers?.[activeCategory] ? 'Continue to Next Category' : 'Skip this Category'}
          </Text>
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
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  categoryScrollContainer: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeCategoryChip: {
    backgroundColor: '#E8F5E9',
    borderColor: colors.primary,
  },
  categoryChipText: {
    color: '#757575',
    fontWeight: '600',
    fontSize: 14,
  },
  activeCategoryChipText: {
    color: colors.primary,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    backgroundColor: '#FFFFFF',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: '#757575',
    fontWeight: '600',
  },
  activeTabText: {
    color: colors.primary,
  },
  listContainer: {
    padding: 15,
    backgroundColor: '#FFFFFF',
    flexGrow: 1,
  },
  templateCard: {
    flex: 1,
    margin: 5,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    aspectRatio: 0.75, 
  },
  templateImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  proBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  proBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  darkModalTitle: {
    color: '#333333',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 15,
  },
  previewContainer: {
    width: '100%',
    aspectRatio: 0.75,
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative'
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlayTextContainer: {
    position: 'absolute',
    top: '15%',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  overlayOrganiser: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 10,
    textAlign: 'center',
    marginBottom: 5,
  },
  overlayEvent: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 10,
    textAlign: 'center',
  },
  overlaySub: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 10,
    textAlign: 'center',
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  darkModalContainer: {
    backgroundColor: '#FFFFFF', 
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '80%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  darkLabel: {
    color: '#333333',
    fontSize: 14,
    width: 100,
    fontWeight: '600'
  },
  logoPicker: {
    width: 60,
    height: 60,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 15,
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeButton: {
    borderWidth: 1,
    borderColor: '#D32F2F',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    backgroundColor: '#FFFFFF',
  },
  removeButtonText: {
    color: '#D32F2F',
    fontSize: 12,
    fontWeight: '600'
  },
  darkInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 45,
    backgroundColor: '#333333',
  },
  darkInput: {
    flex: 1,
    fontSize: 14,
  },
  socialsCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  socialsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  addNewButton: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addNewButtonText: {
    color: '#D32F2F',
    fontSize: 12,
    fontWeight: '600'
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FFF'
  },
  socialPlatformSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D32F2F',
    paddingHorizontal: 12,
    height: 45,
  },
  socialInput: {
    flex: 1,
    color: '#333333',
    paddingHorizontal: 12,
    height: 45,
  },
  updateButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default TournamentFlyersScreen;
