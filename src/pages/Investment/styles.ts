import styled from 'styled-components/native';

export const Header = styled.View`
  padding: 7px 15px 7px 7px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom-width: 0.5px;
  border-bottom-color: #dadada;
`;
export const HeadingLeft = styled.TouchableOpacity.attrs({
  activityOpacity: 1,
})`
  width: 30%;
  align-items: flex-start;
  justify-content: flex-start;
`;
export const ButtonOuter = styled.View`
  align-items: center;
  flex-direction: row;
  padding: 6px 15px;
  border-radius: 14px;
  font-size: 12px;
`;
export const Title = styled.Text`
  font-size: 16px;
  font-weight: bold;
  padding-left: 10px;
`;

export const ProfileDetails = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding-left: 15px;
  padding-right: 15px;
  margin-top: 10px;
  margin-bottom: 15px;
`;
export const ProfileDetailsData = styled.View`
  padding-left: 15px;
`;
export const Banner = styled.TouchableOpacity.attrs({
  activeOpacity: 1,
})`
  align-items: center;
  justify-content: center;
  position: relative;
  height: 78px;
  width: 78px;
  border-radius: 78px;
  overflow: hidden;
  border-width: 2px;
  border-color: #3787f7;
`;

export const CoverImage = styled.Image`
  align-self: center;
  width: 100%;
  height: 78px;
  resize-mode: cover;
  position: relative;
`;
