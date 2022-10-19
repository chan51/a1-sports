import { getStatusBarHeight } from 'react-native-status-bar-height';

import styled from 'styled-components/native';

export const Container = styled.View.attrs({
  // paddingTop: getStatusBarHeight(),
})`
  flex: 1;
  background: #fff;
`;
// export const HeadingLeft = styled.View`
//   padding: 10px 15px;
//   flex-direction: row;
//   align-items: center;
//   justify-content: space-between;
//   border-bottom-width: 0.5px;
//   border-bottom-color: #dadada;
// `;
export const ContentMain = styled.View``;
export const Overlay = styled.TouchableOpacity.attrs({
  activeOpacity: 1,
})`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background: #00000030;
  z-index: 222;
`;
export const Menu = styled.View`
  position: absolute;
  left: 100%;
  top: 0;
  bottom: 0;
  width: 200px;
`;
export const MenuHeader = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: #ddd;
  height: 44px;
  justify-content: center;
  align-items: flex-start;
  padding: 0 15px;
`;
export const MenuList = styled.TouchableOpacity.attrs({
  activityOpacity: 1,
})`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 7px 15px;
`;

export const Header = styled.View`
  padding: 10px 15px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom-width: 0.5px;
  border-bottom-color: #dadada;
`;
export const Banner = styled.View`
  align-items: center;
  justify-content: center;
  position: relative;
`;

export const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;

export const Content = styled.View`
  padding: 10px 30px;
`;

export const CoverImage = styled.Image`
  align-self: center;
  width: 100%;
  height: 230px;
  resize-mode: stretch;
`;

export const Username = styled.Text`
  font-size: 15px;
  font-weight: bold;
`;
export const UserImage = styled.Image`
  width: 44px;
  height: 44px;
  border-radius: 25px;
  margin-right: -15px;
  shadow-color: #000;
  shadow-opacity: 0.5;
  shadow-radius: 5px;
`;
export const UserText = styled.View`
  padding-left: 25px;
`;
export const UserHeading = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #000000;
`;

export const Separator = styled.Text`
  color: #000;
  font-size: 30px;
  opacity: 0.1;
  padding: 0 10px;
`;

export const ProfileColumn = styled.View`
  align-items: flex-start;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
export const ProfileContent = styled.View`
  align-items: center;
  flex-direction: row;
`;

export const ProfileText = styled.Text`
  font-weight: bold;
  font-size:12px
  color:#fff;
`;

export const ButtonOuter = styled.TouchableOpacity.attrs({
  activityOpacity: 1,
})`
  align-items: center;
  flex-direction: row;
  padding: 6px 30px;
  background-color: ${(props: any) =>
    props.disabled ? 'rgba(0, 0, 0, 0.1)' : '#F25813'};
  border-radius: 14px;
  font-size: 12px;
  align-items: center;
`;

export const ActionButton = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.1);
`;
export const BottomVector = styled.View`
  position: absolute;
  height: 40px;
  background: #fff;
  border-radius: 20px;
  left: 0;
  right: 0;
  bottom: -30px;
`;
export const ShareForm = styled.View``;
export const ShareFormInput = styled.View`
  margin-top: 15px;
  margin-bottom: 15px;
  justify-content: space-between;
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
export const HeadingRight = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-end;
  margin-left: -80px;
`;
export const HeadingRightTitle = styled.Text`
  font-size: 14px;
  font-weight: bold;
  padding-left: 10px;
`;
export const ErrorText = styled.Text`
  color: red;
  font-size: 14px;
`;
export const BioTextCounter = styled.Text`
  /* color: ${(props: any) =>
    (props.isError || '').length < 10 ? '#ff0000' : 'rgba(0, 0, 0, 0.6)'}; */
  color: rgba(0, 0, 0, 0.6);
  font-size: 12px;
  position: absolute;
  right: 10px;
  top: -10px;
`;
