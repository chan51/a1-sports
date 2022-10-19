import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background: #fff;
`;

export const Header = styled.View`
  height: 50px;
  align-items: center;
  justify-content: center;
  border-bottom-width: 0.5px;
  border-bottom-color: #dadada;
`;

export const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;
export const Content = styled.View``;
export const Heading = styled.Text`
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
  color: #27343c;
`;
export const List = styled.View``;
export const ListItem = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
})`
  padding: 10px 15px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
export const UserDetails = styled.View`
  flex-direction: row;
  align-items: center;
  width: 85%;
`;
export const UserImage = styled.Image`
  width: 44px;
  height: 44px;
  margin-right: -15px;
  border-radius: 50px;
`;
export const UserText = styled.View`
  padding-left: 25px;
  max-width: 80%;
`;
export const UserHeading = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #000000;
`;
export const UserSubheading = styled.Text`
  width: 100%;
  font-size: 14px;
  color: #9f9f9f;
`;
export const UploadedItem = styled.Image`
  width: 50px;
  height: 40px;
  border-radius: 3px;
`;
export const TextDataLinkText = styled.Text`
  font-weight: bold;
  color: #000000;
`;

export const HeadingLeft = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
`;
export const HeadingLeftTitle = styled.Text`
  flex: 1;
  font-size: 16px;
  font-weight: bold;
  padding-left: 10px;
`;
