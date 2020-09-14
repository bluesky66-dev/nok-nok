import styled from 'styled-components';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {backgroundColor} from './index';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const Container = styled(View)`
  display: flex;
  height: ${hp('100%')}px;
  width: ${wp('100%')}px;
  align-items: center;
  justify-content: center;
  background-color: ${backgroundColor};
`;

export const GreenText = styled(Text)`
  color: ${backgroundColor};
  font-family: 'Raleway-Bold';
`;

export const WhiteTitle = styled(Text)`
  padding-bottom: ${hp('15%')}px;
  color: white;
  font-family: 'Raleway-Bold';
  font-size: 20px;
`;

export const WhiteText = styled(Text)`
  color: white;
  font-family: 'Raleway-Medium';
  font-size: 13px;
`;


export const BlackText = styled(Text)`
  color: black;
  font-family: 'Raleway-Medium';
  font-size: 20px;
`;
export const BlackName= styled(Text)`
  width:${wp(60)}px;
  color: black;
  font-family: 'Raleway-Medium';
  font-size: 20px;
`;
export const AvatarContainer = styled(View)`  
  margin-bottom: ${wp(7)}px;
  position: relative;   
`;

export const Avatar = styled(Image)`
  width: ${wp(27)}px;
  height: ${wp(27)}px;
  border-color: white;
  border-width: 3px;
  border-radius: ${wp(27)}px;
`;

export const UploadBtn = styled(TouchableOpacity)`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${wp(7)}px;
  width: ${wp(7)}px;
  border-radius: ${wp(7)}px;
  background-color: white;
  right: 5px;
  bottom: 5px;
  z-index: 10;
`

export const RoundBtn = styled(TouchableOpacity)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${wp(30)}px;
  height: ${hp(4)}px;
  background-color: white;
  margin-top: ${hp(35)}px;
  border-bottom-left-radius: ${wp(10)}px;
  border-top-left-radius: ${wp(3)}px;
  border-top-right-radius: ${wp(10)}px;
  border-bottom-right-radius: ${wp(3)}px;
`;

export const Form = styled(View)`
  display: flex;
  align-items: center;
`;

export const Header = styled(View)`
  height: ${hp(10)}px;
  width: ${wp(100)}px;
  padding-top:${hp(3)}px;
  background-color: ${backgroundColor};
  display: flex;
  align-items: center;
  justify-content: center;
`;
