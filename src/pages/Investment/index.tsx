import React, { useEffect, useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  View,
  ScrollView,
  Image,
  SafeAreaView,
  Keyboard,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/core';

import * as SecureStore from 'expo-secure-store';
import { AntDesign, Ionicons } from '@expo/vector-icons';

import { Player } from '../../models/player.interface';

import avatar from './../../assets/player/avatar.png';
import growth from './../../assets/icons/growth.png';
import coins from './../../assets/icons/coins.png';
import down from './../../assets/icons/down.png';
import {
  Header,
  ProfileDetails,
  ProfileDetailsData,
  CoverImage,
  Banner,
  HeadingLeft,
  ButtonOuter,
  Title,
} from './styles';

import UserService from '../../services/user.service';
import PlayerService from '../../services/player.service';
import { utilService } from '../../services/util.service';

const userService = new UserService();
const playerService = new PlayerService();

const Investment: React.FC = ({ navigation, route }: any) => {
  const { player } = route.params || {};

  const [playerDetails, setPlayerDetails] = useState<Player>();
  const [currentUser, setCurrentUser] = useState<any>();
  const [currentUserCoins, setCurrentUserCoins] = useState<any>(null);
  const [playerLastInvestment, setPlayerLastInvestment] = useState<any>(null);

  const [isMounted, setIsMounted] = useState(false);
  const [investment, setInvestment] = useState(null);
  const [maxInvestment, setMaxInvestment] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      setIsMounted(true);
      return () => {
        setIsMounted(false);
      };
    }, []),
  );

  useEffect(() => {
    if (isMounted) {
      if (player) {
        setPlayerDetails({ ...player, value: player.value || 0 });
        getCurrentUser(player);
      } else {
        goBack();
      }
    }
  }, [player, isMounted]);

  const getCurrentUser = player => {
    SecureStore.getItemAsync('userId').then((userId: any) => {
      userService.getUserDetails(userId).then(({ status, userRecord }: any) => {
        if (isMounted && status) {
          setCurrentUser(userRecord);
          setMaxInvestment(Math.floor(userRecord.coins / player.value));
        }
      });
      playerService
        .getPlayerLastInvestment(player.id, player.value)
        .then((data: any) => {
          if (isMounted && data.status) {
            setPlayerLastInvestment(data.playerLastInvestment);
          }
        });
    });
  };

  const goBack = () => navigation.goBack();

  const onUpdateInvestment = (value: any) => {
    let updatedInvestment = null;
    const parsedInvest = Number.parseInt(value);
    if (Number.isNaN(parsedInvest)) {
      updatedInvestment = 0;
    } else if (parsedInvest > maxInvestment) {
      updatedInvestment = maxInvestment;
    } else {
      updatedInvestment = parsedInvest;
    }

    setInvestment(updatedInvestment);
    setCurrentUserCoins(
      currentUser?.coins - updatedInvestment * playerDetails.value,
    );
  };

  const buyInvestment = () => {
    Keyboard.dismiss();
    const data = {
      isBuy: true,
      isSell: false,
      userId: currentUser.id,
      playerId: playerDetails.id,
      playerName: playerDetails.name,
      playerValue: playerDetails.value,
      investment,
      totalInvestment: investment * playerDetails.value,
    };
    userService
      .submitInvestment({
        ...data,
        coins: currentUser?.coins - data.totalInvestment,
      })
      .then(({ status, data }: any) => {
        if (status) {
          handleSubmitInvestment(data);
        }
      })
      .finally(() => {
        utilService.showMessage(
          `Successfully invested in player ${playerDetails?.name}!`,
        );
        goBack();
      });
  };

  const sellInvestment = () => {
    Keyboard.dismiss();
    const data = {
      ...playerLastInvestment,
      fromSell: true,
      investment: playerLastInvestment.investment - investment,
      totalInvestment:
        playerLastInvestment.totalInvestment - investment * playerDetails.value,
      isSell: investment === playerLastInvestment.investment,
    };
    userService
      .submitInvestment({
        ...data,
        coins: currentUser?.coins + investment * playerDetails.value,
      })
      .then(({ status, data }: any) => {
        if (status) {
          handleSubmitInvestment(data);
        }
      })
      .finally(() => {
        utilService.showMessage(
          `Successfully sold investment of player ${playerDetails?.name}!`,
        );
        goBack();
      });
  };

  const handleSubmitInvestment = data => {
    const updatedUser = {
      ...currentUser,
      coins: data.coins,
    };
    SecureStore.setItemAsync('user', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
    setCurrentUserCoins(null);
    setInvestment(null);
    setMaxInvestment(Math.floor(updatedUser.coins / player.value));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header>
        <HeadingLeft onPress={() => goBack()}>
          <ButtonOuter>
            <Ionicons name="ios-arrow-back" size={22} color={'#000000'} />
          </ButtonOuter>
        </HeadingLeft>
        <View>
          <Title>Player Investment</Title>
        </View>
        <HeadingLeft></HeadingLeft>
      </Header>

      <ScrollView keyboardShouldPersistTaps="handled">
        <ProfileDetails>
          <Banner style={{ backgroundColor: '#000' }}>
            <CoverImage source={avatar} />
          </Banner>
          <ProfileDetailsData>
            <Text style={{ fontSize: 15, fontWeight: '500' }}>
              {playerDetails?.name}
            </Text>
          </ProfileDetailsData>
        </ProfileDetails>

        <View style={styles.playerHeading}>
          <Text style={styles.playerListHeadingText}>Investment Details</Text>
        </View>

        {/* <View style={styles.playerList}>
          <View style={styles.playerListTitel}>
            <Text style={{ fontSize: 13, fontWeight: '400' }}>
              Growth( in %)
            </Text>
          </View>
          <View style={styles.playerListValue}>
            <Text style={{ marginRight: 8, fontSize: 13, fontWeight: '500' }}>
              {player?.growth || 0}%
            </Text>
            <Image source={growth} />
          </View>
        </View> */}
        <View style={styles.playerList}>
          <View style={styles.playerListTitel}>
            <Text style={{ fontSize: 13, fontWeight: '400' }}>
              Current Value
            </Text>
          </View>
          <View style={styles.playerListValue}>
            <Text style={{ marginRight: 8, fontSize: 13, fontWeight: '400' }}>
              {playerDetails?.value || 0}
            </Text>
            <Image source={coins} />
          </View>
        </View>
        <View style={styles.playerList}>
          <View style={styles.playerListTitel}>
            <Text style={{ fontSize: 13, fontWeight: '400' }}>Your Wallet</Text>
          </View>
          <View style={styles.playerListValue}>
            <Text style={{ marginRight: 8, fontSize: 13, fontWeight: '400' }}>
              {currentUserCoins || currentUser?.coins}
            </Text>
            <Image source={coins} />
          </View>
        </View>
        <View style={styles.playerList}>
          <View style={styles.playerListTitel}>
            <Text style={{ fontSize: 16, fontWeight: '500' }}>Invest</Text>
          </View>
          <View style={styles.playerListValue}>
            <TouchableOpacity
              disabled={!investment}
              style={{ marginRight: 5 }}
              onPress={() => onUpdateInvestment(investment - 1)}
            >
              <AntDesign
                name="minus"
                size={20}
                color={!investment ? '#d5dbe5' : 'black'}
              />
            </TouchableOpacity>
            <TextInput
              style={styles.investmentInput}
              onChangeText={$event => onUpdateInvestment($event)}
              value={(investment || '').toString()}
              placeholder="0"
              keyboardType="numeric"
              maxLength={(maxInvestment || '').length}
              autoComplete={'off'}
              editable={!!maxInvestment && !!playerDetails?.value}
              selectTextOnFocus={!!maxInvestment && !!playerDetails?.value}
            />
            <TouchableOpacity
              disabled={
                maxInvestment === investment ||
                !maxInvestment ||
                !playerDetails?.value
              }
              style={{ marginLeft: 5 }}
              onPress={() => onUpdateInvestment(investment + 1)}
            >
              <AntDesign
                name="plus"
                size={20}
                color={
                  maxInvestment === investment ||
                  !maxInvestment ||
                  !playerDetails?.value
                    ? '#d5dbe5'
                    : 'black'
                }
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => buyInvestment()}
          >
            <View
              style={{
                ...styles.button,
                backgroundColor: investment ? '#fae04b' : '#d5dbe5',
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: '500' }}>Buy</Text>
            </View>
          </TouchableOpacity>
          {playerLastInvestment ? (
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() =>
                investment &&
                investment * playerDetails.value <=
                  playerLastInvestment.totalInvestment
                  ? sellInvestment()
                  : null
              }
            >
              <View
                style={{
                  ...styles.button,
                  backgroundColor:
                    investment &&
                    investment * playerDetails.value <=
                      playerLastInvestment.totalInvestment
                      ? '#fae04b'
                      : '#d5dbe5',
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: '500' }}>Sell</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <></>
          )}
        </View>
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
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heading: {
    paddingVertical: 25,
    paddingHorizontal: 15,
  },
  headingText: {
    fontWeight: '500',
    fontSize: 16,
  },
  playerHeading: {
    paddingVertical: 15,
    backgroundColor: '#3185fc',
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
    width: '60%',
    paddingLeft: 10,
    flexDirection: 'row',
  },
  playerListValue: {
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
  },
  investmentInput: {
    borderWidth: 1,
    borderColor: '#333',
    width: 50,
    paddingHorizontal: 2,
    paddingVertical: 2,
    textAlign: 'center',
  },
  buttonContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    width: '100%',
    paddingHorizontal: 40,
    marginTop: 25,
  },
  button: {
    marginTop: 20,
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    width: 180,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderColor: '#fae04b',
    backgroundColor: '#fae04b',
    textAlign: 'center',
  },
});

export default Investment;
