import styled from 'styled-components';
import {View} from 'react-native';
import {roundColor} from '../../styled/variables';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const RoundTop = styled(View)`
  position: absolute;
  top: ${hp('-130%')}px;
  height: ${hp('150%')}px;
  width: ${wp('200%')}px;
  border-radius: ${wp('130%')}px;
  background-color: ${roundColor};
`;

export const Dot = styled(View)`
  position: absolute;
  width: 15px;
  height: 15px;
  border-radius: 15px;
  background-color: white;
  top: ${(props) => (props.step === 'first' || props.step === 'third'? hp('15.5%') : hp('19%'))}px;

  left: ${(props) =>
    props.step === 'first'
      ? wp('13%')
      : props.step === 'second'
      ? wp('48%')
      : wp('84%')}px;
`;




