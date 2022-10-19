import React from 'react';
import styled from 'styled-components/native';

import { Octicons } from '@expo/vector-icons';

export const Coins: React.FC = () => {
  return (
    <>
      <List>
        <ListItem>
          <Octicons name="primitive-dot" size={13} color="black" />
          <ListContent>
            Collect coins by uploading food clips, snaps and liking feeds.
          </ListContent>
        </ListItem>
        <ListItem>
          <Octicons name="primitive-dot" size={13} color="black" />
          <ListContent>Redeem coins to win exciting prizes.</ListContent>
        </ListItem>
        <ListItem>
          <Octicons name="primitive-dot" size={13} color="black" />
          <ListContent>Minimum 1000 coins needed to redeem.</ListContent>
        </ListItem>
        <ListItem>
          <Octicons name="primitive-dot" size={13} color="black" />
          <ListContent>
            Continue using to explore new features to redeem coins.
          </ListContent>
        </ListItem>
      </List>
    </>
  );
};

export const List = styled.View``;
export const ListItem = styled.View`
  flex-direction: row;
  margin-bottom: 15px;
`;
export const ListContent = styled.Text`
  font-size: 13px;
  color: #000000;
  line-height: 17px;
  margin-left: 5px;
  margin-top: -3px;
  width: 98%;
`;
