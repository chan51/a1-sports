import styled from 'styled-components/native';

export const Banner = styled.TouchableOpacity.attrs({
  activeOpacity: 1,
})`
  align-items: center;
  justify-content: center;
  position: relative;
  height: 78px;
  width: 78px;
  border-radius: 78px;
  overflow:hidden;
  border-width:2px;
  border-color: #3787f7;
`;

export const CoverImage = styled.Image`
  align-self: center;
  width: 100%;
  height: 78px;
  resize-mode: cover;
  position: relative;
`;

export const ActionButton = styled.View`
  padding-top: 10px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.2);
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
