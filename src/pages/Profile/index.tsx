import React, { useContext, useEffect, useState, Fragment } from 'react';
import {
  BackHandler,
  Dimensions,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
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
} from './styles';

import { User } from '../../models/user.interface';
import ProfileContext from '../../context/ProfileContext';

import UserService from '../../services/user.service';

import Sidebar from './Sidebar';
import ProfilePicUpload from '../../components/ProfilePicUpload';
import ProgressiveImage from '../../components/ProgressiveImage/ProgressiveImage';
import coins from './../../assets/icons/coins.png';

const userService = new UserService();
const { width: winWidth, height: winHeight } = Dimensions.get('window');

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
  const [currentUser, setCurrentUser] = useState<User>();

  const [events, setEvents] = useState([]);

  const [refreshing, setRefreshing] = React.useState(false);

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
    setRefreshing(false);
    if (!userId || !isMounted) return;

    setRefreshing(true);
    const profileContextProfileDetails = profileContext.profiles[userId];
    if (profileContextProfileDetails) {
      setUser({ ...profileContextProfileDetails });
      profileContextProfileDetails.events &&
        setEvents(profileContextProfileDetails.events);
    }

    SecureStore.getItemAsync('userCoins').then(userCoins => {
      if (userCoins === null || userCoins === undefined) {
        userService.getUserCoins(userId).then(({ status, userCoins }: any) => {
          if (status) {
            SecureStore.setItemAsync(
              'userCoins',
              JSON.stringify({
                coins: (userCoins || {}).coins || 0,
                likes: (userCoins || {}).likes || 0,
              }),
            );
          }
        });
      }
    });

    getCurrentUser();
    getUserRecord(userId);
    setRefreshing(false);
  };

  const getCurrentUser = async () => {
    SecureStore.getItemAsync('user').then((currentUserValue: any) => {
      currentUserValue = JSON.parse(currentUserValue);
      setCurrentUser(currentUserValue);
    });
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

  const gotoRewardScreen = () => {
    navigation.push('Reward', { userId: userId });
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

  const _handleRefresh = () => {
    setRefreshing(true);
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
          height: winHeight,
          paddingVertical: 20,
          borderTopWidth: 5,
          marginTop: 10,
          marginBottom: 10,
          borderColor: '#F25813',
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  const clickEventForLeader = ({ userId }) => {
    setButtonClicked(true);
    if (!buttonClicked) {
      navigation.navigate('UserProfile', {
        userId,
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
      <SafeAreaView style={styles.container}>
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
              gotoRewardScreen={gotoRewardScreen}
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

            <View style={styles.playerHeading}>
              <Text style={styles.playerListHeadingText}>
                {(user?.name || '').split(' ')[0]}’s{' '}
              </Text>
              <Text style={styles.playerValueHeadingText}>
                Investment Return
              </Text>
            </View>

            <FlatList
              contentContainerStyle={styles.flatListContentContainerStyle}
              onRefresh={_handleRefresh}
              refreshing={refreshing}
              data={investments}
              keyExtractor={investment => investment.id.toString()}
              renderItem={({ item: investment }) => (
                <Fragment key={`leader-${investment.id}`}>
                  <TouchableOpacity
                    style={styles.touchableOpacity}
                    onPress={() => clickEventForLeader(investment)}
                  >
                    <View style={styles.playerList}>
                      <View style={styles.playerListTitel}>
                        <Text style={{ fontSize: 13, fontWeight: '500' }}>
                          {investment.name}
                        </Text>
                      </View>
                      <View style={styles.playerListValue}>
                        <Text
                          style={{
                            marginRight: 8,
                            fontSize: 13,
                            fontWeight: '500',
                          }}
                        >
                          {investment.coins}
                        </Text>
                        <Image source={coins} />
                      </View>
                    </View>
                  </TouchableOpacity>
                </Fragment>
              )}
              onEndReached={_handleLoadMore}
              onEndReachedThreshold={0.5}
              initialNumToRender={10}
              ListFooterComponent={_renderFooter}
            />
          </ContentMain>
        ) : (
          <></>
        )}
      </SafeAreaView>
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
    width: '60%',
    paddingLeft: 10,
    fontWeight: '500',
  },
  playerValueHeadingText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  playerList: {
    flexDirection: 'row',
    marginTop: 14,
    paddingHorizontal: 5,
  },
  playerListTitel: {
    width: '70%',
    paddingLeft: 10,
    flexDirection: 'row',
  },
  playerListValue: {
    paddingLeft: 10,
    flexDirection: 'row',
  },
  flatListContentContainerStyle: {
    flexDirection: 'column',
    width: '100%',
  },
  touchableOpacity: {
    padding: '10px 15px',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default Profile;
