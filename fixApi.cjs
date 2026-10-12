const fs = require('fs');
let c = fs.readFileSync('src/api/index.ts', 'utf8');

c = c.replace(
  "sendOtp: async (email: string) => {",
  "sendOtp: async (mobile: string) => {"
);
c = c.replace(
  "body: JSON.stringify({ email })",
  "body: JSON.stringify({ mobile })"
);

c = c.replace(
  "verifyOtp: async (email: string, otp: string) => {",
  "verifyOtp: async (mobile: string, otp: string) => {"
);
c = c.replace(
  "body: JSON.stringify({ email, otp })",
  "body: JSON.stringify({ mobile, otp })"
);

fs.writeFileSync('src/api/index.ts', c, 'utf8');
console.log('Fixed api/index.ts');
