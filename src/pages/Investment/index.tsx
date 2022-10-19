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

import viratKohli from './../../assets/player/virat-kohli.png';
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

const userService = new UserService();

const Investment: React.FC = ({ navigation, route }: any) => {
  const { player } = route.params || {};

  const [playerDetails, setPlayerDetails] = useState<Player>();
  const [currentUser, setCurrentUser] = useState<any>();

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
    });
  };

  const goBack = () => navigation.goBack();

  const onUpdateInvestment = (value: any) => {
    const parsedInvest = Number.parseInt(value);
    if (Number.isNaN(parsedInvest)) {
      setInvestment(0);
    } else if (parsedInvest > maxInvestment) {
      setInvestment(maxInvestment);
    } else {
      setInvestment(parsedInvest);
    }
  };

  const submitInvestment = () => {
    const data = {
      userId: currentUser.id,
      playerId: playerDetails.id,
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
          const updatedUser = {
            ...currentUser,
            coins: data.coins,
          };
          SecureStore.setItemAsync('user', JSON.stringify(updatedUser));
          setCurrentUser(updatedUser);
          setInvestment(null);
          setMaxInvestment(Math.floor(updatedUser.coins / player.value));
          console.log(Math.floor(updatedUser.coins / player.value));
          Keyboard.dismiss();
        }
      });
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
            <CoverImage source={viratKohli} />
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

        <View style={styles.playerList}>
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
        </View>
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
              {currentUser?.coins}
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
              editable={!!maxInvestment}
              selectTextOnFocus={!!maxInvestment}
            />
            <TouchableOpacity
              disabled={maxInvestment === investment || !maxInvestment}
              style={{ marginLeft: 5 }}
              onPress={() => onUpdateInvestment(investment + 1)}
            >
              <AntDesign
                name="plus"
                size={20}
                color={
                  maxInvestment === investment || !maxInvestment
                    ? '#d5dbe5'
                    : 'black'
                }
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => submitInvestment()}
        >
          <View
            style={{
              ...styles.button,
              backgroundColor: investment ? '#fae04b' : '#d5dbe5',
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: '500' }}>Submit</Text>
          </View>
        </TouchableOpacity>
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
