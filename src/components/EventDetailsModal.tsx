import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import SafeImagePicker from '../utils/SafeImagePicker';

export interface EventDetailsData {
  eventLogo: string | null;
  eventName: string;
  organiserName: string;
  subName: string;
  socials: {
    instagram: string;
    youtube: string;
    discord: string;
    website?: string;
    [key: string]: string | undefined;
  };
}

interface EventDetailsModalProps {
  visible: boolean;
  initialData?: Partial<EventDetailsData>;
  onClose: () => void;
  onUpdate: (data: EventDetailsData) => void;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  visible,
  initialData,
  onClose,
  onUpdate
}) => {
  const [eventLogo, setEventLogo] = useState<string | null>(initialData?.eventLogo || null);
  const [eventName, setEventName] = useState(initialData?.eventName || '');
  const [organiserName, setOrganiserName] = useState(initialData?.organiserName || '');
  const [subName, setSubName] = useState(initialData?.subName || '');
  const [socials, setSocials] = useState({
    instagram: initialData?.socials?.instagram || '',
    youtube: initialData?.socials?.youtube || '',
    discord: initialData?.socials?.discord || '',
    website: initialData?.socials?.website || '',
  });

  const [activeSocialPlatforms, setActiveSocialPlatforms] = useState<string[]>([
    'instagram',
    'youtube',
    'discord',
    ...(initialData?.socials?.website ? ['website'] : [])
  ]);

  useEffect(() => {
    if (visible) {
      setEventLogo(initialData?.eventLogo || null);
      setEventName(initialData?.eventName || '');
      setOrganiserName(initialData?.organiserName || '');
      setSubName(initialData?.subName || '');
      setSocials({
        instagram: initialData?.socials?.instagram || '',
        youtube: initialData?.socials?.youtube || '',
        discord: initialData?.socials?.discord || '',
        website: initialData?.socials?.website || '',
      });
      const platforms = ['instagram', 'youtube', 'discord'];
      if (initialData?.socials?.website) {
        platforms.push('website');
      }
      setActiveSocialPlatforms(platforms);
    }
  }, [visible, initialData]);

  const handlePickLogo = () => {
    SafeImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      cropperCircleOverlay: true,
    })
      .then(image => {
        if (image && image.path) {
          setEventLogo(image.path);
        }
      })
      .catch(err => {
        console.log('SafeImagePicker cancelled or error:', err);
      });
  };

  const handleRemoveLogo = () => {
    setEventLogo(null);
  };

  const handleSocialChange = (platform: string, value: string) => {
    setSocials(prev => ({
      ...prev,
      [platform]: value
    }));
  };

  const handleAddNewSocial = () => {
    if (!activeSocialPlatforms.includes('website')) {
      setActiveSocialPlatforms(prev => [...prev, 'website']);
    } else {
      Alert.alert('Notice', 'All primary social platforms (Instagram, YouTube, Discord, Website) are already active.');
    }
  };

  const handleSave = () => {
    const updatedData: EventDetailsData = {
      eventLogo,
      eventName: eventName.trim(),
      organiserName: organiserName.trim(),
      subName: subName.trim(),
      socials
    };
    onUpdate(updatedData);
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
            <Text style={styles.title}>Event details</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Icon name="close" size={22} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Event Logo */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Event logo</Text>
              <View style={styles.logoRow}>
                <TouchableOpacity
                  style={styles.logoBox}
                  activeOpacity={0.8}
                  onPress={handlePickLogo}
                >
                  {eventLogo ? (
                    <Image source={{ uri: eventLogo }} style={styles.logoImage} />
                  ) : (
                    <View style={styles.logoPlaceholder}>
                      <Icon name="image-outline" size={24} color="#9CA3AF" />
                      <Text style={styles.logoPlaceholderText}>Upload</Text>
                    </View>
                  )}
                </TouchableOpacity>

                {eventLogo ? (
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={handleRemoveLogo}
                    activeOpacity={0.8}
                  >
                    <Icon name="trash-outline" size={14} color="#EF4444" style={{ marginRight: 4 }} />
                    <Text style={styles.removeBtnText}>Remove</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.removeBtn, { backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB' }]}
                    onPress={handlePickLogo}
                    activeOpacity={0.8}
                  >
                    <Icon name="cloud-upload-outline" size={14} color="#374151" style={{ marginRight: 4 }} />
                    <Text style={[styles.removeBtnText, { color: '#374151' }]}>Upload Logo</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Event Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Event Name</Text>
              <View style={styles.inputRow}>
                <Icon name="pencil" size={16} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="STG op"
                  placeholderTextColor="#9CA3AF"
                  value={eventName}
                  onChangeText={setEventName}
                />
              </View>
            </View>

            {/* Organiser Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Organiser Name</Text>
              <View style={styles.inputRow}>
                <Icon name="pencil" size={16} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="STG ESPORTS"
                  placeholderTextColor="#9CA3AF"
                  value={organiserName}
                  onChangeText={setOrganiserName}
                />
              </View>
            </View>

            {/* Sub Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Sub Name</Text>
              <View style={styles.inputRow}>
                <Icon name="pencil" size={16} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="GROUP 1"
                  placeholderTextColor="#9CA3AF"
                  value={subName}
                  onChangeText={setSubName}
                />
              </View>
            </View>

            {/* Social Medias */}
            <View style={styles.inputGroup}>
              <View style={styles.socialHeaderRow}>
                <Text style={styles.label}>Social Medias</Text>
                <TouchableOpacity onPress={handleAddNewSocial}>
                  <Text style={styles.addNewText}>Add new</Text>
                </TouchableOpacity>
              </View>

              {/* Instagram */}
              {activeSocialPlatforms.includes('instagram') && (
                <View style={styles.socialInputRow}>
                  <View style={styles.socialDropdownBtn}>
                    <Icon name="logo-instagram" size={18} color="#E1306C" />
                    <Icon name="chevron-down" size={12} color="#6B7280" style={{ marginLeft: 6 }} />
                  </View>
                  <TextInput
                    style={styles.socialTextInput}
                    placeholder="Instagram handle / @handle"
                    placeholderTextColor="#9CA3AF"
                    value={socials.instagram}
                    onChangeText={val => handleSocialChange('instagram', val)}
                  />
                </View>
              )}

              {/* YouTube */}
              {activeSocialPlatforms.includes('youtube') && (
                <View style={styles.socialInputRow}>
                  <View style={styles.socialDropdownBtn}>
                    <Icon name="logo-youtube" size={18} color="#FF0000" />
                    <Icon name="chevron-down" size={12} color="#6B7280" style={{ marginLeft: 6 }} />
                  </View>
                  <TextInput
                    style={styles.socialTextInput}
                    placeholder="YouTube channel name"
                    placeholderTextColor="#9CA3AF"
                    value={socials.youtube}
                    onChangeText={val => handleSocialChange('youtube', val)}
                  />
                </View>
              )}

              {/* Discord */}
              {activeSocialPlatforms.includes('discord') && (
                <View style={styles.socialInputRow}>
                  <View style={styles.socialDropdownBtn}>
                    <Icon name="logo-discord" size={18} color="#5865F2" />
                    <Icon name="chevron-down" size={12} color="#6B7280" style={{ marginLeft: 6 }} />
                  </View>
                  <TextInput
                    style={styles.socialTextInput}
                    placeholder="Discord server link"
                    placeholderTextColor="#9CA3AF"
                    value={socials.discord}
                    onChangeText={val => handleSocialChange('discord', val)}
                  />
                </View>
              )}

              {/* Website */}
              {activeSocialPlatforms.includes('website') && (
                <View style={styles.socialInputRow}>
                  <View style={styles.socialDropdownBtn}>
                    <Icon name="globe-outline" size={18} color="#10B981" />
                    <Icon name="chevron-down" size={12} color="#6B7280" style={{ marginLeft: 6 }} />
                  </View>
                  <TextInput
                    style={styles.socialTextInput}
                    placeholder="Website URL (e.g. stgesports.in)"
                    placeholderTextColor="#9CA3AF"
                    value={socials.website}
                    onChangeText={val => handleSocialChange('website', val)}
                  />
                </View>
              )}
            </View>

            {/* Bottom Spacing */}
            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Update Button */}
          <View style={styles.footerContainer}>
            <TouchableOpacity
              style={styles.updateButton}
              activeOpacity={0.85}
              onPress={handleSave}
            >
              <Text style={styles.updateButtonText}>Update</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  pillContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  dragPill: {
    width: 44,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#D1D5DB',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBox: {
    width: 60,
    height: 60,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  logoPlaceholder: {
    alignItems: 'center',
  },
  logoPlaceholderText: {
    fontSize: 9,
    color: '#9CA3AF',
    fontWeight: '600',
    marginTop: 2,
  },
  removeBtn: {
    backgroundColor: '#1E293B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    marginLeft: 16,
  },
  removeBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    paddingVertical: Platform.OS === 'ios' ? 12 : 9,
  },
  socialHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addNewText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B57EDC',
  },
  socialInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  socialDropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    marginRight: 10,
    paddingVertical: 8,
  },
  socialTextInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
  },
  footerContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  updateButton: {
    backgroundColor: '#B57EDC',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#B57EDC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

export default EventDetailsModal;
