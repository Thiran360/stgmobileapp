const fs = require('fs');
let content = fs.readFileSync('src/screens/LoginScreen.tsx', 'utf8');

// 1. Rewrite handleSendOtp
content = content.replace(
    /const handleSendOtp = async \(\) => \{[\s\S]*?const handleVerifyOtp = async \(\) => \{/,
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
      if (response && (response.status === 'success' || response.success)) {
        setOtpMethod('email');
        setStep(2);
      } else {
        setError(response.message || 'Failed to send OTP');
      }
    } catch (err) {
      setLoading(false);
      setError('Network Error. Could not reach server.');
    }
  };

  const handleVerifyOtp = async () => {`
);

// 2. Rewrite handleVerifyOtp
content = content.replace(
    /const handleVerifyOtp = async \(\) => \{[\s\S]*?const handleResendOtp = \(\) => \{/,
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
      if (response && (response.status === 'success' || response.success)) {
        const userId = response.userId || response.data?.user_id || email;
        await loginUser(userId);
        navigation.replace('PlayerDetails', { userId, email });
      } else {
        setError(response.message || 'Invalid OTP');
      }
    } catch (err) {
      setLoading(false);
      setError('Network Error. Could not reach server.');
    }
  };

  const handleResendOtp = () => {`
);

// 3. Rewrite handleResendOtp
content = content.replace(
    /const handleResendOtp = \(\) => \{[\s\S]*?return \(/,
`const handleResendOtp = () => {
    setOtp('');
    handleSendOtp();
  };

  return (`
);

// 4. Remove the Tip Card
const tipCardRegex = /<View style=\{styles\.tipCard\}>[\s\S]*?<\/View>/;
content = content.replace(tipCardRegex, '');

fs.writeFileSync('src/screens/LoginScreen.tsx', content, 'utf8');
console.log('LoginScreen updated to remove mock logic');
