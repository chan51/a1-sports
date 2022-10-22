import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';

import * as SecureStore from 'expo-secure-store';
import { NavigationContainer } from '@react-navigation/native';

import IntroSlider from './intro-slider';
import RootStackScreen from './app.routes';

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
