import * as React from 'react';
import {Image} from 'react-native';
import {useDispatch} from 'react-redux';
import database from '@react-native-firebase/database';
import Geolocation from 'react-native-geolocation-service';
import auth from '@react-native-firebase/auth';
import {Container, GreenText} from '../../styled';
import {LogoContainer, LogoTxt, Button} from './style';
import Logo from '../../assets/images/logo.png';
import * as types from '../../redux/actions/types';
import {Platform, PermissionsAndroid} from 'react-native';

async function requestPermissions() {
  if (Platform.OS === 'ios') {
    Geolocation.requestAuthorization('always');
  }

  if (Platform.OS === 'android') {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);
    if (
      (await PermissionsAndroid.check('android.permission.CAMERA')) &&
      (await PermissionsAndroid.check('android.permission.CAMERA')) &&
      (await PermissionsAndroid.check('android.permission.CAMERA'))
    ) {
      console.log('You can use the camera');
      return true;
    } else {
      console.log('all permissions denied');
      return false;
    }
  }
}

function Login({navigation}) {
  const goNavigation = () => {
    navigation.navigate('PhoneVerification');
  };

  const dispatch = useDispatch();
  React.useEffect(() => {
    requestPermissions();

    auth().onAuthStateChanged((user) => {
      if (user) {
        Geolocation.getCurrentPosition(
          (position) => {
            database()
              .ref(`/users/${user.uid}`)
              .once('value')
              .then((snapshot) => {
                if (snapshot.exists()) {
                  const temp = {
                    ...snapshot.val(),
                    location: {
                      lat: position.coords.latitude,
                      long: position.coords.longitude,
                    },
                  };
                  console.log('-----------First User Data--------------', temp);
                  if (Object.keys(snapshot.val()).includes('phoneNumber')) {
                    dispatch({
                      type: types.SET_USER_DATA,
                      payload: temp,
                    });
                    database()
                      .ref(`/users/${user.uid}`)
                      .set(temp)
                      .then((data) => {
                        navigation.replace('Home');
                      });
                  }
                } else {
                  dispatch({
                    type: types.LOG_IN,
                    payload: {
                      uid: user.uid,
                      phoneNumber: user.phoneNumber,
                      location: {
                        lat: position.coords.latitude,
                        long: position.coords.longitude,
                      },
                    },
                  });
                  navigation.replace('Register');
                }
              });
          },
          (error) => {
            console.log('-----Location Error-----', error.message);
          },
          {enableHighAccuracy: false, timeout: 20000, maximumAge: 10000},
        );
      } else {
        console.log('sign out!!!');
        navigation.navigate('Login');
      }
    });
  }, []);

  return (
    <Container>
      <LogoContainer>
        <Image
          source={Logo}
          style={{height: 40, width: 40, resizeMode: 'contain'}}
        />
        <LogoTxt>nok-nok</LogoTxt>
      </LogoContainer>
      <Button onPress={goNavigation}>
        <GreenText>Login com Celular</GreenText>
      </Button>
    </Container>
  );
}

export default Login;
