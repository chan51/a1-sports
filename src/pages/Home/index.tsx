import React, { Fragment, useEffect, useState } from 'react';
import {
  ScrollView,
  RefreshControl,
  SafeAreaView,
  BackHandler,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import * as SecureStore from 'expo-secure-store';
import { distinctUntilChanged } from 'rxjs/operators';
import { useFocusEffect } from '@react-navigation/native';

import { Container, ListItem } from './styles';
import PlayerService from '../../services/player.service';
import { isOnHome, utilService, updateHome } from '../../services/util.service';

import playerIcon from './../../assets/player/player1.png';
import growth from './../../assets/icons/growth.png';
import down from './../../assets/icons/down.png';
import coins from './../../assets/icons/coins.png';
import arrowRight from './../../assets/icons/arrow-right.png';
import { Player } from '../../models/player.interface';

const wait = (timeout: any) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};

let canExitApp = 0;
const perPage = 10;
let feedListParam = {
  skip: 0,
  limit: perPage,
  total: 0,
};
const playerService = new PlayerService();

const Home: React.FC = ({ navigation, route }: any) => {
  const [active, setActive] = useState<any>({
    playId: 0,
    pageIndex: 0,
    refreshEnabled: true,
  });
  const [userId, setUserId] = useState<any>(null);
  const [allPlayers, setAllPlayers] = useState<any>([]);

  const [isMounted, setIsMounted] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [isContentLoading, setIsContentLoading] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => {
      _refreshTopGainers();
    });
  }, []);

  useEffect(() => {
    if (isMounted) {
      try {
        isMounted &&
          updateHome &&
          updateHome
            .pipe(distinctUntilChanged())
            .subscribe(({ type, data }) => {
              if (!type) return;
              switch (type) {
                case 'refreshPage':
                  if (!refreshing) {
                    _refreshTopGainers();
                    setTimeout(() => {
                      isOnHome.next({ type: 'refreshPage', data: false });
                    }, 0);
                  }
                  break;
              }
            });
      } catch {}
    }
  }, []);

  useEffect(() => {
    try {
      setIsMounted(true);
    } catch (error) {
      return error;
    }
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (isMounted) {
      getUserId();
      getTopGainers();
    }
    return () => {
      setIsMounted(false);
    };
  }, [isMounted]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        canExitApp++;
        if (canExitApp === 1) {
          setTimeout(() => (canExitApp = 0), 3000);
          utilService.showMessage('Press again for exit app!');
          return true;
        } else if (canExitApp === 2) {
          canExitApp = 0;
          BackHandler.exitApp();
          return false;
        } else {
          return true;
        }
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, []),
  );

  const getUserId = () => {
    SecureStore.getItemAsync('user').then((user: any) => {
      user && (user = JSON.parse(user));
      SecureStore.getItemAsync('guest').then((isGuestUser: any) => {
        setUserId(
          isGuestUser ? `guest${new Date().getUTCMilliseconds()}` : user.id,
        );
      });
    });
  };

  const resetDataOnLeave = () => {
    if (isMounted) {
      feedListParam = {
        skip: 0,
        limit: perPage,
        total: 0,
      };
      setRefreshing(false);
      setIsContentLoading(false);
      setIsMounted(false);
    }
  };

  const _refreshTopGainers = () => {
    if (isMounted) {
      getTopGainers();
    }
  };

  const getTopGainers = async () => {
    const playerList: any = await playerService.getPlayers({
      topGainers: true,
    });
    if (isMounted) {
      try {
        if (isMounted) {
          setAllPlayers(playerList.status ? [...playerList.players] : []);
          setRefreshing(false);
          setTimeout(() => setIsContentLoading(false), 500);
        }
      } catch (err) {
        setRefreshing(false);
        setTimeout(() => setIsContentLoading(false), 500);
      }
    }
  };

  const gotoPlayerList = () => {
    navigation.navigate('Players');
  };

  const gotoPlayerInvestment = (player: Player) => {
    if (player.isEnable) {
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
          player,
        });
        setTimeout(() => setButtonClicked(false), 500);
      }
    } else {
      utilService.showMessage(
        'Cannot buy share as the match is about to start',
      );
    }
  };

  const returnPlayerRole = role => {
    if (!role) return '';
    role = (role || '').toLowerCase();
    switch (role) {
      case 'batter':
        return require(`./../../assets/cricket/cricket-batter.png`);
      case 'bowler':
        return require(`./../../assets/cricket/cricket-bowler.png`);
      case 'all-rounder':
        return require(`./../../assets/cricket/cricket-all-rounder.png`);
      case 'wicket-keeper':
        return require(`./../../assets/cricket/cricket-wicket-keeper.png`);
      default:
        return require(`./../../assets/cricket/cricket-all-rounder.png`);
    }
  };

  return (
    <Container>
      {isMounted && (
        <SafeAreaView style={styles.container}>
          {/* <View style={styles.playerIconlist}>
            <View style={styles.playerIconlistItem}>
              <UserImage source={playerIcon} />
            </View>
            <View style={styles.playerIconlistItem}>
              <UserImage source={playerIcon} />
            </View>
            <View style={styles.playerIconlistItem}>
              <UserImage source={playerIcon} />
            </View>

            <View style={styles.playerIconlistItem}>
              <UserImage source={playerIcon} />
            </View>

            <View style={styles.playerIconlistItem}>
              <UserImage source={playerIcon} />
            </View>
          </View> */}

          <View style={styles.playerHeading}>
            <Text style={{ ...styles.playerListHeadingText, marginLeft: 10 }}>
              Top Gainers
            </Text>
            <Text style={{ ...styles.playerListHeadingText, marginLeft: -14 }}>
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
            nestedScrollEnabled={true}
            contentContainerStyle={styles.scrollView}
            refreshControl={
              <RefreshControl
                enabled={
                  active.refreshEnabled && !isContentLoading && !refreshing
                }
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          >
            {allPlayers.length ? (
              <>
                {allPlayers.map((player: Player, index: number) => (
                  <Fragment key={`gainer-player-${index}`}>
                    <ListItem onPress={() => gotoPlayerInvestment(player)}>
                      <View style={styles.playerList}>
                        <View style={styles.playerListValue}>
                          <Image
                            source={returnPlayerRole(player?.role)}
                            fadeDuration={0}
                            style={{
                              width: 12,
                              height: 12,
                              marginTop: 5,
                              marginRight: 4,
                            }}
                          />
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
                ))}
              </>
            ) : (
              <></>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => gotoPlayerList()}>
                <View style={styles.button}>
                  <Text style={{ fontSize: 13, fontWeight: '500' }}>
                    Marketplace
                  </Text>
                  <Image source={arrowRight} />
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: '#fff',
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
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
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: '100%',
  },
  button: {
    alignContent: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderWidth: 1,
    width: 150,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderColor: '#fae04b',
  },
  content: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 27,
    paddingVertical: 0,
  },
});

export default Home;
