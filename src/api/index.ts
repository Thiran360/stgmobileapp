import { API_ENDPOINTS } from './config';

const fetchWithTimeout = async (url: string, options: any = {}, timeoutMs = 15000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

export const apiService = {
  submitContact: async (data: any) => {
    const res = await fetchWithTimeout(API_ENDPOINTS.CONTACT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    return res.json();
  },
  
  // Profile
  getProfile: async (userId: string) => {
    const res = await fetchWithTimeout(API_ENDPOINTS.PROFILE(userId), {
      method: 'GET',
    });
    if (res.status === 404) {
      return { error: true, status: false, detail: 'Not Found' };
    }
    return res.json();
  },
  createProfile: async (profileData: any) => {
    const res = await fetchWithTimeout(API_ENDPOINTS.PROFILE_CREATE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    return res.json();
  },
  updateProfile: async (profileData: any) => {
    const res = await fetchWithTimeout(API_ENDPOINTS.PROFILE_UPDATE, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    return res.json();
  },
  followUser: async (targetUserId: string | number, action: 'follow' | 'unfollow') => {
    const res = await fetchWithTimeout(API_ENDPOINTS.PROFILE_FOLLOW(targetUserId), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action })
    });
    return res.json();
  },

  // Auth
  sendOtp: async (mobile: string) => {
    const res = await fetchWithTimeout(API_ENDPOINTS.SEND_OTP, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile })
    });
    return res.json();
  },
  verifyOtp: async (mobile: string, otp: string) => {
    const res = await fetchWithTimeout(API_ENDPOINTS.VERIFY_OTP, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile, otp })
    });
    return res.json();
  },

  // General App Data
  getHomeData: async () => {
    const res = await fetchWithTimeout(API_ENDPOINTS.HOME);
    return res.json();
  },
  getTournaments: async () => {
    const res = await fetchWithTimeout(API_ENDPOINTS.TOURNAMENTS);
    return res.json();
  },
  getFlyers: async () => {
    const res = await fetchWithTimeout(API_ENDPOINTS.FLYERS);
    return res.json();
  },
  getInbox: async () => {
    const res = await fetchWithTimeout(API_ENDPOINTS.INBOX);
    return res.json();
  },

  // Community
  getCommunityPosts: async (category?: string) => {
    let url = API_ENDPOINTS.COMMUNITY_GET;
    if (category) {
      url += `?category=${encodeURIComponent(category)}`;
    }
    const res = await fetchWithTimeout(url);
    return res.json();
  },

  // Registration
  registerTeam: async (tournamentId: number | string, teamData: any) => {
    const res = await fetchWithTimeout(API_ENDPOINTS.REGISTER_TEAM(tournamentId), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teamData)
    });
    return res.json();
  },
  getRegisteredTeams: async (tournamentId: number | string) => {
    try { const res = await fetchWithTimeout(API_ENDPOINTS.GET_REGISTERED_TEAMS(tournamentId)); if (!res.ok) return []; return await res.json().catch(()=>[]); } catch (e) { return []; }
  },
  getMyMatches: async (userId: string) => {
    try { 
      const res = await fetchWithTimeout(`${API_ENDPOINTS.MY_MATCHES}?user_id=${userId}`); 
      if (!res.ok) return []; 
      const data = await res.json().catch(()=>[]); 
      return data?.messages || data?.data || (Array.isArray(data) ? data : []);
    } catch (e) { 
      return []; 
    }
  },
  // Chat
  sendMessage: async (chatId: string, text: string, senderId: string) => { try { const res = await fetchWithTimeout(API_ENDPOINTS.CHAT_SEND_MESSAGE(chatId), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: text, sender_id: senderId, receiver_id: chatId }) }); return res.json().catch(() => null); } catch (e) { return null; } },
    getChatMessages: async (chatId: string) => {
    try {
      const res = await fetchWithTimeout(API_ENDPOINTS.CHAT_MESSAGES(chatId));
      if (!res.ok) return [];
      const data = await res.json().catch(() => null);
      return data?.messages || data?.data || (Array.isArray(data) ? data : []);
    } catch(e) { return []; }
  },
  sendChatMessage: async (chatId: string, formData: FormData) => {
    try {
      const res = await fetch(API_ENDPOINTS.CHAT_SEND(chatId), {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        }
      });
      return await res.json();
    } catch(e) { return null; }
  },

  // Group
  getGroupInfo: async (groupId: string) => {
    const res = await fetchWithTimeout(API_ENDPOINTS.GROUP_INFO(groupId));
    return res.json();
  },
  updateGroup: async (groupId: string, data: any) => {
    const res = await fetchWithTimeout(API_ENDPOINTS.GROUP_UPDATE(groupId), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  updateGroupMember: async (groupId: string, memberId: string, data: any) => {
    const res = await fetchWithTimeout(API_ENDPOINTS.GROUP_MEMBER_UPDATE(groupId, memberId), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }
};






