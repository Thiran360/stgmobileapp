const https = require("https");
const BASE = "https://seclusion-yahoo-swipe.ngrok-free.dev/stg_app";

async function req(method, url, body) {
  return new Promise((resolve) => {
    const u = new URL(url);
    const opts = { hostname: u.hostname, path: u.pathname, method, headers: { "ngrok-skip-browser-warning": "true" } };
    let pd = JSON.stringify(body);
    opts.headers["Content-Type"] = "application/json";
    opts.headers["Content-Length"] = Buffer.byteLength(pd);
    const r = https.request(opts, (res) => {
      let d = "";
      res.on("data", c => d += c);
      res.on("end", () => resolve({ status: res.statusCode, body: d }));
    });
    r.on("error", (e) => resolve({ status: "ERR", body: e.message }));
    r.write(pd);
    r.end();
  });
}

async function run() {
  console.log("Testing different mobile number formats...\n");

  // Test 1: plain 10 digit
  let r = await req("POST", `${BASE}/auth/send-otp`, { mobile: "9876543210" });
  console.log(`[${r.status}] mobile: "9876543210" => ${r.body}`);

  // Test 2: with +91
  r = await req("POST", `${BASE}/auth/send-otp`, { mobile: "+919876543210" });
  console.log(`[${r.status}] mobile: "+919876543210" => ${r.body}`);

  // Test 3: with 91
  r = await req("POST", `${BASE}/auth/send-otp`, { mobile: "919876543210" });
  console.log(`[${r.status}] mobile: "919876543210" => ${r.body}`);

  // Test 4: phone_number key
  r = await req("POST", `${BASE}/auth/send-otp`, { phone_number: "9876543210" });
  console.log(`[${r.status}] phone_number: "9876543210" => ${r.body}`);

  // Test 5: phone key
  r = await req("POST", `${BASE}/auth/send-otp`, { phone: "9876543210" });
  console.log(`[${r.status}] phone: "9876543210" => ${r.body}`);

  // Test 6: email key (maybe backend still uses email)
  r = await req("POST", `${BASE}/auth/send-otp`, { email: "9876543210" });
  console.log(`[${r.status}] email: "9876543210" => ${r.body}`);
}
run();
