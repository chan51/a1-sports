import React, { useEffect, useRef, useState } from 'react';
import { Image, View, TouchableOpacity, StatusBar } from 'react-native';

import * as Application from 'expo-application';
import * as SecureStore from 'expo-secure-store';
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
  MiddText,
  SocialMediaList,
  SocialMediaListItem,
  GuestTextDataView,
  GuestTextDataLink,
  GuestTextData,
} from './styles';

import facebook from '../../assets/icons/facebook.png';
import google from '../../assets/icons/google.png';
import AuthService from '../../services/auth.service';
import * as NavigationService from '../../services/navigation.service';
import { userDetails, utilService } from '../../services/util.service';

const authService = new AuthService();

const Login: React.FC = ({ navigation }: any) => {
  const phoneInput = useRef<PhoneInput>(null);
  const [value, setValue] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [formattedValue, setFormattedValue] = useState('');

  const [isMounted, setIsMounted] = React.useState(true);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [isGuestUser, setIsGuestUser] = useState<any>(false);
  const [applicationVersion, setApplicationVersion] = useState('');

  NavigationService.setNavigator(navigation);

  useEffect(() => {
    try {
      async function isGuestUser() {
        const guestLogin: any = await SecureStore.getItemAsync('guest');
        isMounted && setIsGuestUser(guestLogin === 'true' ? guestLogin : '');
      }
      isGuestUser();
      setApplicationVersion(Application.nativeApplicationVersion);
    } catch { }
  }, []);

  useEffect(() => {
    try {
      if (isGuestUser === '') {
        utilService
          .registerForPushNotificationsAsync()
          .then(token => setExpoPushToken(token));

        setOtpSent(false);
        getNotificationPermission();
      }

      StatusBar.setHidden(false);
      StatusBar.setTranslucent(false);
    } catch (error) {
      return error;
    }
    return () => setIsMounted(false);
  }, [isGuestUser]);

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

  const pressed = async () => {
    authService.guestLogin(() => {
      navigation.push('Main');
    });
  };

  return (
    <Container>
      {isGuestUser === 'true' || isGuestUser === false ? (
        <></>
      ) : (
        <>
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
              <View style={{ borderWidth: 1, borderColor: '#ddd', backgroundColor: '#f8f9f9', borderRadius: 50, overflow: 'hidden', }}>
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
                shouldDisable={otpSent || value.length < 10}
              >
                <LoginActionText>Continue</LoginActionText>
              </LoginAction>

              {/* <TextDataLink>
                <TextData>Already have an account</TextData>
                <TextDataLinkText> Log In</TextDataLinkText>
              </TextDataLink> */}

              {/* <GuestTextDataView>
                <GuestTextDataLink>
                  <GuestTextData onPress={() => pressed()}>
                    Guest User
                  </GuestTextData>
                </GuestTextDataLink>
              </GuestTextDataView> */}

              {/* <TextDataLink>
                <TouchableOpacity
                  onPress={() => {
                    Clipboard.setString(expoPushToken);
                    utilService.showMessage('Text copied: ' + expoPushToken);
                  }}
                >
                  <TextDataLinkText> {expoPushToken}</TextDataLinkText>
                </TouchableOpacity>
              </TextDataLink> */}
            </FormContnet>
          </Content>
        </>
      )}
    </Container>
  );
};

export default Login;
