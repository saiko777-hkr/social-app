import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Main Screens
import FeedScreen from '../screens/feed/FeedScreen';
import ChatListScreen from '../screens/chat/ChatListScreen';
import StoriesScreen from '../screens/stories/StoriesScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

// Additional Screens
import AdminPanelScreen from '../screens/admin/AdminPanelScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import SupportScreen from '../screens/support/SupportScreen';
import PrivateChatScreen from '../screens/chat/PrivateChatScreen';
import GroupChatScreen from '../screens/chat/GroupChatScreen';
import CreatePostScreen from '../screens/feed/CreatePostScreen';
import CreateStoryScreen from '../screens/stories/CreateStoryScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Feed') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Stories') {
            iconName = focused ? 'hourglass' : 'hourglass-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderTopWidth: 1,
          borderTopColor: 'rgba(0, 0, 0, 0.1)',
          height: 85,
          paddingBottom: 25,
          paddingTop: 10,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Stories" component={StoriesScreen} />
      <Tab.Screen name="Chat" component={ChatListScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="AdminPanel" component={AdminPanelScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Support" component={SupportScreen} />
        <Stack.Screen name="PrivateChat" component={PrivateChatScreen} />
        <Stack.Screen name="GroupChat" component={GroupChatScreen} />
        <Stack.Screen name="CreatePost" component={CreatePostScreen} />
        <Stack.Screen name="CreateStory" component={CreateStoryScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
