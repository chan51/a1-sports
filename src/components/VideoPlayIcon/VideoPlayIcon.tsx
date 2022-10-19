import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';

import { FontAwesome5 } from '@expo/vector-icons';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const VideoPlayIcon: React.FC<any> = ({ playHandle, top, marginLeft }: any) => {
  return (
    playHandle && (
      <View style={[styles.viewStyle, { top: top, marginLeft: marginLeft }]}>
        <FontAwesome5
          style={{ marginLeft: 5 }}
          name="play"
          size={24}
          color="#ff2666"
        />
      </View>
    )
  );
};

const styles = StyleSheet.create({
  viewStyle: {
    width: 55,
    height: 55,
    backgroundColor: '#ffffff',
    borderColor: '#000',
    borderRadius: 50,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    left: windowWidth / 2 - 38,
    position: 'absolute',
    bottom: windowHeight / 3,
    zIndex: 99,
  },
});

export default VideoPlayIcon;
