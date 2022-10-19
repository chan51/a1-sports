import React, { useEffect, useState } from 'react';
import { StatusBar, Platform, Text } from 'react-native';

import {
  Ionicons,
  MaterialIcons,
  FontAwesome,
  Entypo,
} from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import Players from '../pages/Players';
import Home from '../pages/Home';
import NotificationBox from '../pages/NotificationBox';
import Profile from '../pages/Profile';
import LeaderBoard from '../pages/LeaderBoard';
import Investment from '../pages/Investment';

import Feedback from '../pages/Feedback';
import Reward from '../pages/Profile/Reward';

import Login from '../pages/Login';
import OTP from '../pages/Login/OTP';
import ProfileEdit from '../pages/Profile/ProfileEdit';
import {
  Blank,
  TermsConditions,
  Disclaimer,
  PrivacyPolicy,
  TNC,
} from '../pages/CommonScreens';

import UserService from '../services/user.service';
import { isOnHome, updateHome } from '../services/util.service';
import * as NavigationService from '../services/navigation.service';

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();
const userService = new UserService();

const AppRoutes: React.FC = ({ navigation, route }: any) => {
  let { initialRoute, initialParams } = route.params || {};
  initialRoute = initialRoute || 'Home';

  const [isMounted, setIsMounted] = React.useState(false);
  const [refreshFeeds, setRefreshFeeds] = useState(false);
  const [isTabClicked, setIsTabClicked] = React.useState(false);
  const [home, setHome] = useState(initialRoute === 'Home');

  useEffect(() => {
    setTimeout(() => setIsMounted(true), 1000);
    setTimeout(() => {
      isOnHome &&
        isMounted &&
        isOnHome.subscribe(({ type, data }) => {
          type === 'refreshFeeds' && isMounted && setRefreshFeeds(!!data);
        });
    }, 1200);
  }, []);

  NavigationService.setNavigator(navigation);

  const setHomeStatus = (status: boolean) => {
    setHome(status);
  };

  StatusBar.setBarStyle('dark-content');
  if (Platform.OS === 'android') StatusBar.setBackgroundColor('#fff');
  StatusBar.setHidden(false);

  const navigateToTab = async (
    $event: any,
    path: string,
    params: any = {},
    fn?: any,
  ) => {
    $event.preventDefault();
    if (isMounted && !isTabClicked) {
      setIsTabClicked(true);
      const loggedInCallback = params => {
        tabClicked();
        if (fn) {
          fn();
        } else {
          navigation.navigate(path, params);
        }
      };
      const tabClicked = () => {
        setTimeout(() => setIsTabClicked(false), 5000);
      };
      userService.isUserLogin(loggedInCallback, params, tabClicked);
    }
  };

  return (
    <Tab.Navigator
      shifting={false}
      barStyle={{
        backgroundColor: '#fff',
        justifyContent: 'center',
        paddingTop: 7,
      }}
      initialRouteName={initialRoute}
      activeColor={'#3185fc'}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        listeners={{
          focus: () => setHomeStatus(true),
          blur: () => setHomeStatus(false),
          tabPress: $event =>
            updateHome.next({ type: 'refreshPage', data: true }),
        }}
        initialParams={initialParams}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <>
              <Ionicons name="home" size={23} color={color} />
              {refreshFeeds ? (
                <Text
                  style={{
                    width: 5,
                    height: 5,
                    backgroundColor: '#F25813',
                    borderRadius: 10,
                  }}
                ></Text>
              ) : (
                <></>
              )}
            </>
          ),
        }}
      />
      <Tab.Screen
        name="LeaderBoard"
        component={LeaderBoard}
        listeners={{
          tabPress: $event => navigateToTab($event, 'LeaderBoard'),
        }}
        options={{
          tabBarLabel: 'Leader Board',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="leaderboard" size={23} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="NotificationBox"
        component={NotificationBox}
        listeners={{
          tabPress: $event => navigateToTab($event, 'NotificationBox'),
        }}
        options={{
          tabBarLabel: 'Info',
          tabBarIcon: ({ color }) => (
            <Entypo name="info-with-circle" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        listeners={{
          tabPress: $event => navigateToTab($event, 'Profile', { userId: '' }),
        }}
        initialParams={initialParams}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={23} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const commonScreens = {
  Blank: { component: Blank, options: { headerShown: false } },
  TNC: { component: TNC, options: { headerShown: false } },
  TermsConditions: {
    component: TermsConditions,
    options: { headerShown: false },
  },
  Disclaimer: { component: Disclaimer, options: { headerShown: false } },
  PrivacyPolicy: { component: PrivacyPolicy, options: { headerShown: false } },
  Players: { component: Players, options: { headerShown: false } },
};

const authScreens = {
  Login: { component: Login, options: { headerShown: false } },
  OTP: { component: OTP, options: { headerShown: false } },
};

const userScreens = {
  Main: { component: AppRoutes, options: { headerShown: false } },
  // Record: { component: Record, options: { headerShown: false } },
  UserProfile: { component: Profile, options: { headerShown: false } },
  ProfileEdit: { component: ProfileEdit, options: { headerShown: false } },
  ProfileOTP: { component: OTP, options: { headerShown: false } },
  LoginReset: { component: Login, options: { headerShown: false } },
  Feedback: { component: Feedback, options: { headerShown: false } },
  Reward: { component: Reward, options: { headerShown: false } },
  Investment: { component: Investment, options: { headerShown: false } },
};

interface Props {
  userId: string | null;
}
const RootStackScreen: React.FC<Props> = ({ userId }) => {
  return (
    <Stack.Navigator>
      {Object.entries({
        ...(userId ? {} : authScreens),
        ...userScreens,
        ...commonScreens,
      }).map(([name, value], index) => (
        <Stack.Screen
          key={`screen-${index}`}
          name={name}
          component={value.component}
          options={value.options}
        />
      ))}
    </Stack.Navigator>
  );
};

export default RootStackScreen;
