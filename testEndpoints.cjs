const http = require('https');

const BASE_URL = 'https://melany-countable-patti.ngrok-free.dev/stg_app';

const endpoints = [
  { name: 'send-otp', url: `${BASE_URL}/auth/send-otp`, method: 'POST', body: { email: 'test@example.com' } },
  { name: 'verify-otp', url: `${BASE_URL}/auth/verify-otp`, method: 'POST', body: { email: 'test@example.com', otp: '123456' } },
  { name: 'tournaments', url: `${BASE_URL}/tournaments`, method: 'GET' },
  { name: 'home', url: `${BASE_URL}/home`, method: 'GET' },
  { name: 'flyers', url: `${BASE_URL}/flyers`, method: 'GET' },
  { name: 'inbox', url: `${BASE_URL}/inbox`, method: 'GET' },
  { name: 'community-posts', url: `${BASE_URL}/community/posts`, method: 'GET' },
  { name: 'chat-messages', url: `${BASE_URL}/chat/test-chat/messages`, method: 'GET' },
  { name: 'group-info', url: `${BASE_URL}/group/test-group/info`, method: 'GET' },
  { name: 'group-update', url: `${BASE_URL}/group/test-group`, method: 'PUT', body: { name: "Test Group" } },
  { name: 'group-member-update', url: `${BASE_URL}/group/test-group/members/test-member`, method: 'PUT', body: { role: 'admin' } },
  { name: 'register_team', url: `${BASE_URL}/atournaments/1/register/`, method: 'POST', body: { teamName: 'Test', players: [] } },
  { name: 'get_registered_teams', url: `${BASE_URL}/tournaments/1/teams/`, method: 'GET' },
  { name: 'contact', url: `${BASE_URL}/contact/`, method: 'POST', body: { name: 'User', message: 'Help' } }
];

async function testEndpoint(ep) {
  return new Promise((resolve) => {
    const url = new URL(ep.url);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: ep.method,
      headers: {}
    };

    let postData = '';
    if (ep.body) {
      postData = JSON.stringify(ep.body);
      options.headers['Content-Type'] = 'application/json';
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ name: ep.name, status: res.statusCode, data: data.substring(0, 100) });
      });
    });

    req.on('error', (e) => {
      resolve({ name: ep.name, status: 'ERROR', error: e.message });
    });

    if (ep.body) {
      req.write(postData);
    }
    req.end();
  });
}

async function runTests() {
  for (const ep of endpoints) {
    const res = await testEndpoint(ep);
    console.log(`[${res.status}] ${ep.method} ${ep.url}`);
    if (res.status === 404 || res.status === 405 || res.status === 500) {
      console.log(`   -> Missing/Failing (Payload expected: ${ep.body ? JSON.stringify(ep.body) : 'None'})`);
    } else {
        console.log(`   -> Works!`);
    }
  }
}

runTests();
