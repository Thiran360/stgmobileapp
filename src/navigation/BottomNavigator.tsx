import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import LookingScreen from '../screens/LookingScreen';
import CommunityScreen from '../screens/CommunityScreen';
import MatchesScreen from '../screens/MatchesScreen';
import { StoreScreen } from '../screens/PlaceholderScreens';
import GlobalHeader from '../components/GlobalHeader';
import CustomDrawer from '../components/CustomDrawer';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

const BottomNavigator = ({ route }: any) => {
  const userName = route?.params?.userName || 'Guest';
  const insets = useSafeAreaInsets();

  return (
    <>
      <CustomDrawer />
      <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        header: () => <GlobalHeader />,
        tabBarIcon: ({ focused }) => {
          let iconName = 'home-outline';
          if (route.name === 'Home') iconName = 'home-outline';
          if (route.name === 'Looking') iconName = 'search-outline';
          if (route.name === 'Matches') iconName = 'trophy-outline';
          if (route.name === 'Community') iconName = 'people-outline';
          if (route.name === 'Store') iconName = 'cart-outline';

          return (
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, width: '100%' }}>
              {focused && (
                <View style={{ position: 'absolute', top: -5, width: 35, height: 3, backgroundColor: colors.primary, borderBottomLeftRadius: 3, borderBottomRightRadius: 3 }} />
              )}
              <Icon name={iconName} size={24} color={focused ? colors.primary : colors.textGray} style={{ marginTop: focused ? -3 : 0 }} />
            </View>
          );
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textGray,
        tabBarItemStyle: {
          paddingTop: 5,
        },
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 0,
          elevation: 15,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} initialParams={{ userName }} />
      <Tab.Screen name="Looking" component={LookingScreen} />
      <Tab.Screen name="Matches" component={MatchesScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen name="Store" component={StoreScreen} />
    </Tab.Navigator>
    </>
  );
};

export default BottomNavigator;

