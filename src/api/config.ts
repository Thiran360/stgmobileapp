export const NGROK_URL = 'https://impromptu-system-driller.ngrok-free.dev';
export const BASE_URL = `${NGROK_URL}/stgapp/`;
export const MEDIA_URL = `${NGROK_URL}/media/`;
export const WS_BASE_URL = 'wss://impromptu-system-driller.ngrok-free.dev/ws/chat/';

export const API_ENDPOINTS = {
  HOME: `${BASE_URL}home`,
  INBOX: `${BASE_URL}inbox`,
  FLYERS: `${BASE_URL}flyers`,

  // Auth
  SEND_OTP: `${BASE_URL}send-otp/`,
  VERIFY_OTP: `${BASE_URL}verify-otp/`,

  // Tournaments
  TOURNAMENTS: `${BASE_URL}tournament/get/`,
  TOURNAMENT_CREATE: `${BASE_URL}tournament/create/`,
  TOURNAMENT_UPDATE: (id: string) => `${BASE_URL}tournament/update/${id}/`,
  REGISTER_TEAM: (tournamentId: number | string) => `${BASE_URL}tournaments/${tournamentId}/register`,
  GET_REGISTERED_TEAMS: (tournamentId: number | string) => `${BASE_URL}tournaments/${tournamentId}/teams/`,
  MY_MATCHES: `${BASE_URL}my-matches/`,

  // Chat & Groups
  CHAT_CREATE: `${BASE_URL}chat/create/`,
  CHAT_MESSAGES: (chatId: string) => `${BASE_URL}chat/${chatId}/messages`,
  CHAT_SEND: (chatId: string) => `${BASE_URL}chat/${chatId}/send/`,
  CHAT_SEND_MESSAGE: (chatId: string) => `${BASE_URL}chat/${chatId}/send/`,
  GROUP_INFO: (groupId: string) => `${BASE_URL}group/${groupId}/info`,
  GROUP_UPDATE: (groupId: string) => `${BASE_URL}group/${groupId}`,
  GROUP_MEMBER_UPDATE: (groupId: string, memberId: string) => `${BASE_URL}group/${groupId}/members/${memberId}`,

  // Community
  COMMUNITY_POSTS: `${BASE_URL}community/posts/`,
  COMMUNITY_GET: `${BASE_URL}community/get/`,
  
  // Looking
  LOOKING_FEED: `${BASE_URL}post/list`,
  LOOKING_POST: `${BASE_URL}post/create`,
  LOOKING_ME: `${BASE_URL}me/`,
  LOOKING_DELETE: `${BASE_URL}post/delete/`,
  LOOKING_UPDATE: `${BASE_URL}post/update/`,

  // Profile
  PROFILE: (userId: string | number) => `${BASE_URL}profile/${userId}/`,
  PROFILE_CREATE: `${BASE_URL}profile/create`,
  PROFILE_UPDATE: `${BASE_URL}profile/update`,
  PROFILE_FOLLOW: (targetUserId: string | number) => `${BASE_URL}profile/${targetUserId}/follow/`,

  // Chatbot (from backend chat app if routed)
  CHATBOT_DATA: `${NGROK_URL}/chat/chatbot-data/`,
  CHATBOT_GET: `${NGROK_URL}/chat/get/chatbot-data/`
};
