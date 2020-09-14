import styled from 'styled-components';
import {TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {backgroundColor} from '../../styled';

export const ManagementBtn = styled(TouchableOpacity)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 20px;
  height: ${hp(4)}px;
  width: ${wp(30)}px;
  border-radius: 5px;
  background-color: ${backgroundColor};
`;
