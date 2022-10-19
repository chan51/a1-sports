import APIService from './base.service';
import { API_URLS } from '../const/api-urls.const';

class FeedService {
  getFeeds = async (data: any) => {
    return await APIService({
      method: 'post',
      url: API_URLS.Feed.GetFeeds,
      data,
    });
  };

  getMasterCuisineTypes = async () => {
    return await APIService({
      url: API_URLS.Feed.GetMasterCuisineTypes,
    });
  };

  createFeed = async (data: any) => {
    return await APIService({
      method: 'post',
      url: API_URLS.Feed.CreateFeed,
      data,
    });
  };

  likeFeed = async (data: any) => {
    return await APIService({
      method: 'put',
      url: API_URLS.Feed.LikeFeed,
      data,
    });
  };

  deleteFeed = async (data: any) => {
    return await APIService({
      method: 'put',
      url: API_URLS.Feed.DeleteFeed,
      data,
    });
  };

  feedViewCount = async (data: any) => {
    return await APIService({
      method: 'post',
      url: API_URLS.Feed.FeedViewCount,
      data,
    });
  };

  updateFeed = async (data: any) => {
    return await APIService({
      method: 'put',
      url: API_URLS.Feed.UpdateFeed,
      data,
    });
  };

  updateUserSavedFeed = async (data: any) => {
    return await APIService({
      method: 'put',
      url: API_URLS.Feed.SaveFeed,
      data: data,
    });
  };

  reportFeed = async (data: any) => {
    return await APIService({
      method: 'put',
      url: API_URLS.Feed.ReportFeed,
      data,
    });
  };
}

export default FeedService;
