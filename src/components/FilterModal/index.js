import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Modal from 'react-native-modal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPhone, faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {BlackText} from '../../styled';
import {ScrollView} from 'react-native-gesture-handler';
import call from 'react-native-phone-call';
import {backgroundColor, WhiteText} from '../../styled';

function FilterModal(props) {
  const [values, setValues] = useState({
    isModalVisible: false,
    closest: false,
    latest: false
  });
  useEffect(() => {
    setValues({...values, isModalVisible: props.isModalVisible});
  }, [props.isModalVisible]);
  useEffect(() => {
    console.log(props.closest);
    setValues({...values, closest: props.closest, latest: props.latest});
  }, [props.closest, props.latest]);
  return (
    <View>
      <Modal isVisible={values.isModalVisible}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: hp(35),
            right: wp(5),
            zIndex: 1000,
          }}
          onPress={() => props.toggleModal()}>
          <FontAwesomeIcon icon={faArrowLeft} color={backgroundColor} />
        </TouchableOpacity>
        <View
          style={{
            height: hp(30),
            backgroundColor: 'white',
            borderRadius: 5,
            padding: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent:'space-around'
          }}>
          <BlackText>Ordem</BlackText>
          <View style={{display: 'flex',alignItems:'center', flexDirection: 'row', marginTop: 30}}>
            <CheckBox
              disabled={false}
              value={values.closest}
              onValueChange={props.toggleCloset}
            />
            <TouchableOpacity
              style={{
                width: wp(50),
                backgroundColor: backgroundColor,
                height: hp(5),
                borderRadius: 5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft:10
              }}
              onPress={props.toggleCloset}>
              <WhiteText>Mais próximo</WhiteText>
            </TouchableOpacity>
          </View>
          <View style={{display: 'flex',alignItems:'center', flexDirection: 'row', marginTop: 5}}>
            <CheckBox
              disabled={false}
              value={values.latest}
              onValueChange={props.toggleLatest}
            />
            <TouchableOpacity
              style={{
                width: wp(50),
                backgroundColor: backgroundColor,
                height: hp(5),
                borderRadius: 5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft:10
              }} onPress={props.toggleLatest}>
              <WhiteText>Últimas Publicações</WhiteText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default FilterModal;
