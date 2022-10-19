import React from 'react';

export const homeConfig = {
  allFeeds: [],
  followerList: [],
  navigation: null,
  active: null,
  getPageData: () => null,
  getFeeds: () => null,
  setAllFeeds: (feeds) => {
    setTimeout(() => (homeConfig.allFeeds = [...feeds]), 200);
  },
  setFollowerList: (followers) => {
    homeConfig.followerList = [];
    setTimeout(() => (homeConfig.followerList = [...followers]), 50);
  },
};

const HomeContext = React.createContext(homeConfig);
export default HomeContext;
