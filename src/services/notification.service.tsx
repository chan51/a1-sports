import APIService from './base.service';
import { API_URLS } from '../const/api-urls.const';

class NotificationService {
  saveDailyNotificationInteraction = async (data: any) => {
    return await APIService({
      method: 'post',
      url: API_URLS.Notification.SaveDailyNotificationInteraction,
      data,
    });
  };

  getNotifications = async (skip, limit) => {
    const url = `${API_URLS.Notification.GetNotifications}?skip=${skip}&limit=${limit}`;
    return await APIService({ url });
  };
}

export default NotificationService;
