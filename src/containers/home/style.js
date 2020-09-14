import styled from 'styled-components';
import {View, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {backgroundColor} from '../../styled';
import MapView from 'react-native-maps';

export const MapViews = styled(MapView)`
  height: ${hp(90)}px;
  width: ${wp(100)}px;
`;

export const Header = styled(View)`
  height: ${hp(10)}px;
  width: ${wp('100%')}px;
  background-color: ${backgroundColor};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Container = styled(View)`
  display: flex;
  height: ${hp('100%')}px;
  padding-top: ${hp(2)}px;
  width: ${wp('100%')}px;
  background-color: ${backgroundColor};
`;

export const PublishBtn = styled(TouchableOpacity)`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  padding: 0px 20px;
  height: ${hp(4)}px;
  top: ${hp(13)}px;
  left: ${wp(10)}px;
  border-radius: 5px;
  background-color: ${backgroundColor};
`;

export const ManagementBtn = styled(TouchableOpacity)`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  padding: 0px 20px;
  height: ${hp(4)}px;
  top: ${hp(13)}px;
  right: ${wp(10)}px;
  border-radius: 5px;
  background-color: ${backgroundColor};
`;

export const SettingBtn = styled(TouchableOpacity)`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  padding: 0px 20px;
  height: ${wp(15)}px;
  width: ${wp(15)}px;
  bottom: ${wp(15)}px;
  right: ${wp(7)}px;
  border-radius: ${wp(10)}px;
  background-color: ${backgroundColor};
`;
