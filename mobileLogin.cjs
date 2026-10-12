const fs = require('fs');
let c = fs.readFileSync('src/screens/LoginScreen.tsx', 'utf8');

// Replace state declarations
c = c.replace("const [step, setStep] = useState(1); // 1 = Email input, 2 = OTP verification input", "const [step, setStep] = useState(1); // 1 = Mobile input, 2 = OTP verification");
c = c.replace("const [email, setEmail] = useState('');", "const [mobile, setMobile] = useState('');");
c = c.replace("const [otpMethod, setOtpMethod] = useState<'email'>('email');", "");

// Replace handleSendOtp validation
c = c.replace(
  `    if (!email) {\n      setError('Email address is required');\n      return;\n    }\n    if (!/^[^s@]+@[^s@]+.[^s@]+$/.test(email)) {\n      setError('Enter a valid email address');\n      return;\n    }`,
  `    if (!mobile) {\n      setError('Mobile number is required');\n      return;\n    }\n    if (!/^[6-9]\\d{9}$/.test(mobile)) {\n      setError('Enter a valid 10-digit mobile number');\n      return;\n    }`
);

// Replace sendOtp call
c = c.replace("const response = await apiService.sendOtp(email);", "const response = await apiService.sendOtp(mobile);");
c = c.replace("setOtpMethod('email');\n        setStep(2);", "setStep(2);");

// Replace verifyOtp call
c = c.replace("const response = await apiService.verifyOtp(email, otp);", "const response = await apiService.verifyOtp(mobile, otp);");
c = c.replace(
  "const userId = response.userId || response.data?.user_id || email;\n        await loginUser(userId);\n        navigation.replace('PlayerDetails', { userId, email });",
  "const userId = response.userId || response.data?.user_id || mobile;\n        await loginUser(userId);\n        navigation.replace('PlayerDetails', { userId, mobile });"
);

// Replace JSX - Step 1 UI
c = c.replace("<Icon name=\"mail-outline\" size={14} /> Enter Email Address", "<Icon name=\"phone-portrait-outline\" size={14} /> Enter Mobile Number");
c = c.replace(`                  placeholder=\"example@gmail.com\"`, `                  placeholder=\"9876543210\"`);
c = c.replace("                  keyboardType=\"email-address\"", "                  keyboardType=\"number-pad\"");
c = c.replace("                  autoCapitalize=\"none\"", "                  maxLength={10}");
c = c.replace(
  `                  value={email}\n                  onChangeText={(text) => {\n                    setEmail(text);\n                    if (error) setError('');\n                  }}`,
  `                  value={mobile}\n                  onChangeText={(text) => {\n                    setMobile(text.replace(/[^0-9]/g, ''));\n                    if (error) setError('');\n                  }}`
);

// Replace button text
c = c.replace("<Icon name=\"mail\" size={20} color=\"#FFFFFF\" style={{ marginRight: 10 }} />", "<Icon name=\"phone-portrait\" size={20} color=\"#FFFFFF\" style={{ marginRight: 10 }} />");
c = c.replace("<Text style={styles.buttonTextWhite}>GET OTP VIA EMAIL</Text>", "<Text style={styles.buttonTextWhite}>GET OTP</Text>");
c = c.replace(`                Sent to {email}`, `                Sent to +91 {mobile}`);
c = c.replace("<Text style={styles.buttonTextBack}>Edit Email Address</Text>", "<Text style={styles.buttonTextBack}>Edit Mobile Number</Text>");

// Change button color from red (email) to primary
c = c.replace("style={[styles.whatsappButton, { marginTop: 15, backgroundColor: '#EA4335' }]}", "style={[styles.whatsappButton, { marginTop: 15, backgroundColor: colors.primary }]}");

fs.writeFileSync('src/screens/LoginScreen.tsx', c, 'utf8');
console.log('Done! Email -> Mobile login updated.');
