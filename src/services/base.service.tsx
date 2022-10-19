import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

import { API_BASE } from '../const/api-urls.const';
import * as NavigationService from './navigation.service';

const APIService = axios.create({
  baseURL: `${API_BASE.baseURL}/`,
  timeout: 10000,
  withCredentials: true,
});

APIService.interceptors.request.use(
  async config => {
    config.headers['ssid'] = (await SecureStore.getItemAsync('userId')) || '';
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

APIService.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response) {
      const statusCode = +error.response.status;
      if (statusCode === 401) {
        logout();
      } else if (error.response.data) {
        return error.response.data;
      } else {
        return error;
      }
    } else {
      return error;
    }
    return error;
  },
);

export const logout = async () => {
  const userId = await SecureStore.getItemAsync('userId');
  if (userId) {
    await SecureStore.deleteItemAsync('userId');
    await SecureStore.deleteItemAsync('user');
    NavigationService.reset();
  }
};

export default APIService;
