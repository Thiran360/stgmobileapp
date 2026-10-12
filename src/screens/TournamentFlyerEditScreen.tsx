import React, { useState, useRef, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, StatusBar, Alert, PanResponder, Animated, Platform, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ViewShot from 'react-native-view-shot';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { colors } from '../theme/colors';
import { AppContext } from '../context/AppContext';

const PRESET_COLORS = [
  // Grayscale
  '#FFFFFF', '#F3F4F6', '#D1D5DB', '#9CA3AF', '#6B7280', '#4B5563', '#1F2937', '#000000',

  // Reds / Pinks
  '#FEF2F2', '#FECACA', '#FCA5A5', '#F87171', '#E51025', '#E51025', '#991B1B',
  '#FDF2F8', '#FBCFE8', '#F9A8D4', '#F472B6', '#EC4899', '#DB2777', '#9D174D',
  '#FFF0F5', '#FFB6C1', '#FF69B4', '#FF1493', '#C71585',

  // Oranges / Yellows
  '#FFF7ED', '#FFEDD5', '#FDBA74', '#FB923C', '#F97316', '#EA580C', '#9A3412',
  '#FEFCE8', '#FEF08A', '#FDE047', '#FACC15', '#EAB308', '#CA8A04', '#854D0E',
  '#FFD700', '#FFA500', '#FF8C00', '#FF4500',

  // Greens
  '#F0FDF4', '#BBF7D0', '#86EFAC', '#4ADE80', '#22C55E', '#16A34A', '#14532D',
  '#ECFDF5', '#A7F3D0', '#6EE7B7', '#34D399', '#10B981', '#059669', '#064E3B',
  '#7CFC00', '#32CD32', '#00FA9A', '#00FF7F',

  // Blues / Cyans / Teals
  '#FEF2F2', '#BFDBFE', '#FCA5A5', '#60A5FA', '#E51025', '#E51025', '#7F1D1D',
  '#F0F9FF', '#BAE6FD', '#7DD3FC', '#38BDF8', '#0EA5E9', '#0284C7', '#0C4A6E',
  '#F0FDFA', '#99F6E4', '#5EEAD4', '#2DD4BF', '#14B8A6', '#0D9488', '#134E4A',
  '#00FFFF', '#00CED1', '#4169E1', '#000080',

  // Purples / Violets
  '#FAF5FF', '#E9D5FF', '#D8B4FE', '#C084FC', '#A855F7', '#9333EA', '#581C87',
  '#F5F3FF', '#DDD6FE', '#C4B5FD', '#A78BFA', '#8B5CF6', '#7C3AED', '#4C1D95',
  '#EE82EE', '#DA70D6', '#BA55D3', '#9932CC', '#8A2BE2',

  // Browns
  '#FDF8F6', '#F2E8E5', '#E2D1C3', '#D3BAA9', '#A0522D', '#8B4513', '#D2691E', '#CD853F'
];
const FONTS = [
  // Esports & Aggressive
  'Impact', 'sans-serif-black', 'sans-serif-condensed', 'Arial Black', 'AvenirNext-Heavy', 'Futura-CondensedExtraBold',

  // Standard & System
  'System', 'sans-serif', 'sans-serif-medium', 'sans-serif-light', 'sans-serif-thin',
  'serif', 'monospace', 'casual', 'cursive', 'sans-serif-smallcaps',

  // Clean & Modern (Mainly iOS/Cross-platform fallbacks)
  'Helvetica Neue', 'Helvetica', 'Avenir', 'Avenir Next',
  'Futura', 'Trebuchet MS', 'Arial', 'Verdana', 'Verdana-Bold',

  // Elegant & Serif
  'Georgia', 'Palatino', 'Baskerville', 'Didot', 'Optima', 'Times New Roman', 'Rockwell', 'Rockwell-Bold', 'Hoefler Text',

  // Playful & Stylized
  'Copperplate', 'Chalkduster', 'Marker Felt', 'Noteworthy', 'Papyrus', 'Bradley Hand', 'Snell Roundhand', 'Zapfino',

  // Monospaced
  'Courier', 'Courier New', 'Menlo', 'Monaco'
];

const DraggableText = ({ initialX, initialY, text, style, onPositionChange, isCapturing }: any) => {
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

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={{
        position: 'absolute',
        top: initialY,
        left: initialX,
        transform: [{ translateX: pan.x }, { translateY: pan.y }],
        padding: 5, // give it some touch area
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

const DraggableImage = ({ initialX, initialY, uri, size, isCapturing, aspectRatio = 1, isCircle = true }: any) => {
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

  const height = size / aspectRatio;
  const borderRadius = isCircle ? size / 2 : 8;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={{
        position: 'absolute',
        top: initialY,
        left: initialX,
        transform: [{ translateX: pan.x }, { translateY: pan.y }],
        padding: 5,
        borderWidth: isCapturing ? 0 : 1,
        borderColor: 'rgba(255,255,255,0.3)',
        borderStyle: 'dashed',
        borderRadius: 4,
      }}
    >
      <Image source={{ uri }} style={{ width: size, height: height, borderRadius: borderRadius }} resizeMode={isCircle ? 'cover' : 'contain'} />
    </Animated.View>
  );
};

const DraggableSocial = ({ initialX, initialY, text, iconName, color, size, isCapturing }: any) => {
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

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={{
        position: 'absolute',
        top: initialY,
        left: initialX,
        transform: [{ translateX: pan.x }, { translateY: pan.y }],
        padding: 5,
        borderWidth: isCapturing ? 0 : 1,
        borderColor: 'rgba(255,255,255,0.3)',
        borderStyle: 'dashed',
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center'
      }}
    >
      {(() => {
        let iconColor = color;
        if (iconName === 'logo-instagram') iconColor = '#E1306C';
        else if (iconName === 'logo-youtube') iconColor = '#FF0000';
        else if (iconName === 'logo-discord') iconColor = '#5865F2';
        return <Icon name={iconName} size={size} color={iconColor} />;
      })()}
      <Text style={{ color, fontSize: size, marginLeft: 6, fontWeight: '600' }}>{text}</Text>
    </Animated.View>
  );
};

const TournamentFlyerEditScreen = ({ route, navigation }: any) => {
  const { selectedTemplate, initialData } = route.params;
  const { draftTournament, setDraftTournament } = useContext(AppContext);
  const globalData = draftTournament?.globalFlyerData || {};
  const specificData = draftTournament?.selectedFlyers?.[selectedTemplate.category]?.specificData || {};
  
  const defaultData: any = {};
    if (selectedTemplate && selectedTemplate.fields) {
      selectedTemplate.fields.forEach((f: any) => {
        defaultData[f.name] = f.default || '';
      });
    }

    const [data, setData] = useState({ 
      ...defaultData, 
      ...(initialData || {}), 
      ...(globalData?.data || {}), 
      ...(specificData?.data || {}) 
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

  const [eventLogo, setEventLogo] = useState<string | null>(specificData.eventLogo !== undefined ? specificData.eventLogo : (globalData.eventLogo !== undefined ? globalData.eventLogo : null));
  const [eventLogoSize, setEventLogoSize] = useState(specificData.eventLogoSize || globalData.eventLogoSize || 40);

  const defaultBgmiLogo = Image.resolveAssetSource(require('../assets/bgmi_logo.png')).uri;
  const [gameLogo, setGameLogo] = useState<string | null>(specificData.gameLogo !== undefined ? specificData.gameLogo : (globalData.gameLogo !== undefined ? globalData.gameLogo : defaultBgmiLogo));
  const [gameLogoSize, setGameLogoSize] = useState(specificData.gameLogoSize || globalData.gameLogoSize || 80);
  const [customImages, setCustomImages] = useState<any[]>(specificData.customImages || globalData.customImages || []);
  const [socials, setSocials] = useState(specificData.socials || globalData.socials || { instagram: '', youtube: '', discord: '' });
  const [customSocials, setCustomSocials] = useState<any[]>(specificData.customSocials || globalData.customSocials || []);
  const [socialColor, setSocialColor] = useState(specificData.socialColor || globalData.socialColor || '#FFFFFF');
  const [socialSize, setSocialSize] = useState(specificData.socialSize || globalData.socialSize || 12);
  const [expandedField, setExpandedField] = useState<string | null>(null);

  const [fieldStyles, setFieldStyles] = useState<Record<string, any>>(specificData.fieldStyles || globalData.fieldStyles || {});
  const [isCapturing, setIsCapturing] = useState(false);
  
  const existingCustomFields = (specificData.templateFields || globalData.templateFields || []).filter((f: any) => !(selectedTemplate.fields || []).find((tf: any) => tf.name === f.name));
  const [templateFields, setTemplateFields] = useState<any[]>([...(selectedTemplate.fields || []), ...existingCustomFields]);

  const viewShotRef = useRef<any>(null);

  const [isAddFieldModalVisible, setIsAddFieldModalVisible] = useState(false);
  const [isAddTypeModalVisible, setIsAddTypeModalVisible] = useState(false);
  const [newFieldLabel, setNewFieldLabel] = useState('');

  const handleAddField = () => {
    setIsAddTypeModalVisible(true);
  };

  const handleChooseType = (type: 'text' | 'image') => {
    setIsAddTypeModalVisible(false);
    if (type === 'text') {
      setTimeout(() => {
        setNewFieldLabel('');
        setIsAddFieldModalVisible(true);
      }, 300);
    } else {
      setTimeout(() => {
        ImagePicker.openPicker({
          cropping: true,
          freeStyleCropEnabled: true,
        }).then(image => {
          const aspectRatio = image.width / image.height;
          const newImage = {
            id: `custom_image_${Date.now()}`,
            uri: image.path,
            size: 100,
            aspectRatio: aspectRatio,
            x: '50%',
            y: '50%'
          };
          setCustomImages(prev => [...prev, newImage]);
        }).catch(e => console.log(e));
      }, 300);
    }
  };

  const updateCustomImageSize = (id: string, delta: number) => {
    setCustomImages(prev => prev.map(img => img.id === id ? { ...img, size: Math.max(20, Math.min(200, img.size + delta)) } : img));
  };

  const removeCustomImage = (id: string) => {
    setCustomImages(prev => prev.filter(img => img.id !== id));
  };

  const confirmAddField = () => {
    if (!newFieldLabel.trim()) {
      Alert.alert('Error', 'Please enter a field name');
      return;
    }
    const newFieldName = `custom_field_${Date.now()}`;
    setTemplateFields([...templateFields, { name: newFieldName, label: newFieldLabel.trim(), x: '50%', y: '50%' }]);
    setIsAddFieldModalVisible(false);
  };

  const handleDeleteField = (fieldName: string) => {
    setTemplateFields(templateFields.filter(f => f.name !== fieldName));
  };

  const handleUpdate = (name: string, value: string) => {
    setData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSocialUpdate = (network: string, value: string) => {
    setSocials(prev => ({ ...prev, [network]: value }));
  };

  const handleAddCustomSocial = () => {
    setCustomSocials(prev => [...prev, { id: `social_${Date.now()}`, name: '', value: '' }]);
  };

  const handleCustomSocialUpdate = (id: string, field: 'name' | 'value', val: string) => {
    setCustomSocials(prev => prev.map(s => s.id === id ? { ...s, [field]: val } : s));
  };

  const handleRemoveCustomSocial = (id: string) => {
    setCustomSocials(prev => prev.filter(s => s.id !== id));
  };

  const updateFieldStyle = (name: string, styleKey: string, value: any) => {
    setFieldStyles(prev => ({
      ...prev,
      [name]: {
        ...(prev[name] || {}),
        [styleKey]: value
      }
    }));
  };

  const cycleFont = (fieldName: string, currentFont: string) => {
    const currentIndex = FONTS.indexOf(currentFont || 'System');
    const nextIndex = (currentIndex + 1) % FONTS.length;
    updateFieldStyle(fieldName, 'fontFamily', FONTS[nextIndex]);
  };

  const handleSelectLogo = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      cropperCircleOverlay: true,
    }).then(image => {
      setEventLogo(image.path);
    }).catch(e => console.log(e));
  };
  const handleNext = () => {
    setIsCapturing(true);
    setTimeout(async () => {
      try {
        const uri = await viewShotRef.current.capture();
        const updatedGlobalData = {
          data,
          eventLogo, eventLogoSize,
          gameLogo, gameLogoSize,
          socials, customSocials, socialColor, socialSize,
          fieldStyles,
          templateFields,
          customImages
        };
        const updatedTournament = {
          ...(draftTournament || {}),
          flyerImage: uri,
          globalFlyerData: updatedGlobalData,
          selectedFlyers: {
            ...(draftTournament?.selectedFlyers || {}),
            [selectedTemplate.category]: {
              templateId: selectedTemplate.id,
              uri: uri,
              data: data,
              specificData: updatedGlobalData
            }
          }
        };
        setDraftTournament(updatedTournament);
        setIsCapturing(false);

        const CATEGORIES = [
          'Coming Soon',
          'Registration',
          'Points Table',
          'Team poster',
          'Slotlist',
          'Roadmaps',
          'Teams Preview',
          'Livestream',
          'Prize Pool',
          'PP Distribution',
          'Final Winers and Runner'
        ];
        const currentIndex = CATEGORIES.indexOf(selectedTemplate.category);
        if (currentIndex !== -1 && currentIndex < CATEGORIES.length - 1) {
          const nextCategory = CATEGORIES[currentIndex + 1];
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Flyers</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: '#F8FAFC' }} contentContainerStyle={{ paddingBottom: 40 }} enableOnAndroid={true} extraScrollHeight={50} showsVerticalScrollIndicator={false}>
      {/* Image Preview Canvas */}
      <View style={styles.previewWrapper}>
        <Text style={styles.dragHint}><Icon name="color-wand" size={14} /> Drag text to position</Text>
        <View style={[styles.canvasShadow, { aspectRatio: imageAspectRatio }]}>
          <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 1.0, width: 1080, height: 1080 }} style={styles.viewShot}>
            <View collapsable={false} style={{ width: '100%', height: '100%' }}>
              <Image
                source={typeof selectedTemplate.image === 'string' ? { uri: selectedTemplate.image } : selectedTemplate.image}
                style={styles.flyerImage}
              />

            {/* Logo Overlay */}
            {eventLogo ? (
              <DraggableImage initialX={'75%'} initialY={'5%'} uri={eventLogo} size={eventLogoSize} isCapturing={isCapturing} />
            ) : null}

            {/* Game Logo Overlay */}
            {gameLogo ? (
              <DraggableImage initialX={'5%'} initialY={'5%'} uri={gameLogo} size={gameLogoSize} isCapturing={isCapturing} isCircle={false} />
            ) : null}

            {/* Custom Image Overlays */}
            {customImages.map((img) => (
              <DraggableImage key={img.id} initialX={img.x} initialY={img.y} uri={img.uri} size={img.size} isCapturing={isCapturing} aspectRatio={img.aspectRatio} isCircle={false} />
            ))}

            {/* Draggable Text Overlays */}
            {templateFields.map((field: any) => {
              const customStyle = fieldStyles[field.name] || {};
              const textColor = customStyle.color || field.color || '#808080';
              return (
                <DraggableText
                  key={field.name}
                  initialX={field.x || '25%'}
                  initialY={field.y || '10%'}
                  text={data[field.name]}
                  isCapturing={isCapturing}
                  style={{
                    color: textColor,
                    fontSize: customStyle.fontSize || field.fontSize || 16,
                    fontWeight: customStyle.fontWeight || field.fontWeight || 'normal',
                    fontStyle: customStyle.fontStyle || 'normal',
                    fontFamily: customStyle.fontFamily || 'System',
                    textShadowColor: 'rgba(0,0,0,0.5)',
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 3
                  }}
                />
              );
            })}

            {/* Social Overlays */}
            {socials.instagram ? (
              <DraggableSocial initialX={'30%'} initialY={'85%'} text={socials.instagram} iconName="logo-instagram" color={socialColor} size={socialSize} isCapturing={isCapturing} />
            ) : null}
            {socials.youtube ? (
              <DraggableSocial initialX={'60%'} initialY={'85%'} text={socials.youtube} iconName="logo-youtube" color={socialColor} size={socialSize} isCapturing={isCapturing} />
            ) : null}
            {socials.discord ? (
              <DraggableSocial initialX={'45%'} initialY={'85%'} text={socials.discord} iconName="logo-discord" color={socialColor} size={socialSize} isCapturing={isCapturing} />
            ) : null}

            {customSocials.map((social, index) => {
              if (!social.value) return null;
              return (
                <DraggableSocial 
                   key={social.id} 
                   initialX={`${20 + ((index % 3) * 20)}%`} 
                   initialY={'90%'} 
                   text={`${social.name ? social.name + ': ' : ''}${social.value}`} 
                   iconName="link" 
                   color={socialColor} 
                   size={socialSize} 
                   isCapturing={isCapturing} 
                />
              );
            })}

            </View>
          </ViewShot>
        </View>
      </View>

        <View style={[styles.formContainer, { marginTop: -20 }]}>

          {/* Game Logo */}
          <View style={styles.row}>
            <Text style={styles.label}>Game logo</Text>
            <View style={styles.logoActions}>
              {gameLogo ? (
                <>
                  <View style={styles.logoPicker}>
                    <Image source={{ uri: gameLogo }} style={{ width: '100%', height: '100%', borderRadius: 8, resizeMode: 'contain' }} />
                  </View>
                  <View style={{ flexDirection: 'row', marginLeft: 15, alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => setGameLogoSize(s => Math.max(20, s - 5))} style={styles.sizeBtn}><Text style={styles.sizeBtnText}>-</Text></TouchableOpacity>
                    <Text style={{ marginHorizontal: 8, fontSize: 16, fontWeight: '600', color: '#333' }}>{gameLogoSize}</Text>
                    <TouchableOpacity onPress={() => setGameLogoSize(s => Math.min(200, s + 5))} style={styles.sizeBtn}><Text style={styles.sizeBtnText}>+</Text></TouchableOpacity>
                  </View>
                  <TouchableOpacity style={styles.removeBtn} onPress={() => { setGameLogo(null); }}>
                    <Text style={styles.removeBtnText}>Delete</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity style={[styles.removeBtn, { backgroundColor: 'rgba(56, 189, 248, 0.1)' }]} onPress={() => { setGameLogo(defaultBgmiLogo); setGameLogoSize(80); }}>
                  <Text style={[styles.removeBtnText, { color: '#38BDF8' }]}>Add Logo</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Event Logo */}
          <View style={styles.row}>
            <Text style={styles.label}>Event logo</Text>
            <View style={styles.logoActions}>
              <TouchableOpacity style={styles.logoPicker} onPress={handleSelectLogo}>
                {eventLogo ? (
                  <Image source={{ uri: eventLogo }} style={{ width: '100%', height: '100%', borderRadius: 8 }} />
                ) : (
                  <Icon name="image-outline" size={24} color="#999" />
                )}
              </TouchableOpacity>
              {eventLogo ? (
                <View style={{ flexDirection: 'row', marginLeft: 15, alignItems: 'center' }}>
                  <TouchableOpacity onPress={() => setEventLogoSize(s => Math.max(20, s - 5))} style={styles.sizeBtn}><Text style={styles.sizeBtnText}>-</Text></TouchableOpacity>
                  <Text style={{ marginHorizontal: 8, fontSize: 16, fontWeight: '600', color: '#333' }}>{eventLogoSize}</Text>
                  <TouchableOpacity onPress={() => setEventLogoSize(s => Math.min(100, s + 5))} style={styles.sizeBtn}><Text style={styles.sizeBtnText}>+</Text></TouchableOpacity>
                </View>
              ) : null}
              <TouchableOpacity style={styles.removeBtn} onPress={() => { setEventLogo(null); setEventLogoSize(40); }}>
                <Text style={styles.removeBtnText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Custom Fields */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#1E293B' }}>Custom Fields</Text>
            <TouchableOpacity style={styles.addBtn} onPress={handleAddField}>
              <Icon name="add" size={16} color="#38BDF8" />
              <Text style={styles.addBtnText}>Add</Text>
            </TouchableOpacity>
          </View>

          {customImages.map((img) => (
            <View key={img.id} style={styles.row}>
              <Text style={styles.label}>Custom Image</Text>
              <View style={styles.logoActions}>
                <View style={styles.logoPicker}>
                  <Image source={{ uri: img.uri }} style={{ width: '100%', height: '100%', borderRadius: 8 }} />
                </View>
                <View style={{ flexDirection: 'row', marginLeft: 15, alignItems: 'center' }}>
                  <TouchableOpacity onPress={() => updateCustomImageSize(img.id, -5)} style={styles.sizeBtn}><Text style={styles.sizeBtnText}>-</Text></TouchableOpacity>
                  <Text style={{ marginHorizontal: 8, fontSize: 16, fontWeight: '600', color: '#333' }}>{img.size}</Text>
                  <TouchableOpacity onPress={() => updateCustomImageSize(img.id, 5)} style={styles.sizeBtn}><Text style={styles.sizeBtnText}>+</Text></TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.removeBtn} onPress={() => removeCustomImage(img.id)}>
                  <Text style={styles.removeBtnText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {templateFields.map((field: any) => {
            const isExpanded = expandedField === field.name;
            const customStyle = fieldStyles[field.name] || { fontSize: field.fontSize || 16, fontWeight: field.fontWeight || 'normal', fontStyle: 'normal', color: field.color || '#808080', fontFamily: 'System' };
            const textColor = customStyle.color;

            return (
              <View key={field.name} style={styles.fieldGroup}>
                <View style={styles.row}>
                  <Text style={styles.label}>{field.label}</Text>
                  <View style={styles.inputWrapper}>
                    <Icon name="pencil" size={16} color="#666" style={{ marginRight: 8 }} />
                    <TextInput
                      style={styles.input}
                      value={data[field.name]}
                      onChangeText={(val) => handleUpdate(field.name, val)}
                    />
                  </View>
                  <TouchableOpacity onPress={() => handleDeleteField(field.name)} style={{ marginLeft: 8, padding: 4 }}>
                    <Icon name="trash-outline" size={20} color="#E51025" />
                  </TouchableOpacity>
                </View>

                {/* Expanded Settings Panel (Canva Style) */}
                <View style={styles.fontControls}>
                    {/* Font Style Row */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                      <Text style={{ color: '#666', fontSize: 13, fontWeight: '600' }}>Text Style</Text>
                      <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => updateFieldStyle(field.name, 'fontWeight', customStyle.fontWeight === 'bold' ? 'normal' : 'bold')} style={[styles.styleBtn, customStyle.fontWeight === 'bold' && styles.styleBtnActive]}>
                          <Text style={[styles.styleBtnText, customStyle.fontWeight === 'bold' && styles.styleBtnTextActive, { fontWeight: 'bold' }]}>B</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => updateFieldStyle(field.name, 'fontWeight', customStyle.fontWeight === '900' ? 'normal' : '900')} style={[styles.styleBtn, customStyle.fontWeight === '900' && styles.styleBtnActive]}>
                          <Text style={[styles.styleBtnText, customStyle.fontWeight === '900' && styles.styleBtnTextActive, { fontWeight: '900' }]}>XB</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => updateFieldStyle(field.name, 'fontStyle', customStyle.fontStyle === 'italic' ? 'normal' : 'italic')} style={[styles.styleBtn, customStyle.fontStyle === 'italic' && styles.styleBtnActive]}>
                          <Text style={[styles.styleBtnText, customStyle.fontStyle === 'italic' && styles.styleBtnTextActive, { fontStyle: 'italic' }]}>I</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Font Family Selection */}
                    <View style={{ marginBottom: 16 }}>
                      <Text style={{ color: '#666', marginBottom: 8, fontSize: 13, fontWeight: '600' }}>Font</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {FONTS.map(font => (
                          <TouchableOpacity
                            key={font}
                            style={[
                              styles.fontPill,
                              customStyle.fontFamily === font && styles.fontPillActive
                            ]}
                            onPress={() => updateFieldStyle(field.name, 'fontFamily', font)}
                          >
                            <Text style={[
                              styles.fontPillText,
                              { fontFamily: font === 'System' ? undefined : font },
                              customStyle.fontFamily === font && styles.fontPillTextActive
                            ]}>
                              {font === 'System' ? 'Default' : font}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>

                    {/* Size Row */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                      <Text style={{ color: '#666', marginRight: 15, fontSize: 13, fontWeight: '600' }}>Size</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => updateFieldStyle(field.name, 'fontSize', Math.max(10, (customStyle.fontSize || 16) - 2))} style={styles.sizeBtn}>
                          <Text style={styles.sizeBtnText}>-</Text>
                        </TouchableOpacity>
                        <Text style={{ marginHorizontal: 12, fontSize: 16, fontWeight: '600', color: '#333' }}>{customStyle.fontSize || 16}</Text>
                        <TouchableOpacity onPress={() => updateFieldStyle(field.name, 'fontSize', Math.min(72, (customStyle.fontSize || 16) + 2))} style={styles.sizeBtn}>
                          <Text style={styles.sizeBtnText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Color Row */}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{ color: '#666', marginRight: 10, fontSize: 12 }}>Color</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center' }}>
                        {PRESET_COLORS.map(color => (
                          <TouchableOpacity
                            key={color}
                            style={[styles.colorCircle, { backgroundColor: color }, textColor === color && styles.colorCircleActive]}
                            onPress={() => updateFieldStyle(field.name, 'color', color)}
                          >
                            {textColor === color && <Icon name="checkmark" size={14} color={color === '#FFFFFF' ? '#000' : '#FFF'} />}
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  </View>
              </View>
            );
          })}

          {/* Social Medias */}
          <View style={styles.socialCard}>
            <View style={styles.socialHeader}>
              <Text style={styles.socialTitle}>Social Handles</Text>
              <TouchableOpacity style={styles.addBtn} onPress={handleAddCustomSocial}>
                <Icon name="add" size={16} color="#38BDF8" />
                <Text style={styles.addBtnText}>Add</Text>
              </TouchableOpacity>
            </View>

            {/* Controls for Socials */}
            <View style={{ marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <Text style={{ color: '#666', marginRight: 15, fontSize: 13, fontWeight: '600', width: 40 }}>Size</Text>
                <TouchableOpacity onPress={() => setSocialSize(s => Math.max(8, s - 2))} style={styles.sizeBtn}>
                  <Text style={styles.sizeBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={{ marginHorizontal: 12, fontSize: 16, fontWeight: '600', color: '#333' }}>{socialSize}</Text>
                <TouchableOpacity onPress={() => setSocialSize(s => Math.min(48, s + 2))} style={styles.sizeBtn}>
                  <Text style={styles.sizeBtnText}>+</Text>
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: '#666', marginRight: 15, fontSize: 13, fontWeight: '600', width: 40 }}>Color</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center' }}>
                  {PRESET_COLORS.map(color => (
                    <TouchableOpacity
                      key={color}
                      style={[styles.colorCircle, { backgroundColor: color }, socialColor === color && styles.colorCircleActive]}
                      onPress={() => setSocialColor(color)}
                    >
                      {socialColor === color ? <Icon name="checkmark" size={14} color={color === '#FFFFFF' ? '#000' : '#FFF'} /> : null}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={styles.socialRow}>
              <View style={[styles.socialPlatformBtn, { backgroundColor: '#E1306C' }]}>
                <Icon name="logo-instagram" size={20} color="#FFF" />
              </View>
              <TextInput
                style={styles.socialInput}
                placeholder="@username"
                placeholderTextColor="#64748B"
                value={socials.instagram}
                onChangeText={(val) => handleSocialUpdate('instagram', val)}
              />
            </View>

            <View style={styles.socialRow}>
              <View style={[styles.socialPlatformBtn, { backgroundColor: '#FF0000' }]}>
                <Icon name="logo-youtube" size={20} color="#FFF" />
              </View>
              <TextInput
                style={styles.socialInput}
                placeholder="Channel Name"
                placeholderTextColor="#64748B"
                value={socials.youtube}
                onChangeText={(val) => handleSocialUpdate('youtube', val)}
              />
            </View>

            <View style={styles.socialRow}>
              <View style={[styles.socialPlatformBtn, { backgroundColor: '#5865F2' }]}>
                <Icon name="logo-discord" size={20} color="#FFF" />
              </View>
              <TextInput
                style={styles.socialInput}
                placeholder="Discord Server"
                placeholderTextColor="#64748B"
                value={socials.discord}
                onChangeText={(val) => handleSocialUpdate('discord', val)}
              />
            </View>

            {customSocials.map(social => (
              <View key={social.id} style={styles.socialRow}>
                <View style={[styles.socialPlatformBtn, { backgroundColor: '#334155' }]}>
                  <Icon name="link" size={20} color="#FFF" />
                </View>
                <TextInput
                  style={[styles.socialInput, { flex: 0.8, borderTopRightRadius: 0, borderBottomRightRadius: 0, borderRightWidth: 1, borderRightColor: '#E2E8F0' }]}
                  placeholder="Platform"
                  placeholderTextColor="#64748B"
                  value={social.name}
                  onChangeText={(val) => handleCustomSocialUpdate(social.id, 'name', val)}
                />
                <TextInput
                  style={[styles.socialInput, { flex: 1.2, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderTopRightRadius: 0, borderBottomRightRadius: 0 }]}
                  placeholder="Username / Link"
                  placeholderTextColor="#64748B"
                  value={social.value}
                  onChangeText={(val) => handleCustomSocialUpdate(social.id, 'value', val)}
                />
                <TouchableOpacity onPress={() => handleRemoveCustomSocial(social.id)} style={{ backgroundColor: '#FFFFFF', borderTopRightRadius: 12, borderBottomRightRadius: 12, justifyContent: 'center', paddingHorizontal: 12 }}>
                  <Icon name="trash-outline" size={20} color="#E51025" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.nextBtn, { flex: 1 }]} onPress={handleNext}>
              <Text style={styles.nextBtnText}>Continue</Text>
              <Icon name="arrow-forward" size={20} color="#FFF" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAwareScrollView>

      {/* Choose Type Modal */}
      <Modal
        visible={isAddTypeModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsAddTypeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Field Type</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalBtnCancel, { marginRight: 8 }]} onPress={() => handleChooseType('text')}>
                <Text style={styles.modalBtnCancelText}>Text Field</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtnCancel, { marginLeft: 8, marginRight: 0 }]} onPress={() => handleChooseType('image')}>
                <Text style={styles.modalBtnCancelText}>Image Field</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Field Modal */}
      <Modal
        visible={isAddFieldModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsAddFieldModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Custom Field</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter field name (e.g. Prize Pool)"
              placeholderTextColor="#999"
              value={newFieldLabel}
              onChangeText={setNewFieldLabel}
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setIsAddFieldModalVisible(false)}>
                <Text style={styles.modalBtnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnAdd} onPress={confirmAddField}>
                <Text style={styles.modalBtnAddText}>Add Field</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#E51025',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  previewWrapper: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  dragHint: {
    color: '#38BDF8', // Tailwind light blue
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 15,
    letterSpacing: 0.3,
  },
  canvasShadow: {
    width: '100%',
    aspectRatio: 1,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    borderRadius: 16,
  },
  viewShot: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  flyerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },
  formContainer: {
    padding: 24,
    backgroundColor: '#FFFFFF', // Changed to White
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  label: {
    flex: 1,
    color: '#333333', // Dark gray
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  logoActions: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center'
  },
  logoPicker: {
    width: 64,
    height: 64,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155'
  },
  removeBtn: {
    marginLeft: 'auto',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  removeBtnText: {
    color: '#E51025', // Red 500
    fontWeight: '700',
    fontSize: 13,
  },
  fieldGroup: {
    marginBottom: 24,
  },
  inputWrapper: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  expandBtn: {
    width: 52,
    height: 52,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  fontControls: {
    flexDirection: 'column',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 16,
    marginTop: -8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  fontPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  fontPillActive: {
    backgroundColor: '#333333',
    borderColor: '#333333',
  },
  fontPillText: {
    color: '#64748B',
    fontSize: 14,
  },
  fontPillTextActive: {
    color: '#FFFFFF',
  },
  smallBtn: {
    backgroundColor: '#334155',
    padding: 6,
    borderRadius: 6,
  },
  styleBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  styleBtnActive: {
    backgroundColor: '#E51025',
    borderColor: '#E51025',
  },
  styleBtnText: {
    color: '#64748B',
  },
  styleBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  sizeBtn: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#E2E8F0', borderRadius: 8, marginRight: 8 },
  sizeBtnActive: { backgroundColor: '#E51025' },
  sizeBtnText: { color: '#333', fontSize: 14, fontWeight: '600' },
  sizeBtnTextActive: { color: '#FFF' },
  colorCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorCircleActive: {
    borderWidth: 2,
    borderColor: '#38BDF8',
    transform: [{ scale: 1.1 }],
  },
  socialCard: {
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  socialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  socialTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
    letterSpacing: 0.3,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addBtnText: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 4,
  },
  socialRow: {
    flexDirection: 'row',
    marginBottom: 12,
    height: 52,
  },
  socialPlatformBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  socialInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#333333',
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  shareBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E293B',
    height: 56,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  shareBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  saveImgBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)', // Emerald tint
    borderWidth: 1,
    borderColor: '#10B981',
    height: 56,
    borderRadius: 16,
    marginLeft: 8,
  },
  saveImgBtnText: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  },
  nextBtn: {
    flexDirection: 'row',
    width: '100%',
    height: 60,
    backgroundColor: colors.primary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  nextBtnText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  modalInput: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalBtnCancel: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    marginRight: 8,
  },
  modalBtnCancelText: {
    color: '#4B5563',
    fontSize: 16,
    fontWeight: '600',
  },
  modalBtnAdd: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    marginLeft: 8,
  },
  modalBtnAddText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  }
});

export default TournamentFlyerEditScreen;




