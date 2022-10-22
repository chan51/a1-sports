import React, { useEffect, useRef, useState } from 'react';
import { View, StatusBar } from 'react-native';

import * as Application from 'expo-application';
import * as Notifications from 'expo-notifications';

import PhoneInput from 'react-native-phone-number-input';

import {
  Container,
  Header,
  HeadingText,
  SubHeading,
  SubHeadingText,
  Content,
  FormContnet,
  LoginAction,
  LoginActionText,
} from './styles';

import AuthService from '../../services/auth.service';
import { utilService } from '../../services/util.service';
import * as NavigationService from '../../services/navigation.service';

const authService = new AuthService();

const Login: React.FC = ({ navigation }: any) => {
  const phoneInput = useRef<PhoneInput>(null);
  const [value, setValue] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [formattedValue, setFormattedValue] = useState('');

  const [isMounted, setIsMounted] = React.useState(true);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [applicationVersion, setApplicationVersion] = useState('');

  NavigationService.setNavigator(navigation);

  useEffect(() => {
    try {
      if (isMounted) {
        utilService
          .registerForPushNotificationsAsync()
          .then(token => setExpoPushToken(token));

        setOtpSent(false);
        getNotificationPermission();
      }

      StatusBar.setHidden(false);
      StatusBar.setTranslucent(false);
      setApplicationVersion(Application.nativeApplicationVersion);
    } catch (error) {
      return error;
    }
    return () => setIsMounted(false);
  }, []);

  const getNotificationPermission = async () => {
    const { status }: any = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      getNotificationPermission();
    }
  };

  const gotoOTP = async () => {
    const checkValid = phoneInput.current?.isValidNumber(value);
    if (checkValid && !otpSent) {
      setOtpSent(true);
    }
  };

  useEffect(() => {
    async function gotoOTPPage() {
      const result: any = await authService.getOTP(formattedValue);
      if (result && result.sid) {
        setOtpSent(false);
        const userData = {
          expoPushToken,
          applicationVersion,
          loginType: 'phone',
          platform: 'mobile',
          sid: result.sid,
          phoneNumber: formattedValue,
          callingCode: `+${phoneInput.current?.getCallingCode()}`,
          countryCode: phoneInput.current?.getCountryCode(),
        };
        navigation.navigate('ProfileOTP', {
          ...userData,
          userData,
        });
      } else {
        setOtpSent(false);
        utilService.showMessage(
          'There is some problem in login, please try again after some time!',
        );
      }
    }

    if (otpSent) {
      gotoOTPPage();
    }
  }, [otpSent]);

  return (
    <Container>
      <Header>
        <HeadingText>Account</HeadingText>
        <SubHeading>
          <SubHeadingText>Login</SubHeadingText>
          <SubHeadingText>/</SubHeadingText>
          <SubHeadingText>Create account</SubHeadingText>
        </SubHeading>
      </Header>
      <Content>
        <FormContnet>
          <View
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              backgroundColor: '#f8f9f9',
              borderRadius: 50,
              overflow: 'hidden',
            }}
          >
            <PhoneInput
              ref={phoneInput}
              defaultValue={value}
              defaultCode="IN"
              onChangeText={text => {
                setValue(text);
              }}
              onChangeFormattedText={text => {
                setFormattedValue(text);
              }}
              autoFocus
            />
          </View>

          <LoginAction
            onPress={() => gotoOTP()}
            shouldDisable={otpSent || (value || '').length < 10}
          >
            <LoginActionText>Continue</LoginActionText>
          </LoginAction>
        </FormContnet>
      </Content>
    </Container>
  );
};

export default Login;
