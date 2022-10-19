import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TextInput,
  SafeAreaView,
} from 'react-native';

import {
  Header,
  ContentMain,
  HeadingLeftTitle,
  Content,
  Title,
  PrimaryButton,
  PrimaryButtonText,
  SecondaryButton,
  SecondaryButtonText,
  HeadingLeft,
  ButtonOuter,
} from './styles';

import { Ionicons } from '@expo/vector-icons';

import UserService from '../../services/user.service';
import { utilService } from '../../services/util.service';

const userService = new UserService();

const Feedback: React.FC = ({ navigation, route }: any) => {
  const [feedbackValue, setFeedbackValue] = useState('');
  const [isActive, setActive] = useState({
    feedback: false,
  });

  const submitFeedback = async () => {
    userService.submitUserFeedback(feedbackValue);
    utilService.showMessage('Your feedback sent successfully!');
    navigation.goBack();
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
            <View>
              <Title>Feedback</Title>
            </View>
            <HeadingLeft></HeadingLeft>
          </Header>

          <ScrollView nestedScrollEnabled={true}>
            <Content>
              <Title>Your suggestion is important for us!</Title>
              <TextInput
                style={{
                  height: 'auto',
                  borderWidth: isActive.feedback ? 2 : 1,
                  borderColor: isActive.feedback ? '#F25813' : '#9F9F9F',
                  textAlignVertical: 'top',
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  marginTop: 20,
                }}
                multiline
                numberOfLines={5}
                maxLength={250}
                value={feedbackValue}
                placeholder="Your suggestion is important for us…."
                onChangeText={$event => setFeedbackValue($event)}
                onFocus={() => setActive({ ...isActive, feedback: true })}
                onBlur={() => setActive({ ...isActive, feedback: false })}
              />
              <View style={styles.row}>
                <PrimaryButton
                  disabled={feedbackValue.length < 10}
                  onPress={() => feedbackValue.length > 10 && submitFeedback()}
                >
                  <PrimaryButtonText disabled={feedbackValue.length < 10}>
                    Submit
                  </PrimaryButtonText>
                </PrimaryButton>
                <SecondaryButton onPress={() => setFeedbackValue('')}>
                  <SecondaryButtonText>Reset</SecondaryButtonText>
                </SecondaryButton>
              </View>
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
export default Feedback;
