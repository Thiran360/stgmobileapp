import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../theme/colors';

const CoachesScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const [coaches, setCoaches] = useState<any[]>([
    {
      id: 1,
      name: 'Hari Narayanan S',
      avatar: 'https://i.pravatar.cc/150?img=11',
      matches: 17,
      points: 1616,
      feeMatch: 600,
      feeDay: 1800,
      badge: true,
    },
    {
      id: 2,
      name: 'Kesavan',
      avatar: 'https://i.pravatar.cc/150?img=12',
      matches: 2,
      points: 697,
      feeMatch: 300,
      feeDay: 650,
      badge: false,
    }
  ]);

  useEffect(() => {
    if (route.params?.newCoach) {
      setCoaches((prev) => [...prev, route.params.newCoach]);
      // clear the param so it doesn't get added twice on re-render
      navigation.setParams({ newCoach: undefined });
    }
  }, [route.params?.newCoach]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={colors.textBlack} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Coaches</Text>
        </View>
        <View style={styles.headerRight}>
          <Icon name="search-outline" size={22} color={colors.white} style={{ marginLeft: 15 }} />
          <Icon name="share-social-outline" size={22} color={colors.textBlack} style={{ marginLeft: 15 }} />
          <Icon name="options-outline" size={22} color={colors.textBlack} style={{ marginLeft: 15 }} />
        </View>
      </View>

      <View style={styles.subHeader}>
        <Text style={styles.subHeaderText}>
          Top coaches of <Text style={styles.highlightText}>Erode - July</Text>
        </Text>
        <Icon name="information-circle-outline" size={20} color="#757575" />
      </View>

      <View style={{ height: 40, marginBottom: 10 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
          <TouchableOpacity style={[styles.filterPill, styles.activeFilterPill]}>
            <Text style={[styles.filterPillText, styles.activeFilterPillText]}>T1 Scrims</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterPill}>
            <Text style={styles.filterPillText}>T2 Scrims</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterPill}>
            <Text style={styles.filterPillText}>Classic</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterPill}>
            <Text style={styles.filterPillText}>Custom Rooms</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView style={styles.content}>
        {coaches.map((coach, index) => (
          <View style={styles.card} key={coach.id}>
            <View style={styles.cardTop}>
              <Image source={{uri: coach.avatar}} style={styles.avatar} />
              <View style={styles.cardInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.nameText}>{coach.name}</Text>
                  {coach.badge && <Icon name="ribbon-outline" size={16} color="#059669" style={{marginLeft: 4}} />}
                </View>
                <Text style={styles.statText}>Matches Coached: <Text style={styles.statBold}>{coach.matches}</Text></Text>
                <Text style={styles.statText}>Total points = <Text style={styles.statHighlight}>{coach.points}</Text></Text>
              </View>
              <Text style={styles.rankText}>{index + 1}</Text>
            </View>
            <View style={styles.cardBottom}>
              <Text style={styles.feeText}>â‚¹{coach.feeDay}/day, {coach.feeMatch}/match</Text>
              <Icon name="chatbubble-ellipses-outline" size={20} color="#059669" />
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View all</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('AddCoach')}>
          <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: '#E51025',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: colors.textBlack,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  headerRight: {
    flexDirection: 'row',
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#F3F4F6',
  },
  subHeaderText: {
    fontSize: 14,
    color: colors.textBlack,
    fontWeight: 'bold',
  },
  highlightText: {
    color: '#059669',
  },
  filterBar: {
    paddingHorizontal: 15,
  },
  filterPill: {
    borderWidth: 1,
    borderColor: '#059669',
    borderRadius: 20,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: colors.white,
    height: 32,
  },
  activeFilterPill: {
    backgroundColor: '#059669',
  },
  filterPillText: {
    color: '#059669',
    fontSize: 13,
  },
  activeFilterPillText: {
    color: colors.white,
  },
  content: {
    padding: 15,
    flex: 1,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardTop: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  cardInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textBlack,
  },
  statText: {
    fontSize: 12,
    color: colors.textGray,
    marginBottom: 2,
  },
  statBold: {
    color: colors.white,
    fontWeight: 'bold',
  },
  statHighlight: {
    color: '#059669',
    fontWeight: 'bold',
  },
  rankText: {
    fontSize: 32,
    fontWeight: '300',
    color: colors.textBlack,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  feeText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  bottomBar: {
    flexDirection: 'row',
    height: 50,
  },
  viewAllButton: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewAllText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
  registerButton: {
    flex: 1,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default CoachesScreen;


