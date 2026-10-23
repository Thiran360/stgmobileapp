import React, { useState, useRef, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  Alert,
  PanResponder,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ViewShot from 'react-native-view-shot';
import Icon from 'react-native-vector-icons/Ionicons';
import SafeImagePicker from '../utils/SafeImagePicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { colors } from '../theme/colors';
import { AppContext } from '../context/AppContext';
import { FLYER_CATEGORIES } from '../data/flyerTemplates';
import PointCalcModal, { PointCalcData, PointCalcTeam } from '../components/PointCalcModal';
import PointsTableOverlay from '../components/PointsTableOverlay';

const DEFAULT_POINTCALC_TEAMS: PointCalcTeam[] = [
  { id: '1', rank: 1, name: 'SOUL', matches: 1, wwcd: 1, placePts: 10, kills: 14, totalPts: 24 },
  { id: '2', rank: 2, name: 'GODLIKE', matches: 1, wwcd: 0, placePts: 6, kills: 11, totalPts: 17 },
  { id: '3', rank: 3, name: 'GLOBAL ESPORTS', matches: 1, wwcd: 0, placePts: 5, kills: 9, totalPts: 14 },
  { id: '4', rank: 4, name: 'TEAM XSPARK', matches: 1, wwcd: 0, placePts: 4, kills: 8, totalPts: 12 },
  { id: '5', rank: 5, name: 'BLIND ESPORTS', matches: 1, wwcd: 0, placePts: 3, kills: 7, totalPts: 10 },
  { id: '6', rank: 6, name: 'REVENANT', matches: 1, wwcd: 0, placePts: 2, kills: 6, totalPts: 8 },
  { id: '7', rank: 7, name: 'ORANGUTAN', matches: 1, wwcd: 0, placePts: 1, kills: 5, totalPts: 6 },
  { id: '8', rank: 8, name: 'MEDAL ESPORTS', matches: 1, wwcd: 0, placePts: 1, kills: 4, totalPts: 5 },
  { id: '9', rank: 9, name: 'HYDRA ESPORTS', matches: 1, wwcd: 0, placePts: 0, kills: 4, totalPts: 4 },
  { id: '10', rank: 10, name: 'GLADIATORS', matches: 1, wwcd: 0, placePts: 0, kills: 3, totalPts: 3 },
];

const DraggableText = ({ initialX, initialY, text, style, isCapturing }: any) => {
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: () => {
        pan.extractOffset();
      },
    })
  ).current;

  if (!text) return null;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={{
        position: 'absolute',
        top: initialY,
        left: initialX,
        transform: [{ translateX: pan.x }, { translateY: pan.y }],
        padding: 4,
        borderWidth: isCapturing ? 0 : 1,
        borderColor: 'rgba(255,255,255,0.3)',
        borderStyle: 'dashed',
        borderRadius: 4,
      }}
    >
      <Text style={[style, { textAlign: 'center' }]}>{text}</Text>
    </Animated.View>
  );
};

const DraggableImage = ({ initialX, initialY, uri, size, isCapturing, isCircle = true }: any) => {
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: () => {
        pan.extractOffset();
      },
    })
  ).current;

  if (!uri) return null;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={{
        position: 'absolute',
        top: initialY,
        left: initialX,
        transform: [{ translateX: pan.x }, { translateY: pan.y }],
        padding: 4,
        borderWidth: isCapturing ? 0 : 1,
        borderColor: 'rgba(255,255,255,0.3)',
        borderStyle: 'dashed',
        borderRadius: isCircle ? size / 2 : 8,
      }}
    >
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: isCircle ? size / 2 : 8 }}
        resizeMode={isCircle ? 'cover' : 'contain'}
      />
    </Animated.View>
  );
};

const DraggableSocial = ({ initialX, initialY, text, iconName, color = '#FFFFFF', size = 12, isCapturing }: any) => {
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: () => {
        pan.extractOffset();
      },
    })
  ).current;

  if (!text) return null;

  let iconColor = color;
  if (iconName === 'logo-instagram') iconColor = '#E1306C';
  else if (iconName === 'logo-youtube') iconColor = '#FF0000';
  else if (iconName === 'logo-discord') iconColor = '#5865F2';
  else if (iconName === 'globe-outline') iconColor = '#10B981';

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={{
        position: 'absolute',
        top: initialY,
        left: initialX,
        transform: [{ translateX: pan.x }, { translateY: pan.y }],
        padding: 4,
        borderWidth: isCapturing ? 0 : 1,
        borderColor: 'rgba(255,255,255,0.25)',
        borderStyle: 'dashed',
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingHorizontal: 6,
        paddingVertical: 2,
      }}
    >
      <Icon name={iconName} size={size} color={iconColor} />
      <Text style={{ color: '#FFFFFF', fontSize: size, marginLeft: 4, fontWeight: '700' }}>{text}</Text>
    </Animated.View>
  );
};

const TournamentFlyerEditScreen = ({ route, navigation }: any) => {
  const { selectedTemplate, initialData } = route.params;
  const { draftTournament, setDraftTournament } = useContext(AppContext);

  const isPointTableCategory = selectedTemplate?.category === 'Event Calculation';

  const globalData = draftTournament?.globalFlyerData || {};
  const specificData = draftTournament?.selectedFlyers?.[selectedTemplate.category]?.specificData || {};

  const defaultData: any = {};
  if (selectedTemplate && selectedTemplate.fields) {
    selectedTemplate.fields.forEach((f: any) => {
      defaultData[f.name] = f.default || '';
    });
  }

  // Prepopulate with tournament name and organizer if present
  if (draftTournament?.name && !defaultData.eventName) {
    defaultData.eventName = draftTournament.name;
  }
  const orgName = (draftTournament as any)?.organiserName || (draftTournament as any)?.organiser_name;
  if (orgName && !defaultData.organiserName) {
    defaultData.organiserName = orgName;
  }
  if (!defaultData.subName) {
    defaultData.subName = 'FINALS';
  }

  const [data, setData] = useState({
    ...defaultData,
    ...(initialData || {}),
    ...(globalData?.data || {}),
    ...(specificData?.data || {}),
  });

  const [imageAspectRatio, setImageAspectRatio] = useState(1);
  useEffect(() => {
    if (typeof selectedTemplate.image === 'string') {
      Image.getSize(
        selectedTemplate.image,
        (width, height) => setImageAspectRatio(width / height),
        () => setImageAspectRatio(1)
      );
    } else if (selectedTemplate.image) {
      const source = Image.resolveAssetSource(selectedTemplate.image);
      if (source && source.width && source.height) {
        setImageAspectRatio(source.width / source.height);
      }
    }
  }, [selectedTemplate.image]);

  const [eventLogo, setEventLogo] = useState<string | null>(
    specificData.eventLogo !== undefined
      ? specificData.eventLogo
      : globalData.eventLogo !== undefined
      ? globalData.eventLogo
      : ((draftTournament as any)?.eventLogo || null)
  );

  const [socials, setSocials] = useState({
    instagram: specificData.socials?.instagram || globalData.socials?.instagram || '',
    youtube: specificData.socials?.youtube || globalData.socials?.youtube || '',
    discord: specificData.socials?.discord || globalData.socials?.discord || '',
    website: specificData.socials?.website || globalData.socials?.website || '',
  });

  // PointCalc state for Point Table / Event Calculation
  const [isPointCalcModalVisible, setIsPointCalcModalVisible] = useState(false);
  const [pointCalcData, setPointCalcData] = useState<PointCalcData>(
    specificData.pointCalcData ||
      globalData.pointCalcData ||
      (draftTournament as any)?.pointCalcData || {
        systemType: '10_pts',
        killPoints: 1,
        matchNumber: 'Match 1',
        mapName: 'Erangel',
        teams: DEFAULT_POINTCALC_TEAMS,
      }
  );

  const [isCapturing, setIsCapturing] = useState(false);
  const viewShotRef = useRef<any>(null);

  // Sync state changes across all flyers (auto-fix / auto-sync)
  const syncToGlobal = (
    nextData: any,
    nextLogo: string | null,
    nextSocials: any,
    nextPointCalc?: PointCalcData
  ) => {
    const updatedGlobal = {
      ...(draftTournament?.globalFlyerData || {}),
      eventName: nextData.eventName,
      organiserName: nextData.organiserName,
      subName: nextData.subName,
      eventLogo: nextLogo,
      socials: nextSocials,
      pointCalcData: nextPointCalc || pointCalcData,
      data: nextData,
    };

    if (setDraftTournament) {
      setDraftTournament({
        ...(draftTournament || {}),
        name: nextData.eventName || draftTournament?.name,
        organiserName: nextData.organiserName || (draftTournament as any)?.organiserName,
        eventLogo: nextLogo,
        pointCalcData: nextPointCalc || pointCalcData,
        globalFlyerData: updatedGlobal,
      } as any);
    }
  };

  const handleFieldChange = (name: string, value: string) => {
    const nextData = { ...data, [name]: value };
    setData(nextData);
    syncToGlobal(nextData, eventLogo, socials, pointCalcData);
  };

  const handleSocialChange = (network: 'instagram' | 'youtube' | 'discord' | 'website', val: string) => {
    const nextSocials = { ...socials, [network]: val };
    setSocials(nextSocials);
    syncToGlobal(data, eventLogo, nextSocials, pointCalcData);
  };

  const handleSelectLogo = () => {
    SafeImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      cropperCircleOverlay: true,
    })
      .then(image => {
        if (image && image.path) {
          setEventLogo(image.path);
          syncToGlobal(data, image.path, socials, pointCalcData);
        }
      })
      .catch(e => console.log('Logo pick cancelled or error:', e));
  };

  const handleRemoveLogo = () => {
    setEventLogo(null);
    syncToGlobal(data, null, socials, pointCalcData);
  };

  const handlePointCalcSave = (newData: PointCalcData) => {
    setPointCalcData(newData);
    setIsPointCalcModalVisible(false);
    syncToGlobal(data, eventLogo, socials, newData);
  };

  const handleContinue = () => {
    setIsCapturing(true);
    setTimeout(async () => {
      try {
        const uri = await viewShotRef.current.capture();
        const updatedGlobalData = {
          data,
          eventLogo,
          socials,
          pointCalcData,
        };
        const updatedTournament = {
          ...(draftTournament || {}),
          flyerImage: uri,
          pointCalcData,
          globalFlyerData: updatedGlobalData,
          selectedFlyers: {
            ...(draftTournament?.selectedFlyers || {}),
            [selectedTemplate.category]: {
              templateId: selectedTemplate.id,
              uri: uri,
              data: data,
              specificData: updatedGlobalData,
            },
          },
        };
        setDraftTournament(updatedTournament);
        setIsCapturing(false);

        const currentIndex = FLYER_CATEGORIES.indexOf(selectedTemplate.category);
        if (currentIndex !== -1 && currentIndex < FLYER_CATEGORIES.length - 1) {
          const nextCategory = FLYER_CATEGORIES[currentIndex + 1];
          navigation.navigate('TournamentFlyers', { activeCategory: nextCategory, ...route.params });
        } else {
          navigation.navigate('TournamentConfirmation', { finalTournament: updatedTournament, ...route.params });
        }
      } catch (e) {
        setIsCapturing(false);
        Alert.alert('Error', 'Failed to save flyer.');
      }
    }, 100);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
      <StatusBar barStyle="light-content" backgroundColor="#E51025" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Flyer - {selectedTemplate?.category || 'Template'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAwareScrollView
        style={{ flex: 1, backgroundColor: '#F8FAFC' }}
        contentContainerStyle={{ paddingBottom: 40 }}
        enableOnAndroid={true}
        extraScrollHeight={50}
        showsVerticalScrollIndicator={false}
      >
        {/* Poster Canvas Preview */}
        <View style={styles.previewWrapper}>
          <Text style={styles.dragHint}>
            <Icon name="color-wand" size={14} /> Elements auto-fit across all flyers
          </Text>

          <View style={[styles.canvasShadow, { aspectRatio: imageAspectRatio }]}>
            <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 1.0, width: 1080, height: 1080 }} style={styles.viewShot}>
              <View collapsable={false} style={{ width: '100%', height: '100%' }}>
                <Image
                  source={typeof selectedTemplate.image === 'string' ? { uri: selectedTemplate.image } : selectedTemplate.image}
                  style={styles.flyerImage}
                />

                {/* If Points Table / Event Calculation: Render PointCalc Esports Overlay */}
                {isPointTableCategory ? (
                  <View style={StyleSheet.absoluteFill}>
                    <PointsTableOverlay
                      teams={pointCalcData.teams}
                      eventName={data.eventName || draftTournament?.name || 'STG OP CHAMPIONSHIP'}
                      subName={data.subName || 'MATCH OVERALL STANDINGS'}
                      matchInfo={pointCalcData.matchNumber}
                      mapName={pointCalcData.mapName}
                    />
                  </View>
                ) : (
                  <>
                    {/* Draggable Event Logo */}
                    {eventLogo ? (
                      <DraggableImage initialX={'75%'} initialY={'6%'} uri={eventLogo} size={48} isCapturing={isCapturing} />
                    ) : null}

                    {/* Standard Flyer Text Overlays */}
                    {data.eventName ? (
                      <DraggableText
                        initialX={'20%'}
                        initialY={'28%'}
                        text={data.eventName}
                        isCapturing={isCapturing}
                        style={styles.overlayEventName}
                      />
                    ) : null}

                    {data.organiserName ? (
                      <DraggableText
                        initialX={'25%'}
                        initialY={'36%'}
                        text={`ORGANISED BY: ${data.organiserName}`}
                        isCapturing={isCapturing}
                        style={styles.overlayOrganiser}
                      />
                    ) : null}

                    {data.subName ? (
                      <DraggableText
                        initialX={'30%'}
                        initialY={'22%'}
                        text={data.subName}
                        isCapturing={isCapturing}
                        style={styles.overlaySubName}
                      />
                    ) : null}

                    {/* Render any additional template-specific fields */}
                    {(selectedTemplate.fields || []).map((field: any) => {
                      if (['eventName', 'organiserName', 'subName'].includes(field.name)) return null;
                      if (!data[field.name]) return null;
                      return (
                        <DraggableText
                          key={field.name}
                          initialX={field.x || '25%'}
                          initialY={field.y || '50%'}
                          text={data[field.name]}
                          isCapturing={isCapturing}
                          style={{
                            color: field.color || '#FFFFFF',
                            fontSize: field.fontSize || 16,
                            fontWeight: field.fontWeight || '800',
                            textShadowColor: 'rgba(0,0,0,0.8)',
                            textShadowOffset: { width: 1, height: 1 },
                            textShadowRadius: 3,
                          }}
                        />
                      );
                    })}

                    {/* Draggable Social Overlays at Bottom */}
                    {socials.instagram ? (
                      <DraggableSocial initialX={'12%'} initialY={'88%'} text={socials.instagram} iconName="logo-instagram" isCapturing={isCapturing} />
                    ) : null}
                    {socials.youtube ? (
                      <DraggableSocial initialX={'42%'} initialY={'88%'} text={socials.youtube} iconName="logo-youtube" isCapturing={isCapturing} />
                    ) : null}
                    {socials.discord ? (
                      <DraggableSocial initialX={'70%'} initialY={'88%'} text={socials.discord} iconName="logo-discord" isCapturing={isCapturing} />
                    ) : null}
                    {socials.website ? (
                      <DraggableSocial initialX={'30%'} initialY={'93%'} text={socials.website} iconName="globe-outline" isCapturing={isCapturing} />
                    ) : null}
                  </>
                )}
              </View>
            </ViewShot>
          </View>
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          {/* PointCalc Dedicated Card for Points Table Category */}
          {isPointTableCategory && (
            <View style={styles.pointCalcCard}>
              <View style={styles.pointCalcHeader}>
                <View style={styles.pointCalcIconBadge}>
                  <Icon name="calculator" size={20} color="#B57EDC" />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.pointCalcTitle}>PointCalc - Custom PT Maker</Text>
                  <Text style={styles.pointCalcSub}>
                    {pointCalcData.systemType === '10_pts' ? 'Official 10-Point BGMI System' : 'Classic 15-Point System'} • {pointCalcData.matchNumber} ({pointCalcData.mapName})
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.openPointCalcBtn}
                activeOpacity={0.85}
                onPress={() => setIsPointCalcModalVisible(true)}
              >
                <Icon name="create-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.openPointCalcBtnText}>Edit Match Points & Standings</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Clean "Event Details" Card (Matching Turn 1 Screenshot Exactly) */}
          <View style={styles.cleanCard}>
            <View style={styles.cardHeader}>
              <Icon name="information-circle" size={20} color="#E51025" style={{ marginRight: 8 }} />
              <Text style={styles.cardTitle}>Event Details</Text>
              <View style={styles.autoSyncBadge}>
                <Text style={styles.autoSyncBadgeText}>Auto-syncs all flyers</Text>
              </View>
            </View>

            {/* Event Logo Row */}
            <View style={styles.fieldRow}>
              <View style={styles.logoCircleWrapper}>
                {eventLogo ? (
                  <Image source={{ uri: eventLogo }} style={styles.eventLogoPreview} />
                ) : (
                  <View style={styles.eventLogoPlaceholder}>
                    <Icon name="image-outline" size={24} color="#9CA3AF" />
                  </View>
                )}
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.fieldLabel}>Event Logo</Text>
                <View style={{ flexDirection: 'row', marginTop: 6 }}>
                  <TouchableOpacity style={styles.logoBtnPrimary} onPress={handleSelectLogo}>
                    <Icon name="cloud-upload-outline" size={15} color="#FFFFFF" style={{ marginRight: 4 }} />
                    <Text style={styles.logoBtnPrimaryText}>{eventLogo ? 'Change' : 'Upload'}</Text>
                  </TouchableOpacity>
                  {eventLogo ? (
                    <TouchableOpacity style={styles.logoBtnSecondary} onPress={handleRemoveLogo}>
                      <Icon name="trash-outline" size={15} color="#E51025" style={{ marginRight: 4 }} />
                      <Text style={styles.logoBtnSecondaryText}>Remove</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            </View>

            {/* Event Name */}
            <View style={styles.inputItem}>
              <Text style={styles.fieldLabel}>Event Name</Text>
              <View style={styles.cleanInputBox}>
                <Icon name="pencil" size={17} color="#9CA3AF" style={styles.inputLeftIcon} />
                <TextInput
                  style={styles.cleanInput}
                  placeholder="Enter Tournament / Event Name"
                  placeholderTextColor="#9CA3AF"
                  value={data.eventName}
                  onChangeText={val => handleFieldChange('eventName', val)}
                />
              </View>
            </View>

            {/* Organiser Name */}
            <View style={styles.inputItem}>
              <Text style={styles.fieldLabel}>Organiser Name</Text>
              <View style={styles.cleanInputBox}>
                <Icon name="pencil" size={17} color="#9CA3AF" style={styles.inputLeftIcon} />
                <TextInput
                  style={styles.cleanInput}
                  placeholder="Enter Organiser / Host Name"
                  placeholderTextColor="#9CA3AF"
                  value={data.organiserName}
                  onChangeText={val => handleFieldChange('organiserName', val)}
                />
              </View>
            </View>

            {/* Sub Name */}
            <View style={styles.inputItem}>
              <Text style={styles.fieldLabel}>Sub Name / Group</Text>
              <View style={styles.cleanInputBox}>
                <Icon name="pencil" size={17} color="#9CA3AF" style={styles.inputLeftIcon} />
                <TextInput
                  style={styles.cleanInput}
                  placeholder="e.g. Group 1, Finals, Day 1"
                  placeholderTextColor="#9CA3AF"
                  value={data.subName}
                  onChangeText={val => handleFieldChange('subName', val)}
                />
              </View>
            </View>

            {/* Template Specific Additional Fields (if any) */}
            {(selectedTemplate.fields || [])
              .filter((f: any) => !['eventName', 'organiserName', 'subName'].includes(f.name))
              .map((field: any) => (
                <View key={field.name} style={styles.inputItem}>
                  <Text style={styles.fieldLabel}>{field.label}</Text>
                  <View style={styles.cleanInputBox}>
                    <Icon name="pencil" size={17} color="#9CA3AF" style={styles.inputLeftIcon} />
                    <TextInput
                      style={styles.cleanInput}
                      placeholder={`Enter ${field.label}`}
                      placeholderTextColor="#9CA3AF"
                      value={data[field.name]}
                      onChangeText={val => handleFieldChange(field.name, val)}
                    />
                  </View>
                </View>
              ))}
          </View>

          {/* Social Medias Card */}
          <View style={styles.cleanCard}>
            <View style={styles.cardHeader}>
              <Icon name="share-social-outline" size={20} color="#E51025" style={{ marginRight: 8 }} />
              <Text style={styles.cardTitle}>Social Medias</Text>
            </View>

            {/* Instagram */}
            <View style={styles.socialItem}>
              <View style={[styles.socialIconBox, { backgroundColor: '#E1306C' }]}>
                <Icon name="logo-instagram" size={18} color="#FFFFFF" />
              </View>
              <TextInput
                style={styles.socialInput}
                placeholder="Instagram username (e.g. @esports)"
                placeholderTextColor="#9CA3AF"
                value={socials.instagram}
                onChangeText={val => handleSocialChange('instagram', val)}
              />
            </View>

            {/* YouTube */}
            <View style={styles.socialItem}>
              <View style={[styles.socialIconBox, { backgroundColor: '#FF0000' }]}>
                <Icon name="logo-youtube" size={18} color="#FFFFFF" />
              </View>
              <TextInput
                style={styles.socialInput}
                placeholder="YouTube channel name"
                placeholderTextColor="#9CA3AF"
                value={socials.youtube}
                onChangeText={val => handleSocialChange('youtube', val)}
              />
            </View>

            {/* Discord */}
            <View style={styles.socialItem}>
              <View style={[styles.socialIconBox, { backgroundColor: '#5865F2' }]}>
                <Icon name="logo-discord" size={18} color="#FFFFFF" />
              </View>
              <TextInput
                style={styles.socialInput}
                placeholder="Discord server link / name"
                placeholderTextColor="#9CA3AF"
                value={socials.discord}
                onChangeText={val => handleSocialChange('discord', val)}
              />
            </View>

            {/* Website */}
            <View style={styles.socialItem}>
              <View style={[styles.socialIconBox, { backgroundColor: '#10B981' }]}>
                <Icon name="globe-outline" size={18} color="#FFFFFF" />
              </View>
              <TextInput
                style={styles.socialInput}
                placeholder="Website (e.g. stgesports.in)"
                placeholderTextColor="#9CA3AF"
                value={socials.website}
                onChangeText={val => handleSocialChange('website', val)}
              />
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity style={styles.continueBtn} onPress={handleContinue} activeOpacity={0.85}>
            <Text style={styles.continueBtnText}>Continue</Text>
            <Icon name="arrow-forward" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>

      {/* PointCalc Modal */}
      <PointCalcModal
        visible={isPointCalcModalVisible}
        initialData={pointCalcData}
        onClose={() => setIsPointCalcModalVisible(false)}
        onSave={handlePointCalcSave}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#E51025',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  previewWrapper: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  dragHint: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
  },
  canvasShadow: {
    width: '100%',
    aspectRatio: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderRadius: 16,
  },
  viewShot: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
  },
  flyerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  overlayEventName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    letterSpacing: 0.5,
  },
  overlayOrganiser: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FACC15',
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 0.5,
  },
  overlaySubName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#38BDF8',
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 1,
  },
  formContainer: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  pointCalcCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#E9D5FF',
    shadowColor: '#B57EDC',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  pointCalcHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pointCalcIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(181, 126, 220, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointCalcTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  pointCalcSub: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  openPointCalcBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B57EDC',
    borderRadius: 12,
    paddingVertical: 12,
    shadowColor: '#B57EDC',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  openPointCalcBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  cleanCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
  },
  autoSyncBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  autoSyncBadgeText: {
    color: '#2563EB',
    fontSize: 11,
    fontWeight: '700',
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  logoCircleWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    overflow: 'hidden',
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventLogoPreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  eventLogoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  logoBtnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    marginRight: 8,
  },
  logoBtnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  logoBtnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  logoBtnSecondaryText: {
    color: '#E51025',
    fontSize: 12,
    fontWeight: '700',
  },
  inputItem: {
    marginBottom: 14,
  },
  cleanInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
  },
  inputLeftIcon: {
    marginRight: 10,
  },
  cleanInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
  socialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    height: 48,
  },
  socialIconBox: {
    width: 48,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialInput: {
    flex: 1,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

export default TournamentFlyerEditScreen;
