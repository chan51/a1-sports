import styled from 'styled-components/native';

interface Props {
  active: boolean;
}

export const Container = styled.View`
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
export const ContentMain = styled.View`
  height: 100%;
`;

export const Header = styled.View`
  padding: 10px 15px;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
`;

export const Title = styled.Text`
  font-size: 16px;
  font-weight: bold;
`;

export const Content = styled.View`
  padding: 5px 0;
`;

export const Username = styled.Text`
  font-size: 15px;
  font-weight: bold;
`;

export const Stats = styled.View`
  margin-top: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
export const StatsColumn = styled.View`
  align-items: center;
  width: 30%;
`;

export const StatsColumnButton = styled.TouchableOpacity.attrs({
  activityOpacity: 1,
})`
  align-items: center;
`;
export const TextButton = styled.TouchableOpacity.attrs({
  activityOpacity: 1,
})`
  color: #F25813;
`;

export const StatsNumber = styled.Text`
  font-size: 18px;
  padding: 0 10px;
  font-weight: bold;
`;

export const Separator = styled.Text`
  color: #000;
  font-size: 30px;
  opacity: 0.1;
  padding: 0 10px;
`;

export const StatsText = styled.Text`
  color: #707070;
  font-size: 12px;
  margin-top: 5px;
`;

export const ProfileColumn = styled.View`
  align-items: flex-start;
  flex-direction: row;
  padding: 0;
  justify-content: space-between;
  margin-bottom: 5px;
`;
export const ProfileContent = styled.View`
  width:${(props: any) => props.width || '60%'}
  padding-right:30px;
`;

export const ProfileText = styled.Text`
  font-weight: bold;
  font-size:12px
  color:#fff;
`;

export const ProfileEdit = styled.TouchableOpacity.attrs({
  activityOpacity: 1,
})`
  width: 100%;
  align-items: center;
  flex-direction: row;
  padding: 6px 20px;
  background-color: #F25813;
  border-radius: 14px;
  font-size: 12px;
  align-items: center;
`;

export const FoodList = styled.View``;

export const Gallery = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
`;

export const Text = styled.Text``;
export const Tab = styled.View`
  width: 33%;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;
  border-bottom-width: 3px;
  border-bottom-color: ${(props: Props) =>
    props.active ? '#F25813' : '#f1f1f1'};
`;
export const GalleryContent = styled.View`
  margin: 2px -29px 0;
  flex-direction: row;
  flex-wrap: wrap;
`;
export const GalleryContentItem = styled.TouchableOpacity.attrs({
  activityOpacity: 1,
})`
  width: 33.33%;
  padding: 1px;
  margin-bottom: 2px;
  position: relative;
  height: 120px;
`;
export const GalleryImage = styled.Image`
  align-self: center;
  width: 100%;
  height: 120px;
`;
export const GalleryVidoBtn = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
`;
export const TextDataLinkText = styled.Text`
  font-size: 14px;
  color: #F25813;
  font-weight: bold;
`;
export const HeadingLeft = styled.View`
  width: 100%;
  flex-direction: row;
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

export const LongPressView = styled.Text`
  display: flex;
  border: 1px solid #dbe8ff;
  border-radius: 5px;
`;
export const ProfileDetails = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding-left: 15px;
  padding-right:15px;
  margin-top:10px;
`;
export const ProfileDetailsData = styled.View`
padding-left: 15px;
`;

export const ListItem = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
})`
  padding: 10px 15px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
