const http = require('https');

const BASE_URL = 'https://melany-countable-patti.ngrok-free.dev/stg_app';

const endpoints = [
  { name: 'profile', url: `${BASE_URL}/profile/`, method: 'POST', body: { username: 'vijay123', fullName: 'Vijay Kumar', email: 'test@example.com' } },
  { name: 'profile (without slash)', url: `${BASE_URL}/profile`, method: 'POST', body: { username: 'vijay123', fullName: 'Vijay Kumar', email: 'test@example.com' } },
  
  { name: 'community_posts', url: `${BASE_URL}/community/posts/`, method: 'POST', body: { postedBy: 'tester', name: 'Test Post', description: 'desc' } },
  { name: 'community_posts (without slash)', url: `${BASE_URL}/community/posts`, method: 'POST', body: { postedBy: 'tester', name: 'Test Post', description: 'desc' } },
  
  { name: 'tournaments', url: `${BASE_URL}/tournaments/`, method: 'POST', body: { name: 'Test Tourney', game: 'BGMI' } },
  { name: 'tournaments (without slash)', url: `${BASE_URL}/tournaments`, method: 'POST', body: { name: 'Test Tourney', game: 'BGMI' } },
  
  { name: 'chat_messages', url: `${BASE_URL}/chat/test_id/messages/`, method: 'POST', body: { text: 'Hello', senderId: '123' } },
  { name: 'chat_messages (without slash)', url: `${BASE_URL}/chat/test_id/messages`, method: 'POST', body: { text: 'Hello', senderId: '123' } }
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
        resolve({ name: ep.name, status: res.statusCode, data: data.substring(0, 150) });
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
  console.log('Testing potential missing endpoints...\n');
  for (const ep of endpoints) {
    const res = await testEndpoint(ep);
    console.log(`[${res.status}] ${ep.method} ${ep.url}`);
    if (res.status >= 200 && res.status < 300) {
      console.log(`   -> EXISTS & WORKING!`);
    } else if (res.status >= 400 && res.status < 500) {
      console.log(`   -> EXISTS but failed validation or method not allowed (${res.status}). Body: ${res.data}`);
    } else {
      console.log(`   -> CRASH/MISSING (${res.status}). Body: ${res.data.substring(0, 50)}...`);
    }
  }
}

runTests();
