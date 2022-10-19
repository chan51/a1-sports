import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

import { Text } from './styles';
import noEvent from '../../assets/noEvent.png';

const NoRecord: React.FC<any> = ({ message }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      <Image source={noEvent} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
  },
  message: { fontSize: 16 },
  image: { width: 170, height: 170, marginTop: 15 },
});

export default NoRecord;
