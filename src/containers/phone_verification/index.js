import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import Toast from 'react-native-simple-toast';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import {Container, RoundBtn, Form, GreenText, WhiteText} from '../../styled';
import {RoundTop, Dot} from './style';
import * as types from '../../redux/actions/types';
import InputBox from '../../components/InputBox';
import PhoneInputBox from '../../components/InputBox/PhoneInput';

function PhoneVerification({navigation}) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [countryCode, setCountryCode] = useState('');
  const [code, setCode] = useState('');
  const dispatch = useDispatch();
  async function signInWithPhoneNumber(phoneNumber) {
    if (phoneNumber !== '') {
      if (!phoneNumber.includes('+')) {
        await auth()
          .signInWithPhoneNumber('+' + phoneNumber)
          .then((confirmation) => {
            Toast.showWithGravity(
              'Sent Verification Code!',
              Toast.SHORT,
              Toast.BOTTOM,
            );
            setConfirm(confirmation);
          }).catch(error=>console.log(error));
      } else {
        await auth()
          .signInWithPhoneNumber(phoneNumber)
          .then((confirmation) => {
            Toast.showWithGravity(
              'Sent Verification Code!',
              Toast.SHORT,
              Toast.BOTTOM,
            );
            setConfirm(confirmation);
          }).catch(error=>console.log(error));
      }
    } else {
      alert('Please enter phone number!');
    }
  }

  async function confirmCode() {
    if (code !== '') {
      try {
        await confirm
          .confirm(code)
          .then((data) => {
            // const uid = data.user.uid;
            // dispatch({
            //   type: types.LOG_IN,
            //   payload: {uid: uid, phoneNumber: phoneNumber},
            // });
          })
          .catch((error) => {
            Toast.showWithGravity(
              'Please resend the Verification Code!',
              Toast.SHORT,
              Toast.BOTTOM,
            );
          });
      } catch (error) {
        alert(error);
      }
    } else {
      alert('Please enter code!');
    }
  }

  const onChange = (countryCode, value) => {
    setPhoneNumber(value);
    setCountryCode(countryCode);
  };

  const onChangeCode = (value) => {
    setCode(value);
  };

  if (!confirm) {
    return (
      <ScrollView>
        <Container>
          <RoundTop />
          <Dot step="first" />

          <Form>
            <PhoneInputBox tick="Celular" onChange={onChange} value={phoneNumber} placeholder="DDD+Número"/>
            <RoundBtn onPress={() => signInWithPhoneNumber(countryCode + phoneNumber)}>
              <GreenText>Próximo</GreenText>
            </RoundBtn>
          </Form>
        </Container>
      </ScrollView>
    );
  }
  return (
    <ScrollView>
      <Container>
        <RoundTop />
        <Dot step="second" />

        <Form>
          <InputBox tick="código" onChange={onChangeCode} value={code} placeholder="Aguarde 10 segundos"/>
          <TouchableOpacity
            style={{marginTop: 10}}
            onPress={() => signInWithPhoneNumber(phoneNumber)}>
            <WhiteText>Resend Code</WhiteText>
          </TouchableOpacity>
          <RoundBtn onPress={() => confirmCode()}>
            <GreenText>Próximo</GreenText>
          </RoundBtn>
        </Form>
      </Container>
    </ScrollView>
  );
}

export default PhoneVerification;
