import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';

import APIService from './base.service';
import { API_URLS } from '../const/api-urls.const';
import { utilService, isOnHome } from './util.service';
import * as NavigationService from '../services/navigation.service';

class UserService {
  getUserDetails = async (userId: string = '') => {
    const userSessionId = userId ? `?userId=${userId}` : '';
    const url = `${API_URLS.Users.GetUserDetails}${userSessionId}`;
    return await APIService({ url });
  };

  updateUserDetails = async (data: any) => {
    return await APIService({
      method: 'put',
      url: API_URLS.Users.UpdateUserDetails,
      data,
    });
  };

  updateUserProfile = async (data: any) => {
    return await APIService({
      method: 'put',
      url: API_URLS.Users.UpdateUserProfile,
      data,
    });
  };

  userAppStatus = async (data: any) => {
    return await APIService({
      method: 'post',
      url: API_URLS.Users.UserAppStatus,
      data,
    });
  };

  updateUserPushToken = async (data: any) => {
    return await APIService({
      method: 'put',
      url: API_URLS.Users.UserAppPushToken,
      data,
    });
  };

  getUserFiles = async (data: any) => {
    return await APIService({
      method: 'post',
      url: API_URLS.Users.GetUserFiles,
      data,
    });
  };

  isUserLogin = async (
    loggedInCallback?: any,
    parameters: any = '',
    onDismiss?: Function,
    duration: number = 200,
    handleCanPlay?: Function,
  ) => {
    const isGuest = await SecureStore.getItemAsync('guest');
    if (loggedInCallback) {
      if (isGuest === 'true') {
        Alert.alert(
          'Please Login first to access!',
          'go to login page to access app fully',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Okay',
              onPress: async () => {
                handleCanPlay && handleCanPlay();
                this.logoutUser();
              },
            },
          ],
          {
            cancelable: false,
            onDismiss: onDismiss && onDismiss(),
          },
        );
      } else {
        setTimeout(() => loggedInCallback(parameters), duration);
      }
    } else {
      return isGuest !== 'true';
    }
  };

  logoutUser = async () => {
    isOnHome.next({ type: 'reset' });
    await SecureStore.deleteItemAsync('userId');
    await SecureStore.deleteItemAsync('guest');
    await SecureStore.deleteItemAsync('user');
    NavigationService.reset('LoginReset');
  };

  submitUserFeedback = async (feedbackValue: string) => {
    return await APIService({
      method: 'post',
      url: API_URLS.Users.SubmitUserFeedback,
      data: { feedbackValue },
    });
  };

  getUserCoins = async (userId: string = '') => {
    const userSessionId = userId ? `?userId=${userId}` : '';
    const url = `${API_URLS.Users.GetUserCoins}${userSessionId}`;
    return await APIService({ url });
  };

  submitInvestment = async (data: any) => {
    return await APIService({
      method: 'post',
      url: API_URLS.Users.SubmitInvestment,
      data,
    });
  };
}

export default UserService;
