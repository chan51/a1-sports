import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import * as SecureStore from 'expo-secure-store';

import IntroSlider from './intro-slider';
import RootStackScreen from './app.routes';
import AuthService from '../services/auth.service';
import * as NavigationService from '../services/navigation.service';

const authService = new AuthService();

const Routes: React.FC<any> = ({ userId }: any) => {
  let [loading, setLoading] = useState(false);
  let [isSliderDone, setIsSliderDone] = useState(false);

  useEffect(() => {
    try {
      checkSlider();
      if (userId !== null) {
        setLoading(true);
      }
    } catch (error) {
      return error;
    }
  });

  const checkSlider = async () => {
    const sliderDone = await SecureStore.getItemAsync('isSliderDone');
    if (sliderDone === 'true') {
      setIsSliderDone(true);
    }
  };

  const handleSliderAction = () => {
    setIsSliderDone(true);
    SecureStore.setItemAsync('isSliderDone', 'true');
    // authService.guestLogin(() => NavigationService.navigate('Main'));1
  };

  return (
    // <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
    <NavigationContainer>
      {loading ? (
        isSliderDone ? (
          <RootStackScreen userId={userId} />
        ) : (
          <IntroSlider
            isSliderDone={isSliderDone}
            handleSlider={handleSliderAction}
          />
        )
      ) : (
        <Text>``</Text>
      )}
    </NavigationContainer>
  );
};

export default Routes;
