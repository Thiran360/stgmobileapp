import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  Platform,
  ImageBackground,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAvoidingView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../theme/colors';
import { AppContext } from '../context/AppContext';
import { apiService } from '../api/index';

const { height } = Dimensions.get('window');

const LoginScreen = ({ navigation }: any) => {
  const { loginUser, setUserProfile } = useContext(AppContext);
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async () => {
    if (mobile.length !== 10) { setError('Enter a valid 10-digit mobile number'); return; }
    setLoading(true); setError('');
    try {
      const response = await apiService.sendOtp(mobile);
      if (response.status === true || response.status === 'success' || response.success) {
        setStep(2);
      } else {
        setError(response.message || 'Failed to send OTP');
      }
    } catch { setError('Network Error. Could not reach server.'); }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 4) { setError('Enter the OTP sent to your number'); return; }
    setLoading(true); setError('');
    try {
      const response = await apiService.verifyOtp(mobile, otp);
      setLoading(false);
      if (response.status === true || response.status === 'success' || response.success) {
        const userId = response.user_id?.toString() || response.userId?.toString() || response.data?.user_id?.toString() || mobile;
        const profileExists = await loginUser(userId);
        if (profileExists) { navigation.replace('MainTabs'); }
        else { navigation.replace('PlayerDetails', { userId, mobileNumber: mobile }); }
      } else { setError(response.message || 'Invalid OTP'); }
    } catch { setLoading(false); setError('Network Error. Could not reach server.'); }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* ── FULL SCREEN HERO IMAGE ── */}
      <ImageBackground
        source={require('../assets/images/upmi_login_hero.jpg')}
        style={styles.hero}
        resizeMode="cover"
      >
        {/* UPMI badge top-left */}
        <View style={[styles.logoRow, { marginTop: insets.top + 12 }]}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>U</Text>
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.logoTitle}>UPMI</Text>
            <Text style={styles.logoSub}>BATTLEGROUNDS MOBILE INDIA</Text>
          </View>
        </View>

        {/* Bottom text overlaid on image */}
        <View style={styles.heroTextBlock}>
          <Text style={styles.heroSquad}>SQUAD UP</Text>
          <Text style={styles.heroDominate}>DOMINATE TOGETHER</Text>
          <Text style={styles.heroTagline}>Play. Connect. Climb Ranks.</Text>
          <View style={styles.heroUnderline} />
        </View>
      </ImageBackground>

      {/* ── WHITE BOTTOM SHEET ── */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.sheet}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
        {/* pill */}
        <View style={styles.pillRow}>
          <View style={[styles.pill, { backgroundColor: colors.primary, width: 24 }]} />
          <View style={[styles.pill, { backgroundColor: '#E5E7EB', width: 14 }]} />
        </View>

        {step === 1 ? (
          <>
            <Text style={styles.welcomeText}>
              Welcome to <Text style={{ color: colors.primary }}>UPMI</Text>
            </Text>
            <Text style={styles.welcomeSub}>Enter your mobile number to continue</Text>

            <View style={styles.phoneRow}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>+91</Text>
                <Icon name="chevron-down" size={14} color="#6B7280" style={{ marginLeft: 4 }} />
              </View>
              <TextInput
                style={styles.phoneInput}
                placeholder="Enter your mobile number"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                maxLength={10}
                value={mobile}
                onChangeText={(t) => { setMobile(t.replace(/[^0-9]/g, '')); setError(''); }}
              />
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {loading
              ? <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
              : (
                <TouchableOpacity style={styles.loginBtn} onPress={handleSendOtp} activeOpacity={0.85}>
                  <Text style={styles.loginBtnText}>Login</Text>
                  <Icon name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
                </TouchableOpacity>
              )}
          </>
        ) : (
          <>
            <Text style={styles.welcomeText}>
              Verify <Text style={{ color: colors.primary }}>OTP</Text>
            </Text>
            <Text style={styles.welcomeSub}>Code sent to +91 {mobile}</Text>

            <TextInput
              style={styles.otpInput}
              placeholder="Enter OTP"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={(t) => { setOtp(t.replace(/[^0-9]/g, '')); setError(''); }}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {loading
              ? <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
              : (
                <>
                  <TouchableOpacity style={styles.loginBtn} onPress={handleVerifyOtp} activeOpacity={0.85}>
                    <Text style={styles.loginBtnText}>Verify & Continue</Text>
                    <Icon name="checkmark" size={20} color="#fff" style={{ marginLeft: 8 }} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.backBtn} onPress={() => { setStep(1); setOtp(''); setError(''); }}>
                    <Text style={styles.backBtnText}>← Edit Mobile Number</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { setOtp(''); handleSendOtp(); }} style={{ marginTop: 10 }}>
                    <Text style={styles.resendText}>
                      Didn't receive OTP?{'  '}
                      <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Resend</Text>
                    </Text>
                  </TouchableOpacity>
                </>
              )}
          </>
        )}

        <Text style={styles.termsText}>By continuing, you agree to our Terms & Privacy Policy</Text>

        <TouchableOpacity onPress={() => {
          setUserProfile({
            id: 'guest', fullName: 'Guest', username: 'guest',
            followers: 0, following: 0, liveLocation: '', gender: '',
            dateOfBirth: '', mobileNumber: '', email: '', profilePicture: null,
          });
          navigation.replace('MainTabs', { userName: 'Guest' });
        }}>
          <Text style={styles.guestText}>Continue as Guest</Text>
        </TouchableOpacity>

        {/* bottom safe area spacer */}
        <View style={{ height: insets.bottom + 8 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  hero: {
    height: height * 0.50,
    justifyContent: 'space-between',
  },
  heroDarkOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '55%',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  heroTextBlock: {
    paddingHorizontal: 20,
    paddingBottom: 22,
  },
  heroSquad: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  heroDominate: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  heroTagline: {
    fontSize: 13,
    color: '#F3F4F6',
    fontWeight: '600',
    marginTop: 4,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  heroUnderline: {
    width: 40,
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: 2,
    marginTop: 8,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBadgeText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 22,
    fontStyle: 'italic',
  },
  logoTitle: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 18,
    letterSpacing: 1,
  },
  logoSub: {
    color: '#E5E7EB',
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  sheet: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
  },
  pillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 18,
  },
  pill: {
    height: 5,
    borderRadius: 3,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 5,
    textAlign: 'center',
  },
  welcomeSub: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 22,
    textAlign: 'center',
  },
  phoneRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  countryCodeText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  phoneInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    fontSize: 24,
    color: '#111827',
    paddingVertical: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 10,
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
  },
  errorText: {
    color: colors.primary,
    fontSize: 13,
    marginBottom: 8,
    textAlign: 'center',
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 50,
    paddingVertical: 17,
    marginTop: 4,
    marginBottom: 14,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  backBtn: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 50,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 8,
  },
  backBtnText: {
    color: '#6B7280',
    fontSize: 15,
    fontWeight: '600',
  },
  resendText: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
  },
  termsText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 18,
  },
  guestText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default LoginScreen;
