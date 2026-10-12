const http = require("https");

const BASE = "https://melany-countable-patti.ngrok-free.dev/stg_app";

async function req(method, url, body) {
  return new Promise((resolve) => {
    const u = new URL(url);
    const opts = { hostname: u.hostname, path: u.pathname, method, headers: {} };
    let pd = "";
    if (body) {
      pd = JSON.stringify(body);
      opts.headers["Content-Type"] = "application/json";
      opts.headers["Content-Length"] = Buffer.byteLength(pd);
    }
    const r = http.request(opts, (res) => {
      let d = "";
      res.on("data", c => d += c);
      res.on("end", () => resolve({ status: res.statusCode, body: d.substring(0, 200) }));
    });
    r.on("error", (e) => resolve({ status: "ERR", body: e.message }));
    if (body) r.write(pd);
    r.end();
  });
}

async function run() {
  const results = [];

  // 1. Send OTP
  let r = await req("POST", `${BASE}/auth/send-otp`, { email: "test@example.com" });
  results.push({ test: "POST send-otp", status: r.status, body: r.body });

  // 2. Verify OTP
  r = await req("POST", `${BASE}/auth/verify-otp`, { email: "test@example.com", otp: "123456" });
  results.push({ test: "POST verify-otp", status: r.status, body: r.body });

  // 3. Home
  r = await req("GET", `${BASE}/home`, null);
  results.push({ test: "GET home", status: r.status, body: r.body });

  // 4. Tournaments List
  r = await req("GET", `${BASE}/tournaments`, null);
  results.push({ test: "GET tournaments", status: r.status, body: r.body });

  // 5. Create Tournament
  r = await req("POST", `${BASE}/tournaments`, { name: "Test Tourney", game: "BGMI", prize: "10000", teamsLimit: "32", status: "REGISTRATIONS OPEN" });
  results.push({ test: "POST tournaments (create)", status: r.status, body: r.body });

  // 6. Flyers
  r = await req("GET", `${BASE}/flyers`, null);
  results.push({ test: "GET flyers", status: r.status, body: r.body });

  // 7. Inbox
  r = await req("GET", `${BASE}/inbox`, null);
  results.push({ test: "GET inbox", status: r.status, body: r.body });

  // 8. Community Posts - GET
  r = await req("GET", `${BASE}/community/posts`, null);
  results.push({ test: "GET community/posts", status: r.status, body: r.body });

  // 9. Community Posts - POST
  r = await req("POST", `${BASE}/community/posts`, { postedBy: "tester", name: "Test Team", description: "Looking for players", category: "Team" });
  results.push({ test: "POST community/posts (create)", status: r.status, body: r.body });

  // 10. Chat Messages - GET
  r = await req("GET", `${BASE}/chat/test-chat-id/messages`, null);
  results.push({ test: "GET chat/messages", status: r.status, body: r.body });

  // 11. Chat Messages - POST (send message)
  r = await req("POST", `${BASE}/chat/test-chat-id/messages`, { senderId: "user123", text: "Hello!" });
  results.push({ test: "POST chat/messages (send)", status: r.status, body: r.body });

  // 12. Group Info - GET
  r = await req("GET", `${BASE}/group/test-group-id/info`, null);
  results.push({ test: "GET group/info", status: r.status, body: r.body });

  // 13. Group Update - PUT
  r = await req("PUT", `${BASE}/group/test-group-id`, { name: "New Group Name" });
  results.push({ test: "PUT group (update name)", status: r.status, body: r.body });

  // 14. Group Update - PATCH
  r = await req("PATCH", `${BASE}/group/test-group-id`, { name: "New Group Name" });
  results.push({ test: "PATCH group (update name)", status: r.status, body: r.body });

  // 15. Group Member Update - PUT
  r = await req("PUT", `${BASE}/group/test-group-id/members/test-member-id`, { role: "admin" });
  results.push({ test: "PUT group member (role)", status: r.status, body: r.body });

  // 16. Group Member Update - PATCH
  r = await req("PATCH", `${BASE}/group/test-group-id/members/test-member-id`, { role: "admin" });
  results.push({ test: "PATCH group member (role)", status: r.status, body: r.body });

  // 17. Register Team - POST
  r = await req("POST", `${BASE}/atournaments/1/register`, { teamName: "Test Squad", players: [{ gameId: "11111", gameName: "Player1" }] });
  results.push({ test: "POST register_team", status: r.status, body: r.body });

  // 18. Get Registered Teams - GET
  r = await req("GET", `${BASE}/tournaments/1/teams`, null);
  results.push({ test: "GET registered_teams", status: r.status, body: r.body });

  // 19. Contact - POST
  r = await req("POST", `${BASE}/contact`, { name: "Tester", email: "test@test.com", message: "Hello" });
  results.push({ test: "POST contact", status: r.status, body: r.body });

  // 20. Profile - GET
  r = await req("GET", `${BASE}/profile`, null);
  results.push({ test: "GET profile", status: r.status, body: r.body });

  // 21. Profile - POST
  r = await req("POST", `${BASE}/profile`, { username: "tester", fullName: "Tester", email: "test@example.com", mobileNumber: "9999999999" });
  results.push({ test: "POST profile (create)", status: r.status, body: r.body });

  // 22. Profile - PUT
  r = await req("PUT", `${BASE}/profile`, { username: "tester", fullName: "Tester Updated" });
  results.push({ test: "PUT profile (update)", status: r.status, body: r.body });

  console.log("\n====== FULL ENDPOINT REPORT ======");
  for (const res of results) {
    const icon = (res.status >= 200 && res.status < 300) ? "OK" : (res.status === 404) ? "MISSING" : (res.status === 405) ? "METHOD_ERR" : (res.status === 500) ? "SERVER_CRASH" : "FAIL";
    console.log(`[${res.status}] ${icon} -> ${res.test}`);
    if (icon !== "OK") {
      console.log(`         Response: ${res.body.substring(0, 80)}`);
    }
  }
}

run();
