import styled from 'styled-components';
import {View, TextInput, Text} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {lightGrayColor, backgroundColor} from '../../styled/variables';

export const Container = styled(View)`
  display: flex;
  flex-direction: row;
`;

export const InputTick = styled(View)`
  width: ${wp(15)}px;
  height: ${hp(4)}px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${lightGrayColor};
  border-top-left-radius: 7px;
  border-bottom-left-radius: 7px;
`;

export const Input = styled(TextInput)`
  background-color: white;
  height: ${hp(4)}px;
  width: ${wp(40)}px;
  padding: 0 10px;
  border-top-right-radius: 7px;
  border-bottom-right-radius: 7px;
`;

export const TickText = styled(Text)`
  color: ${backgroundColor};
`;
