const https = require("https");
const BASE = "https://melany-countable-patti.ngrok-free.dev/stg_app";

async function req(method, url, body) {
  return new Promise((resolve) => {
    const u = new URL(url);
    const opts = { hostname: u.hostname, path: u.pathname, method, headers: { "ngrok-skip-browser-warning": "true" } };
    let pd = "";
    if (body) {
      pd = JSON.stringify(body);
      opts.headers["Content-Type"] = "application/json";
      opts.headers["Content-Length"] = Buffer.byteLength(pd);
    }
    const r = https.request(opts, (res) => {
      let d = "";
      res.on("data", c => d += c);
      res.on("end", () => resolve({ status: res.statusCode, body: d.substring(0, 200) }));
    });
    r.on("error", (e) => resolve({ status: "ERR", body: e.message }));
    if (pd) r.write(pd);
    r.end();
  });
}

async function run() {
  let r;

  // PUT group
  r = await req("PUT", `${BASE}/group/test-group-id`, { name: "New Group Name", description: "New Desc" });
  console.log(`[${r.status}] PUT group/<id> => ${r.body.substring(0,100)}`);

  // PUT group member
  r = await req("PUT", `${BASE}/group/test-group-id/members/member-id-1`, { role: "admin" });
  console.log(`[${r.status}] PUT group/<id>/members/<id> => ${r.body.substring(0,100)}`);

  // POST contact
  r = await req("POST", `${BASE}/contact`, { name: "Test", email: "test@test.com", message: "Hi" });
  console.log(`[${r.status}] POST contact => ${r.body.substring(0,100)}`);
  
  r = await req("POST", `${BASE}/contact/`, { name: "Test", email: "test@test.com", message: "Hi" });
  console.log(`[${r.status}] POST contact/ (with slash) => ${r.body.substring(0,100)}`);
}
run();
