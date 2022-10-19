import styled from 'styled-components/native';

interface Props {
  home: boolean;
}

export const Container = styled.View`
  top:-5px;
  width: 36px;
  height: 36px;
  justify-content: center;
  border-radius: 200px;
  align-items: center;
  border: 5px solid #fff;
  overflow: hidden;
 
 
`;

export const Button = styled.TouchableOpacity.attrs({
  activeOpacity: 1,
})``;
