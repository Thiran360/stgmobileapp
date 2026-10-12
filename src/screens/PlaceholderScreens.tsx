import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../theme/colors';

export const LookingScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Ã°Å¸â€Â Looking Screen Placeholder</Text>
  </View>
);

export const MatchesScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Ã°Å¸Ââ€  Matches Screen Placeholder</Text>
  </View>
);

export const CommunityScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Ã°Å¸â€˜Â¥ Community Screen Placeholder</Text>
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

export const StoreScreen = () => {
  const dummyProducts = [
    { id: '1', name: 'BGMI Official T-Shirt', price: '₹499', image: 'https://m.media-amazon.com/images/I/51BqjU91UeL._AC_UY1100_.jpg' },
    { id: '2', name: 'Gaming Finger Sleeves', price: '₹149', image: 'https://m.media-amazon.com/images/I/61I20rE3-sL.jpg' },
    { id: '3', name: 'Mobile Gaming Triggers', price: '₹299', image: 'https://m.media-amazon.com/images/I/61k8wIqFmEL.jpg' },
    { id: '4', name: 'BGMI Logo Cap', price: '₹349', image: 'https://m.media-amazon.com/images/I/51r5rU8Bv6L._AC_UY1100_.jpg' },
    { id: '5', name: 'PUBG/BGMI Keychain', price: '₹99', image: 'https://m.media-amazon.com/images/I/51h1d85J4+L._AC_UY1100_.jpg' },
    { id: '6', name: 'Gaming Earbuds', price: '₹1299', image: 'https://m.media-amazon.com/images/I/61j3VLuQB+L.jpg' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6' }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#FFFFFF', elevation: 2 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827', flex: 1 }}>UPMI Merch Store</Text>
        <Icon name="cart-outline" size={24} color="#111827" />
      </View>

      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 10, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }} scrollEnabled={false}>
          {dummyProducts.map(prod => (
            <View key={prod.id} style={{ width: '48%', backgroundColor: '#FFF', borderRadius: 12, padding: 10, marginBottom: 15, elevation: 1 }}>
              <Image source={{ uri: prod.image }} style={{ width: '100%', height: 120, borderRadius: 8, resizeMode: 'cover', marginBottom: 10 }} />
              <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#111827', marginBottom: 5 }} numberOfLines={1}>{prod.name}</Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#E51025' }}>{prod.price}</Text>
              <TouchableOpacity style={{ backgroundColor: '#111827', paddingVertical: 6, borderRadius: 6, alignItems: 'center', marginTop: 10 }}>
                <Text style={{ color: '#FFF', fontSize: 12, fontWeight: 'bold' }}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.85)', justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
          <Icon name="lock-closed" size={48} color="#E51025" style={{ marginBottom: 15 }} />
          <Text style={{ fontSize: 26, fontWeight: '900', color: '#111827', letterSpacing: -0.5, marginBottom: 8, textAlign: 'center' }}>STORE IS COMING SOON</Text>
          <Text style={{ fontSize: 15, color: '#6B7280', textAlign: 'center', paddingHorizontal: 40, lineHeight: 22 }}>
            We are curating the best esports merchandise for you. Drop back soon!
          </Text>
          <TouchableOpacity style={{ backgroundColor: '#E51025', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 25, marginTop: 25 }}>
            <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 }}>Notify Me</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

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





