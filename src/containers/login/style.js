import styled from 'styled-components';
import {View, Text, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const LogoContainer = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 20%;
`;

export const LogoTxt = styled(Text)`
  font-family: 'Raleway-Bold';
  color: white;
  font-size: 25px;
  margin-left: 10px;
`;

export const Button = styled(TouchableOpacity)`
  width: 50%;
  height: 30px;
  background-color: white;
  margin-top: 70%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom-left-radius: ${wp(10)}px;
  border-top-left-radius: ${wp(3)}px;
  border-top-right-radius: ${wp(10)}px;
  border-bottom-right-radius: ${wp(3)}px;
`;
