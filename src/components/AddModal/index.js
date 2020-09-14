import React, {useState, useEffect} from 'react';
import {
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Modal from 'react-native-modal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import auth from '@react-native-firebase/auth';
import ImageResizer from 'react-native-image-resizer';
import Spinner from 'react-native-loading-spinner-overlay';
import {useDispatch} from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import database from '@react-native-firebase/database';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faPen,
  faPlus,
  faArrowLeft,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import {BlackText} from '../../styled';
import {ScrollView} from 'react-native-gesture-handler';
import storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';
import firebase from '@react-native-firebase/app';
import {backgroundColor, WhiteText} from '../../styled';
import Toast from 'react-native-simple-toast';
import {ManagementBtn} from './style';
import {usePublications} from '../../utils/hooks';
import * as types from '../../redux/actions/types';

const options = {
  title: 'Select Avatar',
  mediaType: 'photo',
  noData: true,
  storageOptions: {
    skipBackup: true,
  },
};

function EditModal(props) {
  const [values, setValues] = useState({
    isModalVisible: false,
    userData: {},
    name: '',
    setName: false,
    description: '',
    whatsAppNumber: '',
    publicationImages: [],
  });
  const [loading, setLoading] = useState(false);
  const {state, addPublications} = usePublications();
  const dispatch = useDispatch();
  useEffect(() => {
    setValues({
      ...values,
      isModalVisible: props.isModalVisible,
    });
  }, [props.isModalVisible]);

  useEffect(() => {
    setValues({
      ...values,
      userData: props.userData,
      name: props.userData.name,
      description: props.userData.publication
        ? props.userData.publication.description
        : '',
      publicationImages: props.userData.publication
        ? props.userData.publication.images !== undefined
          ? props.userData.publication.images
          : []
        : [],
      whatsAppNumber: props.userData.publication
        ? props.userData.publication.whatsAppNumber
        : '',
    });
  }, [props.userData]);

  const setName = () => {
    setValues({...values, setName: !values.setName});
  };

  const removeImage = (index) => {
    const temp = [...values.publicationImages];
    temp.splice(index, 1);
    setValues({...values, publicationImages: temp});
  };

  const imagePicker = () => {
    ImagePicker.showImagePicker(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        setLoading(true);
        const source = {uri: response.uri};
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
          firebase
            .storage()
            .ref(`userAvatar/${filename}`)
            .putFile(newImage.uri)
            .then(async (data) => {
              setLoading(false);
              const url = await storage()
                .ref(`userAvatar/${filename}`)
                .getDownloadURL();
              setValues({
                ...values,
                userData: {...values.userData, avatar: {uri: url}},
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
              setValues({
                ...values,
                publicationImages: [{uri: url}, ...values.publicationImages],
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
    if (!values.description) {
      Toast.showWithGravity(
        'Please enter Description!',
        Toast.SHORT,
        Toast.BOTTOM,
      );
      return;
    }
    if (!values.whatsAppNumber) {
      Toast.showWithGravity(
        'Please enter WhatsApp Number!',
        Toast.SHORT,
        Toast.BOTTOM,
      );
      return;
    }
    const data = {
      ...values.userData,
      publication: {
        description: values.description,
        images: values.publicationImages,
        whatsAppNumber: values.whatsAppNumber,
        createdDate: Date.now(),
      },
      publicationCreatedDate: Date.now(),
    };
    addPublications(`users/${values.userData.uid}`, data);
    dispatch({type: types.LOG_IN, payload: data});
    props.navigation.replace('EditPublications', {manage: false});
    props.toggleModal();
  };

  const confirmAlert = () => {
    //function to make two option alert
    Alert.alert(
      //title
      'Delete Account',
      //body
      'Are you sure delete this account?',
      [
        {
          text: 'Yes',
          onPress: async () => {
            await database()
              .ref(`users/${values.userData.uid}`)
              .remove()
              .then(() => {
                auth()
                  .signOut()
                  .then(() => {
                    setValues({...values, isModalVisible: false});
                  });
              });
          },
        },
        {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'},
      ],
      {cancelable: false},
      //clicking out side of alert will not cancel
    );
  };

  return (
    <View style={{flex: 1}}>
      <Spinner
        visible={loading}
        textContent={'Uploading...'}
        style={{zIndex: 100}}
      />
      <Modal isVisible={values.isModalVisible} style={{marginTop: hp(5)}}>
        <ScrollView style={{position: 'relative'}}>
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: hp(4),
              right: wp(8),
              zIndex: 1000,
            }}
            onPress={() => props.toggleModal()}>
            <FontAwesomeIcon icon={faArrowLeft} color={backgroundColor} />
          </TouchableOpacity>
          <View
            style={{
              height: hp(85),
              backgroundColor: 'white',
              borderRadius: 40,
              padding: 30,
              display: 'flex',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                position: 'relative',
              }}>
              <Image
                source={values.userData.avatar}
                style={{width: wp(15), height: wp(15), borderRadius: wp(15)}}
              />
              <TouchableOpacity
                onPress={imagePicker}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  paddingLeft: 10,
                  position: 'absolute',
                  bottom: 0,
                  left: wp(11),
                }}>
                <FontAwesomeIcon icon={faPen} size={13} />
              </TouchableOpacity>
              <View
                style={{
                  display: 'flex',
                  height: wp(15),
                  justifyContent: 'center',
                  paddingLeft: 10,
                }}>
                {values.setName ? (
                  <TextInput
                    value={values.userData.name}
                    style={{
                      height: hp(5),
                      borderWidth: 1,
                      padding: 2,
                      borderColor: backgroundColor,
                      borderRadius: 10,
                      paddingHorizontal: 15,
                    }}
                    onChangeText={(value) =>
                      setValues({
                        ...values,
                        userData: {...values.userData, name: value},
                      })
                    }
                  />
                ) : (
                  <BlackText>{values.name}</BlackText>
                )}
              </View>

              <TouchableOpacity
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  paddingLeft: 10,
                }}
                onPress={setName}>
                <FontAwesomeIcon icon={faPen} size={13} />
              </TouchableOpacity>
            </View>
            <View style={{paddingVertical: 10}}>
              <TextInput
                multiline
                style={{
                  height: hp(30),
                  borderWidth: 1,
                  borderColor: backgroundColor,
                  borderRadius: 20,
                  padding: wp(5),
                }}
                placeholder="Escreva para seus vizinhos"
                value={values.description}
                onChangeText={(text) =>
                  setValues({...values, description: text})
                }
              />
            </View>
            <View style={{paddingVertical: 10}}>
              <TextInput
                keyboardType="numeric"
                style={{
                  height: hp(5),
                  borderWidth: 1,
                  borderColor: backgroundColor,
                  borderRadius: 5,
                  paddingVertical: 0,
                  padding: wp(3),
                }}
                placeholder="WhatsApp"
                value={values.whatsAppNumber}
                onChangeText={(text) =>
                  setValues({...values, whatsAppNumber: text})
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
                  marginRight: 15,
                }}
                onPress={publicationImagePicker}>
                <FontAwesomeIcon icon={faPlus} color="white" />
              </TouchableOpacity>
              {console.log('------------', values.publicationImages)}
              {values.publicationImages !== undefined &&
                values.publicationImages.map((data, index) => (
                  <View style={{position: 'relative'}} key={index}>
                    <Image
                      source={data}
                      key={index}
                      style={{
                        width: wp(13),
                        height: wp(13),
                        borderRadius: 10,
                        marginRight: 15,
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => removeImage(index)}
                      style={{
                        position: 'absolute',
                        height: wp(6),
                        width: wp(6),
                        top: -5,
                        right: 5,
                        borderRadius: wp(5),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: backgroundColor,
                      }}>
                      <FontAwesomeIcon icon={faTrashAlt} color="white" />
                    </TouchableOpacity>
                  </View>
                ))}
            </View>
            <View
              style={{display: 'flex', alignItems: 'center', marginTop: hp(8)}}>
              <ManagementBtn onPress={onSave}>
                <WhiteText>Publicar</WhiteText>
              </ManagementBtn>
            </View>
            <View
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 20,
              }}>
              <TouchableOpacity onPress={confirmAlert}>
                <Text
                  style={{
                    textDecorationLine: 'underline',
                    fontSize: 10,
                    color: 'gray',
                  }}>
                  Excluir conta
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
}

export default EditModal;
