import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppContext, AppContextProvider } from './src/context/AppContext';
import { ActivityIndicator, View } from 'react-native';

import LoginScreen from './src/screens/LoginScreen';
import PlayerDetailsScreen from './src/screens/PlayerDetailsScreen';
import BottomNavigator from './src/navigation/BottomNavigator';
import CoachesScreen from './src/screens/CoachesScreen';
import AddCoachScreen from './src/screens/AddCoachScreen';
import CommentatorsScreen from './src/screens/CommentatorsScreen';
import AddCommentatorScreen from './src/screens/AddCommentatorScreen';
import StreamersScreen from './src/screens/StreamersScreen';
import AddStreamerScreen from './src/screens/AddStreamerScreen';
import OrganisersScreen from './src/screens/OrganisersScreen';
import AddOrganiserScreen from './src/screens/AddOrganiserScreen';
import CreateTournamentScreen from './src/screens/CreateTournamentScreen';
import PointSystemScreen from './src/screens/PointSystemScreen';
import ManageTeamsScreen from './src/screens/ManageTeamsScreen';
import TournamentDashboardScreen from './src/screens/TournamentDashboardScreen';
import TournamentFlyersScreen from './src/screens/TournamentFlyersScreen';
import TeamRegistrationScreen from './src/screens/TeamRegistrationScreen';
import RegisteredTeamsScreen from './src/screens/RegisteredTeamsScreen';
import TournamentFlyerEditScreen from './src/screens/TournamentFlyerEditScreen';
import TournamentConfirmationScreen from './src/screens/TournamentConfirmationScreen';
import ChatScreen from './src/screens/ChatScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import PolicyScreen from './src/screens/PolicyScreen';
import CommunityListScreen from './src/screens/CommunityListScreen';
import CommunityPostDetailsScreen from './src/screens/CommunityPostDetailsScreen';
import CommunityAddScreen from './src/screens/CommunityAddScreen';
import InboxScreen from './src/screens/InboxScreen';
import { ActivityScreen, SavedScreen, CloseFriendsScreen, BlockedScreen } from './src/screens/PlaceholderScreens';
import SettingsScreen from './src/screens/SettingsScreen';
const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { isAppLoading, userProfile, currentUserId } = useContext(AppContext);

  if (isAppLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
        <ActivityIndicator size="large" color="#E51025" />
      </View>
    );
  }

  // Determine starting route:
  // 1. If we have a full profile, go to MainTabs
  // 2. If we only have a currentUserId (404 profile), go to PlayerDetails to create one
  // 3. Otherwise, go to Login
  const initialRoute = userProfile ? "MainTabs" : currentUserId ? "PlayerDetails" : "Login";

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
        }}
      >
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
          />
          <Stack.Screen 
            name="ChatScreen" 
            component={ChatScreen} 
          />
                    <Stack.Screen 
            name="InboxScreen" 
            component={InboxScreen} 
          />
          <Stack.Screen 
            name="CommunityListScreen" 
            component={CommunityListScreen} 
          />
                    <Stack.Screen 
            name="CommunityAddScreen" 
            component={CommunityAddScreen} 
          />
          <Stack.Screen 
            name="CommunityPostDetailsScreen" 
            component={CommunityPostDetailsScreen} 
          />
          <Stack.Screen 
            name="PlayerDetails" 
            component={PlayerDetailsScreen} 
          />
          <Stack.Screen 
            name="MainTabs" 
            component={BottomNavigator} 
          />
          <Stack.Screen 
            name="Coaches" 
            component={CoachesScreen} 
          />
          <Stack.Screen 
            name="AddCoach" 
            component={AddCoachScreen} 
          />
          <Stack.Screen 
            name="Commentators" 
            component={CommentatorsScreen} 
          />
          <Stack.Screen 
            name="AddCommentator" 
            component={AddCommentatorScreen} 
          />
          <Stack.Screen 
            name="Streamers" 
            component={StreamersScreen} 
          />
          <Stack.Screen 
            name="AddStreamer" 
            component={AddStreamerScreen} 
          />
          <Stack.Screen 
            name="Organisers" 
            component={OrganisersScreen} 
          />
          <Stack.Screen 
            name="AddOrganiser" 
            component={AddOrganiserScreen} 
          />
          <Stack.Screen 
            name="CreateTournament" 
            component={CreateTournamentScreen} 
          />
          <Stack.Screen 
            name="PointSystem" 
            component={PointSystemScreen} 
          />
          <Stack.Screen 
            name="ManageTeams" 
            component={ManageTeamsScreen} 
          />
          <Stack.Screen 
            name="TournamentDashboard" 
            component={TournamentDashboardScreen} 
          />
          <Stack.Screen 
            name="TournamentFlyers" 
            component={TournamentFlyersScreen} 
          />
          <Stack.Screen 
            name="TournamentFlyerEdit" 
            component={TournamentFlyerEditScreen} 
          />
          <Stack.Screen 
            name="TeamRegistration" 
            component={TeamRegistrationScreen} 
          />
          <Stack.Screen 
            name="RegisteredTeams" 
            component={RegisteredTeamsScreen} 
          />
          <Stack.Screen 
            name="TournamentConfirmation" 
            component={TournamentConfirmationScreen} 
          />
          <Stack.Screen 
            name="ProfileScreen" 
            component={ProfileScreen} 
          />
          <Stack.Screen 
              name="EditProfileScreen" 
              component={EditProfileScreen} 
            />
            <Stack.Screen 
              name="PolicyScreen" 
              component={PolicyScreen} 
            />
            <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
            <Stack.Screen name="ActivityScreen" component={ActivityScreen} />
            <Stack.Screen name="SavedScreen" component={SavedScreen} />
            <Stack.Screen name="CloseFriendsScreen" component={CloseFriendsScreen} />
            <Stack.Screen name="BlockedScreen" component={BlockedScreen} />
          </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <AppContextProvider>
      <SafeAreaProvider style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <RootNavigator />
      </SafeAreaProvider>
    </AppContextProvider>
  );
};

export default App;




