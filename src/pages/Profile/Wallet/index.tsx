import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, SafeAreaView } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/native';

import {
  Header,
  ContentMain,
  HeadingLeftTitle,
  Content,
  PrimaryButton,
  PrimaryButtonText,
  HeadingLeft,
  ButtonOuter,
  IconImage,
  HeadingMain,
  HeadingText,
} from './styles';

import { Coins } from './Coins';
import AccordionListItem from '../../../components/AccordionListItem/AccordionListItem';

import UserService from '../../../services/user.service';

const userService = new UserService();

const Wallet: React.FC = ({ navigation, route }: any) => {
  let { userId } = route.params || {};

  const accordionList = [
    { title: 'How to earn coins & Reedem it?', component: <Coins /> },
  ];
  const [openIndex, setOpenIndex] = useState(0);

  const [isMounted, setIsMounted] = useState(false);
  const [coins, setCoins] = useState(0);

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
      handleParams();
    }
  }, [isMounted]);

  const handleParams = () => {
    SecureStore.getItemAsync('userCoins').then(userCoins => {
      const coins: any = JSON.parse(userCoins || '{}');
      setCoins(coins.coins || 0);

      userService.getUserCoins(userId).then(({ status, userCoins }: any) => {
        if (status) {
          userCoins = userCoins || {};
          setCoins(userCoins.coins || 0);

          SecureStore.setItemAsync(
            'userCoins',
            JSON.stringify({
              coins: userCoins.coins || 0,
              likes: userCoins.likes || 0,
            }),
          );
        }
      });
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        nestedScrollEnabled={true}
        contentContainerStyle={styles.scrollView}
      >
        <ContentMain>
          <Header>
            <HeadingLeft onPress={() => navigation.goBack()}>
              <ButtonOuter>
                <Ionicons name="ios-arrow-back" size={22} color={'#000000'} />
                <HeadingLeftTitle style={{ color: '#9F9F9F' }}>
                  Back
                </HeadingLeftTitle>
              </ButtonOuter>
            </HeadingLeft>
          </Header>

          <ScrollView nestedScrollEnabled={true}>
            <Content>
              <View style={{ alignItems: 'center', marginBottom: -40 }}>
                <IconImage
                  source={require('../../../assets/lottie-animations/wallet.gif')}
                  style={{
                    width: '100%',
                    height: 285,
                    marginTop: -5,
                  }}
                />
              </View>

              <HeadingMain>
                <HeadingText>You have </HeadingText>
                <HeadingText style={{ color: '#F25813' }}>{coins}</HeadingText>
                <HeadingText> coins in your wallet.</HeadingText>
              </HeadingMain>

              {/* <View style={{ marginTop: 30 }}>
                {accordionList.map(({ title, component }, index) => (
                  <AccordionListItem
                    key={index}
                    index={index}
                    title={title}
                    children={component}
                    openIndex={openIndex}
                    setOpenIndex={$event =>
                      setOpenIndex(openIndex === $event ? null : $event)
                    }
                  ></AccordionListItem>
                ))}
              </View> */}
            </Content>
          </ScrollView>
        </ContentMain>
      </ScrollView>
    </SafeAreaView>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
});
export default Wallet;
