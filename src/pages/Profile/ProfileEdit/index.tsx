import React, { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  TextInput,
  Keyboard,
  View,
  StatusBar,
  BackHandler,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/core';

import PhoneInput from 'react-native-phone-number-input';
import DateTimePicker from '@react-native-community/datetimepicker';

import {
  Container,
  Header,
  HeadingLeft,
  HeadingLeftTitle,
  ButtonOuter,
  Content,
  ProfileText,
  ShareForm,
  ShareFormInput,
  ErrorText,
  BioTextCounter,
  HeadingRight,
} from './styles';

import AuthService from '../../../services/auth.service';
import UserService from '../../../services/user.service';
import {
  utilService,
  userDetails as userDetailsSubject,
} from '../../../services/util.service';
import * as NavigationService from '../../../services/navigation.service';
import ProfilePicUpload from '../../../components/ProfilePicUpload';

let typingTimer = null;
const requiredFields = [
  'name',
  'email',
  'mobile',
  'countryCode',
  'callingCode',
];

const ProfileEdit: React.FC = ({ navigation, route }: any) => {
  const authService = new AuthService();
  const userService = new UserService();
  let { user, userId, shouldEdit } = route.params || {};

  const phoneInput = useRef<PhoneInput>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formattedValue, setFormattedValue] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [isActive, setActive] = useState({
    name: false,
    loginName: false,
    email: false,
    mobile: false,
    dob: false,
    gender: false,
    bio: false,
  });
  const [userDetails, setUserDetails] = useState<any>({});
  const [formUpdated, setFormUpdated] = useState<boolean>(null);
  const [formErrors, setFormErrors] = useState<any>({
    mobile: '',
    email: '',
  });

  useEffect(() => {
    StatusBar.setHidden(false);
    StatusBar.setTranslucent(false);
    if (!isLoaded) {
      const callingCode = user?.callingCode || `+91`;
      const mobile = user?.mobile || user?.phoneNumber || '';

      setUserDetails({
        id: userId || '',
        name: user?.name || '',
        loginName: user?.loginName || '',
        email: user?.email || '',
        dob: user?.dob || '',
        gender: user?.gender || '',
        profile: user?.profile || '',
        platform: user?.platform || '',
        ...user,
        bio: user?.bio ? user?.bio : '',
        mobile: mobile ? mobile.replace(callingCode, '') : '',
        countryCode: user?.countryCode || 'IN',
        callingCode: user?.callingCode || '+91',
        expoPushToken: user?.expoPushToken || '',
      });
      setIsLoaded(true);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setHidden(false);
      StatusBar.setTranslucent(false);

      const onBackPress = () => {
        if (user?.mobile && user?.email) {
          goBack({ userId: userId });
          return false;
        }
        setIsSubmitted(true);
        utilService.showMessage(
          'Please fill all required fields to continue further.',
        );
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, []),
  );

  const updateUserDetails = (field: string, value: string) => {
    if (field && isLoaded) {
      if (userDetails[field] !== value) {
        setFormUpdated(true);
        setUserDetails({ ...userDetails, [field]: value });
      }

      setFormErrors({
        email:
          formErrors.email || formErrors.email !== 'in progress'
            ? formErrors.email
            : 'in progress',
        mobile:
          formErrors.mobile || formErrors.mobile !== 'in progress'
            ? formErrors.mobile
            : 'in progress',
      });
      typingTimer && clearTimeout(typingTimer);
      typingTimer = setTimeout(() => checkKeyup(field, value), 2000);
    }
  };

  const checkKeyup = async (field: string, value: string) => {
    if (user[field] === value) {
      setFormErrors({
        mobile: '',
        email: '',
      });
      return;
    }

    switch (field) {
      case 'email':
        const resultEmail: any = await authService.checkUserExist(value);
        if (
          resultEmail &&
          resultEmail !== 'OK' &&
          resultEmail.id !== userDetails.id
        ) {
          setFormErrors({
            mobile:
              formErrors.mobile === null || formErrors.mobile === 'in progress'
                ? null
                : formErrors.mobile,
            email:
              'The email id you are trying to use already exist with another account!',
          });
          utilService.showMessage(
            'The email id you are trying to use already exist with another account!',
          );
        } else if (resultEmail === 'OK' || resultEmail.id === userDetails.id) {
          setFormErrors({
            mobile:
              formErrors.mobile === null || formErrors.mobile === 'in progress'
                ? ''
                : formErrors.mobile,
            email: '',
          });
        }
        break;
      case 'mobile':
        const resultMobile: any = await authService.checkUserExist(
          (userDetails.callingCode || '+91') + value,
        );
        if (
          resultMobile &&
          resultMobile !== 'OK' &&
          resultMobile.id !== userDetails.id &&
          phoneInput.current.isValidNumber(phoneInput.current.state.number)
        ) {
          setFormErrors({
            mobile:
              'The mobile number you are trying to use already exist with another account!',
            email:
              formErrors.email === null || formErrors.email === 'in progress'
                ? null
                : formErrors.email,
          });
          utilService.showMessage(
            'The mobile number you are trying to use already exist with another account!',
          );
        } else if (
          (resultMobile === 'OK' || resultMobile.id === userDetails.id) &&
          phoneInput.current.isValidNumber(phoneInput.current.state.number)
        ) {
          setFormErrors({
            mobile: '',
            email:
              formErrors.email === null || formErrors.email === 'in progress'
                ? ''
                : formErrors.email,
          });
        }
        break;
    }
  };

  const goBack = (params: any) => {
    if (user?.mobile && user?.email) {
      navigation.goBack(params);
    } else {
      setIsSubmitted(true);
      utilService.showMessage(
        'Please fill all required fields to continue further.',
      );
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const setDOB = (event: any, selectedDate: any) => {
    dismissKeyboard();
    setActive({ ...isActive, dob: false });
    setTimeout(() => {
      if (selectedDate) {
        const date = new Date(selectedDate);
        const dob = `${date.getDate() < 10 ? '0' : ''}${date.getDate()}-${
          date.getMonth() < 9 ? '0' : ''
        }${date.getMonth() + 1}-${date.getFullYear()}`;

        setSelectedDate(selectedDate);
        setUserDetails({ ...userDetails, dob });
      }
    }, 100);
  };

  const updateProfile = (userProfile: any) => {
    setUserDetails({
      ...userDetails,
      profile: userProfile || user?.profile,
    });
  };

  const isFormValid = () => {
    let isValid = phoneInput.current?.isValidNumber(userDetails.mobile);
    Object.entries(userDetails)
      .filter(([key, value]) => {
        return requiredFields.includes(key);
      })
      .map(([key, value]: any) => {
        if (isValid) {
          if (key === 'bio' && value.length < 10) {
            isValid = false;
          } else if (!value) {
            isValid = false;
          }
        }
      });
    return isValid;
  };

  const isEmailMobileValid = () => {
    return (
      (formErrors.mobile === '' && formErrors.email === '') ||
      (formErrors.mobile === null && formErrors.email === null)
    );
  };

  const saveUserDetails = async () => {
    Keyboard.dismiss();
    setIsSubmitted(true);
    if (formUpdated && isFormValid() && !isSubmitting && isEmailMobileValid()) {
      const name = utilService.capitalize(userDetails.name);
      const [firstName, ...lastName] = name.split(' ');
      const data = {
        ...userDetails,
        name,
        firstName: firstName || '',
        lastName: (lastName || '').join(''),
        mobile: formattedValue || user?.mobile,
        countryCode: phoneInput.current?.getCountryCode(),
        callingCode: `+${phoneInput.current?.getCallingCode()}`,
      };
      const mobile = (user?.mobile || user?.phoneNumber || '').replace(
        '+91',
        '',
      );
      const userMobile = (
        userDetails?.mobile ||
        userDetails?.phoneNumber ||
        ''
      ).replace('+91', '');

      setIsSubmitting(true);
      !data.id && delete data.id;
      if (mobile && user?.email && mobile === userMobile) {
        updateUserProfile(data);
      } else {
        if (user?.email || mobile !== userMobile) {
          const phoneNumber = formattedValue || mobile;
          const formData = {
            ...data,
            countryCode: data.countryCode,
            callingCode: data.callingCode,
            mobile: formattedValue || mobile,
            phoneNumber,
            twilioStatus: 'pending',
          };
          doLogin(formData);
        } else if (mobile) {
          doLogin({ ...data, twilioStatus: 'pending' });
        }
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
              NavigationService.reset('Main', 0, { gotoHome: true });
            } catch (err) {}
          }, 100);
        });
      });
    } else {
      setIsSubmitting(false);
      if (result.status === 'pending') userDetails.twilioStatus = result.status;
      utilService.showMessage('Something went wrong!');
    }
  };

  const updateUserProfile = async (data: any, shouldGoBack: boolean = true) => {
    const result: any = await userService.updateUserDetails(data);
    if (shouldGoBack) {
      setIsSubmitted(false);
      setIsSubmitting(false);
    }

    if (result.status) {
      await SecureStore.setItemAsync('userId', result.data.id);
      await SecureStore.setItemAsync('user', JSON.stringify(result.data));

      userDetailsSubject.next(result.data);
      utilService.showMessage('Profile updated successfully!');
      if (shouldGoBack) {
        goBack({ userId: '' });
      } else {
        navigation.navigate('Main', { initialRoute: 'Profile' });
      }
    } else {
      utilService.showMessage(
        'There is some issue in updaing profile, please try again!',
      );
    }
  };

  return isLoaded ? (
    <Container>
      <Header>
        <HeadingLeft onPress={() => goBack({ userId: userId })}>
          <Ionicons name="ios-arrow-back" size={22} color="black" />
          <HeadingLeftTitle>Back</HeadingLeftTitle>
        </HeadingLeft>

        <HeadingRight>
          <ButtonOuter
            disabled={
              !formUpdated ||
              isSubmitting ||
              !isFormValid() ||
              !isEmailMobileValid()
            }
            onPress={() => saveUserDetails()}
          >
            <ProfileText>Save</ProfileText>
          </ButtonOuter>
        </HeadingRight>
      </Header>

      <ScrollView>
        <ProfilePicUpload
          user={userDetails}
          navigation={navigation}
          isMounted={true}
          updateProfile={(userProfile: any) => updateProfile(userProfile)}
        ></ProfilePicUpload>

        <Content>
          <ShareForm>
            <ShareFormInput>
              <TextInput
                style={{
                  height: 40,
                  borderBottomWidth: isActive.name ? 2 : 1,
                  borderBottomColor:
                    !userDetails.name && isSubmitted
                      ? 'red'
                      : isActive.name
                      ? '#F25813'
                      : '#9F9F9F',
                }}
                maxLength={20}
                placeholder="Full name"
                textContentType="name"
                value={userDetails.name}
                onFocus={() => setActive({ ...isActive, name: true })}
                onBlur={() => setActive({ ...isActive, name: false })}
                onChangeText={(name: string) => updateUserDetails('name', name)}
              />
            </ShareFormInput>
            <ShareFormInput>
              <TextInput
                style={{
                  height: 40,
                  borderBottomWidth: isActive.email ? 2 : 1,
                  borderBottomColor:
                    !userDetails.email && isSubmitted
                      ? 'red'
                      : isActive.email
                      ? '#F25813'
                      : '#9F9F9F',
                }}
                placeholder="Email ID"
                keyboardType="email-address"
                textContentType="emailAddress"
                value={userDetails.email}
                onFocus={() => setActive({ ...isActive, email: true })}
                onBlur={() => setActive({ ...isActive, email: false })}
                onChangeText={(email: string) =>
                  updateUserDetails('email', email)
                }
              />
              {formErrors.email && formErrors.email !== 'in progress' ? (
                <ErrorText>{formErrors.email}</ErrorText>
              ) : null}
            </ShareFormInput>
            <ShareFormInput>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor:
                    !userDetails.mobile && isSubmitted ? 'red' : '#9F9F9F',
                }}
              >
                <PhoneInput
                  ref={phoneInput}
                  disabled={!!shouldEdit}
                  textContainerStyle={{ backgroundColor: '#fff' }}
                  defaultValue={userDetails.mobile}
                  defaultCode={userDetails?.countryCode}
                  onChangeText={mobile => updateUserDetails('mobile', mobile)}
                  onChangeFormattedText={value => setFormattedValue(value)}
                />
              </View>
              {formErrors.mobile && formErrors.mobile !== 'in progress' ? (
                <ErrorText>{formErrors.mobile}</ErrorText>
              ) : null}
            </ShareFormInput>
            <ShareFormInput>
              <TextInput
                style={{
                  height: 40,
                  borderBottomWidth: isActive.dob ? 2 : 1,
                  borderBottomColor: isActive.dob ? '#F25813' : '#9F9F9F',
                }}
                placeholder="DOB"
                value={userDetails.dob}
                onFocus={() => setActive({ ...isActive, dob: true })}
                onBlur={() => setActive({ ...isActive, dob: false })}
                onChangeText={(dob: string) => updateUserDetails('dob', dob)}
              />
              {isActive.dob && (
                <DateTimePicker
                  testID="dob"
                  mode="date"
                  display="spinner"
                  maximumDate={new Date()}
                  value={selectedDate}
                  onChange={setDOB}
                />
              )}
            </ShareFormInput>
            {/* <ShareFormInput>
              <TouchableOpacity onPress={dismissKeyboard}>
                <View
                  style={{
                    height: 40,
                    borderBottomWidth: 1,
                    borderBottomColor: '#9F9F9F',
                  }}
                >
                  <Picker
                    mode="dropdown"
                    style={{
                      marginLeft: -8,
                      marginRight: -15,
                    }}
                    selectedValue={userDetails.gender}
                    onValueChange={(gender: any) =>
                      updateUserDetails('gender', gender)
                    }
                  >
                    <Picker.Item label="Select Gender" value="" />
                    <Picker.Item label="Male" value="Male" />
                    <Picker.Item label="Female" value="Female" />
                    <Picker.Item label="Others" value="Others" />
                  </Picker>
                </View>
              </TouchableOpacity>
            </ShareFormInput> */}
            <ShareFormInput>
              <TextInput
                style={{
                  height: 60,
                  borderBottomWidth: isActive.bio ? 2 : 1,
                  borderBottomColor: isActive.bio ? '#F25813' : '#9F9F9F',
                }}
                multiline
                numberOfLines={3}
                maxLength={90}
                placeholder={`Bio ${
                  !userDetails.bio && userDetails.bio.length < 10
                    ? '(min 10 characters)'
                    : ''
                }`}
                value={userDetails.bio}
                onFocus={() => setActive({ ...isActive, bio: true })}
                onBlur={() => setActive({ ...isActive, bio: false })}
                onChangeText={(bio: string) => updateUserDetails('bio', bio)}
              />
              <BioTextCounter>
                {userDetails.bio ? userDetails.bio.length : 0}/90
              </BioTextCounter>
            </ShareFormInput>
          </ShareForm>
        </Content>
      </ScrollView>
    </Container>
  ) : (
    <></>
  );
};

export default ProfileEdit;
