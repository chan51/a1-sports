import React from 'react';

export const searchesConfig = {
  searches: [],
  updateSearches: newSearches => {
    searchesConfig.searches = [...searchesConfig.searches, ...newSearches];
  },
};

const SearchesContext = React.createContext(searchesConfig);
export default SearchesContext;
