import APIService from './base.service';
import { API_URLS } from '../const/api-urls.const';

import * as SecureStore from 'expo-secure-store';

import * as NavigationService from './navigation.service';

class AuthService {
  getOTP = async (phoneNumber: string) => {
    const url = `${API_URLS.Auth.SendOTP}?phoneNumber=${phoneNumber}`;
    return await APIService({ url });
  };

  checkOTP = async (data: any) => {
    return await APIService({
      method: 'post',
      url: API_URLS.Auth.CheckOTP,
      data,
    });
  };

  loginSocial = async (data: any) => {
    return await APIService({
      method: 'post',
      url: API_URLS.Auth.LoginSocial,
      data,
    });
  };

  checkUserExist = async (loginName: string) => {
    const url = `${API_URLS.Auth.CheckUserExist}?loginName=${loginName}`;
    return await APIService({ url });
  };

  guestLogin = async (callback: any) => {
    SecureStore.setItemAsync('guest', 'true').then(callback);
  };

  logout = async (routeName?) => {
    const userId = await SecureStore.getItemAsync('userId');
    if (userId) {
      await SecureStore.deleteItemAsync('userId');
      await SecureStore.deleteItemAsync('user');
      NavigationService.reset(routeName);
    }
  };
}

export default AuthService;
