import APIService from './base.service';
import { API_URLS } from '../const/api-urls.const';

class LeaderService {
  getLeaders = async (skip, limit) => {
    const url = `${API_URLS.Players.GetLeaders}?skip=${skip}&limit=${limit}`;
    return await APIService({ url });
  };
}

export default LeaderService;
