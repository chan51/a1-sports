import React, { useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Keyboard, ScrollView, Text, TouchableOpacity } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import OTPTextInput from 'react-native-otp-textinput';

import {
  Container,
  BackBtn,
  BackBtnText,
  Header,
  HeadingText,
  Content,
  FormContnet,
  LoginAction,
  LoginActionText,
  TextDataLink,
  TextData,
  TextDataLinkText,
  styles,
} from './styles';
import AuthService from '../../../services/auth.service';
import * as NavigationService from '../../../services/navigation.service';
import { utilService, userDetails } from '../../../services/util.service';
import TimerText from '../../../components/TimerText/TimerText';

const authService = new AuthService();

const OTP: React.FC = ({ navigation, route }: any) => {
  let {
    expoPushToken,
    applicationVersion,
    countryCode,
    callingCode,
    phoneNumber,
    sid,
    userData,
  } = route.params;
  const [resendButtonDisabledTime, setResendButtonDisabledTime] = useState(60);

  const otpInput = useRef<OTPTextInput>(null);
  const [otpCode, setOtpCode] = useState('');
  const [otpCheck, setOtpCheck] = useState(false);

  function resetData() {
    setOtpCode('');
    setOtpCheck(false);
  }

  useFocusEffect(
    React.useCallback(() => {
      resetData();
    }, []),
  );

  const goBack = () => {
    navigation.goBack();
  };

  const resendOTP = async () => {
    resetData();
    setResendButtonDisabledTime(30);
    await authService.getOTP(phoneNumber);
  };

  const handleTextChange = code => {
    if (code) {
      setOtpCode(code);
      if (code.length === 4) {
        Keyboard.dismiss();
        checkOTP(code);
      }
    }
  };

  const checkOTP = async (code = otpCode) => {
    if (code.length === 4) {
      setOtpCheck(true);
      const data = {
        sid,
        expoPushToken,
        otp: code,
        callingCode: callingCode.trim(),
        countryCode: countryCode.trim(),
        phoneNumber: phoneNumber.trim(),
        ...(userData || {}),
      };
      applicationVersion && (data.applicationVersion = applicationVersion);
      !data.id && delete data.id;

      if (data.platform === 'mobile') {
        const result: any = await authService.checkUserExist(phoneNumber);
        if (result && result.id && result.email) {
          doLogin(data);
        } else {
          navigation.navigate('Main', {
            initialRoute: 'Profile',
            initialParams: {
              user: data,
              shouldEdit: true,
              currentTime: new Date().getUTCSeconds(),
            },
          });
        }
      } else {
        doLogin(data);
      }
    }
  };

  const doLogin = async data => {
    const result: any = await authService.checkOTP(data);
    if (result && result.id) {
      SecureStore.setItemAsync('userId', result.id).then(() => {
        SecureStore.setItemAsync('user', JSON.stringify(result)).then(() => {
          setTimeout(() => {
            try {
              resetData();
              if (result?.name) {
                userDetails.next(result);
                NavigationService.reset('Main', 0, { gotoHome: true });
              } else {
                navigation.navigate('Main', {
                  initialRoute: 'Profile',
                  initialParams: {
                    user: result,
                    shouldEdit: true,
                    currentTime: new Date().getUTCSeconds(),
                  },
                });
              }
            } catch {
              setOtpCheck(false);
            }
          }, 100);
        });
      });
    } else {
      setOtpCheck(false);
      utilService.showMessage(
        result.status ||
          'OTP is not valid, try to resend or try after some time!',
      );
    }
  };

  return (
    <Container>
      <TouchableOpacity onPress={goBack}>
        <BackBtn>
          <Ionicons name="ios-arrow-back" size={24} color="black" />
          <BackBtnText>Back</BackBtnText>
        </BackBtn>
      </TouchableOpacity>

      <ScrollView>
        <Header>
          <HeadingText>Please enter the OTP that</HeadingText>
          <HeadingText>
            We’ve sent to your registered mobile number
            <Text style={{ fontWeight: 'bold' }}> {phoneNumber}!</Text>
          </HeadingText>
        </Header>
        <Content>
          <FormContnet>
            <OTPTextInput
              ref={otpInput}
              tintColor="#F25813"
              offTintColor="#F25813"
              defaultValue={otpCode}
              keyboardType={'phone-pad'}
              handleTextChange={handleTextChange}
            />

            {/* <OTPInputView
              codeInputFieldStyle={styles.underlineStyleBase}
              codeInputHighlightStyle={styles.underlineStyleHighLighted}
            /> */}

            <TextDataLink>
              <TextData>Didn’t receive the OTP?</TextData>
              {resendButtonDisabledTime ? (
                <TimerText
                  time={resendButtonDisabledTime}
                  startText={'Resend OTP in '}
                  endText={'s'}
                  setTime={setResendButtonDisabledTime}
                />
              ) : (
                <TextDataLinkText onPress={resendOTP}>
                  Resend OTP
                </TextDataLinkText>
              )}
            </TextDataLink>
            <LoginAction
              onPress={() => checkOTP()}
              shouldDisable={otpCheck || otpCode.length !== 4}
            >
              <LoginActionText>Verify and Proceed</LoginActionText>
            </LoginAction>
          </FormContnet>
        </Content>
      </ScrollView>
    </Container>
  );
};

export default OTP;
