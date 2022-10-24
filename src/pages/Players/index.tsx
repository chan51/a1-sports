import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  View,
  Animated,
  Easing,
  Image,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/core';

import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

import { Search, Header, Input } from './styles';

import { Player } from '../../models/player.interface';
import PlayerService from '../../services/player.service';
import { utilService } from '../../services/util.service';
import PlayerItem from './playerItem';

let typingTimer: any;
let doneTypingInterval: number = 500;

const playerService = new PlayerService();
const { width: winWidth } = Dimensions.get('screen');

const Players: React.FC = ({ navigation }: any) => {
  const [search, setSearch] = useState('');
  const [isSearchActive, setSearchActive] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  const [page, setPage] = useState({
    skip: 0,
    limit: 20,
  });
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = React.useState(true);
  const [players, setPlayers] = useState([]);
  const [totalPlayers, setTotalPlayers] = useState(0);

  const searchInput = useRef<TextInput>();
  const source = axios.CancelToken.source();
  let cancelToken = source.token;

  const spinValue = new Animated.Value(0);
  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 10000,
      easing: Easing.linear,
      useNativeDriver: true,
    }),
  ).start();

  useEffect(() => {
    clearTimeout(typingTimer);
    cancelToken = source.token;
    source.cancel('search cancellation');

    typingTimer = setTimeout(() => {
      cancelToken = null;
      setRefreshing(true);
      getSearchResult();
    }, doneTypingInterval);
  }, [search]);

  useFocusEffect(
    React.useCallback(() => {
      setSearch('');
      setSearchActive(false);
      getSearchResult();
      return () => {
        setSearch('');
        setSearchActive(false);
      };
    }, []),
  );

  const getSearchResult = () => {
    playerService
      .getPlayers(
        { searchKeyword: search, skip: page.skip, limit: page.limit },
        cancelToken,
      )
      .then(({ status, players: playerList, playersLength }: any) => {
        if (status) {
          const newPlayers = [...players, ...(playerList || [])];
          setPlayers(utilService.getUniqueArray(newPlayers, 'id', true, ''));

          setRefreshing(false);
          setLoadingMore(false);
          if (!totalPlayers) {
            setTotalPlayers(playersLength);
          }
        }
      });
  };

  const activateSearch = () => {
    setSearchActive(!isSearchActive);
    setTimeout(() => searchInput.current?.focus(), 100);
  };

  const goBack = () => {
    navigation.goBack();
  };

  const gotoPlayerInvestment = (player: Player) => {
    setButtonClicked(true);
    if (!buttonClicked) {
      const data = {
        redirectId: player.id,
        description: player.name,
        searchType: 'player',
      };
      playerService.createRecentSearch(data);
      navigation.navigate('Investment', {
        userId: player.id,
        player,
      });
      setTimeout(() => setButtonClicked(false), 500);
    }
  };

  useEffect(() => {
    if (!page.skip || page.skip < totalPlayers) {
      getSearchResult();
    } else {
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [page]);

  const _handleRefresh = () => {
    setRefreshing(true);
    setPlayers([]);
    setTotalPlayers(0);
    setPage({
      skip: 0,
      limit: 20,
    });
  };

  const _handleLoadMore = () => {
    if (page.skip < totalPlayers && !loadingMore && !refreshing) {
      setLoadingMore(true);
      setPage({
        skip: page.skip + page.limit,
        limit: page.limit,
      });
    }
  };

  const _renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View
        style={{
          position: 'relative',
          width: winWidth,
          height: 50,
          paddingVertical: 20,
          borderTopWidth: 5,
          marginTop: 10,
          marginBottom: 20,
          borderColor: '#F25813',
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header>
        <Search>
          <Ionicons
            name="ios-arrow-back"
            style={{
              paddingRight: 0,
            }}
            size={22}
            color="rgba(0, 0, 0, 0.6)"
            onPress={() => goBack()}
          />

          {isSearchActive ? (
            <Input
              style={{
                paddingLeft: 10,
              }}
              ref={searchInput}
              placeholder="Search Player"
              placeholderTextColor="rgba(0, 0, 0, 0.6)"
              value={search}
              returnKeyType="search"
              onChangeText={($event: React.SetStateAction<string>) =>
                setSearch($event)
              }
              onBlur={() => setSearchActive(false)}
            />
          ) : (
            <TouchableOpacity onPress={() => activateSearch()}>
              <Text
                style={{
                  paddingLeft: 10,
                }}
              >
                Search Player
              </Text>
            </TouchableOpacity>
          )}
        </Search>
      </Header>

      <View style={styles.playerHeading}>
        <Text style={{ ...styles.playerListHeadingText, marginLeft: 10 }}>
          Player Name
        </Text>
        <Text style={{ ...styles.playerListHeadingText, marginLeft: -16 }}>
          Country
        </Text>
        <Text
          style={{
            ...styles.playerListHeadingText,
            marginLeft: '-13%',
          }}
        >
          Value (Coins)
        </Text>
      </View>

      <View style={styles.scrollView}>
        <FlatList
          contentContainerStyle={styles.flatListContentContainerStyle}
          onRefresh={_handleRefresh}
          refreshing={refreshing}
          data={players}
          keyExtractor={player => player.id.toString()}
          renderItem={({ item: player }) => (
            <PlayerItem
              player={player}
              gotoPlayerInvestment={gotoPlayerInvestment}
            />
          )}
          onEndReached={_handleLoadMore}
          onEndReachedThreshold={0.5}
          initialNumToRender={20}
          ListFooterComponent={_renderFooter}
          removeClippedSubviews={true}
          ListEmptyComponent={() =>
            !refreshing && !loadingMore ? (
              <Image
                source={require('../../assets/lottie-animations/investment.gif')}
                style={{
                  width: '100%',
                  height: 560,
                  position: 'absolute',
                }}
              />
            ) : (
              <></>
            )
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 2,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flatListContentContainerStyle: {
    flexDirection: 'column',
    width: '100%',
    flexGrow: 1,
    minHeight: 600,
  },
  heading: {
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  headingText: {
    fontWeight: '500',
    fontSize: 16,
  },
  playerIconlist: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  playerIconlistItem: {
    paddingHorizontal: 6,
  },
  playerHeading: {
    paddingVertical: 15,
    backgroundColor: '#aa556f',
    paddingHorizontal: 5,
    flexDirection: 'row',
    marginTop: 15,
  },
  playerListHeadingText: {
    color: '#fff',
    fontSize: 14,
    width: '42%',
    paddingHorizontal: 10,
    fontWeight: '500',
  },
});

export default Players;
