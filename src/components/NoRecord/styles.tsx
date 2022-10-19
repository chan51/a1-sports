import styled from 'styled-components/native';

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
