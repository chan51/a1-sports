import React, { useState, useEffect, useRef } from 'react';
import { View, Image, AppState, LogBox } from 'react-native';

import { Asset } from 'expo-asset';
import * as Application from 'expo-application';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import NetInfo from '@react-native-community/netinfo';

import Routes from './src/routes/routes';

import UserService from './src/services/user.service';
import * as NavigationService from './src/services/navigation.service';
import {
  utilService,
  isOnHome,
  userDetails,
  appState,
} from './src/services/util.service';
import { User } from './src/models/user.interface';

const userService = new UserService();
const splash = require('./assets/images/splash.png');
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const App: React.FC = () => {
  let [userId, setUserId] = useState('');
  const [appIsReady, setAppIsReady] = useState(false);
  const [appCurrentState, setCurrentAppState] = useState('active');
  const [networkState, setNetworkState] = useState<any>();

  const [notification, setNotification] = useState<any>(false);
  const notificationListener: any = useRef();
  const responseListener: any = useRef();

  useEffect(() => {
    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
      });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(
        ({ actionIdentifier, notification }) => {
          // console.log('addNotificationResponseReceivedListener', notification);
          const { date, request } = notification;
          if (request && request.content) {
            const { data } = request.content;
            if (data.saveInteraction) {
              navigateToLink('Home');
            } else if (data.page && data.action) {
              switch (data.action) {
                case 'feeds/like-feed':
                  navigateToLink(data.page, {
                    feedId: data.feedId,
                    goBack: appCurrentState === 'active',
                  });
                  break;
                case 'feeds/create-feed':
                  navigateToLink(data.page, {
                    feedId: data.feedId,
                    goBack: appCurrentState === 'active',
                  });
                  break;
                case 'users/set-user-follows':
                  navigateToLink(data.page, {
                    userId: data.userId,
                  });
                  break;
              }
            }
          }
        },
      );

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current,
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    async function cancelAllScheduledNotificationsAsync() {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
    cancelAllScheduledNotificationsAsync();

    triggerDailyNotification({
      title: 'Good Morning',
      body: 'Start your day with a healthy breakfast.',
      hour: 7,
      minute: 30,
    });
    triggerDailyNotification({
      title: 'Its Lunch Time',
      body: 'Explore cuisines and try at home.',
      hour: 12,
      minute: 30,
    });
    triggerDailyNotification({
      title: 'Snack Time',
      body: 'Take a break... Working too long is stressful.',
      hour: 17,
      minute: 30,
    });
    triggerDailyNotification({
      title: 'Keep it lite',
      body: 'Explore new healthy recipes and keep yourself healthy.',
      hour: 20,
      minute: 30,
    });
  }, []);

  useEffect(() => {
    isOnHome.next(false);
    isUserAvailable();
    LogBox.ignoreAllLogs(true);
    SecureStore.deleteItemAsync('upload');
    setTimeout(() => initialization(), 100);

    networkState && networkState();
    getNetworkStateAsync();
  }, []);

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);
    return () => AppState.removeEventListener('change', _handleAppStateChange);
  }, []);

  const triggerDailyNotification = async notifi => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: notifi.title,
        body: notifi.body,
        data: { saveInteraction: true, title: notifi.title },
      },
      trigger: {
        hour: notifi.hour,
        minute: notifi.minute,
        repeats: true,
      },
    });
  };

  const navigateToLink = (path, queryParams = {}) => {
    if (appCurrentState !== 'active') {
      setTimeout(() => NavigationService.navigate('Blank'), 500);
    }

    setTimeout(() => {
      if (appCurrentState === 'active') {
        NavigationService.navigate(path, queryParams);
      } else {
        NavigationService.reset(path, 0, queryParams);
      }
    }, 800);
  };

  const _handleAppStateChange = async (status: any) => {
    setCurrentAppState(status);
    updateUserSpecificAppDetails(status);

    const currentAppStateValue = await currentAppState();
    appState.next({ ...currentAppStateValue, status });
  };

  const updateUserSpecificAppDetails = async status => {
    let user: User | any = await SecureStore.getItemAsync('user');
    const userId: string = await SecureStore.getItemAsync('userId');
    const expoPushToken = (await Notifications.getExpoPushTokenAsync()).data;

    if (userId) {
      const appStateData = { userId, status };
      await userService.userAppStatus(appStateData);

      user = JSON.parse(user);
      if (
        (user.expoPushToken !== expoPushToken && expoPushToken) ||
        user.applicationVersion !== Application.nativeApplicationVersion
      ) {
        const pushTokenData = {
          userId,
          applicationVersion: Application.nativeApplicationVersion,
          expoPushToken: expoPushToken ? expoPushToken : user.expoPushToken,
        };
        await userService.updateUserPushToken(pushTokenData);
        SecureStore.setItemAsync(
          'user',
          JSON.stringify({ ...user, expoPushToken }),
        );
      }
    }
  };

  const currentAppState = async () => {
    return await appState.getValue();
  };

  const initialization = async () => {
    try {
      await SplashScreen.preventAutoHideAsync();
    } catch (e) {
      console.warn(e);
    }
    _cacheSplashResourcesAsync();
  };

  const isUserAvailable = async () => {
    const userId: any = await SecureStore.getItemAsync('userId');
    const isGuestUser: any = await SecureStore.getItemAsync('guest');
    if (isGuestUser === 'true') {
      setUserId('guest');
    } else if (userId) {
      setUserId(userId);
      userDetailsSetter();
    }
  };

  const getNetworkStateAsync = async () => {
    const unsubscribe = NetInfo.addEventListener(async state => {
      const currentAppStateValue = await currentAppState();
      if (
        currentAppStateValue.networkConnected !== state.isConnected &&
        currentAppStateValue.status === 'active'
      ) {
        handleFirstConnectivityChange(state.isConnected);
      }
    });
    // setNetworkState(unsubscribe);
  };

  const handleFirstConnectivityChange = async (isConnected: any) => {
    if (isConnected) {
      utilService.showMessage('Great you are online!');
    } else {
      utilService.showMessage('You are offline, please connect to internet!');
    }
    const currentAppStateValue = await currentAppState();
    appState.next({ ...currentAppStateValue, networkConnected: isConnected });
  };

  const userDetailsSetter = async () => {
    const user: any = await userService.getUserDetails();
    if (user.status) {
      userDetails.next(user.userRecord);
      user.userSavedFeed &&
        SecureStore.setItemAsync(
          'userSavedFeed',
          JSON.stringify([...(user.userSavedFeed.feeds || [])]),
        );
    }
  };

  const _cacheSplashResourcesAsync = async () => {
    return Asset.fromModule(splash).downloadAsync();
  };

  const _cacheResourcesAsync = async () => {
    try {
      const images = [
        require('./assets/images/icon.png'),
        require('./assets/images/favicon.png'),
      ];

      const cacheImages = images.map(image => {
        return Asset.fromModule(image).downloadAsync();
      });

      await Promise.all(cacheImages);
      setAppIsReady(true);
      setTimeout(async () => {
        await SplashScreen.hideAsync();
      }, 100);
    } catch (e) {
      console.warn(e);
    }
  };

  if (!appIsReady) {
    return (
      <View>
        <Image source={splash} onLoad={_cacheResourcesAsync} />
      </View>
    );
  }
  return <Routes userId={userId} />;
};

export default App;
