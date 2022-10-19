import { StyleSheet } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import styled from 'styled-components/native';

export const Container = styled.View.attrs({
  paddingTop: getStatusBarHeight(),
})`
  flex: 1;
  background: #fff;
  padding: 0 30px;
`;

export const BackBtn = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 8px 0;
`;
export const BackBtnText = styled.Text`
  font-size: 15px;
  padding-left: 8px;
  color: #000;
  font-weight: 600;
`;

export const Header = styled.View`
  margin-top: 70px;
  margin-right: 15px;
`;

export const HeadingText = styled.Text`
  font-size: 14px;
  color: #222f2c;
`;
export const SubHeading = styled.View`
  padding-top: 4px;
  width: 100%;
  flex-direction: row;
`;
export const SubHeadingText = styled.Text`
  color: #F25813;
  font-size: 13px;
  font-weight: bold;
  margin-right: 3px;
`;
export const Content = styled.View`
  flex: 1;
  margin: 40px 0;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;
export const FormContnet = styled.View`
  flex: 1;
  width: 100%;
`;

export const Input = styled.TextInput`
  border-bottom-color: #000;
  border-bottom-width: 2px;
  font-size: 16px;
  width:100%;
  margin:0
  padding:7px;
`;

export const LoginAction = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
})`
  padding: 10px 0;
  background: ${(props: any) => (props.shouldDisable ? '#ececec' : '#F25813')};
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 23px;
  align-items: center;
  justify-content: center;
  height: 45px;
  margin-top: 45px;
`;
export const LoginActionText = styled.Text`
  font-size: 14px;
  padding: 5px;
  color: #fff;
  font-weight: bold;
`;
export const MiddText = styled.Text`
  margin-top: 38px;
  font-size: 14px;
  color: #222f2c;
  text-align: center;
`;

export const SocialMediaList = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-top: 20px;
`;
export const SocialMediaListItem = styled.View`
  width: 46px;
  margin: 10px;
  height: 46px;
  border: 1px solid #dbe8ff;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
`;

export const TextDataLink = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-top: 16px;
`;
export const TextData = styled.Text`
  font-size: 12px;
  color: #222f2c;
`;
export const TextDataLinkText = styled.Text`
  font-size: 14px;
  color: #F25813;
  font-weight: bold;
  margin-left: 3px;
`;

export const styles = StyleSheet.create({
  borderStyleBase: {
    width: 30,
    height: 45,
  },

  borderStyleHighLighted: {
    borderColor: '#F25813',
    color: '#F25813',
  },

  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: '#000',
    color: '#000',
  },

  underlineStyleHighLighted: {
    borderColor: '#F25813',
    color: '#F25813',
  },
});
