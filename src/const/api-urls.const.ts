export const API_BASE = {
  // baseHost: 'https://c4cook.com/stag',
  // baseHost: 'https://c4cook.com/prod',
  // basePort: '',
  baseHost: 'http://192.168.1.10',
  basePort: ':1410',
  get baseURL() {
    return this.baseHost + (this.basePort || '');
  },
  APIv1: 'api/v1/',
};

export const API_URLS = {
  Auth: {
    SendOTP: API_BASE.APIv1 + 'send-otp',
    CheckOTP: API_BASE.APIv1 + 'check-otp',
    LoginSocial: API_BASE.APIv1 + 'login-social',
    CheckUserExist: API_BASE.APIv1 + 'check-user-exist',
  },

  Users: {
    GetUserDetails: API_BASE.APIv1 + 'get-user-details',
    UpdateUserDetails: API_BASE.APIv1 + 'update-user',
    UpdateUserProfile: API_BASE.APIv1 + 'update-user-profile',
    UserAppStatus: API_BASE.APIv1 + 'user-app-status',
    GetUserFiles: API_BASE.APIv1 + 'get-user-files',
    UserAppPushToken: API_BASE.APIv1 + 'user-app-push-token',
    SubmitUserFeedback: API_BASE.APIv1 + 'submit-user-feedback',
    GetUserCoins: API_BASE.APIv1 + 'get-user-coins',
    SubmitInvestment: API_BASE.APIv1 + 'submit-investment',
  },

  Players: {
    GetPlayers: API_BASE.APIv1 + 'get-players?searchKeyword=',
    CreateRecentSearch: API_BASE.APIv1 + 'create-recent-search',
  },

  Chats: {},

  Record: {
    UploadImage: API_BASE.APIv1 + 'upload-image',
    UploadVideo: API_BASE.APIv1 + 'upload-video',
    UploadThumb: API_BASE.APIv1 + 'upload-thumb',
    UploadUserProfile: API_BASE.APIv1 + 'upload-user-profile',
  },

  Feed: {
    GetMasterCuisineTypes: API_BASE.APIv1 + 'get-master-cuisine-types',
    GetFeeds: API_BASE.APIv1 + 'get-feeds',
    CreateFeed: API_BASE.APIv1 + 'create-feed',
    LikeFeed: API_BASE.APIv1 + 'like-feed',
    DeleteFeed: API_BASE.APIv1 + 'delete-feed',
    FeedViewCount: API_BASE.APIv1 + 'feed-view-count',
    UpdateFeed: API_BASE.APIv1 + 'update-feed',
    SaveFeed: API_BASE.APIv1 + 'save-feed',
    ReportFeed: API_BASE.APIv1 + 'report-feed',
  },

  Notification: {
    SaveDailyNotificationInteraction:
      API_BASE.APIv1 + 'save-daily-notification-interaction',
    GetNotifications: API_BASE.APIv1 + 'get-notifications',
  },

  Leaders: {
    GetLeaders: API_BASE.APIv1 + 'get-leaders',
  },
};
