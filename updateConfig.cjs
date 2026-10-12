const fs = require('fs');
let c = fs.readFileSync('src/api/config.ts', 'utf8');

c = c.replace(
  "PROFILE: `${BASE_URL}stg_app/profile`",
  "PROFILE: `${BASE_URL}stg_app/profile`,\n  PROFILE_CREATE: `${BASE_URL}stg_app/profile/create`,\n  PROFILE_UPDATE: `${BASE_URL}stg_app/profile/update`"
);

fs.writeFileSync('src/api/config.ts', c, 'utf8');
console.log('Updated config.ts');
