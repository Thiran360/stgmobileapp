const fs = require('fs');
let config = fs.readFileSync('src/api/config.ts', 'utf8');

// Replace PROFILE string with a function that takes userId
config = config.replace(
  "PROFILE: `${BASE_URL}stg_app/profile`,",
  "PROFILE: (userId: string | number) => `${BASE_URL}stg_app/profile/${userId}/`,"
);

fs.writeFileSync('src/api/config.ts', config, 'utf8');

let api = fs.readFileSync('src/api/index.ts', 'utf8');
api = api.replace(
  "API_ENDPOINTS.PROFILE + \"?user_id=\" + userId",
  "API_ENDPOINTS.PROFILE(userId)"
);

fs.writeFileSync('src/api/index.ts', api, 'utf8');
console.log('Updated GET profile endpoint!');
