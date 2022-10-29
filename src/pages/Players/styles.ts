import styled from 'styled-components/native';

export const Container = styled.View.attrs({
  // paddingTop: getStatusBarHeight(),
})`
  flex: 1;
`;

export const Header = styled.View`
  margin: 10px 10px 0px;
  margin-right: 5px;
  flex-direction: row;
  align-items: center;
  padding: 0 0;
`;

export const Search = styled.View`
  flex: 1;
  border-radius: 5px;
  align-items: center;
  padding: 10px 0;
  margin-right: 0;
  background: #fff;
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-color: #ddd;
`;
export const Input = styled.TextInput`
  flex: 1;
  font-size: 16px;
`;
export const Content = styled.View`
  flex-direction: column;
  flex: 1;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0 27px 0px;
`;
export const Heading = styled.Text`
  font-size: 18px;
  font-weight: bold;
  padding: 40px 0 10px;
`;

export const SearchList = styled.View`
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 30px;
`;
export const SearchListItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 15px;
`;
export const SearchText = styled.Text`
  font-size: 15px;
  color: #9f9f9f;
  padding-left: 5px;
`;

export const ListItem = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
})`
  padding: 10px 15px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const HeadingText = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
})`
  font-size: 14px;
  width: 42%;
  padding-horizontal: 10px;
  font-weight: 500;
  margin-left: ${props => props.marginLeft};
`;
