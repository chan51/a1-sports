import { ToastAndroid, Share, Platform, Alert } from 'react-native';

// import * as Linking from 'expo-linking';
// import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as Notifications from 'expo-notifications';
import { FileSystemSessionType } from 'expo-file-system';

import { delay, filter, map } from 'rxjs/operators';
import { BehaviorSubject, from, Subject } from 'rxjs';

import { User } from '../models/user.interface';
import { API_BASE } from '../const/api-urls.const';

const userDetails = new BehaviorSubject<User | any>({});
const isOnHome = new BehaviorSubject<boolean | any>({});
const isOnProfile = new Subject<boolean | any>();
const updateHome = new Subject<boolean | any>();
const openSidebar = new BehaviorSubject<boolean | any>(false);
const updatedFeed = new BehaviorSubject<any>({});
const appState = new BehaviorSubject<any>({
  status: false,
  networkConnected: true,
});

const utilService = {
  wait: (timeout: any) => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  },

  isOnHomeTab: function (status: boolean) {
    isOnHome.next(status);
  },

  isOnProfileTab: function (status: boolean) {
    isOnProfile.next(status);
  },

  setUserDetails: function (user: User) {
    userDetails.next(user);
  },

  showMessage: function (message: string, duration = 3000) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, duration);
    } else if (Platform.OS === 'ios') {
      Alert.alert(message);
    }
  },

  saveFile: async function (url: string) {
    const callback = (downloadProgress: any) => {
      const progress =
        downloadProgress.totalBytesWritten /
        downloadProgress.totalBytesExpectedToWrite;
    };

    const fileName = url.substring(url.lastIndexOf('-') + 1, url.length);
    const downloadResumable = FileSystem.createDownloadResumable(
      url,
      FileSystem.documentDirectory + fileName,
      {},
      callback,
    );

    try {
      const { uri }: any = await downloadResumable.downloadAsync();
      return uri;
    } catch (e) {
      console.error(e);
    }
  },

  /* shareFile: async function(url: string, fileType: string) {
    if (!(await Sharing.isAvailableAsync())) {
      this.showMessage(
        'Your device does not allow sharing!',
        ToastAndroid.SHORT,
      );
      return;
    }

    if (Sharing.isAvailableAsync()) {
      const tmpFileUri = FileSystem.cacheDirectory + 'tmp.jpg';
      const { uri: fileUri } = await FileSystem.downloadAsync(url, tmpFileUri);
      const shareOptions = {
        mimeType: fileType === 'video' ? 'video/mp4' : 'image/jpeg',
        dialogTitle:
          fileType === 'video'
            ? 'Check out this video!'
            : 'Check out this image!',
        UTI: fileType === 'video' ? 'video/mp4' : 'image/jpeg',
      };
      
      await Sharing.shareAsync(fileUri, shareOptions);
    }
  }, */

  shareFile: async function (pageToRedirect: string, queryParams: any = {}) {
    const params = new URLSearchParams(queryParams).toString();
    const redirectUrl = `${API_BASE.baseURL}/app/${pageToRedirect}?${params}`;

    try {
      await Share.share({
        message: redirectUrl,
      });
    } catch (error) {
      alert(error.message);
    }
  },

  showNotification: async function (fileUri: string) {
    let content: any = {
      title: 'Download has finished',
      body: 'file has been downloaded. Tap to open file.',
      sound: true,
      vibrate: true,
    };
    content.data = { fileUri, title: content.title, body: content.body };

    Notifications.scheduleNotificationAsync({
      content,
      trigger: null,
    });
  },

  registerForPushNotificationsAsync: async function () {
    let token;
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          experienceId: '@chan51/a1-sports-app',
        })
      ).data;
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  },

  capitalize: function (str) {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  },

  getUniqueArray: function (
    arr,
    key = 'id',
    updateOld = false,
    sortKey = 'createdAt',
  ) {
    let result = [];
    const map = new Map();
    for (const item of arr) {
      if (item && !map.has(item[key])) {
        map.set(item[key], true);
        result.push({ ...item });
      } else if (updateOld) {
        const previousContentIndex = result.findIndex(
          res => res[key] === item[key],
        );
        result[previousContentIndex] = { ...item };
      }
    }
    if (sortKey) {
      result = result.sort((a, b) => b[sortKey] - a[sortKey]);
    }
    return result;
  },

  getAgoTimestamp: function (date) {
    var seconds = Math.floor((new Date().getTime() - date) / 1000);
    var interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + 'y';
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + 'm';
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + 'd';
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + 'h';
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + 'm';
    }
    return Math.floor(seconds) + 's';
  },

  _updateCache: async function (feeds) {
    const fileUri = FileSystem.cacheDirectory + 'mediaCache.json';
    const file = await FileSystem.readAsStringAsync(fileUri);
    let cacheData = JSON.parse(file) || {};

    from([...(feeds || [])])
      .pipe(
        delay(100),
        filter(({ id }) => !cacheData[id]),
        map(async ({ cloudinaryURL, filePath, id }) => {
          const feedPath: string = cloudinaryURL || filePath || '';
          const fileName = feedPath.substring(feedPath.lastIndexOf('/') + 1);
          const fileSystemPath = FileSystem.cacheDirectory + fileName;

          const fileInfo = await FileSystem.getInfoAsync(fileSystemPath);
          if (!fileInfo.exists) {
            FileSystem.downloadAsync(feedPath, fileSystemPath, {
              sessionType: FileSystemSessionType.BACKGROUND,
            }).then(async ({ uri }) => {
              cacheData = { ...cacheData, [id]: uri };
              await FileSystem.writeAsStringAsync(
                fileUri,
                JSON.stringify(cacheData),
              );
            });
          }
        }),
      )
      .subscribe();
  },

  jsCoreDateCreator: function (dateString) {
    let dateParam = dateString.split(/[\s-:]/);
    dateParam[1] = (parseInt(dateParam[1], 10) - 1).toString();
    return new Date(dateParam.join(' ')).toString();
  },
};

export {
  utilService,
  isOnHome,
  isOnProfile,
  updateHome,
  userDetails,
  openSidebar,
  appState,
  updatedFeed,
};
