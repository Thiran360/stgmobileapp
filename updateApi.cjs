const fs = require('fs');
let c = fs.readFileSync('src/api/index.ts', 'utf8');

c = c.replace(
  "createProfile: async (profileData: any) => {\n    const res = await fetchWithTimeout(API_ENDPOINTS.PROFILE, {\n      method: 'POST',",
  "createProfile: async (profileData: any) => {\n    const res = await fetchWithTimeout(API_ENDPOINTS.PROFILE_CREATE, {\n      method: 'POST',"
);

c = c.replace(
  "updateProfile: async (profileData: any) => {\n    const res = await fetchWithTimeout(API_ENDPOINTS.PROFILE, {\n      method: 'PUT',",
  "updateProfile: async (profileData: any) => {\n    const res = await fetchWithTimeout(API_ENDPOINTS.PROFILE_UPDATE, {\n      method: 'PUT',"
);

// Also let's check if the backend developer wants PUT or POST for the update endpoint. Usually /update might be a POST or PATCH or PUT. Since it was PUT, I will keep it PUT. If it fails, I'll advise the user. But actually, often DRF uses PUT or PATCH. Let's keep it PUT.
// Or maybe it's POST? Let's just leave it as PUT for now.

fs.writeFileSync('src/api/index.ts', c, 'utf8');
console.log('Updated index.ts');
