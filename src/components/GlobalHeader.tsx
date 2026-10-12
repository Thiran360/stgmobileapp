import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../context/AppContext';

const GlobalHeader = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { setIsDrawerOpen } = React.useContext(AppContext);

  return (
    <View style={[styles.navbar, { paddingTop: insets.top + 10 }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      <View style={styles.navLeft}>
        <TouchableOpacity onPress={() => setIsDrawerOpen(true)}>
          <Icon name="menu" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>UPMI</Text>
        </View>
        <TouchableOpacity style={styles.proBadge}>
          <Text style={styles.proText}>PRO @ â‚¹199</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.navRight}>
        <TouchableOpacity onPress={() => navigation.navigate('InboxScreen')}>
          <Icon name="chatbubble-ellipses-outline" size={24} color="#FFFFFF" style={styles.navIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: '#E51025',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 12,
  },
  navLeft: { flexDirection: 'row', alignItems: 'center' },
  logoContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 15 },
  logoText: { color: '#FFFFFF', fontSize: 20, fontWeight: '900', fontStyle: 'italic', marginTop: 2, paddingRight: 4 },
  proBadge: { borderWidth: 1, borderColor: '#FFFFFF', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  proText: { color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' },
  navRight: { flexDirection: 'row', alignItems: 'center' },
  navIcon: { marginLeft: 15 },
});

export default GlobalHeader;







