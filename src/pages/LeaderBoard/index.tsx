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

import styled from 'styled-components/native';
import { useFocusEffect } from '@react-navigation/core';

import coins from './../../assets/icons/coins.png';

import UserService from '../../services/user.service';
import { utilService } from '../../services/util.service';

const userService = new UserService();
const winDimension = Dimensions.get('window');

const LeaderBoard: React.FC = ({ navigation }: any) => {
  const [page, setPage] = useState({
    skip: 0,
    limit: 15,
  });
  const [refreshing, setRefreshing] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  const [leaders, setLeaders] = useState([]);
  const [totalLeaders, setTotalLeaders] = useState(0);

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
    if (!skip || skip < totalLeaders) {
      getLeader(skip, limit);
    } else {
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [page]);

  const getLeader = (skip, limit) => {
    userService.getLeaders().then((response: any) => {
      const newLeaders = [...leaders, ...(response.leaders || [])];
      setLeaders(utilService.getUniqueArray(newLeaders, 'id', true));

      setRefreshing(false);
      setLoadingMore(false);
      if (!totalLeaders) {
        setTotalLeaders(response.leadersLength);
      }
    });
  };

  const _handleLoadMore = () => {
    if (page.skip < totalLeaders && !loadingMore && !refreshing) {
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
    setLeaders([]);
    setTotalLeaders(0);
    setPage({
      skip: 0,
      limit: 15,
    });
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
    <SafeAreaView style={styles.container}>
      <View style={styles.heading}>
        <Text style={styles.headingText}>Leader Board</Text>
      </View>
      <View style={styles.playerHeading}>
        <Text style={styles.playerListHeadingText}>Name</Text>
        <Text style={styles.playerValueHeadingText}>Coins Earned</Text>
      </View>

      <View style={styles.scrollView}>
        <FlatList
          contentContainerStyle={styles.flatListContentContainerStyle}
          onRefresh={_handleRefresh}
          refreshing={refreshing}
          data={leaders}
          keyExtractor={leader => leader.id.toString()}
          renderItem={({ item: leader }) => (
            <Fragment key={`leader-${leader.id}`}>
              <ListItem onPress={() => clickEventForLeader(leader)}>
                <View style={styles.playerList}>
                  <View style={styles.playerListTitel}>
                    <Text style={{ fontSize: 13, fontWeight: '500' }}>
                      {leader.userName}
                    </Text>
                  </View>
                  <View style={styles.playerListValue}>
                    <Text
                      style={{
                        marginRight: 8,
                        fontSize: 13,
                        fontWeight: '500',
                        justifyContent: 'flex-end',
                        alignContent: 'flex-end',
                      }}
                    >
                      {leader.coins}
                    </Text>
                    <Image source={coins} />
                  </View>
                </View>
              </ListItem>
            </Fragment>
          )}
          onEndReached={_handleLoadMore}
          onEndReachedThreshold={0.5}
          initialNumToRender={20}
          ListFooterComponent={_renderFooter}
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
    </SafeAreaView>
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
  playerHeading: {
    paddingVertical: 15,
    backgroundColor: '#aa556f',
    paddingHorizontal: 5,
    marginTop: 5,
    flexDirection: 'row',
  },
  playerListHeadingText: {
    color: '#fff',
    fontSize: 14,
    width: '61%',
    paddingLeft: 15,
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
    paddingLeft: 0,
    flexDirection: 'row',
  },
  playerListValue: {
    width: 80,
    marginLeft: -5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
  },
});
export const ListItem = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
})`
  padding: 5px 15px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export default LeaderBoard;
