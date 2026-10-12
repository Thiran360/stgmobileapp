const https = require("https");

const BASE = "https://melany-countable-patti.ngrok-free.dev/stg_app";

async function req(method, url, body, isForm) {
  return new Promise((resolve) => {
    const u = new URL(url);
    const opts = { hostname: u.hostname, path: u.pathname, method, headers: { "ngrok-skip-browser-warning": "true" } };
    let pd = "";
    if (body && !isForm) {
      pd = JSON.stringify(body);
      opts.headers["Content-Type"] = "application/json";
      opts.headers["Content-Length"] = Buffer.byteLength(pd);
    }
    const r = https.request(opts, (res) => {
      let d = "";
      res.on("data", c => d += c);
      res.on("end", () => resolve({ status: res.statusCode, body: d.substring(0, 300) }));
    });
    r.on("error", (e) => resolve({ status: "ERR", body: e.message }));
    if (pd) r.write(pd);
    r.end();
  });
}

function label(status) {
  if (status >= 200 && status < 300) return "? WORKS";
  if (status === 301 || status === 302) return "?? REDIRECT";
  if (status === 400) return "?? BAD_REQ (exists, payload issue)";
  if (status === 401) return "?? AUTH_REQ (exists, need token)";
  if (status === 403) return "?? FORBIDDEN";
  if (status === 404) return "? MISSING (not in urls.py)";
  if (status === 405) return "?? METHOD_NOT_ALLOWED";
  if (status === 500) return "?? SERVER_CRASH (bug in views.py)";
  return `? ${status}`;
}

async function run() {
  const tests = [];

  // ===== AUTH =====
  let r;
  r = await req("POST", `${BASE}/auth/send-otp`, { email: "testuser@gmail.com" });
  tests.push({ name: "1. POST auth/send-otp", status: r.status, res: r.body });

  r = await req("POST", `${BASE}/auth/verify-otp`, { email: "testuser@gmail.com", otp: "123456" });
  tests.push({ name: "2. POST auth/verify-otp", status: r.status, res: r.body });

  // ===== PROFILE =====
  r = await req("GET", `${BASE}/profile`, null);
  tests.push({ name: "3. GET profile", status: r.status, res: r.body });

  r = await req("POST", `${BASE}/profile`, {
    username: "test_player",
    fullName: "Test Player",
    email: "testuser@gmail.com",
    mobileNumber: "9876543210",
    gender: "Male",
    liveLocation: "Chennai",
    dateOfBirth: "1998-05-15",
    profilePicture: ""
  });
  tests.push({ name: "4. POST profile (create)", status: r.status, res: r.body });

  r = await req("PUT", `${BASE}/profile`, {
    username: "test_player",
    fullName: "Test Player Updated",
    email: "testuser@gmail.com"
  });
  tests.push({ name: "5. PUT profile (update)", status: r.status, res: r.body });

  r = await req("PATCH", `${BASE}/profile`, { fullName: "Updated Name" });
  tests.push({ name: "6. PATCH profile (partial update)", status: r.status, res: r.body });

  // ===== HOME =====
  r = await req("GET", `${BASE}/home`, null);
  tests.push({ name: "7. GET home", status: r.status, res: r.body });

  // ===== TOURNAMENTS =====
  r = await req("GET", `${BASE}/tournaments`, null);
  tests.push({ name: "8. GET tournaments (list)", status: r.status, res: r.body });

  r = await req("POST", `${BASE}/tournaments`, {
    name: "Test Weekend Showdown",
    organiser_name: "STG Esports",
    game: "BGMI",
    prize: "10000",
    teams_limit: 32,
    total_slots: 32,
    teams_per_group: 26,
    number_of_groups: 2,
    registration_start_date: "1 Oct 2026",
    registration_end_date: "3 Oct 2026",
    roadmap: "Tournament Roadmap",
    time: "Starts 1 Oct 2026",
    match_date: "5 Oct - 7 Oct 2026",
    status: "REGISTRATIONS OPEN",
    user_id: "test_user_id",
    kills_point: "1",
    stages: JSON.stringify([
      { title: "Qualifier", date: "2026-10-05" },
      { title: "Semi final", date: "2026-10-06" },
      { title: "Finals", date: "2026-10-07" }
    ]),
    positions: JSON.stringify([
      { label: "#1", value: 10 },
      { label: "#2", value: 6 },
      { label: "#3", value: 5 }
    ])
  });
  tests.push({ name: "9. POST tournaments (create)", status: r.status, res: r.body });

  // ===== TEAM REGISTRATION =====
  r = await req("POST", `${BASE}/atournaments/1/register`, {
    teamName: "Test Squad",
    players: [
      { gameId: "11111111", gameName: "Player1" },
      { gameId: "22222222", gameName: "Player2" },
      { gameId: "33333333", gameName: "Player3" },
      { gameId: "44444444", gameName: "Player4" }
    ]
  });
  tests.push({ name: "10. POST atournaments/1/register (team reg)", status: r.status, res: r.body });

  r = await req("GET", `${BASE}/tournaments/1/teams`, null);
  tests.push({ name: "11. GET tournaments/1/teams (registered teams)", status: r.status, res: r.body });

  // ===== FLYERS =====
  r = await req("GET", `${BASE}/flyers`, null);
  tests.push({ name: "12. GET flyers", status: r.status, res: r.body });

  // ===== INBOX =====
  r = await req("GET", `${BASE}/inbox`, null);
  tests.push({ name: "13. GET inbox", status: r.status, res: r.body });

  // ===== CHAT =====
  r = await req("GET", `${BASE}/chat/test-chat-id/messages`, null);
  tests.push({ name: "14. GET chat/<id>/messages", status: r.status, res: r.body });

  r = await req("POST", `${BASE}/chat/test-chat-id/messages`, {
    senderId: "user123",
    text: "Hello! When is the match?",
    messageType: "text",
    time: "4:00 PM"
  });
  tests.push({ name: "15. POST chat/<id>/messages (send msg)", status: r.status, res: r.body });

  // ===== GROUP =====
  r = await req("GET", `${BASE}/group/test-group-id/info`, null);
  tests.push({ name: "16. GET group/<id>/info", status: r.status, res: r.body });

  r = await req("PATCH", `${BASE}/group/test-group-id`, {
    name: "New Group Name",
    description: "New description"
  });
  tests.push({ name: "17. PATCH group/<id> (update name/desc)", status: r.status, res: r.body });

  r = await req("PUT", `${BASE}/group/test-group-id`, {
    name: "New Group Name"
  });
  tests.push({ name: "18. PUT group/<id>", status: r.status, res: r.body });

  r = await req("PATCH", `${BASE}/group/test-group-id/members/member-id-1`, {
    role: "admin"
  });
  tests.push({ name: "19. PATCH group/<id>/members/<id> (role)", status: r.status, res: r.body });

  r = await req("DELETE", `${BASE}/group/test-group-id/members/member-id-1`, null);
  tests.push({ name: "20. DELETE group/<id>/members/<id> (remove)", status: r.status, res: r.body });

  // ===== COMMUNITY =====
  r = await req("GET", `${BASE}/community/posts`, null);
  tests.push({ name: "21. GET community/posts", status: r.status, res: r.body });

  r = await req("POST", `${BASE}/community/posts`, {
    postedBy: "test_player",
    name: "Team Alpha",
    orgName: "Alpha Esports",
    ownerName: "Vijay",
    experience: "3 years",
    since: "2021",
    description: "Looking for players for BGMI squad",
    achievements: "State Champions 2023",
    overallPlayers: "5",
    category: "Team",
    youtube: "https://youtube.com",
    instagram: "https://instagram.com",
    discord: "https://discord.gg"
  });
  tests.push({ name: "22. POST community/posts (create post)", status: r.status, res: r.body });

  // ===== CONTACT =====
  r = await req("POST", `${BASE}/contact`, {
    name: "Test User",
    email: "test@example.com",
    message: "I need help with my account"
  });
  tests.push({ name: "23. POST contact", status: r.status, res: r.body });

  // ===== PRINT REPORT =====
  console.log("\n");
  console.log("=".repeat(70));
  console.log("   FULL API TEST REPORT - STG APP");
  console.log("=".repeat(70));

  let working = 0, missing = 0, crash = 0, methodErr = 0, other = 0;

  for (const t of tests) {
    const lbl = label(t.status);
    console.log(`\n${lbl}`);
    console.log(`  ${t.name}`);
    if (t.status < 200 || t.status >= 300) {
      console.log(`  Response: ${t.res.substring(0, 120)}`);
    }
    if (t.status >= 200 && t.status < 300) working++;
    else if (t.status === 404) missing++;
    else if (t.status === 500) crash++;
    else if (t.status === 405) methodErr++;
    else other++;
  }

  console.log("\n" + "=".repeat(70));
  console.log(`SUMMARY: ? ${working} Working | ? ${missing} Missing | ?? ${crash} Crashes | ?? ${methodErr} Method Errors | ? ${other} Other`);
  console.log("=".repeat(70));
}

run();
