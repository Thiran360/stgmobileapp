const http = require('https');
const BASE_URL = 'https://melany-countable-patti.ngrok-free.dev/stg_app';

const endpoints = [
  { name: 'verify-otp', url: `${BASE_URL}/auth/verify-otp/`, method: 'POST', body: { email: 'test@example.com', otp: '123456' } },
  { name: 'verify-otp-noslash', url: `${BASE_URL}/auth/verify-otp`, method: 'POST', body: { email: 'test@example.com', otp: '123456' } },
  
  { name: 'register_team', url: `${BASE_URL}/atournaments/1/register/`, method: 'POST', body: { teamName: 'Test' } },
  { name: 'register_team-noslash', url: `${BASE_URL}/atournaments/1/register`, method: 'POST', body: { teamName: 'Test' } },
  
  { name: 'get_registered_teams', url: `${BASE_URL}/tournaments/1/teams/`, method: 'GET' },
  { name: 'get_registered_teams-noslash', url: `${BASE_URL}/tournaments/1/teams`, method: 'GET' }
];

async function testEndpoint(ep) {
  return new Promise((resolve) => {
    const url = new URL(ep.url);
    const options = { hostname: url.hostname, path: url.pathname + url.search, method: ep.method, headers: {} };
    if (ep.body) {
      const postData = JSON.stringify(ep.body);
      options.headers['Content-Type'] = 'application/json';
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }
    const req = http.request(options, (res) => {
      resolve({ name: ep.name, status: res.statusCode });
    });
    req.on('error', (e) => resolve({ name: ep.name, status: 'ERROR' }));
    if (ep.body) req.write(JSON.stringify(ep.body));
    req.end();
  });
}

async function runTests() {
  for (const ep of endpoints) {
    const res = await testEndpoint(ep);
    console.log(`[${res.status}] ${ep.method} ${ep.url}`);
  }
}
runTests();
