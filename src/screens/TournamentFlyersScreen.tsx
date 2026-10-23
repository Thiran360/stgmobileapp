import React, { useState, useContext, useRef, useEffect, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../theme/colors';
import { AppContext } from '../context/AppContext';
import WizardProgressIndicator from '../components/WizardProgressIndicator';
import EventDetailsModal, { EventDetailsData } from '../components/EventDetailsModal';
import {
  ALL_FLYER_TEMPLATES,
  FLYER_CATEGORIES,
  FlyerTemplate
} from '../data/flyerTemplates';

const { width } = Dimensions.get('window');

const TournamentFlyersScreen = ({ route, navigation }: any) => {
  const [activeCategory, setActiveCategory] = useState(
    route.params?.activeCategory || 'Coming Soon'
  );
  const [activeTab, setActiveTab] = useState<'free' | 'pro'>('free');
  const [isEventDetailsVisible, setIsEventDetailsVisible] = useState(false);
  const categoryListRef = useRef<FlatList>(null);

  const { draftTournament, setDraftTournament } = useContext(AppContext);

  // Sync category scroll
  useEffect(() => {
    const index = FLYER_CATEGORIES.indexOf(activeCategory);
    if (index !== -1 && categoryListRef.current) {
      try {
        categoryListRef.current.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
      } catch (e) {}
    }
  }, [activeCategory]);

  useEffect(() => {
    if (route.params?.activeCategory) {
      setActiveCategory(route.params.activeCategory);
    }
  }, [route.params?.activeCategory]);

  // Current global flyer details
  const globalFlyerData = draftTournament?.globalFlyerData || {};
  const currentEventLogo = globalFlyerData.eventLogo !== undefined ? globalFlyerData.eventLogo : ((draftTournament as any)?.eventLogo || null);
  const currentEventName = globalFlyerData.eventName || draftTournament?.name || 'STG OP CHAMPIONSHIP';
  const currentOrgName = globalFlyerData.organiserName || (draftTournament as any)?.organiserName || (draftTournament as any)?.organiser_name || 'STG ESPORTS';
  const currentSubName = globalFlyerData.subName || 'GROUP 1';
  const currentSocials = globalFlyerData.socials || {
    instagram: 'stg_esports',
    youtube: 'STG Esports Live',
    discord: 'discord.gg/stg',
    website: ''
  };

  const handleUpdateEventDetails = (updated: EventDetailsData) => {
    const newGlobalData = {
      ...(draftTournament?.globalFlyerData || {}),
      eventLogo: updated.eventLogo,
      eventName: updated.eventName,
      organiserName: updated.organiserName,
      subName: updated.subName,
      socials: updated.socials,
    };

    const updatedTournament: any = {
      ...(draftTournament || {}),
      name: updated.eventName || draftTournament?.name,
      organiserName: updated.organiserName || (draftTournament as any)?.organiserName,
      organiser_name: updated.organiserName || (draftTournament as any)?.organiser_name,
      eventLogo: updated.eventLogo,
      globalFlyerData: newGlobalData
    };

    if (setDraftTournament) {
      setDraftTournament(updatedTournament);
    }
  };

  const handleSelectTemplate = (template: FlyerTemplate) => {
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
      initialData: {
        eventName: currentEventName,
        organiserName: currentOrgName,
        subName: currentSubName,
        eventLogo: currentEventLogo,
        socials: currentSocials,
        ...(draftTournament?.selectedFlyers?.[template.category]?.data || {})
      },
      activeCategory: template.category,
      flyerType: 'free'
    });
  };

  const currentCategoryTemplates = useMemo(() => {
    return ALL_FLYER_TEMPLATES.filter(t => t.category === activeCategory);
  }, [activeCategory]);

  const renderTemplateItem = ({ item }: { item: FlyerTemplate }) => {
    const isSelected = draftTournament?.selectedFlyers?.[item.category]?.templateId === item.id;
    const editedUri = isSelected ? draftTournament?.selectedFlyers?.[item.category]?.uri : null;
    const imageSource = (editedUri && typeof editedUri === 'string')
      ? { uri: editedUri }
      : (typeof item.image === 'string' ? { uri: item.image } : item.image);

    const showDynamicPreview = !editedUri;

    return (
      <TouchableOpacity
        style={[styles.templateCard, isSelected && styles.selectedTemplateCard]}
        activeOpacity={0.88}
        onPress={() => handleSelectTemplate(item)}
      >
        <Image source={imageSource} style={styles.templateImage} />

        {/* Dynamic Overlays: Auto-Fixed across all flyers */}
        {showDynamicPreview && (
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {/* Auto-Fixed Event Logo */}
            {currentEventLogo ? (
              <View
                style={[
                  styles.autoLogoBox,
                  {
                    top: item.logoPos.y as any,
                    left: item.logoPos.x as any,
                    width: item.logoPos.size,
                    height: item.logoPos.size,
                    borderRadius: item.logoPos.size / 2
                  }
                ]}
              >
                <Image source={{ uri: currentEventLogo }} style={styles.autoLogoImg} />
              </View>
            ) : null}

            {/* Template Fields */}
            {item.fields.map(field => {
              let textVal = '';
              if (field.name === 'organiserName') textVal = currentOrgName;
              else if (field.name === 'eventName') textVal = currentEventName;
              else if (field.name === 'subName') textVal = currentSubName;
              else textVal = field.default;

              if (!textVal) return null;

              return (
                <View
                  key={field.name}
                  style={{
                    position: 'absolute',
                    top: field.y as any,
                    left: (field.x || '10%') as any,
                    right: '10%'
                  }}
                >
                  <Text
                    numberOfLines={1}
                    style={{
                      color: field.color || '#FFF',
                      fontSize: (field.fontSize || 16) * 0.42,
                      fontWeight: (field.fontWeight as any) || 'bold',
                      textShadowColor: 'rgba(0,0,0,0.85)',
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 3
                    }}
                  >
                    {textVal}
                  </Text>
                </View>
              );
            })}

            {/* Auto-Fixed Socials Row */}
            <View
              style={[
                styles.autoSocialsRow,
                {
                  top: item.socialPos.y as any,
                  left: item.socialPos.x as any
                }
              ]}
            >
              {currentSocials.instagram ? (
                <View style={styles.socialItem}>
                  <Icon name="logo-instagram" size={10} color="#E1306C" />
                  <Text style={styles.socialItemText}>@{currentSocials.instagram}</Text>
                </View>
              ) : null}
              {currentSocials.youtube ? (
                <View style={styles.socialItem}>
                  <Icon name="logo-youtube" size={10} color="#FF0000" />
                  <Text style={styles.socialItemText}>{currentSocials.youtube}</Text>
                </View>
              ) : null}
              {currentSocials.discord ? (
                <View style={styles.socialItem}>
                  <Icon name="logo-discord" size={10} color="#5865F2" />
                  <Text style={styles.socialItemText}>{currentSocials.discord}</Text>
                </View>
              ) : null}
            </View>
          </View>
        )}

        {/* Selected Checkmark */}
        {isSelected && (
          <View style={styles.selectedBadge}>
            <Icon name="checkmark" size={16} color="#FFF" />
          </View>
        )}

        {/* Template Index Tag */}
        <View style={styles.templateTag}>
          <Text style={styles.templateTagText}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <SafeAreaView style={{ backgroundColor: colors.primary }} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Flyer Templates</Text>
          <TouchableOpacity
            style={styles.headerEditBtn}
            onPress={() => setIsEventDetailsVisible(true)}
          >
            <Icon name="options-outline" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <WizardProgressIndicator currentStep={2} />

      {/* Free / Pro Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'free' && styles.activeTab]}
          onPress={() => setActiveTab('free')}
        >
          <Text style={[styles.tabText, activeTab === 'free' && styles.activeTabText]}>
            Free Flyers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pro' && styles.activeTab]}
          onPress={() => setActiveTab('pro')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon
              name="sparkles"
              size={14}
              color={activeTab === 'pro' ? colors.primary : '#D97706'}
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.tabText, activeTab === 'pro' && styles.activeTabText]}>
              Pro Flyers
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* When activeTab is 'pro': Show Static Coming Soon Poster */}
      {activeTab === 'pro' ? (
        <View style={styles.proComingSoonContainer}>
          <View style={styles.proCard}>
            <View style={styles.proCardInner}>
              <View style={styles.proBadgeBig}>
                <Icon name="star" size={16} color="#F59E0B" />
                <Text style={styles.proBadgeBigText}>PRO FLYERS</Text>
              </View>

              <Text style={styles.proTitle}>COMING SOON</Text>
              <Text style={styles.proSubTitle}>
                Ultra-HD Esports & 3D Animated tournament posters are currently being crafted.
              </Text>

              <View style={styles.proFeaturesList}>
                <View style={styles.proFeatureRow}>
                  <Icon name="checkmark-circle" size={16} color="#10B981" />
                  <Text style={styles.proFeatureText}>100+ 3D Esports Tournament Layouts</Text>
                </View>
                <View style={styles.proFeatureRow}>
                  <Icon name="checkmark-circle" size={16} color="#10B981" />
                  <Text style={styles.proFeatureText}>Auto-Animated Winner Celebrations</Text>
                </View>
                <View style={styles.proFeatureRow}>
                  <Icon name="checkmark-circle" size={16} color="#10B981" />
                  <Text style={styles.proFeatureText}>Direct 4K Vector Export</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.proNotifyBtn}
                activeOpacity={0.85}
                onPress={() => setActiveTab('free')}
              >
                <Icon name="arrow-back" size={16} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={styles.proNotifyBtnText}>Back to Free Flyers</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        /* Free Flyers View */
        <>
          {/* Quick Event Details Auto-Sync Bar */}
          <View style={styles.eventDetailsBar}>
            <View style={styles.eventBarLeft}>
              {currentEventLogo ? (
                <Image source={{ uri: currentEventLogo }} style={styles.barLogo} />
              ) : (
                <View style={styles.barLogoPlaceholder}>
                  <Icon name="image-outline" size={16} color="#9CA3AF" />
                </View>
              )}
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.barEventName} numberOfLines={1}>
                  {currentEventName}
                </Text>
                <Text style={styles.barOrgName} numberOfLines={1}>
                  {currentOrgName} • {currentSubName}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.barEditBtn}
              activeOpacity={0.8}
              onPress={() => setIsEventDetailsVisible(true)}
            >
              <Icon name="pencil" size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.barEditBtnText}>Edit Details</Text>
            </TouchableOpacity>
          </View>

          {/* Categories Horizontal Scroll */}
          <View style={styles.categoryWrap}>
            <FlatList
              ref={categoryListRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScrollContainer}
              data={FLYER_CATEGORIES}
              keyExtractor={item => item}
              onScrollToIndexFailed={info => {
                setTimeout(() => {
                  categoryListRef.current?.scrollToIndex({
                    index: info.index,
                    animated: true,
                    viewPosition: 0.5
                  });
                }, 100);
              }}
              renderItem={({ item: category }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryChip,
                    activeCategory === category && styles.activeCategoryChip
                  ]}
                  onPress={() => setActiveCategory(category)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      activeCategory === category && styles.activeCategoryChipText
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>

          {/* 10 Flyers Grid for Active Category */}
          <FlatList
            data={currentCategoryTemplates}
            keyExtractor={item => item.id}
            numColumns={2}
            contentContainerStyle={styles.listContainer}
            renderItem={renderTemplateItem}
            showsVerticalScrollIndicator={false}
          />

          {/* Bottom Next / Skip Navigation */}
          <View style={styles.bottomNavContainer}>
            <TouchableOpacity
              style={[
                styles.bottomNavBtn,
                {
                  backgroundColor: draftTournament?.selectedFlyers?.[activeCategory]
                    ? colors.primary
                    : '#1F2937'
                }
              ]}
              onPress={() => {
                const currentIndex = FLYER_CATEGORIES.indexOf(activeCategory);
                if (currentIndex !== -1 && currentIndex < FLYER_CATEGORIES.length - 1) {
                  setActiveCategory(FLYER_CATEGORIES[currentIndex + 1]);
                } else {
                  navigation.navigate('TournamentConfirmation', {
                    finalTournament: draftTournament
                  });
                }
              }}
            >
              <Text style={styles.bottomNavBtnText}>
                {draftTournament?.selectedFlyers?.[activeCategory]
                  ? 'Continue to Next Category'
                  : 'Skip this Category'}
              </Text>
              <Icon name="chevron-forward" size={16} color="#FFF" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Editable Event Details Drawer Modal (Matching Screenshot 1) */}
      <EventDetailsModal
        visible={isEventDetailsVisible}
        initialData={{
          eventLogo: currentEventLogo,
          eventName: currentEventName,
          organiserName: currentOrgName,
          subName: currentSubName,
          socials: currentSocials
        }}
        onClose={() => setIsEventDetailsVisible(false)}
        onUpdate={handleUpdateEventDetails}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.primary,
  },
  backButton: {
    padding: 4,
  },
  title: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
  },
  headerEditBtn: {
    padding: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '700',
  },
  activeTabText: {
    color: colors.primary,
  },
  eventDetailsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 12,
    marginTop: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  eventBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  barLogo: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  barLogoPlaceholder: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  barEventName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  barOrgName: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 1,
  },
  barEditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B57EDC',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
  },
  barEditBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  categoryWrap: {
    backgroundColor: '#F8FAFC',
  },
  categoryScrollContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  activeCategoryChip: {
    backgroundColor: '#E51025',
    borderColor: '#E51025',
  },
  categoryChipText: {
    color: '#475569',
    fontWeight: '700',
    fontSize: 12,
  },
  activeCategoryChipText: {
    color: '#FFFFFF',
  },
  listContainer: {
    paddingHorizontal: 8,
    paddingBottom: 90,
  },
  templateCard: {
    flex: 1,
    margin: 6,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#000000',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    aspectRatio: 0.72,
    position: 'relative',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedTemplateCard: {
    borderColor: '#10B981',
    borderWidth: 2.5,
  },
  templateImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  autoLogoBox: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#FFF',
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  autoLogoImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  autoSocialsRow: {
    position: 'absolute',
    flexDirection: 'row',
    flexWrap: 'wrap',
    right: '5%',
    gap: 6,
  },
  socialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 8,
  },
  socialItemText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '700',
    marginLeft: 3,
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#10B981',
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  templateTag: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  templateTagText: {
    color: '#F8FAFC',
    fontSize: 9,
    fontWeight: '700',
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  bottomNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  bottomNavBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
  proComingSoonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  proCard: {
    width: '100%',
    borderRadius: 20,
    backgroundColor: '#0F172A',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    padding: 24,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  proCardInner: {
    alignItems: 'center',
  },
  proBadgeBig: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  proBadgeBigText: {
    color: '#F59E0B',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1,
    marginLeft: 6,
  },
  proTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    marginBottom: 10,
    textAlign: 'center',
  },
  proSubTitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  proFeaturesList: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  proFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  proFeatureText: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 10,
  },
  proNotifyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    width: '100%',
  },
  proNotifyBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});

export default TournamentFlyersScreen;
