import React, { useContext, useEffect, useState, Fragment } from 'react';
import {
  BackHandler,
  Dimensions,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import { Ionicons, Octicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/native';

import {
  Header,
  ContentMain,
  Text,
  HeadingLeft,
  HeadingLeftTitle,
  HeadingRight,
  ProfileDetails,
  ProfileDetailsData,
  ListItem,
} from './styles';

import { User } from '../../models/user.interface';
import ProfileContext from '../../context/ProfileContext';

import UserService from '../../services/user.service';
import { utilService, isOnProfile } from '../../services/util.service';

import Sidebar from './Sidebar';
import ProfilePicUpload from '../../components/ProfilePicUpload';
import ProgressiveImage from '../../components/ProgressiveImage/ProgressiveImage';
import coins from './../../assets/icons/coins.png';

const userService = new UserService();
const { width: winWidth } = Dimensions.get('window');

const Profile: React.FC = ({ navigation, route }: any) => {
  let {
    user: userParam,
    userId: userIdParam,
    shouldEdit,
    currentTime,
  } = route.params || {};
  const profileContext = useContext(ProfileContext);

  const [readBio, setReadBio] = useState(70);
  const [user, setUser] = useState<User | any>({});
  const [shouldGoToEdit, setShouldGoToEdit] = useState(
    shouldEdit && currentTime - 10 <= new Date().getUTCSeconds(),
  );
  const [isMounted, setIsMounted] = useState(false);
  const [showHideSidebar, setShowHideSidebar] = useState(false);
  const [userId, setUserId] = useState<User | any>(userIdParam || null);

  const [refreshing, setRefreshing] = React.useState(true);

  useEffect(() => {
    if (isMounted) {
      if (userIdParam !== null) {
        setUserId(userIdParam);
        handleParams();
      } else {
        handleParams();
      }
      StatusBar.setHidden(false);
      StatusBar.setTranslucent(false);
    }
  }, [userIdParam, isMounted]);

  useEffect(() => {
    if (shouldGoToEdit && userParam?.loginType) {
      gotoEditScreen(true);
      setShouldGoToEdit(false);
    }
  }, [userId]);

  useEffect(() => {
    if (isMounted) {
      isOnProfile.subscribe(status => {
        if (status) {
          _handleRefresh();
          utilService.isOnProfileTab(false);
        }
      });
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setIsMounted(true);
      return () => {
        setIsMounted(false);
        setShowHideSidebar(false);
      };
    }, []),
  );

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (userParam) {
          navigation.navigate('Home');
          return true;
        }
        return false;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, []),
  );

  const handleParams = async () => {
    if (userId) {
      getUserDetails(userId);
    } else {
      const currentUserId = await SecureStore.getItemAsync('userId');
      if (currentUserId) {
        setUserId(currentUserId);
        getUserDetails(currentUserId);
      }
    }
  };

  const getUserDetails = userId => {
    if (!userId || !isMounted) return;

    const profileContextProfileDetails = profileContext.profiles[userId];
    if (profileContextProfileDetails) {
      setUser({ ...profileContextProfileDetails });
    }

    getUserRecord(userId);
  };

  const getUserRecord = userId => {
    if (!userId) return;
    userService.getUserDetails(userId).then(({ status, userRecord }: any) => {
      if (isMounted && status) {
        const updatedUserDetails = {
          ...(profileContext.profiles[userId] || {}),
          ...userRecord,
        };
        profileContext.updateProfiles({ [userId]: updatedUserDetails });
        setUser(updatedUserDetails);
      }
    });
  };

  const showProgressiveImage = (uri: string) => {
    return (
      <ProgressiveImage
        source={{ uri }}
        resizeMode="cover"
        style={{
          width: '100%',
          height: 120,
          alignSelf: 'center',
        }}
      />
    );
  };

  const toggleSidebar = () => {
    setShowHideSidebar(!showHideSidebar);
  };

  const gotoEditScreen = (fromLogin: boolean = false) => {
    navigation.push('ProfileEdit', {
      user: fromLogin ? userParam : user,
      userId: fromLogin ? user.id : userId,
      shouldEdit,
    });
    setShowHideSidebar(false);
  };

  const gotoTNCScreen = () => {
    navigation.push('TNC');
    setShowHideSidebar(false);
  };

  const gotoWalletScreen = () => {
    navigation.push('Wallet', { userId: userId });
    setShowHideSidebar(false);
  };

  const gotoFeedbackScreen = () => {
    navigation.push('Feedback');
    setShowHideSidebar(false);
  };

  const readBioButton = () => {
    setReadBio(readBio > 70 ? 70 : user?.bio.length);
  };

  const updateProfile = (userProfile: any) => {
    handleParams();
  };

  const [page, setPage] = useState({
    skip: 0,
    limit: 10,
  });
  const [loadingMore, setLoadingMore] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [investments, setInvestments] = useState([]);
  const [totalInvestments, setTotalInvestments] = useState(0);

  useEffect(() => {
    const { skip, limit } = page;
    if (!skip || skip < totalInvestments) {
      getUserInvestments(skip, limit);
    } else {
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [page]);

  const getUserInvestments = (skip, limit) => {
    userService.getUserInvestments(skip, limit).then((response: any) => {
      const newInvestments = [...investments, ...(response.investments || [])];
      setInvestments(utilService.getUniqueArray(newInvestments, 'id', true));

      setRefreshing(false);
      setLoadingMore(false);
      if (!totalInvestments) {
        setTotalInvestments(response.investmentsLength);
      }
    });
  };

  const _handleRefresh = () => {
    setRefreshing(true);
    setInvestments([]);
    setTotalInvestments(0);
    setPage({
      skip: 0,
      limit: 10,
    });
  };

  const _handleLoadMore = () => {
    if (page.skip < totalInvestments && !loadingMore && !refreshing) {
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

  const clickEventForLeader = player => {
    setButtonClicked(true);
    if (!buttonClicked) {
      navigation.navigate('Investment', {
        userId: player.id,
        player,
      });
      setTimeout(() => setButtonClicked(false), 500);
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        profiles: { ...profileContext.profiles, [user.id]: user },
        updateProfiles: () => null,
      }}
    >
      <View style={styles.container}>
        {isMounted ? (
          <ContentMain
            style={showHideSidebar ? { left: -(winWidth / 1.8) } : null}
          >
            <Sidebar
              user={user}
              showHideSidebar={showHideSidebar}
              toggleSidebar={toggleSidebar}
              gotoEditScreen={gotoEditScreen}
              gotoTNCScreen={gotoTNCScreen}
              gotoWalletScreen={gotoWalletScreen}
              gotoFeedbackScreen={gotoFeedbackScreen}
            />

            <Header>
              {userIdParam ? (
                <HeadingLeft>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="ios-arrow-back" size={22} color="black" />
                  </TouchableOpacity>
                  <HeadingLeftTitle>{user?.name}</HeadingLeftTitle>
                </HeadingLeft>
              ) : (
                <HeadingRight>
                  <HeadingLeftTitle>A1 sports exchange</HeadingLeftTitle>
                  <TouchableOpacity onPress={() => toggleSidebar()}>
                    <Octicons name="three-bars" size={22} color="black" />
                  </TouchableOpacity>
                </HeadingRight>
              )}
            </Header>

            <ProfileDetails>
              {isMounted ? (
                <ProfilePicUpload
                  user={user}
                  isMounted={isMounted}
                  navigation={navigation}
                  updateProfile={(userProfile: any) =>
                    updateProfile(userProfile)
                  }
                ></ProfilePicUpload>
              ) : (
                <></>
              )}
              <ProfileDetailsData>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '500',
                    marginBottom: 3,
                  }}
                >
                  {user?.name}
                </Text>
                <Text style={{ marginBottom: 3 }}>{user?.email}</Text>
                <Text>{user?.mobile}</Text>
              </ProfileDetailsData>
            </ProfileDetails>

            {(investments || []).length ? (
              <View style={styles.playerHeading}>
                <Text
                  style={{ ...styles.playerListHeadingText, marginLeft: -10 }}
                >
                  Player
                </Text>
                <Text
                  style={{ ...styles.playerListHeadingText, marginLeft: 2 }}
                >
                  Share
                </Text>
                <Text
                  style={{ ...styles.playerListHeadingText, marginLeft: 4 }}
                >
                  Value
                </Text>
                <Text
                  style={{ ...styles.playerListHeadingText, marginLeft: 0 }}
                >
                  Coins
                </Text>
              </View>
            ) : (
              <></>
            )}

            <FlatList
              contentContainerStyle={styles.flatListContentContainerStyle}
              onRefresh={_handleRefresh}
              refreshing={refreshing}
              data={investments}
              keyExtractor={investment => investment.id.toString()}
              renderItem={({ item: investment }) => (
                <Fragment key={`investment-${investment.id}`}>
                  <ListItem
                    onPress={() =>
                      investment.player
                        ? clickEventForLeader(investment.player)
                        : null
                    }
                  >
                    <View style={styles.playerList}>
                      <View
                        style={{ ...styles.playerListValue, paddingLeft: 5 }}
                      >
                        <Text style={styles.playerListValueText}>
                          {investment?.playerName}
                          {'\n'}({investment?.player?.team})
                        </Text>
                      </View>
                      <View
                        style={{ ...styles.playerListValue, paddingLeft: 12 }}
                      >
                        <Text style={styles.playerListValueText}>
                          {investment.investment}
                        </Text>
                      </View>
                      <View
                        style={{ ...styles.playerListValue, paddingLeft: 20 }}
                      >
                        <Text style={styles.playerListValueText}>
                          {investment.playerValue || 0}
                        </Text>
                        <Image source={coins} />
                      </View>
                      <View
                        style={{
                          ...styles.playerListValue,
                          justifyContent: 'center',
                        }}
                      >
                        <Text style={styles.playerListValueText}>
                          {investment.totalInvestment}
                        </Text>
                        <Image source={coins} />
                      </View>
                    </View>
                  </ListItem>
                </Fragment>
              )}
              onEndReached={_handleLoadMore}
              onEndReachedThreshold={0.5}
              initialNumToRender={10}
              ListFooterComponent={_renderFooter}
              ListEmptyComponent={() =>
                !refreshing && !loadingMore ? (
                  <Image
                    source={require('../../assets/lottie-animations/investment.gif')}
                    style={{
                      top: (investments || []).length ? 0 : 10,
                      width: '100%',
                      height: (investments || []).length ? 560 : 615,
                      position: 'absolute',
                    }}
                  />
                ) : (
                  <></>
                )
              }
            />
          </ContentMain>
        ) : (
          <></>
        )}
      </View>
    </ProfileContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centeredView: {
    flex: 1,
    backgroundColor: '#000',
  },
  modalView: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  playerHeading: {
    paddingVertical: 15,
    backgroundColor: '#33291e',
    paddingHorizontal: 5,
    flexDirection: 'row',
    marginTop: 15,
  },
  playerListHeadingText: {
    color: '#fff',
    fontSize: 14,
    width: '25%',
    paddingLeft: 25,
    fontWeight: '500',
  },
  playerList: {
    flexDirection: 'row',
    marginTop: 2,
  },
  playerListValue: {
    width: '25%',
    flexDirection: 'row',
  },
  playerListValueText: {
    marginRight: 8,
    fontSize: 13,
    fontWeight: '500',
  },
  flatListContentContainerStyle: {
    flexDirection: 'column',
    width: '100%',
    flexGrow: 1,
  },
});

export default Profile;
