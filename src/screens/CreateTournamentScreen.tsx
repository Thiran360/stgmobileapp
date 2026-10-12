import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal, Image, Alert, Platform, Animated, StatusBar, KeyboardAvoidingView } from 'react-native';
import Share from 'react-native-share';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../theme/colors';
import { AppContext } from '../context/AppContext';
import { Calendar } from 'react-native-calendars';
import WizardProgressIndicator from '../components/WizardProgressIndicator';

const TOURNAMENT_TYPES = ['Solo', 'Duo', 'Squad'];
const MAPS = ['Erangel', 'Miramar', 'Sanhok', 'Vikendi'];
const ROADMAPS = ['Tournament Roadmap'];

const CustomDay = React.memo(({ date, state, marking, onPress }: any) => {
  const isSelected = marking?.selected;
  const isReg = marking?.isReg;
  const stageTitle = marking?.stageTitle;
  const stageIndex = marking?.stageIndex ?? 0;
  const isMatch = stageTitle === 'Match';

  const stageColors = [
    { main: '#8B5CF6', pillBg: '#EDE9FE', pillText: '#6D28D9' }, // Purple
    { main: '#10B981', pillBg: '#D1FAE5', pillText: '#047857' }, // Emerald
    { main: '#EC4899', pillBg: '#FCE7F3', pillText: '#BE185D' }, // Pink
    { main: '#06B6D4', pillBg: '#CFFAFE', pillText: '#0E7490' }, // Cyan
  ];

  let colorSet = stageColors[stageIndex % stageColors.length];
  if (stageTitle) {
    const lowerTitle = stageTitle.toLowerCase();
    if (lowerTitle.includes('grand finals') || lowerTitle.includes('final')) {
      colorSet = { main: '#E51025', pillBg: '#FEE2E2', pillText: '#B91C1C' }; // Red
    } else if (lowerTitle.includes('semi')) {
      colorSet = { main: '#F97316', pillBg: '#FFEDD5', pillText: '#C2410C' }; // Orange
    } else if (lowerTitle.includes('round') || lowerTitle.includes('qualifier')) {
      colorSet = { main: '#E51025', pillBg: '#DBEAFE', pillText: '#B91C1C' }; // Blue
    }
  }

  let bgColor = 'transparent';
  let textColor = state === 'disabled' ? '#CBD5E1' : colors.textBlack;
  let shadowColor = 'transparent';

  if (isSelected) {
    if (isMatch) {
      bgColor = '#E51025';
      shadowColor = '#E51025';
    } else {
      bgColor = colorSet.main;
      shadowColor = colorSet.main;
    }
    textColor = '#FFF';
  } else if (isReg) {
    bgColor = 'rgba(245, 158, 11, 0.15)';
    textColor = '#D97706';
  }

  const scale = useRef(new Animated.Value(isSelected ? 1.15 : 1)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 350,
      delay: Math.random() * 150,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    Animated.spring(scale, {
      toValue: isSelected ? 1.15 : 1,
      friction: 5,
      tension: 120,
      useNativeDriver: true,
    }).start();
  }, [isSelected]);

  return (
    <TouchableOpacity onPress={() => { if (onPress) onPress(date); }} activeOpacity={0.7} style={{ alignItems: 'center', justifyContent: 'center', height: 42, width: 42 }}>
      <Animated.View style={[
        { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', opacity, backgroundColor: bgColor },
        isSelected ? { shadowColor, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 5 } : {},
        { transform: [{ scale }] }
      ]}>
        <Text style={[{ fontSize: 14, includeFontPadding: false, textAlignVertical: 'center', textAlign: 'center', color: textColor }, isSelected && { fontWeight: 'bold' }]}>
          {date?.day}
        </Text>
      </Animated.View>
      {stageTitle && !isMatch ? (
        <View style={{ position: 'absolute', bottom: -14, backgroundColor: colorSet.pillBg, paddingHorizontal: 2, paddingVertical: 1, borderRadius: 4, zIndex: 10, shadowColor: colorSet.main, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1, elevation: 2, width: 44, alignSelf: 'center' }}>
          <Text adjustsFontSizeToFit numberOfLines={2} style={{ fontSize: 6, lineHeight: 7, color: colorSet.pillText, fontWeight: '900', textAlign: 'center', textTransform: 'uppercase' }}>
            {stageTitle.replace(' ', '\n')}
          </Text>
        </View>
      ) : isMatch ? (
        <View style={{ position: 'absolute', bottom: -12, backgroundColor: '#FEE2E2', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4, zIndex: 10, shadowColor: '#E51025', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1, elevation: 2, alignSelf: 'center' }}>
          <Text style={{ fontSize: 7, color: '#B91C1C', fontWeight: '900', textAlign: 'center', textTransform: 'uppercase' }}>MATCH</Text>
        </View>
      ) : isReg && !isSelected ? (
        <View style={{ position: 'absolute', bottom: -10, backgroundColor: '#FEF3C7', paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4, zIndex: 10, alignSelf: 'center' }}>
          <Text style={{ fontSize: 7, color: '#B45309', fontWeight: '900', textTransform: 'uppercase' }}>REG</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  return prevProps.state === nextProps.state && 
         prevProps.marking?.selected === nextProps.marking?.selected &&
         prevProps.marking?.isReg === nextProps.marking?.isReg &&
         prevProps.marking?.stageTitle === nextProps.marking?.stageTitle &&
         prevProps.date?.dateString === nextProps.date?.dateString;
});

const parseToYYYYMMDD = (dateStr: string) => {
  if (!dateStr) return null;
  const parts = dateStr.split(' ');
  if (parts.length !== 3) return null;
  const day = parts[0].padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = (months.indexOf(parts[1]) + 1).toString().padStart(2, '0');
  const year = parts[2];
  return `${year}-${month}-${day}`;
};

const formatYYYYMMDD = (dateStr: string) => {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const year = parts[0];
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${day} ${months[month]} ${year}`;
};



const PointRow = ({ label, value, onChange, placeholder }: any) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
      {label ? (
        <View style={{ backgroundColor: '#E51025', paddingVertical: 10, paddingHorizontal: 10, borderRadius: 10, width: 50, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 }}>{label}</Text>
        </View>
      ) : null}
      <TextInput 
        style={[{ flex: 1, color: '#111827', backgroundColor: '#F9FAFB', borderRadius: 15, borderWidth: 1, borderColor: '#F3F4F6', paddingHorizontal: 20, paddingVertical: 14, fontSize: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 }, !label && { marginLeft: 0 }, label && { marginLeft: 15 }]} 
        value={String(value)} 
        placeholder={placeholder}
        placeholderTextColor="#757575" 
        onChangeText={(text) => {
          if (text === '') onChange('');
          else {
             const num = parseInt(text);
             if (!isNaN(num)) onChange(num);
          }
        }}
        keyboardType="numeric" 
      />
    </View>
  );
};

const CreateTournamentScreen = ({ route, navigation }: any) => {
  const { isEdit, tournament } = route?.params || {};
  const { addMultipleChats } = useContext(AppContext);
  const [killsPoint, setKillsPoint] = useState<number | string>(1);
  const [positions, setPositions] = useState<{label: string, value: number | string}[]>(
    Array.from({ length: 25 }, (_, i) => {
      const pos = i + 1;
      let val: number | string = 0;
      if (pos === 1) val = 10;
      else if (pos === 2) val = 6;
      else if (pos === 3) val = 5;
      else if (pos === 4) val = 4;
      else if (pos === 5) val = 3;
      else if (pos === 6) val = 2;
      else if (pos <= 8) val = 1;
      return { label: `#${pos}`, value: val };
    })
  );
  const [isPointModalVisible, setIsPointModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [tournamentName, setTournamentName] = useState('');
  const [organiserName, setOrganiserName] = useState('');
  const [sponsorName, setSponsorName] = useState('');
  const [manageBy, setManageBy] = useState('');
  const [socialMedia1, setSocialMedia1] = useState('');
  const [socialMedia2, setSocialMedia2] = useState('');
  const [socialMedia3, setSocialMedia3] = useState('');
  const [socialMedia4, setSocialMedia4] = useState('');
  const [prizePool, setPrizePool] = useState('');
  const [totalSlots, setTotalSlots] = useState('');
  const [teamsPerGroup, setTeamsPerGroup] = useState('26');
  const [numberOfGroups, setNumberOfGroups] = useState('');
  const [groupsGenerated, setGroupsGenerated] = useState(false);
  const [regStartDate, setRegStartDate] = useState('');
  const [regEndDate, setRegEndDate] = useState('');
  const [matchDatesObj, setMatchDatesObj] = useState<any>({});
  const [matchTime, setMatchTime] = useState('');
  const [stages, setStages] = useState([
    { title: 'Qualifier', date: '' },   
    { title: 'Semi final', date: '' },
    { title: 'Finals', date: '' },
    { title: 'Grand final', date: '' }
  ]);

  const calendarRef = useRef<any>(null);

  const handleDownloadCalendar = async () => {
    try {
      if (calendarRef.current) {
        const uri = await calendarRef.current.capture();
        await Share.open({ url: uri, title: 'Tournament Calendar' });
      }
    } catch (err) {
      console.log('Error sharing calendar', err);
    }
  };

  const [maxTeams, setMaxTeams] = useState('');
  const [rules, setRules] = useState('');
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [roadmap, setRoadmap] = useState(ROADMAPS[0]);

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [calendarModalConfig, setCalendarModalConfig] = useState<{ visible: boolean, type: 'match' | 'stage', stageIndex?: number }>({ visible: false, type: 'match' });
  const [editingStageIndex, setEditingStageIndex] = useState<number | null>(null);

  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [currentDateField, setCurrentDateField] = useState<string | null>(null);
  const roadmapInputRefs = useRef<Array<TextInput | null>>([]);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (event.type === 'dismissed') {
      setShowPicker(false);
      return;
    }
    if (selectedDate && currentDateField) {
      if (pickerMode === 'date') {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const formattedDate = `${selectedDate.getDate()} ${months[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
        if (currentDateField === 'regStartDate') setRegStartDate(formattedDate);
        if (currentDateField === 'regEndDate') setRegEndDate(formattedDate);
      } else if (pickerMode === 'time') {
        let hours = selectedDate.getHours();
        const minutes = selectedDate.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const strMinutes = minutes < 10 ? '0' + minutes : minutes;
        const formattedTime = hours + ':' + strMinutes + ' ' + ampm;
        if (currentDateField === 'matchTime') setMatchTime(formattedTime);
      }
    }
  };

  const openPicker = (field: string, mode: 'date' | 'time') => {
    setCurrentDateField(field);
    setPickerMode(mode);
    setShowPicker(true);
  };

  const handleGenerateGroups = () => {
    const num = parseInt(numberOfGroups);
    if (!isNaN(num) && num > 0) {
      const newChats = [];
      for (let i = 1; i <= num; i++) {
        newChats.push({
          id: Date.now().toString() + i,
          name: `Group ${i}`,
          lastMessage: `Welcome to Group ${i}!`,
          time: 'Just now',
          unread: 0,
          isGroup: true
        });
      }
      addMultipleChats(newChats);
      setGroupsGenerated(true);
      Alert.alert('Success', `${num} groups created successfully!`);
    }
  };

  const getPickerValue = () => {
    if (pickerMode === 'time' && currentDateField === 'matchTime' && matchTime) {
      try {
        const [time, ampm] = matchTime.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (ampm === 'PM' && hours < 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;
        const d = new Date();
        d.setHours(hours, minutes, 0, 0);
        return d;
      } catch (e) { return new Date(); }
    }
    if (pickerMode === 'date') {
      let dateStr = null;
      if (currentDateField === 'regStartDate' && regStartDate) dateStr = regStartDate;
      else if (currentDateField === 'regEndDate' && regEndDate) dateStr = regEndDate;

      if (dateStr) {
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) return d;
      }
    }
    return new Date();
  };

  const handleImagePick = async () => {
    try {
      const image = await ImagePicker.openPicker({
        cropping: true,
        mediaType: 'photo',
        freeStyleCropEnabled: true,
      });
      if (image && image.path) {
        setBannerImage(image.path);
      }
    } catch (error: any) {
      if (error.message !== 'User cancelled image selection') {
        console.error(error);
        Alert.alert('Error', 'Something went wrong');
      }
    }
  };
  const { draftTournament, setDraftTournament, updateTournament } = React.useContext(AppContext);
  useEffect(() => {


    if (isEdit && tournament) {
      setTournamentName(tournament.name || '');
      setOrganiserName(tournament.organiserName || '');
      setPrizePool(tournament.prize || '');
      setTotalSlots(tournament.teamsLimit || '');
      setTeamsPerGroup(tournament.teamsPerGroup || '26');
      setNumberOfGroups(tournament.numberOfGroups || '');
      setBannerImage(tournament.bannerImage || null);
      if (tournament.roadmap) setRoadmap(tournament.roadmap);
      if (tournament.regStartDate) setRegStartDate(tournament.regStartDate);
      if (tournament.regEndDate) setRegEndDate(tournament.regEndDate);
      if (tournament.matchDatesObj) setMatchDatesObj(tournament.matchDatesObj);
      if (tournament.stages) setStages(tournament.stages);
    }
  }, [isEdit, tournament]);

  useEffect(() => {
    const slots = parseInt(totalSlots);
    const perGroup = parseInt(teamsPerGroup);
    if (!isNaN(slots) && !isNaN(perGroup) && perGroup > 0) {
      setNumberOfGroups(Math.ceil(slots / perGroup).toString());
    } else {
      setNumberOfGroups('');
    }
  }, [totalSlots, teamsPerGroup]);

  const getMatchDateRange = () => {
    const keys = Object.keys(matchDatesObj);
    if (keys.length === 0) return '';
    keys.sort();
    if (keys.length === 1) return `${formatYYYYMMDD(keys[0])} ${matchTime}`.trim();
    return `${formatYYYYMMDD(keys[0])} - ${formatYYYYMMDD(keys[keys.length - 1])} ${matchTime}`.trim();
  };

  const handleCreate = () => {
    const formatYYYYMMDDLocal = (ds) => {
      if (!ds) return "";
      const d = new Date(ds);
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    };

    const finalStages = stages.map((UPMI, idx) => {
      const datesForStage = Object.keys(matchDatesObj).filter(k => matchDatesObj[k].stageIndex === idx).sort();
      let dateStr = UPMI.date || "";
      if (datesForStage.length === 1) {
        dateStr = formatYYYYMMDDLocal(datesForStage[0]);
      } else if (datesForStage.length > 1) {
        dateStr = `${formatYYYYMMDDLocal(datesForStage[0])} - ${formatYYYYMMDDLocal(datesForStage[datesForStage.length - 1])}`;
      }
      return { ...UPMI, date: dateStr };
    });
    if (currentStep === 1) {
      if (!tournamentName.trim()) {
        Alert.alert('Error', 'Tournament Name is required.');
        return;
      }
      setCurrentStep(2);
      return;
    }

    if (isEdit && tournament) {
      setDraftTournament({
        ...tournament,
        name: tournamentName,
        organiserName,
        sponsorName,
        manageBy,
        socialMedia: [socialMedia1, socialMedia2, socialMedia3, socialMedia4],
        prize: prizePool,
        teamsLimit: totalSlots,
        totalSlots: totalSlots,
        teamsPerGroup,
        numberOfGroups,
        roadmap,
        time: regStartDate ? `Starts ${regStartDate}` : tournament.time,
        matchDate: getMatchDateRange() || tournament.matchDate,
        matchDatesObj,
        stages: finalStages,
        regStartDate,
        regEndDate,
        bannerImage,
        isEdit: true,
        killsPoint: String(killsPoint),
        positions: positions,
        rules: rules
      });
      navigation.navigate('TournamentFlyers', { isEdit: true, ...route.params });
      return;
    }

    // Save to draft tournament context
    setDraftTournament({
      ...(draftTournament || {}),
      name: tournamentName,
      organiserName,
      sponsorName,
      manageBy,
      socialMedia: [socialMedia1, socialMedia2, socialMedia3, socialMedia4],
      game: 'Custom',
      prize: prizePool,
      teamsLimit: totalSlots,
      totalSlots: totalSlots,
      teamsPerGroup,
      numberOfGroups,
      roadmap,
      time: regStartDate ? `Starts ${regStartDate}` : 'Starts Soon',
      matchDate: getMatchDateRange(),
      matchDatesObj,
      stages: finalStages,
      regStartDate,
      regEndDate,
      bannerImage,
      killsPoint: String(killsPoint),
      positions: positions,
        rules: rules
    });

    Alert.alert('Success', 'Tournament Details Saved!');
    navigation.navigate('TournamentFlyers');
  };

  const renderDropdown = (label: string, value: string, modalKey: string) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setActiveModal(modalKey)}
      >
        <Text style={styles.dropdownText}>{value}</Text>
        <Icon name="chevron-down" size={20} color="#757575" />
      </TouchableOpacity>
    </View>
  );

  const renderModal = (modalKey: string, title: string, options: string[], currentValue: string, setter: (val: string) => void) => (
    <Modal
      visible={activeModal === modalKey}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setActiveModal(null)}
    >
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setActiveModal(null)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.modalOption}
              onPress={() => {
                setter(option);
                setActiveModal(null);
              }}
            >
              <Text style={[styles.modalOptionText, currentValue === option && { color: colors.primary, fontWeight: 'bold' }]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const getMarkedDates = () => {
    const marks: any = { ...matchDatesObj };
    const start = parseToYYYYMMDD(regStartDate);
    const end = parseToYYYYMMDD(regEndDate);

    if (start && end) {
      let curr = new Date(start);
      const endDate = new Date(end);
      while (curr <= endDate) {
        const dStr = curr.toISOString().split('T')[0];
        marks[dStr] = { ...marks[dStr], isReg: true };
        curr.setDate(curr.getDate() + 1);
      }
    } else if (start) {
      marks[start] = { ...marks[start], isReg: true };
    } else if (end) {
      marks[end] = { ...marks[end], isReg: true };
    }

    return marks;
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <SafeAreaView style={{ backgroundColor: colors.primary }} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.title}>{isEdit ? 'Edit Tournament' : 'Create Tournament'}</Text>
        </View>
      </SafeAreaView>

      <KeyboardAwareScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }} enableOnAndroid={true} extraScrollHeight={20} keyboardShouldPersistTaps="handled">
        {!isEdit && <WizardProgressIndicator currentStep={currentStep} />}

        {currentStep === 1 && (
          <>
            {/* Banner Image */}
        <TouchableOpacity style={styles.uploadSection} onPress={handleImagePick}>
          {bannerImage ? (
            <Image source={{ uri: bannerImage }} style={styles.bannerImage} />
          ) : (
            <View style={styles.uploadBox}>
              <Icon name="image-outline" size={40} color={colors.primary} />
              <Text style={styles.uploadText}>Upload Your Logo</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Basic Details */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Organiser Name</Text>
          <TextInput style={styles.input} placeholder="e.g. Esports Org" placeholderTextColor="#757575" value={organiserName} onChangeText={setOrganiserName} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tournament Name</Text>
          <TextInput style={styles.input} placeholder="e.g. Summer Showdown" placeholderTextColor="#757575" value={tournamentName} onChangeText={setTournamentName} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Sponsor Name</Text>
          <TextInput style={styles.input} placeholder="e.g. Red Bull" placeholderTextColor="#757575" value={sponsorName} onChangeText={setSponsorName} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Manage by</Text>
          <TextInput style={styles.input} placeholder="e.g. Event Manager Name" placeholderTextColor="#757575" value={manageBy} onChangeText={setManageBy} />
        </View>

        <Text style={[styles.label, { marginTop: 10 }]}>Social Media Links</Text>
        <View style={styles.inputGroup}>
          <TextInput style={styles.input} placeholder="Link 1 (e.g. Instagram URL)" placeholderTextColor="#757575" value={socialMedia1} onChangeText={setSocialMedia1} />
        </View>
        <View style={styles.inputGroup}>
          <TextInput style={styles.input} placeholder="Link 2 (e.g. YouTube URL)" placeholderTextColor="#757575" value={socialMedia2} onChangeText={setSocialMedia2} />
        </View>
        <View style={styles.inputGroup}>
          <TextInput style={styles.input} placeholder="Link 3 (e.g. Discord URL)" placeholderTextColor="#757575" value={socialMedia3} onChangeText={setSocialMedia3} />
        </View>
        <View style={styles.inputGroup}>
          <TextInput style={styles.input} placeholder="Link 4 (e.g. Twitter/WhatsApp URL)" placeholderTextColor="#757575" value={socialMedia4} onChangeText={setSocialMedia4} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Prize Pool</Text>
          <TextInput style={styles.input} placeholder="e.g. ?5000" placeholderTextColor="#757575" value={prizePool} onChangeText={setPrizePool} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Total Slots</Text>
          <TextInput style={styles.input} placeholder="e.g. 100" placeholderTextColor="#757575" value={totalSlots} onChangeText={setTotalSlots} keyboardType="numeric" />
        </View>

        {/* Dates & Times */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>Reg. Start Date</Text>
            <TouchableOpacity style={[styles.input, { justifyContent: 'center' }]} onPress={() => openPicker('regStartDate', 'date')}>
              <Text style={{ color: regStartDate ? colors.textBlack : '#757575', fontSize: 15 }}>{regStartDate || 'YYYY-MM-DD'}</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Reg. End Date</Text>
            <TouchableOpacity style={[styles.input, { justifyContent: 'center' }]} onPress={() => openPicker('regEndDate', 'date')}>
              <Text style={{ color: regEndDate ? colors.textBlack : '#757575', fontSize: 15 }}>{regEndDate || 'YYYY-MM-DD'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Match Time</Text>
          <TouchableOpacity style={[styles.input, { justifyContent: 'center' }]} onPress={() => openPicker('matchTime', 'time')}>
            <Text style={{ color: matchTime ? colors.textBlack : '#757575', fontSize: 15 }}>{matchTime || 'HH:MM AM/PM'}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: 'center' }}>
          <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, marginTop: 10 }}>
            <Text style={[styles.label, { marginBottom: 0 }]}>Tournament Roadmap (Rounds)</Text>
          </View>
          {stages.map((stage, index) => {
            const stageColors = [
              { main: '#8B5CF6', pillBg: '#EDE9FE', pillText: '#6D28D9' }, // Purple
              { main: '#E51025', pillBg: '#DBEAFE', pillText: '#B91C1C' }, // Blue
              { main: '#10B981', pillBg: '#D1FAE5', pillText: '#047857' }, // Emerald
              { main: '#EC4899', pillBg: '#FCE7F3', pillText: '#BE185D' }, // Pink
              { main: '#06B6D4', pillBg: '#CFFAFE', pillText: '#0E7490' }, // Cyan
              { main: '#84CC16', pillBg: '#ECFCCB', pillText: '#4D7C0F' }, // Lime
            ];
            let colorSet = stageColors[index % stageColors.length];
            if (stage.title) {
              const lowerTitle = stage.title.toLowerCase();
              if (lowerTitle.includes('grand finals') || lowerTitle.includes('final')) {
                colorSet = { main: '#E51025', pillBg: '#FEE2E2', pillText: '#B91C1C' }; // Red
              } else if (lowerTitle.includes('semi')) {
                colorSet = { main: '#F97316', pillBg: '#FFEDD5', pillText: '#C2410C' }; // Orange
              }
            }
            const dateCount = Object.values(matchDatesObj).filter((v: any) => v.stageIndex === index).length;

            return (
              <React.Fragment key={index}>
                <View style={{ backgroundColor: '#FFF', padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#CBD5E1', borderLeftWidth: 4, borderLeftColor: colorSet.main, alignItems: 'center', width: '100%', flexDirection: 'row' }}>
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 2 }}>
                      <TextInput
                        ref={(el) => { roadmapInputRefs.current[index] = el; }}
                        style={{ fontWeight: 'bold', fontSize: 15, color: editingStageIndex === index ? '#000' : '#333', padding: 0, paddingVertical: 0, margin: 0, includeFontPadding: false, textAlignVertical: 'center', textAlign: 'center', minWidth: 90, borderBottomWidth: 1, borderBottomColor: editingStageIndex === index ? '#E51025' : 'transparent' }}
                        value={stage.title}
                        editable={editingStageIndex === index}
                        onBlur={() => setEditingStageIndex(null)}
                        onSubmitEditing={() => setEditingStageIndex(null)}
                        onChangeText={(val) => {
                          const newStages = [...stages];
                          newStages[index].title = val;
                          setStages(newStages);

                          setMatchDatesObj((prev: any) => {
                            const updated = { ...prev };
                            Object.keys(updated).forEach(key => {
                              if (updated[key].stageIndex === index) {
                                updated[key].stageTitle = val;
                              }
                            });
                            return updated;
                          });
                        }}
                      />
                      <TouchableOpacity 
                        onPress={() => {
                          setEditingStageIndex(index);
                          setTimeout(() => roadmapInputRefs.current[index]?.focus(), 100);
                        }}
                        style={{
                          marginLeft: 8,
                          backgroundColor: '#F8FAFC',
                          width: 26,
                          height: 26,
                          borderRadius: 13,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderWidth: 1,
                          borderColor: '#E2E8F0',
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 1 },
                          shadowOpacity: 0.05,
                          shadowRadius: 2,
                          elevation: 1
                        }}
                      >
                        <Icon name="pencil" size={14} color="#E51025" />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => setCalendarModalConfig({ visible: true, type: 'stage', stageIndex: index })} style={{ marginTop: 6, backgroundColor: dateCount > 0 ? colorSet.pillBg : '#F1F5F9', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4 }}>
                      <Text style={{ fontSize: 11, color: dateCount > 0 ? colorSet.pillText : '#64748B', fontWeight: 'bold' }}>
                        {dateCount > 0 ? `${dateCount} Date(s)` : '??? Set Date(s)'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={() => {
                    const newStages = [...stages];
                    newStages.splice(index, 1);
                    setStages(newStages);
                  }} style={{ padding: 4 }}>
                    <Icon name="close-circle" size={20} color="#E51025" />
                  </TouchableOpacity>
                </View>
                <Icon name="arrow-down" size={16} color="#94A3B8" style={{ marginVertical: 4 }} />
              </React.Fragment>
            )
          })}

          <TouchableOpacity onPress={() => {
            setStages([...stages, { title: 'New Round', date: '' }]);
          }} style={{ marginBottom: 15, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, backgroundColor: '#E0F2FE', borderWidth: 1, borderColor: '#BAE6FD', flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="add" size={16} color="#0284C7" />
            <Text style={{ fontSize: 12, color: '#0284C7', fontWeight: 'bold', marginLeft: 4 }}>Add Round</Text>
          </TouchableOpacity>

          <Text style={{ fontWeight: 'bold', color: '#F59E0B' }}>?? Champion</Text>
        </View>


        <View style={styles.inputGroup}>
          <Text style={styles.label}>About the tournament</Text>
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            placeholder="Enter tournament details and rules..."
            placeholderTextColor="#757575"
            value={rules}
            onChangeText={setRules}
            multiline
          />
        </View>
        </>
        )}

        {currentStep === 2 && (
          <View style={{ flex: 1, paddingVertical: 20 }}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Total Slots</Text>
              <TextInput style={styles.input} placeholder="e.g. 100" placeholderTextColor="#757575" value={totalSlots} onChangeText={setTotalSlots} keyboardType="numeric" />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Teams per Group</Text>
              <TextInput style={styles.input} placeholder="e.g. 26" placeholderTextColor="#757575" value={teamsPerGroup} onChangeText={setTeamsPerGroup} keyboardType="numeric" />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Number of Groups</Text>
              <TextInput style={[styles.input, { backgroundColor: '#F3F4F6' }]} placeholder="Auto-calculated" placeholderTextColor="#757575" value={numberOfGroups} editable={false} />
            </View>
            
            {numberOfGroups !== '' && parseInt(numberOfGroups) > 0 && (
              <TouchableOpacity 
                style={{ backgroundColor: groupsGenerated ? '#10B981' : '#F59E0B', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 20 }}
                onPress={handleGenerateGroups}
                disabled={groupsGenerated}
              >
                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>
                  {groupsGenerated ? `${numberOfGroups} Groups Created!` : `Click OK to create ${numberOfGroups} groups instantly`}
                </Text>
              </TouchableOpacity>
            )}

            {/* --- Point System UI --- */}
            <View style={{ marginBottom: 20, marginTop: 10 }}>
              <Text style={styles.label}>Configure Point System</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F9FAFB', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' }}>
                <View>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111827' }}>Point System</Text>
                  <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>{positions.length} Positions Configured</Text>
                </View>
                <TouchableOpacity onPress={() => setIsPointModalVisible(true)} style={{ backgroundColor: '#E51025', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 }}>
                  <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 }}>Change</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* ------------------------- */}
          </View>
        )}

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          {currentStep === 2 && (
            <TouchableOpacity style={[styles.createButton, { flex: 1, marginRight: 10, backgroundColor: '#E5E7EB' }]} onPress={() => setCurrentStep(1)}>
              <Text style={[styles.createButtonText, { color: '#374151' }]}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.createButton, { flex: 2 }]} onPress={handleCreate}>
            <Text style={styles.createButtonText}>Next</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAwareScrollView>

      {/* Modals */}
      {renderModal('roadmap', 'Select Roadmap', ROADMAPS, roadmap, setRoadmap)}

      <Modal visible={calendarModalConfig.visible} animationType="fade" transparent={true} onRequestClose={() => setCalendarModalConfig({ visible: false, type: 'stage' })}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#FFF', width: '90%', borderRadius: 12, padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: '#333' }}>
              {`Select Dates for ${calendarModalConfig.stageIndex !== undefined ? stages[calendarModalConfig.stageIndex].title : 'Stage'}`}
            </Text>
            <Calendar
              dayComponent={CustomDay}
              onDayPress={(d: any) => {
                if (calendarModalConfig.type === 'stage' && calendarModalConfig.stageIndex !== undefined) {
                  const idx = calendarModalConfig.stageIndex;
                  const title = stages[idx].title;
                  setMatchDatesObj((prev: any) => {
                    const updated = { ...prev };
                    if (updated[d.dateString] && updated[d.dateString].stageIndex === idx) {
                      delete updated[d.dateString];
                    } else {
                      updated[d.dateString] = { selected: true, stageTitle: title, stageIndex: idx };
                    }
                    return updated;
                  });
                }
              }}
              markedDates={(() => {
                const marked: any = {};
                const startYMD = parseToYYYYMMDD(regStartDate);
                const endYMD = parseToYYYYMMDD(regEndDate);

                if (startYMD && endYMD) {
                  let current = new Date(startYMD);
                  const end = new Date(endYMD);
                  while (current <= end) {
                    const dateString = current.toISOString().split('T')[0];
                    marked[dateString] = { isReg: true };
                    current.setDate(current.getDate() + 1);
                  }
                } else if (startYMD) {
                  marked[startYMD] = { isReg: true };
                }

                const currentStageIdx = calendarModalConfig.stageIndex ?? 0;
                Object.keys(matchDatesObj).forEach(key => {
                  const item = matchDatesObj[key];
                  if (item.stageIndex <= currentStageIdx) {
                    marked[key] = {
                      ...marked[key],
                      ...item,
                      selected: item.stageIndex === currentStageIdx,
                    };
                  }
                });
                return marked;
              })()}
              theme={{
                calendarBackground: '#FFF',
                dayTextColor: colors.textBlack,
                monthTextColor: colors.textBlack,
                arrowColor: colors.primary,
                todayTextColor: colors.primary,
              }}
            />
            <TouchableOpacity onPress={() => setCalendarModalConfig({ visible: false, type: 'stage' })} style={{ backgroundColor: colors.primary, padding: 12, borderRadius: 8, marginTop: 20, alignItems: 'center' }}>
              <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={isPointModalVisible} animationType="slide" onRequestClose={() => setIsPointModalVisible(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827' }}>Configure Point System</Text>
            <TouchableOpacity onPress={() => setIsPointModalVisible(false)}>
              <Icon name="close" size={24} color="#111827" />
            </TouchableOpacity>
          </View>
          <KeyboardAwareScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }} enableOnAndroid={true} extraScrollHeight={20}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 15 }}>Kills point</Text>
            <PointRow label="" value={killsPoint} onChange={setKillsPoint} placeholder="Enter points per kill" />
            <Text style={{ color: '#757575', fontSize: 12, marginTop: -5, marginBottom: 15 }}>Points awarded per kill</Text>

            <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 15, marginTop: 10 }}>Position points</Text>
            {positions.map((pos, index) => (
              <PointRow 
                key={pos.label} 
                label={pos.label} 
                value={pos.value} 
                onChange={(val: number) => {
                  const newPos = [...positions];
                  newPos[index].value = val;
                  setPositions(newPos);
                }} 
              />
            ))}
            
            <TouchableOpacity onPress={() => {
              const nextIndex = positions.length + 1;
              setPositions([...positions, { label: `#${nextIndex}`, value: 0 }]);
            }} style={{ paddingVertical: 12, paddingHorizontal: 20, backgroundColor: '#E51025', borderRadius: 12, alignSelf: 'center', marginTop: 10, marginBottom: 30 }}>
              <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>+ Add Position</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsPointModalVisible(false)} style={{ backgroundColor: '#E51025', padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>Save Point System</Text>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        </SafeAreaView>
      </Modal>

      {showPicker && (
        <DateTimePicker
          value={getPickerValue()}
          mode={pickerMode}
          is24Hour={false}
          display="default"
          onChange={handleDateChange}
        />
      )}
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
    marginRight: 15,
  },
  title: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  uploadSection: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    height: 160,
    backgroundColor: '#F8FAFC',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  uploadBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    color: '#64748B',
    marginTop: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 18,
  },
  row: {
    flexDirection: 'row',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  label: {
    color: '#64748B',
    fontSize: 13,
    marginBottom: 8,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    color: colors.textBlack,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    shadowColor: '#94A3B8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  calendarContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFF',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 5,
    marginTop: 4,
  },
  dropdown: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#94A3B8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dropdownText: {
    color: colors.textBlack,
    fontSize: 15,
  },
  createButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  createButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '85%',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    color: colors.textBlack,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalOptionText: {
    color: colors.textBlack,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CreateTournamentScreen;







