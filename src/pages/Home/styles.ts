import { Dimensions } from 'react-native';
import styled from 'styled-components/native';

const { width: winWidth } = Dimensions.get('window');

interface Props {
  active: boolean;
}

export const Container = styled.View`
  flex: 1;
  background: #fff;
`;

export const Separator = styled.Text`
  color: #fff;
  font-size: 15px;
  opacity: 0.2;
`;

export const Header = styled.View`
  height: 10%;
  flex-direction: row;
  position: absolute;
  align-self: center;
  z-index: 10;
  align-items: center;
  margin-top: 5%;
`;
export const Text = styled.Text`
  color: #27343c;
  font-size: ${(props: Props) => (props.active ? '20px' : '18px')};
  padding: 5px;
  font-weight: bold;
  opacity: ${(props: Props) => (props.active ? '1' : '0.5')};
`;

export const Tab = styled.TouchableOpacity.attrs({
  activeOpacity: 1,
})``;

export const Feed = styled.View`
  flex: 1;
  z-index: -1;
  position: absolute;
`;

export const RefreshFeedTextDataLink = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
})`
  z-index: 99999999;
  background: #fff;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 13px;
  height: 28px;
  width: 100px;
  position: absolute;
  top: 20px;
  left: ${Math.ceil(winWidth / 2.7)}px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: center;
`;
export const RefreshFeedTextData = styled.Text`
  font-size: 12px;
  padding: 5px;
  color: #fff;
  font-weight: bold;
`;
export const UserImage = styled.Image`
  width: 55px;
  height: 55px;
  border-radius: 55px;
  shadow-color: #000;
  shadow-opacity: 0.5;
  shadow-radius: 5px;
  border-color: #3a8afc;
  border-width: 3px;
`;

export const ListItem = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
})`
  padding: 10px 15px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
