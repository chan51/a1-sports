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
  TouchableOpacity,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/core';

import coins from './../../assets/icons/coins.png';

import LeaderService from '../../services/leader.service';
import { utilService } from '../../services/util.service';

const winDimension = Dimensions.get('window');
const leaderService = new LeaderService();

const LeaderBoard: React.FC = ({ navigation }: any) => {
  const [page, setPage] = useState({
    skip: 0,
    limit: 10,
  });
  const [refreshing, setRefreshing] = useState(false);
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
    getLeader(skip, limit);
  }, [page]);

  const getLeader = (skip, limit) => {
    leaderService.getLeaders(skip, limit).then((response: any) => {
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
    setTotalLeaders(0);
    setPage({
      skip: 0,
      limit: 10,
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
              <TouchableOpacity
                style={styles.touchableOpacity}
                onPress={() => clickEventForLeader(leader)}
              >
                <View style={styles.playerList}>
                  <View style={styles.playerListTitel}>
                    <Text style={{ fontSize: 13, fontWeight: '500' }}>
                      {leader.name}
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
                      {leader.coins}
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
    width: '70%',
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
    width: '75%',
    paddingLeft: 10,
    flexDirection: 'row',
  },
  playerListValue: {
    paddingLeft: 10,
    flexDirection: 'row',
  },
  touchableOpacity: {
    padding: '10px 15px',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default LeaderBoard;
