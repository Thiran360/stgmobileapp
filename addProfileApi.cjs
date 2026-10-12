const fs = require('fs');
let c = fs.readFileSync('src/api/index.ts', 'utf8');

const profileApiCode = `
  // Profile
  getProfile: async (userId: string) => {
    const res = await fetchWithTimeout(API_ENDPOINTS.PROFILE + "?user_id=" + userId, {
      method: 'GET',
    });
    return res.json();
  },
  createProfile: async (profileData: any) => {
    const res = await fetchWithTimeout(API_ENDPOINTS.PROFILE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    return res.json();
  },
  updateProfile: async (profileData: any) => {
    const res = await fetchWithTimeout(API_ENDPOINTS.PROFILE, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    return res.json();
  },
`;

c = c.replace("// Auth", profileApiCode + "\n  // Auth");
fs.writeFileSync('src/api/index.ts', c, 'utf8');
console.log('Added profile APIs to index.ts');
