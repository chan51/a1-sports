import React from 'react';

import { Container } from './styles';

import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  home: boolean;
}

const HomeButton: React.FC<Props> = ({ home }) => {
  return (
    <Container home={home}>
      <LinearGradient
        colors={['#F12711', '#F5AF19']}
        style={{
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        start={{
          x: 0,
          y: 0,
        }}
        end={{
          x: 1,
          y: 1,
        }}
      >
        <Feather name="plus" size={18} color={home ? '#fff' : '#fff'} />
      </LinearGradient>
    </Container>
  );
};

export default HomeButton;
