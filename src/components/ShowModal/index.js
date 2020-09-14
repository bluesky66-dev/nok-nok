import React, {useState, useEffect} from 'react';
import {Text, View, Image, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import Hyperlink from 'react-native-hyperlink'
import {faPhone, faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {BlackName} from '../../styled';
import {ScrollView} from 'react-native-gesture-handler';
import call from 'react-native-phone-call';
import {backgroundColor, WhiteText} from '../../styled';
import {ManagementBtn} from './style';

const options = {
  title: 'Select Avatar',
};

function ShowModal(props) {
  const [values, setValues] = useState({
    isModalVisible: false,
    userData: {},
    name: '',
    setName: false,
    description: '',
    whatsAppNumber: '',
    publicationImages: [],
  });

  useEffect(() => {
    
    setValues({
      ...values,
      isModalVisible: props.isModalVisible,
     
    });
    console.log(props.userData);
  }, [props.isModalVisible]);

  useEffect(()=>{
    setValues({
      ...values,
      isModalVisible: props.isModalVisible,
      userData: props.userData,
      name: props.userData.name,
      description: props.userData.publication
        ? props.userData.publication.description
        : '',
      publicationImages: props.userData.publication
        ? props.userData.publication.images
        : [],
      whatsAppNumber: props.userData.publication
        ? props.userData.publication.whatsAppNumber
        : '',
    });

  },[props.userData])

  const onSave = () => {
    props.toggleModal();
  };

  const onCall = (number) => {
    const args = {
      number: number, // String value with the number to call
      prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call 
    }
    call(args).catch(console.error)
  }

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Modal
        isVisible={values.isModalVisible}
        style={{display: 'flex', marginTop: hp(10)}}>
        <View>
         
          <View
            style={{
              // height: hp(80),
              backgroundColor: 'white',
              borderRadius: 40,
              padding: 30,
            }}>
            <View
              style={{height: hp(10), display: 'flex', flexDirection: 'row'}}>
              <Image
                source={values.userData.avatar}
                style={{width: wp(15), height: wp(15), borderRadius: wp(15)}}
              />

              <View
                style={{
                  display: 'flex',
                  height: wp(15),
                  justifyContent: 'center',
                  paddingLeft: 10,
                }}>
                <BlackName>{values.name}</BlackName>
              </View>
            </View>
            <View style={{paddingVertical: 10}}>
            <Hyperlink linkDefault={ true } linkStyle={ { color: '#2980b9' } }>
              <Text
                style={{
                  paddingVertical: 20,
                }}>
                {values.description}
              </Text>
              </Hyperlink>
            </View>
            <View
              style={{
                paddingVertical: 10,
                display: 'flex',
                flexDirection: 'row',
                paddingVertical: 20,
              }}>
              <FontAwesomeIcon
                icon={faPhone}
                color={'black'}
                style={{marginRight: 20}}
              />
              <ManagementBtn onPress={()=>onCall(values.whatsAppNumber)}>
                <WhiteText>Entrar em Contato</WhiteText>
              </ManagementBtn>
            </View>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              {values.publicationImages!==undefined&& values.publicationImages.map((data, index) => (
                <Image
                  source={data}
                  key={index}
                  style={{
                    width: wp(13),
                    height: wp(13),
                    borderRadius: 10,
                    marginRight: 5,
                  }}
                />
              ))}
            </View>
            <View
              style={{display: 'flex', alignItems: 'center', marginTop: hp(8)}}>
              <ManagementBtn onPress={onSave}>
                <WhiteText>Fechar</WhiteText>
              </ManagementBtn>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default ShowModal;
