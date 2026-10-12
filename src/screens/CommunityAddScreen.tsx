import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Platform, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { colors } from '../theme/colors';
import { AppContext } from '../context/AppContext';

const CommunityAddScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { category } = route.params || { category: 'Community' };
  const { userProfile } = useContext(AppContext);

  const [logo, setLogo] = useState<string | null>(null);
  const [username, setUsername] = useState((userProfile?.username ? (userProfile.username.startsWith('@') ? userProfile.username : '@'+userProfile.username) : userProfile?.fullName) || 'Guest');
  const [name, setName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [experience, setExperience] = useState('');
  const [since, setSince] = useState('');
  const [description, setDescription] = useState('');
  const [previousWork, setPreviousWork] = useState('');
  const [achievements, setAchievements] = useState('');
  const [overallPlayers, setOverallPlayers] = useState('');
  
  // Social
  const [youtube, setYoutube] = useState('');
  const [instagram, setInstagram] = useState('');
  const [discord, setDiscord] = useState('');
  const [website, setWebsite] = useState('');
  
  const [ownerYoutube, setOwnerYoutube] = useState('');
  const [ownerInstagram, setOwnerInstagram] = useState('');
  const [ownerDiscord, setOwnerDiscord] = useState('');
  const [ownerWebsite, setOwnerWebsite] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEsports = category === 'Esports';
  const isAcademy = category === 'Academy';
  const isOrganisation = category === 'Scrims Organizer' || category === 'Tournament Organizer';
  
  const handlePickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
    if (result.assets && result.assets.length > 0) {
      setLogo(result.assets[0].uri || null);
    }
  };

  const handlePost = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const endpoint = require('../api/config').API_ENDPOINTS.COMMUNITY_POSTS;
      const f = new FormData();
      
      f.append('category', category);
      f.append('posted_by', username || '');
      
      f.append('name', name || '');
      f.append('org_name', orgName || '');
      f.append('owner_name', ownerName || '');
      f.append('experience', experience || '');
      f.append('since', since || '');
      f.append('description', description || '');
      f.append('previous_work', previousWork || '');
      f.append('achievements', achievements || '');
      f.append('overall_players', overallPlayers || '');
      
      f.append('youtube', youtube || '');
      f.append('instagram', instagram || '');
      f.append('discord', discord || '');
      f.append('website', website || '');
      f.append('owner_youtube', ownerYoutube || '');
      f.append('owner_instagram', ownerInstagram || '');
      f.append('owner_discord', ownerDiscord || '');
      f.append('owner_website', ownerWebsite || '');
      
      if (logo) {
        f.append('logo', {
          uri: logo,
          name: 'community_logo_' + Date.now() + '.jpg',
          type: 'image/jpeg',
        } as any);
      } else {
        f.append('logo', '');
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        body: f
      });
      const data = await res.json();
      
      if (data?.status !== false) {
        navigation.dispatch((state: any) => {
          const routes = state.routes.filter((r: any) => r.name !== 'CommunityAddScreen');
          const listRouteIndex = routes.findIndex((r: any) => r.name === 'CommunityListScreen');
          if (listRouteIndex !== -1) {
            routes[listRouteIndex] = {
              ...routes[listRouteIndex],
              params: { ...routes[listRouteIndex].params, shouldRefresh: true }
            };
          }
          return CommonActions.reset({
            ...state,
            routes,
            index: routes.length - 1,
          });
        });
      } else {
        console.log('Error from backend:', data);
      }
    } catch (error) {
      console.log('Error posting to community:', error);
    }
    setIsSubmitting(false);
  };

  const renderInput = (label: string, value: string, setValue: any, placeholder: string, multiline = false) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label} *</Text>
      <TextInput
        style={[styles.input, multiline && styles.inputMultiline]}
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        multiline={multiline}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.textBlack} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Post in {category}</Text>
        <TouchableOpacity onPress={handlePost}>
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#E51025" />
          ) : (
            <Text style={styles.headerPostText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView style={{ flex: 1 }} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} enableOnAndroid={true} extraScrollHeight={20}>
          
          <View style={styles.imagePickerContainer}>
            <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
              {logo ? (
                <Image source={{ uri: logo }} style={styles.imagePreview} />
              ) : (
                <View style={styles.imagePickerPlaceholder}>
                  <Icon name="camera" size={32} color="#E51025" />
                  <Text style={styles.imagePickerText}>Upload Logo</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {renderInput('Username', username, setUsername, 'Your Name')}

          {isEsports && renderInput('Org Name', orgName, setOrgName, 'Enter Organization Name')}
          {isEsports && renderInput('Owner Name', ownerName, setOwnerName, 'Enter Owner Name')}
          
          {(!isEsports) && renderInput('Name', name, setName, 'Enter Name')}
          
          {(isAcademy || isEsports) && renderInput('Since', since, setSince, 'e.g., 2020')}
          
          {renderInput(isEsports ? 'LAN Experience' : 'Experience', experience, setExperience, 'e.g., 3 years')}
          
          {!isEsports && renderInput(isOrganisation ? `Previous ${category} Details` : category === 'Production house' ? 'Work Details' : 'Previous Work Details', previousWork, setPreviousWork, 'Detail your past work...', true)}
          
          {renderInput('Description', description, setDescription, 'Write something about yourself...', true)}

          {isEsports && renderInput('Achievements', achievements, setAchievements, 'List your achievements...', true)}
          {isEsports && renderInput('Overall Players', overallPlayers, setOverallPlayers, 'e.g., 50+ Players')}

          {isEsports ? (
            <>
              <Text style={styles.sectionTitle}>Org Social Media (Optional)</Text>
              {renderInput('Org YouTube Link', youtube, setYoutube, 'youtube.com/...')}
              {renderInput('Org Instagram Link', instagram, setInstagram, 'instagram.com/...')}
              {renderInput('Org Discord Link', discord, setDiscord, 'discord.gg/...')}
              {renderInput('Org Website Link', website, setWebsite, 'https://...')}

              <Text style={styles.sectionTitle}>Owner Social Media (Optional)</Text>
              {renderInput('Owner YouTube Link', ownerYoutube, setOwnerYoutube, 'youtube.com/...')}
              {renderInput('Owner Instagram Link', ownerInstagram, setOwnerInstagram, 'instagram.com/...')}
              {renderInput('Owner Discord Link', ownerDiscord, setOwnerDiscord, 'discord.gg/...')}
              {renderInput('Owner Website Link', ownerWebsite, setOwnerWebsite, 'https://...')}
            </>
          ) : (
            <>
              <Text style={styles.sectionTitle}>Social Media (Optional)</Text>
              {renderInput('YouTube Link', youtube, setYoutube, 'youtube.com/...')}
              {renderInput('Instagram Link', instagram, setInstagram, 'instagram.com/...')}
              {renderInput('Discord Link', discord, setDiscord, 'discord.gg/...')}
              {renderInput('Website Link', website, setWebsite, 'https://...')}
            </>
          )}

          <View style={{ height: 40 }} />
        </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  headerPostText: { fontSize: 16, fontWeight: 'bold', color: '#E51025' },
  content: { padding: 20 },
  imagePickerContainer: { alignItems: 'center', marginBottom: 25 },
  imagePicker: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#FEF2F2', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderWidth: 1, borderColor: '#FCA5A5', borderStyle: 'dashed' },
  imagePreview: { width: '100%', height: '100%' },
  imagePickerPlaceholder: { alignItems: 'center' },
  imagePickerText: { fontSize: 12, color: '#E51025', marginTop: 4, fontWeight: '500' },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: 'bold', color: '#4B5563', marginBottom: 6 },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#111827' },
  inputMultiline: { minHeight: 80, textAlignVertical: 'top' },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#111827', marginTop: 10, marginBottom: 15 }
});

export default CommunityAddScreen;












