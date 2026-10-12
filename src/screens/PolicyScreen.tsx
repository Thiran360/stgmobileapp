import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';

const PolicyScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { title } = route.params || { title: 'Policy' };

    const getContent = () => {
    switch (title) {
      case 'Privacy Policy':
        return "We value your privacy. We collect data necessary for providing tournament and gaming services, such as your profile info and match statistics.\n\nWe do not sell your personal data to third parties. All user data is encrypted and securely stored.\n\nYou have the right to request deletion of your account at any time. For detailed information, please contact our support team.";
      case 'Terms of Service':
        return "Welcome to UPMI! By using our app, you agree to abide by our community guidelines.\n\nAny form of cheating, toxicity, or harassment in tournaments will result in an immediate ban.\n\nWe reserve the right to suspend accounts that violate these terms. Users must be 13 years or older to participate in cash prize tournaments.";
      case 'Paid Service Terms':
        return "Our PRO memberships and paid tournament entries are non-refundable unless specified otherwise.\n\nSubscriptions are billed automatically unless canceled at least 24 hours before the renewal date.\n\nUPMI is not responsible for prize pool payouts managed by third-party organizers.";
      default:
        return "Content not available.";
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>
      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.text}>{getContent()}</Text>
        <Text style={styles.lastUpdated}>Last updated: September 2026</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F8' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#FFFFFF', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, zIndex: 10 },
  backBtn: { marginRight: 15, padding: 4 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  content: { flex: 1, padding: 20 },
  text: { fontSize: 15, color: '#4B5563', lineHeight: 26, textAlign: 'justify' },
  lastUpdated: { fontSize: 14, color: '#9CA3AF', marginTop: 30, fontStyle: 'italic' }
});

export default PolicyScreen;

