import React, {useRef, useState} from 'react';
import {Container, InputTick, PhoneBox, TickText} from './style';

function PhoneInputBox(props) {
  const phone =  useRef(null);
  const [phoneNumber, setPhonNumber] = useState('');
  const onChangePhoneNumber = (value) => {
    setPhonNumber(value);
    props.onChange(phone.current.getCountryCode(), value);
  }
  const onSelectCountry = (ios2) => {
    props.onChange(phone.current.getCountryCode(), phoneNumber);
  }

  return (
    <Container>
      <InputTick>
        <TickText>{props.tick}</TickText>
      </InputTick>
      <PhoneBox
        ref={phone}
        initialCountry="br"
        onChangePhoneNumber={onChangePhoneNumber}
        onSelectCountry={onSelectCountry}
        value={props.value}
        textProps={{placeholder: props.placeholder ? props.placeholder : ''}}
        textStyle={{fontSize:10}}
      />
    </Container>
  );
}

export default PhoneInputBox;
