import React, {useRef} from 'react';
import {Text, TextInput} from 'react-native';
import PhoneInput from 'react-native-phone-input'
import {Container, InputTick, Input, TickText} from './style';

function PhoneInputBox(props) {
  let phone =  useRef(null);
  onPressFlag = () => {

  }
  return (
    <Container>
      <InputTick>
        <TickText>{props.tick}</TickText>
      </InputTick>
      <PhoneInput
        ref={phone}
        initialCountry="br"
        onChangePhoneNumber={(value) => props.onChange(value)}
        value={props.value}
        textProps={{placeholder: props.placeholder ? props.placeholder : ''}}
        textStyle={{fontSize:10}}
      />
    </Container>
  );
}

export default PhoneInputBox;
