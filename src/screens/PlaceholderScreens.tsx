import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../theme/colors';

export const LookingScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>ðŸ” Looking Screen Placeholder</Text>
  </View>
);

export const MatchesScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>ðŸ† Matches Screen Placeholder</Text>
  </View>
);

export const CommunityScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>ðŸ‘¥ Community Screen Placeholder</Text>
  </View>
);



export const ActivityScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Your Activity Screen Placeholder</Text>
  </View>
);

export const SavedScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Saved Screen Placeholder</Text>
  </View>
);

export const CloseFriendsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Close Friends Screen Placeholder</Text>
  </View>
);

export const BlockedScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Blocked Screen Placeholder</Text>
  </View>
);

export { default as StoreScreen } from './StoreScreen';

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F6' },
  text: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginBottom: 10 },
  subText: { fontSize: 16, color: '#6B7280' },
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  navbar: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    alignItems: 'center',
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogo: {
    width: 34,
    height: 34,
    borderRadius: 17,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.lightGray,
    resizeMode: 'cover',
    marginHorizontal: 10,
  },
  proBadge: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  proText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  navRight: {
    flexDirection: 'row',
  },
  comingSoonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#F3F4F6',
  },
  comingSoonTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
    textAlign: 'center',
  },
  comingSoonSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
});





