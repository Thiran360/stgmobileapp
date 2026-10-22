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
  // Profile
  getProfile: async (userId: string | number, viewerId?: string | number) => {
    let url = API_ENDPOINTS.PROFILE(userId);
    if (viewerId) {
      url += `?viewer_id=${encodeURIComponent(String(viewerId))}`;
    }
    const res = await fetchWithTimeout(url, {
      method: 'GET',
    });
    if (res.status === 404) {
      return { error: true, status: false, detail: 'Not Found' };
    }
    return res.json();
  },
  createProfile: async (profileData: any) => {
    const isFormData = profileData instanceof FormData;
    const res = await fetchWithTimeout(API_ENDPOINTS.PROFILE_CREATE, {
      method: 'POST',
      headers: isFormData ? { 'Accept': 'application/json' } : { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: isFormData ? profileData : JSON.stringify(profileData)
    });
    return res.json();
  },
  updateProfile: async (profileData: any) => {
    const isFormData = profileData instanceof FormData;
    const res = await fetchWithTimeout(API_ENDPOINTS.PROFILE_UPDATE, {
      method: 'PUT',
      headers: isFormData ? { 'Accept': 'application/json' } : { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: isFormData ? profileData : JSON.stringify(profileData)
    });
    return res.json();
  },
  followUser: async (targetUserId: string | number, action: 'follow' | 'unfollow', followerId?: string | number) => {
    const res = await fetchWithTimeout(API_ENDPOINTS.PROFILE_FOLLOW(targetUserId), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ action, user_id: followerId })
    });
    return res.json();
  },

  // Auth
  sendOtp: async (mobile: string) => {
    const res = await fetchWithTimeout(API_ENDPOINTS.SEND_OTP, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ mobile })
    });
    return res.json();
  },
  verifyOtp: async (mobile: string, otp: string) => {
    const res = await fetchWithTimeout(API_ENDPOINTS.VERIFY_OTP, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
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
    try {
      const res = await fetchWithTimeout(API_ENDPOINTS.FLYERS);
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  },
  getInbox: async (userId?: string | number | null) => {
    let url = API_ENDPOINTS.INBOX;
    if (userId) {
      url += `?user_id=${encodeURIComponent(String(userId))}`;
    }
    const res = await fetchWithTimeout(url);
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
  createCommunityPost: async (postData: any) => {
    const isFormData = postData instanceof FormData;
    const res = await fetchWithTimeout(API_ENDPOINTS.COMMUNITY_POSTS, {
      method: 'POST',
      headers: isFormData ? { 'Accept': 'application/json' } : { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: isFormData ? postData : JSON.stringify(postData)
    });
    return res.json();
  },

  // Tournaments
  createTournament: async (data: any) => {
    const isFormData = data instanceof FormData;
    const res = await fetchWithTimeout(API_ENDPOINTS.TOURNAMENT_CREATE, {
      method: 'POST',
      headers: isFormData ? { 'Accept': 'application/json' } : { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: isFormData ? data : JSON.stringify(data)
    });
    return res.json();
  },
  registerTeam: async (tournamentId: number | string, teamData: any, userId?: string | number) => {
    let url = API_ENDPOINTS.REGISTER_TEAM(tournamentId);
    if (userId) {
      url += `?user_id=${encodeURIComponent(String(userId))}`;
    }
    const res = await fetchWithTimeout(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(teamData)
    });
    return res.json();
  },
  getRegisteredTeams: async (tournamentId: number | string) => {
    try {
      const res = await fetchWithTimeout(API_ENDPOINTS.GET_REGISTERED_TEAMS(tournamentId));
      if (!res.ok) return [];
      const data = await res.json().catch(() => []);
      return data?.data || data || [];
    } catch (e) {
      return [];
    }
  },
  getMyMatches: async (userId: string | number) => {
    try { 
      const res = await fetchWithTimeout(`${API_ENDPOINTS.MY_MATCHES}?user_id=${userId}`); 
      if (!res.ok) return []; 
      const data = await res.json().catch(() => []); 
      return data?.messages || data?.data || (Array.isArray(data) ? data : []);
    } catch (e) { 
      return []; 
    }
  },

  // Looking
  getLookingFeed: async (category?: string) => {
    let url = API_ENDPOINTS.LOOKING_FEED;
    if (category) {
      url += `?category=${encodeURIComponent(category)}`;
    }
    const res = await fetchWithTimeout(url);
    return res.json();
  },
  getMyLookingPosts: async (userId: string | number) => {
    const res = await fetchWithTimeout(`${API_ENDPOINTS.LOOKING_ME}?user_id=${userId}`);
    return res.json();
  },
  createLookingPost: async (postData: any) => {
    const isFormData = postData instanceof FormData;
    const res = await fetchWithTimeout(API_ENDPOINTS.LOOKING_POST, {
      method: 'POST',
      headers: isFormData ? { 'Accept': 'application/json' } : { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: isFormData ? postData : JSON.stringify(postData)
    });
    return res.json();
  },
  updateLookingPost: async (postData: any) => {
    const isFormData = postData instanceof FormData;
    const res = await fetchWithTimeout(API_ENDPOINTS.LOOKING_UPDATE, {
      method: 'POST',
      headers: isFormData ? { 'Accept': 'application/json' } : { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: isFormData ? postData : JSON.stringify(postData)
    });
    return res.json();
  },
  deleteLookingPost: async (postId: string | number, userId: string | number) => {
    const res = await fetchWithTimeout(`${API_ENDPOINTS.LOOKING_DELETE}?post_id=${postId}&user_id=${userId}`, {
      method: 'DELETE',
      headers: { 'Accept': 'application/json' }
    });
    return res.json();
  },

  // Chat & Messaging
  createChatSession: async (userId: string | number, otherUserId: string | number) => {
    try {
      const res = await fetchWithTimeout(API_ENDPOINTS.CHAT_CREATE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ user_id: String(userId), other_user_id: String(otherUserId) })
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },
  getChatMessages: async (chatId: string, currentUserId?: string | number | null) => {
    try {
      let url = API_ENDPOINTS.CHAT_MESSAGES(chatId);
      if (currentUserId) {
        url += `?user_id=${encodeURIComponent(String(currentUserId))}`;
      }
      const res = await fetchWithTimeout(url);
      if (!res.ok) return [];
      const data = await res.json().catch(() => null);
      return data?.messages || data?.data || (Array.isArray(data) ? data : []);
    } catch (e) {
      return [];
    }
  },
  sendMessage: async (chatId: string, text: string, senderId: string | number) => {
    try {
      const res = await fetchWithTimeout(API_ENDPOINTS.CHAT_SEND_MESSAGE(chatId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ text, sender_id: String(senderId) })
      });
      return await res.json().catch(() => null);
    } catch (e) {
      return null;
    }
  },
  sendChatMessage: async (chatId: string, formData: FormData) => {
    try {
      const res = await fetchWithTimeout(API_ENDPOINTS.CHAT_SEND(chatId), {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        }
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Group
  getGroupInfo: async (groupId: string) => {
    const res = await fetchWithTimeout(API_ENDPOINTS.GROUP_INFO(groupId));
    return res.json();
  },
  updateGroup: async (groupId: string, data: any) => {
    const res = await fetchWithTimeout(API_ENDPOINTS.GROUP_UPDATE(groupId), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  updateGroupMember: async (groupId: string, memberId: string, data: any) => {
    const res = await fetchWithTimeout(API_ENDPOINTS.GROUP_MEMBER_UPDATE(groupId, memberId), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Chatbot (if active)
  getChatbotData: async () => {
    try {
      const res = await fetchWithTimeout(API_ENDPOINTS.CHATBOT_GET);
      return await res.json();
    } catch (e) {
      return null;
    }
  },
  postChatbotData: async (data: any) => {
    try {
      const res = await fetchWithTimeout(API_ENDPOINTS.CHATBOT_DATA, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  }
};
