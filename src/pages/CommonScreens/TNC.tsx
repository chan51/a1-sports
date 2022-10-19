import React, { useState } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';

import { Ionicons } from '@expo/vector-icons';

import { Disclaimer } from './Disclaimer';
import { PrivacyPolicy } from './PrivacyPolicy';
import { TermsConditions } from './TermsConditions';
import AccordionListItem from '../../components/AccordionListItem/AccordionListItem';

export const TNC: React.FC = ({ navigation }: any) => {
  const accordionList = [
    {
      title: 'Terms and Conditions',
      component: <TermsConditions />,
    },
    { title: 'Disclaimer', component: <Disclaimer /> },
    {
      title: 'Privacy and Policy',
      component: <PrivacyPolicy />,
    },
  ];
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <Container>
      <Header>
        <HeadingLeft onPress={() => navigation.goBack()}>
          <Ionicons name="ios-arrow-back" size={22} color="black" />
          <HeadingLeftTitle>Back</HeadingLeftTitle>
        </HeadingLeft>
      </Header>
      <View style={{ paddingHorizontal: 20 }}>
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
      </View>
    </Container>
  );
};

export const Container = styled.View`
  flex: 1;
  background: #fff;
`;

export const Header = styled.View`
  background: #fff;
  padding: 10px 15px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom-width: 0.5px;
  border-bottom-color: #dadada;
`;
export const HeadingLeft = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;
export const HeadingLeftTitle = styled.Text`
  font-size: 14px;
  font-weight: bold;
  padding-left: 10px;
`;
