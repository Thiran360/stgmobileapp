import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../api/index';

export interface Player {
  id: string;
  name: string;
  role: string;
}

export interface TeamRegistrationData {
  id: string;
  tournamentId: string;
  teamName: string;
  teamBanner: string | null;
  slot: string;
  map?: string;
  players: Player[];
}

export interface UserProfile {
  id: string;
  fullName: string;
  username: string; // no longer optional
  bio?: string;
  followers: number;
  following: number;
  socialLinks?: {
    youtube?: string;
    instagram?: string;
    discord?: string;
    facebook?: string;
  };
  liveLocation: string;
  gender: string;
  dateOfBirth: string;
  mobileNumber: string;
  email: string;
  profilePicture: string | null;
  password?: string;
  region?: string;
  languages?: string;
}

export interface FlyerData {
  id: string;
  image: string | null;
  text: string;
  timestamp: string;
}

export interface Tournament {
  id: string;
  name: string;
  game: string;
  prize: string;
  teamsLimit: string;
  time: string;
  status: string;
  pointsSystem?: string;
  totalSlots?: string;
  teamsPerGroup?: string;
  numberOfGroups?: string;
  flyerDetails?: string;
  bannerImage?: string | null;
  flyerImage?: any;
  organiserName?: string;
  matchDate?: string;
  templateId?: string;
  templateData?: any;
  roadmap?: string;
  matchDatesObj?: any;
  regStartDate?: string;
  regEndDate?: string;
  selectedFlyers?: Record<string, any>;
  globalFlyerData?: any;
  stages?: any[];
  killsPoint?: string;
  positions?: any;
  sponsorName?: string;
  manageBy?: string;
  socialMedia?: string[];
}

export interface Match {
  id: string;
  league: string;
  teamA: string;
  teamB: string;
  time: string;
  venue: string;
  isLive: boolean;
}

export interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  role: 'super_admin' | 'admin' | 'member';
}

export interface GroupPermissions {
  editSettings: boolean;
  sendMessages: boolean;
  addMembers: boolean;
  approveMembers: boolean;
}

export interface ChatItem {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  isGroup: boolean;
  isFavorite?: boolean;
  members?: GroupMember[];
  permissions?: GroupPermissions;
}

interface AppContextType {
  globalTournaments: Tournament[];
  addTournament: (tournament: Tournament) => void;
  updateTournament: (id: string, updatedData: Partial<Tournament>) => void;
  registeredMatches: Match[];
  registerForTournament: (tournament: Tournament) => void;
  addMatch: (match: Match) => void;
  fetchMyMatches: () => Promise<void>;
  draftTournament: Partial<Tournament> | null;
  setDraftTournament: (tournament: Partial<Tournament> | null) => void;
  teamRegistrations: TeamRegistrationData[];
  registerTeam: (data: TeamRegistrationData) => void;
  flyers: FlyerData[];
  addFlyer: (flyer: FlyerData) => void;
  chats: ChatItem[];
  addMultipleChats: (newChats: ChatItem[]) => void;
  toggleFavoriteChat: (id: string) => void;
  userProfile: UserProfile | null;
  currentUserId: string | null;
  setUserProfile: (profile: UserProfile | null) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  loginUser: (userId: string) => Promise<boolean | void>;
  logoutUser: () => Promise<void>;
  fetchTournaments: () => Promise<void>;
  isAppLoading: boolean;
    isDrawerOpen: boolean;
    setIsDrawerOpen: (isOpen: boolean) => void;
}

export const AppContext = createContext<AppContextType>({
  globalTournaments: [],
  addTournament: () => {},
  updateTournament: () => {},
  registeredMatches: [],
  registerForTournament: () => {},
  addMatch: () => {},
  fetchMyMatches: async () => {},
  draftTournament: null,
  setDraftTournament: () => {},
  teamRegistrations: [],
  registerTeam: () => {},
  flyers: [],
  addFlyer: () => {},
  chats: [],
  addMultipleChats: () => {},
  toggleFavoriteChat: () => {},
  userProfile: null,
  setUserProfile: () => {},
  updateUserProfile: async () => {},
  loginUser: async () => false,
  logoutUser: async () => {},
  fetchTournaments: async () => {},
  isAppLoading: true,
    isDrawerOpen: false,
    setIsDrawerOpen: () => {},
});

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [globalTournaments, setGlobalTournaments] = useState<Tournament[]>([]);
  const [registeredMatches, setRegisteredMatches] = useState<Match[]>([]);
  const [draftTournament, setDraftTournament] = useState<Partial<Tournament> | null>(null);
  const [teamRegistrations, setTeamRegistrations] = useState<TeamRegistrationData[]>([]);
  const [flyers, setFlyers] = useState<FlyerData[]>([]);
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isAppLoading, setIsAppLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [chats, setChats] = useState<ChatItem[]>([]);

  const addMultipleChats = (newChats: ChatItem[]) => {
    setChats(prev => {
      const map = new Map<string, ChatItem>();
      newChats.forEach(c => { if (c && c.id) map.set(c.id, c); });
      prev.forEach(c => { if (c && c.id && !map.has(c.id)) map.set(c.id, c); });
      return Array.from(map.values());
    });
  };

  const toggleFavoriteChat = (id: string) => {
    setChats(prev => prev.map(c => c.id === id ? { ...c, isFavorite: !c.isFavorite } : c));
  };

  const setUserProfile = (profile: UserProfile | null) => {
    setUserProfileState(profile);
  };

  const updateUserProfile = async (profileData: Partial<UserProfile>) => {
    if (userProfile) {
      const updatedProfile = { ...userProfile, ...profileData } as UserProfile;
      
      try {
        await apiService.updateProfile(updatedProfile);
      } catch (e) {
        console.log('API update profile error:', e);
      }
      
      setUserProfileState(updatedProfile);
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    }
  };

  const fetchUserProfile = async (userId: string) => {
      try {
        // Try to fetch from API
        const apiData = await apiService.getProfile(userId).catch(() => null);
        
        // If API responds with an explicit error (like 404 profile not found)
        if (apiData && (apiData.error || apiData.detail || apiData.status === false)) {
           await AsyncStorage.removeItem('userProfile');
           setUserProfileState(null);
           return false;
        }

        // If API responds with success
        if (apiData && !apiData.error && !apiData.detail && apiData.status !== false) {
          const profileData = apiData.data || apiData; // handle if backend wraps in data object
          
          // Check if essential fields are empty
          if (!profileData.username || !profileData.fullName || profileData.fullName.trim() === '') {
             await AsyncStorage.removeItem('userProfile');
             setUserProfileState(null);
             return false;
          }

          setUserProfileState(profileData);
          await AsyncStorage.setItem('userProfile', JSON.stringify(profileData));
          return true;
        }

        // If API fails due to network (apiData is null), fallback to local storage
        const profileStr = await AsyncStorage.getItem('userProfile');
        if (profileStr) {
          const profileData = JSON.parse(profileStr);
          setUserProfileState(profileData);
          return true;
        }
      } catch (error) {
        console.log('Error fetching user profile:', error);
      }
      return false;
  };

  const loginUser = async (userId: string) => {
    await AsyncStorage.setItem('userId', userId);
    setCurrentUserId(userId);
    return await fetchUserProfile(userId);
  };

  const logoutUser = async () => {
    await AsyncStorage.removeItem('userId');
    setCurrentUserId(null);
    setUserProfileState(null);
  };

  const fetchTournaments = async () => {
    try {
      const res = await apiService.getTournaments().catch(() => null);
      let apiData = res;
      if (res && (res.status === 'success' || res.status === true) && res.data) {
        if (Array.isArray(res.data)) {
          apiData = res.data;
        } else if (Array.isArray(res.data.tournaments_near_you)) {
          apiData = res.data.tournaments_near_you;
        }
      }
      
      if (apiData && Array.isArray(apiData)) {
          const mappedData = apiData.map(item => ({
            id: item.id ? item.id.toString() : '',
            user_id: item.user_id,
            name: item.name || '',
            organiserName: item.organiser_name || item.organiserName || '',
            sponsorName: item.sponsor_name || item.sponsorName || '',
            manageBy: item.manage_by || item.manageBy || '',
            socialMedia: [
              item.social_media_1 || '',
              item.social_media_2 || '',
              item.social_media_3 || '',
              item.social_media_4 || ''
            ],
            game: item.game || '',
            prize: item.prize || '',
            teamsLimit: item.teams_limit?.toString() || item.teamsLimit?.toString() || '0',
            totalSlots: item.total_slots?.toString() || item.totalSlots?.toString() || '0',
            teamsPerGroup: item.teams_per_group?.toString() || item.teamsPerGroup?.toString() || '0',
            numberOfGroups: item.number_of_groups?.toString() || item.numberOfGroups?.toString() || '0',
            regStartDate: item.registration_start_date || item.regStartDate || '',
            regEndDate: item.registration_end_date || item.regEndDate || '',
            roadmap: item.roadmap || '',
            time: item.time || '',
            matchDate: item.match_date || item.matchDate || '',
            bannerImage: item.banner_image || item.bannerImage || null,
            status: item.status || 'upcoming',
            selectedFlyers: item.selected_flyers || item.selectedFlyers || {},
            stages: item.stages || [],
            matchDatesObj: item.match_dates_obj || item.matchDatesObj || {},
            killsPoint: item.kills_point || item.killsPoint || 1,
            positions: item.positions || []
          }));
          setGlobalTournaments(mappedData);
          await AsyncStorage.setItem('tournaments', JSON.stringify(mappedData));
      } else {
          const stored = await AsyncStorage.getItem('tournaments');
          if (stored) setGlobalTournaments(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Error fetching tournaments:', error);
    }
  };

  const fetchGlobalData = async (uid?: string | null) => {
    try {
      const homeData = await apiService.getHomeData().catch(() => null);
      const flyersData = await apiService.getFlyers().catch(() => null);
      if (flyersData && Array.isArray(flyersData)) setFlyers(flyersData);
      
      const targetUid = uid || currentUserId || '1';
      const inboxData = await apiService.getInbox(targetUid).catch(() => null);
      if (inboxData && Array.isArray(inboxData)) setChats(inboxData);
    } catch (e) {
      console.log('Error fetching global API data:', e);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      let activeUid: string | null = null;
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          activeUid = storedUserId;
          setCurrentUserId(storedUserId);
          await fetchUserProfile(storedUserId);
        }
      } catch (e) {
        console.error('Failed to load profile', e);
      }
      await fetchTournaments();
      await fetchGlobalData(activeUid);
      setIsAppLoading(false);
    };
    loadInitialData();
  }, []);

  const addTournament = (tournament: Tournament) => {
    setGlobalTournaments(prev => [tournament, ...prev]);
  };

  const updateTournament = (id: string, updatedData: Partial<Tournament>) => {
    setGlobalTournaments(prev => prev.map(t => t.id === id ? { ...t, ...updatedData } : t));
  };

  const registerForTournament = (tournament: Tournament) => {
    const newRegistration: Match = {
      id: Date.now().toString(),
      league: tournament.game,
      teamA: 'My Team',
      teamB: 'TBD',
      time: tournament.time,
      venue: 'Online',
      isLive: false,
    };
    setRegisteredMatches(prev => [newRegistration, ...prev]);
  };

  const addMatch = (match: Match) => {
    setRegisteredMatches(prev => [match, ...prev]);
  };

  const fetchMyMatches = async () => {
    const uid = currentUserId || userProfile?.id;
    if (!uid) return;
    try {
      const matches = await apiService.getMyMatches(uid);
      if (matches && Array.isArray(matches)) {
        setRegisteredMatches(matches);
      }
    } catch (e) {
      console.log('Error fetching my matches:', e);
    }
  };

  const registerTeam = async (data: TeamRegistrationData) => {
    // API Call
    try {
        await apiService.registerTeam(data.tournamentId, data);
    } catch (e) {
        console.log('Failed to post register team API', e);
    }
    // Update local state anyway
    setTeamRegistrations(prev => [data, ...prev]);
  };

  const addFlyer = (flyer: FlyerData) => {
    setFlyers(prev => [flyer, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      globalTournaments,
      addTournament,
      updateTournament,
      registeredMatches,
      registerForTournament,
      addMatch,
      fetchMyMatches,
      draftTournament,
      setDraftTournament,
      teamRegistrations,
      registerTeam,
      flyers,
      addFlyer,
      chats,
      addMultipleChats,
      toggleFavoriteChat,
      userProfile,
      currentUserId,
      setUserProfile,
      updateUserProfile,
      loginUser,
      logoutUser,
      fetchTournaments,
      isAppLoading,
        isDrawerOpen,
        setIsDrawerOpen,
      }}>
      {children}
    </AppContext.Provider>
  );
};








