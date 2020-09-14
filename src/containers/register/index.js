import React, {useState, useEffect} from 'react';
import database from '@react-native-firebase/database';
import {useSelector} from 'react-redux';
import {ScrollView} from 'react-native-gesture-handler';
import storage from '@react-native-firebase/storage';

import firebase from '@react-native-firebase/app';
import Spinner from 'react-native-loading-spinner-overlay';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import ImagePicker from 'react-native-image-picker';
import Toast from 'react-native-simple-toast';
import ImageResizer from 'react-native-image-resizer';
import {useDispatch} from 'react-redux';
import * as types from '../../redux/actions/types';
import {
  Container,
  RoundBtn,
  Form,
  GreenText,
  WhiteTitle,
  Avatar,
  AvatarContainer,
  UploadBtn,
} from '../../styled';
import {RoundTop, Dot} from './style';
import TextBox from '../../components/TextBox';
import AvatarImg from '../../assets/images/office-worker.png';
import {backgroundColor} from '../../styled/variables';
import {getToday} from '../../utils/hooks';


function Register({navigation}) {
  const {yyyy, mm, dd, hour, min, sec} = getToday();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [avartar, setAvatar] = useState('');
  const [position, setPosition] = useState({});
  const [values, setValues] = useState({
    userData:{}
  })
  const userData = useSelector((store) => store.data);

  useEffect(()=>{
    setValues({...values,userData:userData})

  },[userData])
  const options = {
    title: 'Select Avatar',
    mediaType: 'photo',
    noData: true,
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };
  const imagePicker = () => {
    ImagePicker.showImagePicker(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        alert(response.error);
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
              console.log(url);
              setAvatar({uri: url});
            })
            .catch((error) => {
              setLoading(false);
              alert(error);
            });
        });
        let metadata = {
          contentType: 'image/jpeg',
        };

        // });
        console.log(response.uri);
      }
    });
  };

  const registerUser = () => {
    if (name === '') {
      Toast.showWithGravity('Please enter Name!', Toast.SHORT, Toast.CENTER);
      return;
    }
    if (avartar === '') {
      Toast.showWithGravity(
        'Please upload the Image!',
        Toast.SHORT,
        Toast.CENTER,
      );
      return;
    }
    const data = {
      uid: values.userData.uid,
      phoneNumber: values.userData.phoneNumber,
      avatar: avartar,
      location: values.userData.location,
      name: name,
      createTime: new Date(yyyy, mm, dd, hour, min, sec).getTime(),
    };
    dispatch({type: types.LOG_IN, payload: data});
    database()
      .ref(`users/${values.userData.uid}`)
      .update(data)
      .then(() => navigation.replace('Home'));
  };




  return (
    <ScrollView>
      <Spinner visible={loading} textContent={'Uploading...'} />

      <Container>
        <RoundTop />
        <Dot step="third" />
        <Form>
          <WhiteTitle className="top">informação básica</WhiteTitle>

          <AvatarContainer>
            <UploadBtn onPress={imagePicker}>
              <FontAwesomeIcon icon={faPlus} color={backgroundColor} />
            </UploadBtn>
            <Avatar source={avartar !== '' ? avartar : AvatarImg} />
          </AvatarContainer>
          <TextBox tick="Nome" onChange={setName} value={name} />
          <RoundBtn onPress={() => registerUser()}>
            <GreenText>Confirmar</GreenText>
          </RoundBtn>
        </Form>
      </Container>
    </ScrollView>
  );
}

export default Register;
