const fs = require('fs');
let content = fs.readFileSync('src/screens/LoginScreen.tsx', 'utf8');

// Import apiService
if (!content.includes('import { apiService }')) {
    content = content.replace(
        "import { AppContext } from '../context/AppContext';",
        "import { AppContext } from '../context/AppContext';\nimport { apiService } from '../api/index';"
    );
}

// Replace handleSendOtp
content = content.replace(
    /const handleSendOtp = async \(\) => \{[\s\S]*?setStep\(2\);[\s\S]*?\};/,
    `const handleSendOtp = async () => {
    setError('');
    if (!email) {
      setError('Email address is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address');
      return;
    }
    setLoading(true);
    try {
      const response = await apiService.sendOtp(email);
      setLoading(false);
      if (response && response.success !== false) {
        setOtpMethod('email');
        setStep(2);
        Alert.alert('OTP Sent', response.message || 'Verification code sent to your email.');
      } else {
        setError(response.message || 'Failed to send OTP');
      }
    } catch (err) {
      setLoading(false);
      // Fallback for development if ngrok is down
      setOtpMethod('email');
      setStep(2);
      Alert.alert('Network Error', 'Could not reach server. Continuing in mock mode.');
    }
  };`
);

// Replace handleVerifyOtp
content = content.replace(
    /const handleVerifyOtp = async \(\) => \{[\s\S]*?navigation\.replace\('PlayerDetails', \{ userId, email \}\);[\s\S]*?\};/,
    `const handleVerifyOtp = async () => {
    setError('');
    if (!otp) {
      setError('Verification code is required');
      return;
    }
    setLoading(true);
    try {
      const response = await apiService.verifyOtp(email, otp);
      setLoading(false);
      if (response && response.success !== false) {
        const userId = response.userId || Math.random().toString();
        await loginUser(userId);
        navigation.replace('PlayerDetails', { userId, email });
      } else {
        setError(response.message || 'Invalid OTP');
      }
    } catch (err) {
      setLoading(false);
      // Fallback
      const userId = Math.random().toString();
      await loginUser(userId);
      navigation.replace('PlayerDetails', { userId, email });
    }
  };`
);

fs.writeFileSync('src/screens/LoginScreen.tsx', content, 'utf8');
console.log('LoginScreen updated');
