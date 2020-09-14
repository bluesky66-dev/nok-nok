import React, {useState, useEffect} from 'react';
import {Button, TextInput, View, Image, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ImageResizer from 'react-native-image-resizer';
import Spinner from 'react-native-loading-spinner-overlay';
import {useDispatch} from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPen, faPlus, faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-native-datepicker';
import {ScrollView} from 'react-native-gesture-handler';
import storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';
import firebase from '@react-native-firebase/app';
import {backgroundColor, WhiteText, GreenText, BlackText} from '../../styled';
import Toast from 'react-native-simple-toast';
import {ManagementBtn} from './style';
import {usePublications, getToday} from '../../utils/hooks';
import * as types from '../../redux/actions/types';

const options = {
  title: 'Select Avatar',
  mediaType: 'photo',
  noData: true,
  storageOptions: {
    skipBackup: true,
  },
};

function EditManagementModal(props) {
  const {yyyy, mm, dd} = getToday();
  const [values, setValues] = useState({
    isModalVisible: false,
    userData: {},
    name: '',
    setName: false,
    description: '',
    phoneNumber: '',
    value: '',
    pay: false,
    receive: true,
    images: [],
    today: `${yyyy}-${mm}-${dd}`,
    index: 0
  });

  const [loading, setLoading] = useState(false);
  const {state, addPublications} = usePublications();
  const dispatch = useDispatch();
  useEffect(() => {
    if(props.userData && props.data){
      setValues({
        ...values,
        userData: props.userData,
        isModalVisible: props.isModalVisible,
        name: props.data.name,
        description:props.data.description,
        phoneNumber:props.data.phoneNumber,
        value:props.data.value,
        pay:props.data.pay,
        receive:props.data.receive,
        images:props.data.images?props.data.images:[],
        today: props.data.createdDate,
        index: props.index
      });
    }
    
  }, [props.isModalVisible, props.userData, props.data]);

  const publicationImagePicker = () => {
    ImagePicker.showImagePicker(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        setLoading(true);
        let filename =
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15);
        ImageResizer.createResizedImage(
          response.uri,
          300,
          300,
          'JPEG',
          70,
        ).then(async (newImage) => {
          let metadata = {
            contentType: 'image/jpeg',
          };
          firebase
            .storage()
            .ref(`userAvatar/${filename}`)
            .putFile(newImage.uri)
            .then(async (data) => {
              setLoading(false);
              const url = await storage()
                .ref(`userAvatar/${filename}`)
                .getDownloadURL();
              console.log(url);
              setValues({
                ...values,
                images: [{uri: url}, ...values.images],
              });
            })
            .catch((error) => {
              setLoading(false);
              alert(error);
            });
        });
        console.log(response.uri);
      }
    });
  };

  const onSave = () => {
    // props.toggleModal();
    if (!values.name) {
      Toast.showWithGravity('Please enter Name!', Toast.SHORT, Toast.BOTTOM);
      return;
    }
   
    const editedData = {
      name: values.name,
      value: values.value,
      pay: values.pay,
      receive: values.receive,
      description: values.description,
      images: values.images,
      phoneNumber: values.phoneNumber,
      createdDate: values.today,
    }
    const temp = [...values.userData.clients]
    temp[values.index] = {...editedData}
   

    const  data = {
        ...values.userData,
        clients:[
        ...temp,
       
      ]};
    
    console.log(data);
    addPublications(`users/${values.userData.uid}`, data);
    dispatch({type: types.LOG_IN, payload: data});
    // props.navigation.replace('EditPublications');
    props.toggleModal();
  };

  return (
    <View style={{flex: 1}}>
      <Spinner visible={loading} textContent={'Uploading...'} />
      <Modal isVisible={values.isModalVisible}>
        <ScrollView>
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: hp(5),
              right: wp(8),
              zIndex: 1000,
            }}
            onPress={() => props.toggleModal()}>
            <FontAwesomeIcon icon={faArrowLeft} color={backgroundColor} />
          </TouchableOpacity>
          <View
            style={{
              height: hp(90),
              backgroundColor: 'white',
              borderRadius: 40,
              paddingHorizontal: 30,
              paddingVertical: 50,
            }}>
            {/* 
              Client Name section
            */}
            <View style={{paddingVertical: 5}}>
              <TextInput
                style={{
                  height: hp(5),
                  borderWidth: 1,
                  borderColor: backgroundColor,
                  borderRadius: 5,
                  paddingVertical: 0,
                }}
                placeholder="Nome do Cliente"
                value={values.name}
                onChangeText={(text) => setValues({...values, name: text})}
              />
            </View>

            {/* 
              Cel phone number section
            */}
            <View style={{paddingVertical: 10}}>
              <TextInput
                keyboardType="numeric"
                style={{
                  height: hp(5),
                  borderWidth: 1,
                  borderColor: backgroundColor,
                  borderRadius: 5,
                  paddingVertical: 0,
                }}
                placeholder="Celular"
                value={values.phoneNumber}
                onChangeText={(text) =>
                  setValues({...values, phoneNumber: text})
                }
              />
            </View>

            {/* 
              Value section
            */}
            <View style={{paddingVertical: 10}}>
              <TextInput
                keyboardType="numeric"
                style={{
                  height: hp(5),
                  borderWidth: 1,
                  borderColor: backgroundColor,
                  borderRadius: 5,
                  paddingVertical: 0,
                }}
                placeholder="Valor"
                value={values.value}
                onChangeText={(text) => setValues({...values, value: text})}
              />
            </View>

            {/* 
              Two buttons section 
            */}
            <View
              style={{
                paddingVertical: 10,
                display: 'flex',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                onPress={() =>
                  setValues({...values, receive: true, pay: false})
                }
                style={
                  values.receive
                    ? {
                        height: hp(5),
                        backgroundColor: backgroundColor,
                        borderWidth: 1,
                        borderColor: backgroundColor,
                        width: wp(37),
                        borderBottomLeftRadius: 5,
                        borderTopLeftRadius: 5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }
                    : {
                        height: hp(5),
                        borderWidth: 1,
                        borderColor: backgroundColor,
                        width: wp(37),
                        borderBottomLeftRadius: 5,
                        borderTopLeftRadius: 5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }
                }>
                {values.receive ? (
                  <WhiteText>Para receber</WhiteText>
                ) : (
                  <GreenText>Para receber</GreenText>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  setValues({...values, receive: false, pay: true})
                }
                style={
                  values.pay
                    ? {
                        height: hp(5),
                        backgroundColor: backgroundColor,
                        borderWidth: 1,
                        borderColor: backgroundColor,
                        width: wp(37),
                        borderBottomRightRadius: 5,
                        borderTopRightRadius: 5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }
                    : {
                        height: hp(5),
                        borderWidth: 1,
                        borderColor: backgroundColor,
                        width: wp(37),
                        borderBottomRightRadius: 5,
                        borderTopRightRadius: 5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }
                }>
                {values.pay ? (
                  <WhiteText>Para pagar</WhiteText>
                ) : (
                  <GreenText>Para pagar</GreenText>
                )}
              </TouchableOpacity>
            </View>

            {/* 
              Date picker section
            */}

            <View style={{paddingVertical: 10}}>
              <DatePicker
                style={{width: wp(50)}}
                date={values.today}
                mode="date"
                placeholder="select date"
                format="YYYY-MM-DD"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateInput: {
                    borderRadius: 5,
                    height: hp(5),
                    width: wp(10),
                    borderColor: backgroundColor,
                  },
                  // ... You can check the source to find the other keys.
                }}
                onDateChange={(date) => {
                  setValues({...values, today: date});
                }}
              />
            </View>

            {/* 
              Note section
            */}
            <View style={{paddingVertical: 10}}>
              <TextInput
                multiline
                style={{
                  height: hp(10),
                  borderWidth: 1,
                  borderColor: backgroundColor,
                  borderRadius: 5,
                  paddingVertical: 0,
                }}
                placeholder="Anotação"
                value={values.description}
                onChangeText={(text) =>
                  setValues({...values, description: text})
                }
              />
            </View>

            <View style={{display: 'flex', flexDirection: 'row'}}>
              <TouchableOpacity
                style={{
                  width: wp(13),
                  height: wp(13),
                  backgroundColor: backgroundColor,
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 5,
                }}
                onPress={publicationImagePicker}>
                <FontAwesomeIcon icon={faPlus} color="white" />
              </TouchableOpacity>
              {values.images.map((data, index) => (
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
                <WhiteText>Registrar</WhiteText>
              </ManagementBtn>
            </View>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
}

export default EditManagementModal;
