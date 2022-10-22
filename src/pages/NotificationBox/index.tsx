import React, { Fragment, useEffect, useState } from 'react';
import {
  Dimensions,
  StatusBar,
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text,
  Image,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/core';

import {
  Content,
  ListItem,
  UserDetails,
  UserImage,
  UserText,
  UserHeading,
  UserSubheading,
  UploadedItem,
  Header,
  HeadingLeft,
  HeadingLeftTitle,
} from './styles';
import userIcon from '../../assets/user.png';

import LeaderService from '../../services/leader.service';
import { utilService } from '../../services/util.service';

const winDimension = Dimensions.get('window');
const notificationService = new LeaderService();

const NotificationBox: React.FC = ({ navigation }: any) => {
  const [page, setPage] = useState({
    skip: 0,
    limit: 10,
  });
  const [refreshing, setRefreshing] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [totalNotifications, setTotalNotifications] = useState(0);

  useEffect(() => {
    StatusBar.setHidden(false);
    StatusBar.setTranslucent(true);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setHidden(false);
      StatusBar.setTranslucent(false);
    }, []),
  );

  useEffect(() => {
    const { skip, limit } = page;
    if (!skip || skip < totalNotifications) {
      getNotification(skip, limit);
    } else {
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [page]);

  const getNotification = (skip, limit) => {
    notificationService.getLeaders(skip, limit).then((response: any) => {
      const newNotifications = [
        ...notifications,
        ...(response.notifications || []),
      ].filter(notification => notification.visible);
      setNotifications(
        utilService.getUniqueArray(newNotifications, 'id', true),
      );

      setRefreshing(false);
      setLoadingMore(false);
      if (!totalNotifications) {
        setTotalNotifications(response.notificationsLength);
      }
    });
  };

  const _handleLoadMore = () => {
    if (page.skip < totalNotifications && !loadingMore && !refreshing) {
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
          width: winDimension.width,
          height: winDimension.height,
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

  const _handleRefresh = () => {
    setRefreshing(true);
    setNotifications([]);
    setTotalNotifications(0);
    setPage({
      skip: 0,
      limit: 10,
    });
  };

  const clickEventForNotification = item => {
    setButtonClicked(true);
    if (!buttonClicked) {
      const { action, actionPerformedOnId, notificationSentById } = item;

      switch (action) {
        case 'feeds/like-feed':
          openMedia(actionPerformedOnId);
          break;
        case 'feeds/create-feed':
          openMedia(actionPerformedOnId);
          break;
        case 'users/set-user-follows':
          gotoUser(notificationSentById);
          break;
      }
    }
  };

  const openMedia = (feedId: string) => {
    navigation.push('LinkFeed', { feedId, goBack: true });
    setTimeout(() => setButtonClicked(false), 500);
  };

  const gotoUser = (userId: string) => {
    setButtonClicked(true);
    if (!buttonClicked) {
      navigation.navigate('UserProfile', {
        userId,
      });
      setTimeout(() => setButtonClicked(false), 500);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header>
        <HeadingLeft>
          <HeadingLeftTitle>Notifications</HeadingLeftTitle>
        </HeadingLeft>
      </Header>

      <Content style={styles.scrollView}>
        <FlatList
          contentContainerStyle={styles.flatListContentContainerStyle}
          onRefresh={_handleRefresh}
          refreshing={refreshing}
          data={notifications}
          keyExtractor={notification => notification.id.toString()}
          renderItem={({ item: notification }) => (
            <Fragment key={`notification-${notification.id}`}>
              <ListItem onPress={() => clickEventForNotification(notification)}>
                <UserDetails>
                  {notification.notificationSentByImage ? (
                    <UserImage
                      source={{ uri: notification.notificationSentByImage }}
                    />
                  ) : (
                    <UserImage source={userIcon} />
                  )}
                  <UserText>
                    <UserHeading>
                      {notification.notificationSentByName}
                    </UserHeading>
                    <UserSubheading>
                      {notification.notificationBody.body.replace(
                        `${notification.notificationSentByName} `,
                        '',
                      )}
                      <Text style={{ color: 'black' }}>
                        {' '}
                        {utilService.getAgoTimestamp(notification.createdAt)}
                      </Text>
                    </UserSubheading>
                  </UserText>
                </UserDetails>
                {notification.requestData.thumb ? (
                  <UploadedItem
                    style={{ borderRadius: 5 }}
                    source={{ uri: notification.requestData.thumb }}
                  />
                ) : notification.actionPerformedOnType === 'user' &&
                  notification.notificationSentByImage ? (
                  <UploadedItem
                    style={{ borderRadius: 5 }}
                    source={{ uri: notification.notificationSentByImage }}
                  />
                ) : (
                  <UploadedItem source={userIcon} />
                )}
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
                source={require('../../assets/lottie-animations/notification.gif')}
                style={{
                  width: 400,
                  height: 560,
                  position: 'absolute',
                }}
              />
            ) : (
              <></>
            )
          }
        />
      </Content>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    height: '100%',
    backgroundColor: '#fff',
  },
  flatListContentContainerStyle: {
    flexDirection: 'column',
    width: '100%',
    flexGrow: 1,
  },
});

export default NotificationBox;
