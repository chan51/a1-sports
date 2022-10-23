import React, { Fragment, useEffect, useRef, useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  View,
  ScrollView,
  Animated,
  Easing,
  Image,
  Dimensions,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/core';

import axios from 'axios';
import ProgressBar from 'react-native-progress/Bar';
import { Ionicons } from '@expo/vector-icons';

import { Search, Header, Input, Content, ListItem } from './styles';
import growth from './../../assets/icons/growth.png';
import down from './../../assets/icons/down.png';
import coins from './../../assets/icons/coins.png';

import { Player } from '../../models/player.interface';
import PlayerService from '../../services/player.service';
import { utilService } from '../../services/util.service';

let typingTimer: any;
let doneTypingInterval: number = 500;

const playerService = new PlayerService();
const { width: winWidth } = Dimensions.get('screen');

const Players: React.FC = ({ navigation }: any) => {
  const [search, setSearch] = useState('');
  const [isSearchActive, setSearchActive] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  const [playerSearchResultList, setPlayerSearchResultList] = useState<any>({
    data: [],
    loading: true,
  });

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
      setPlayerSearchResultList({
        ...playerSearchResultList,
        loading: true,
      });
      getSearchResult(search);
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

  const onRefresh = React.useCallback(() => {
    setPlayerSearchResultList({
      ...playerSearchResultList,
      loading: true,
    });
    utilService.wait(2000).then(() => {
      getSearchResult(search);
    });
  }, []);

  const getSearchResult = (searchKeyword: string = '') => {
    playerService
      .getPlayers({ searchKeyword }, cancelToken)
      .then(({ status, players }: any) => {
        if (status) {
          setPlayerSearchResultList({
            data: players || [],
            loading: false,
          });
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
        // filePath: player.profile,
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

  return (
    <SafeAreaView style={styles.container}>
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
            marginLeft: '-15%',
          }}
        >
          Value (Coins)
        </Text>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl
            enabled={!playerSearchResultList.loading}
            refreshing={false}
            onRefresh={onRefresh}
          />
        }
      >
        {playerSearchResultList.data.length &&
        !playerSearchResultList.loading ? (
          <View style={{ paddingBottom: 20 }}>
            {playerSearchResultList.data.map(
              (player: Player, index: number) => (
                <Fragment key={`list-player-${index}`}>
                  <ListItem onPress={() => gotoPlayerInvestment(player)}>
                    <View style={styles.playerList}>
                      <View style={styles.playerListValue}>
                        <Text style={styles.playerListValueText}>
                          {player.name}
                        </Text>
                        {/* <Image style={{ marginRight: 8 }} source={growth || down} />
                      <Text style={{ fontSize: 13, fontWeight: '500' }}>
                        +1.2%
                      </Text> */}
                      </View>
                      <View style={styles.playerListValue}>
                        <Text style={styles.playerListValueText}>
                          {player.team}
                        </Text>
                      </View>
                      <View
                        style={{
                          ...styles.playerListValue,
                          justifyContent: 'flex-end',
                          width: '20%',
                        }}
                      >
                        <Text style={styles.playerListValueText}>
                          {player.value}
                        </Text>
                        <Image source={coins} />
                      </View>
                    </View>
                  </ListItem>
                </Fragment>
              ),
            )}
          </View>
        ) : playerSearchResultList.loading ? (
          <Content style={{ marginTop: '60%', textAlign: 'center' }}>
            <ProgressBar
              indeterminate
              animated={true}
              color="#F25813"
              width={winWidth - 50}
              height={30}
              borderRadius={4}
              animationType="timing"
              unfilledColor="rgba(0,0,0,.7)"
            />
          </Content>
        ) : (
          <></>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 2,
    backgroundColor: '#fff',
  },
  playerHeading: {
    paddingVertical: 15,
    backgroundColor: '#3185fc',
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
  playerList: {
    flexDirection: 'row',
    marginTop: 2,
    width: '100%',
  },
  playerListValue: {
    width: '40%',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  playerListValueText: {
    marginRight: 8,
    fontSize: 13,
    fontWeight: '500',
  },
});

export default Players;
