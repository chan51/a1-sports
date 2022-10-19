import React, { useEffect, useState } from 'react';

import * as SecureStore from 'expo-secure-store';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import userIcon from '../../assets/user.png';
import progressiveImage from '../../assets/progressive.png';
import { Banner, CoverImage, ActionButton, BottomVector } from './styles';

import { User } from '../../models/user.interface';

import UserService from '../../services/user.service';
import { utilService } from '../../services/util.service';

interface ProfilePicUploadProps {
  user: User;
  navigation: any;
  updateProfile: any;
  isMounted?: boolean;
}

const userService = new UserService();

const ProfilePicUpload: React.FC<ProfilePicUploadProps> = ({
  user,
  isMounted,
  navigation,
  updateProfile,
}: ProfilePicUploadProps) => {
  const [userId, setUserId] = useState('');
  const [uploadStart, isUploadStart] = useState(false);

  useEffect(() => {
    function setUserIdValue() {
      SecureStore.getItemAsync('userId').then((userIdValue: string) => {
        isMounted && setUserId(userIdValue);
      });
    }
    setUserIdValue();
  }, [user]);

  const onPicUpload = () => {
    if (!user.id || userId === user?.id) {
      navigation.navigate('Photo', {
        profilePicUpload: true,
        gotoProfilePicUpload,
      });
    }
  };

  const gotoProfilePicUpload = (params: any) => {
    /* isUploadStart(false);
    if (!uploadStart && params.file) {
      isUploadStart(true);
      recordService
        .uploadProfile(params.file, checkProgress())
        .then((profile: string) => {
          if (user?.id) {
            const data = {
              profile,
              id: user?.id,
            };
            userService
              .updateUserProfile(data)
              .then(({ data, status }) => {
                status && uploadSuccessCallback(data);
              })
              .catch(err => {
                isUploadStart(false);
              });
          } else {
            isUploadStart(false);
            updateProfile(profile);
          }
        })
        .catch(err => {
          isUploadStart(false);
        });
    } */
  };

  const checkProgress = (progress?: number) => {
    // console.log(progress);
  };

  const uploadSuccessCallback = (result: any) => {
    isUploadStart(false);
    utilService.showMessage('Profile picture uploaded successfully!');
    SecureStore.setItemAsync('user', JSON.stringify(result)).then(() => {
      updateProfile(result.profile);
    });
  };

  return (
    <Banner onPress={onPicUpload} style={{ backgroundColor: '#000' }}>
      {user?.profile ? (
        <CoverImage
          source={{ uri: user?.profile }}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
            width: '100%',
            resizeMode: 'contain',
          }}
        />
      ) : (
        <>
          <CoverImage source={userIcon} />
          <ActionButton>
            <MaterialCommunityIcons
              style={{ elevation: 5 }}
              name="camera-outline"
              size={30}
              color="#4793f8"
            />
          </ActionButton>
        </>
      )}
      {/* <BottomVector></BottomVector> */}
    </Banner>
  );
};

export default ProfilePicUpload;
