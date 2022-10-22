import APIService from './base.service';

import { API_URLS } from '../const/api-urls.const';

class PlayerService {
  getPlayers = async (data, cancelToken = null) => {
    return await APIService({
      method: 'post',
      url: API_URLS.Players.GetPlayers,
      data: { ...data },
      cancelToken,
    });
  };

  createRecentSearch = async (data: any) => {
    return await APIService({
      method: 'post',
      url: API_URLS.Players.CreateRecentSearch,
      data,
    });
  };

  getPlayerLastInvestment = async (playerId, playerValue) => {
    const url = `${API_URLS.Players.GetPlayerLastInvestment}?playerId=${playerId}&playerValue=${playerValue}`;
    return await APIService({ url });
  };
}

export default PlayerService;
