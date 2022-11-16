import styled from 'styled-components/native';

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
  height: 100%;
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
  border-bottom-color: #fff;
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
export const Text = styled.Text`
  color: #000;
  font-size: ${(props: any) => (props.active ? '13px' : '13px')};
  padding: 5px;
  font-weight: bold;
  justify-content: center;
  opacity: ${(props: any) => (props.active ? '1' : '0.9')};
  width: 100%;
  text-align: center;
  border-bottom-width: 3px;
  border-bottom-color: ${(props: any) =>
    props.active ? '#F25813' : 'transparent'};
`;
