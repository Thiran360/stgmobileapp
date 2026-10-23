import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

export const StoreScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0F17" />
      
      <View style={styles.container}>
        {/* Ambient Glows */}
        <View style={styles.glowTop} />
        <View style={styles.glowBottom} />

        {/* Static Poster Card */}
        <View style={styles.posterCard}>
          <View style={styles.iconCircle}>
            <Icon name="cart" size={48} color="#E51025" />
          </View>

          <View style={styles.tagBadge}>
            <View style={styles.tagDot} />
            <Text style={styles.tagText}>OFFICIAL MERCHANDISE</Text>
          </View>

          <Text style={styles.brandTitle}>UPMI STORE</Text>
          
          <View style={styles.divider} />

          <Text style={styles.comingSoonText}>COMING SOON</Text>
          
          <Text style={styles.subtitle}>
            Exclusive Esports Jerseys, Gaming Sleeves & Pro Accessories
          </Text>

          <View style={styles.footerNote}>
            <Icon name="sparkles" size={16} color="#F59E0B" style={{ marginRight: 6 }} />
            <Text style={styles.footerNoteText}>Launching Soon • Stay Tuned</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default StoreScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0D0F17',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#0D0F17',
    position: 'relative',
  },
  glowTop: {
    position: 'absolute',
    top: '15%',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(229, 16, 37, 0.12)',
  },
  glowBottom: {
    position: 'absolute',
    bottom: '15%',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
  },
  posterCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#131722',
    borderRadius: 24,
    paddingVertical: 44,
    paddingHorizontal: 28,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#262D40',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#1C1522',
    borderWidth: 2,
    borderColor: '#E51025',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 22,
    shadowColor: '#E51025',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E2333',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#374151',
    marginBottom: 16,
  },
  tagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E51025',
    marginRight: 6,
  },
  tagText: {
    color: '#9CA3AF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
    textAlign: 'center',
  },
  divider: {
    width: 48,
    height: 3,
    backgroundColor: '#E51025',
    borderRadius: 2,
    marginVertical: 16,
  },
  comingSoonText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#E51025',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
    marginBottom: 24,
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1F2C',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  footerNoteText: {
    color: '#F3F4F6',
    fontSize: 12,
    fontWeight: '600',
  },
});
