import React from 'react';

import {
  MaterialCommunityIcons,
  Feather,
  AntDesign,
  FontAwesome,
} from '@expo/vector-icons';

import { Overlay, Menu, MenuHeader, MenuList, Text } from './styles';

import UserService from '../../../services/user.service';

const userService = new UserService();

const Sidebar: React.FC<any> = ({
  user,
  showHideSidebar,
  toggleSidebar,
  gotoEditScreen,
  gotoWalletScreen,
  gotoFeedbackScreen,
  gotoTNCScreen,
}: any) => {
  return (
    <>
      <Menu>
        <MenuHeader>
          <Text style={{ fontSize: 17, color: '#000', textAlign: 'left' }}>
            {user?.name}
          </Text>
        </MenuHeader>
        {/* <MenuList onPress={() => gotoEditScreen()}>
          <Feather name="edit-3" size={20} color="#000" />
          <Text style={{ fontSize: 14, color: '#000', textAlign: 'left' }}>
            Edit profile
          </Text>
        </MenuList> */}
        <MenuList onPress={() => gotoWalletScreen()}>
          <FontAwesome name="money" size={20} color="black" />
          <Text style={{ fontSize: 14, color: '#000', textAlign: 'left' }}>
            My Wallet
          </Text>
        </MenuList>

        <MenuList onPress={() => gotoFeedbackScreen()}>
          <MaterialCommunityIcons
            name="message-alert-outline"
            size={20}
            color="black"
          />
          <Text style={{ fontSize: 14, color: '#000', textAlign: 'left' }}>
            Feedback
          </Text>
        </MenuList>
        <MenuList onPress={() => gotoTNCScreen()}>
          <AntDesign name="filetext1" size={20} color="#000" />
          <Text style={{ fontSize: 14, color: '#000', textAlign: 'left' }}>
            T n c
          </Text>
        </MenuList>
        <MenuList onPress={() => userService.logoutUser()}>
          <AntDesign name="setting" size={20} color="#000" />
          <Text style={{ fontSize: 14, color: '#000', textAlign: 'left' }}>
            Logout
          </Text>
        </MenuList>
        {/* <MenuList>
          <AntDesign name="setting" size={20} color="#000" />
          <Text style={{ fontSize: 14, color: '#000', textAlign: 'left' }}>
            Settings
          </Text>
        </MenuList> */}
      </Menu>

      {showHideSidebar && <Overlay onPress={() => toggleSidebar()}></Overlay>}
    </>
  );
};

export default Sidebar;
