const fs = require('fs');
let config = fs.readFileSync('src/api/config.ts', 'utf8');

if (!config.includes('PROFILE_FOLLOW')) {
  config = config.replace(
    "PROFILE_UPDATE: `${BASE_URL}stg_app/profile/update`",
    "PROFILE_UPDATE: `${BASE_URL}stg_app/profile/update`,\n  PROFILE_FOLLOW: `${BASE_URL}stg_app/profile/follow/`,\n  PROFILE_UNFOLLOW: `${BASE_URL}stg_app/profile/unfollow/`"
  );
  fs.writeFileSync('src/api/config.ts', config, 'utf8');
}
