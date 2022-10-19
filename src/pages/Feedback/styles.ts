import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background: #fff;
`;

export const ContentMain = styled.View`
  height: 100%;
`;

export const Header = styled.View`
  padding: 7px 15px 7px 7px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom-width: 0.5px;
  border-bottom-color: #dadada;
`;

export const Title = styled.Text`
  font-size: 16px;
  font-weight: bold;
  padding-left: 10px;
`;
export const HeadingLeft = styled.TouchableOpacity.attrs({
  activityOpacity: 1,
})`
  width: 30%;
  align-items: flex-start;
  justify-content: flex-start;
`;
export const HeadingRight = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-end;
`;
export const HeadingLeftTitle = styled.Text`
  flex: 1;
  font-size: 16px;
  font-weight: bold;
  padding-left: 10px;
`;
export const HeadingRightTitle = styled.Text`
  font-size: 14px;
  font-weight: bold;
  padding-left: 10px;
`;
export const Content = styled.View`
  padding: 10px 30px;
`;

export const PrimaryButton = styled.TouchableOpacity.attrs({
  activityOpacity: 1,
})`
  align-items: center;
  padding: 6px 20px;
  border-width: 2px;
  min-width: 90px;
  border-color: ${(props: any) =>
    props.disabled ? 'rgba(0, 0, 0, 0.1)' : '#F25813'};
  border-radius: 14px;
  margin: 5px;
`;
export const PrimaryButtonText = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: ${(props: any) =>
    props.disabled ? 'rgba(0, 0, 0, 0.1)' : '#F25813'};
`;
export const SecondaryButton = styled.TouchableOpacity.attrs({
  activityOpacity: 1,
})`
  align-items: center;
  padding: 6px 20px;
  min-width:90px
  border-width:2px
  border-color: ${(props: any) =>
    props.disabled ? 'rgba(0, 0, 0, 0.1)' : '#9F9F9F'};
  border-radius: 14px;
  margin:5px;
`;
export const SecondaryButtonText = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #9f9f9f;
`;

export const ButtonOuter = styled.View`
  align-items: center;
  flex-direction: row;
  padding: 6px 15px;
  border-radius: 14px;
  font-size: 12px;
`;
