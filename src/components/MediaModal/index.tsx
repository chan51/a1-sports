import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';

import * as SecureStore from 'expo-secure-store';

import CameraImagePreview from '../CameraImagePreview';
import CameraVideoPreview from '../CameraVideoPreview';

import UserService from '../../services/user.service';

const userService = new UserService();

interface MediaModalProps {
  modalVisible: any;
  showActions?: any;
  navigation?: any;
  goBack?: any;
}

const MediaModal: React.FC<MediaModalProps> = ({
  showActions,
  modalVisible,
  navigation,
  goBack,
}: MediaModalProps) => {
  const [followerList, setFollowerList] = useState(null);

  useEffect(() => {
    if (showActions) {
      getFollowList();
    }
  }, [showActions]);

  const getFollowList = async () => {
    const userId = await SecureStore.getItemAsync('userId');
    if (!userId || userId.includes('guest')) return;
    const userFollowList: any = await userService.getFollowUsers(userId);
    if (userFollowList.status) {
      setFollowerList(
        userFollowList.userFollowing
          ? userFollowList.userFollowing.map((user: any) => user.id)
          : [],
      );
    } else {
      setFollowerList([]);
    }
  };

  return (
    <View
      style={{
        backgroundColor: 'transparent',
        width: '100%',
        height: '100%',
      }}
    >
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible.visible}
        onRequestClose={goBack}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {modalVisible.fileType === 'image' && (
              <CameraImagePreview
                item={modalVisible.item}
                file={{ uri: modalVisible.filePath }}
                showActions={showActions}
                navigation={navigation}
                goBack={goBack}
                followerList={followerList}
                getFollowList={getFollowList}
              />
            )}
            {modalVisible.fileType === 'video' && (
              <CameraVideoPreview
                item={modalVisible.item}
                file={{ uri: modalVisible.filePath }}
                thumb={{ uri: modalVisible.thumb }}
                showActions={showActions}
                navigation={navigation}
                goBack={goBack}
                followerList={followerList}
                getFollowList={getFollowList}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
  },
  modalView: {
    backgroundColor: 'white',
  },
});

export default MediaModal;
