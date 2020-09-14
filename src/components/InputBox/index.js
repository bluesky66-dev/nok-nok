import * as React from 'react';
import {Text, TextInput} from 'react-native';
import {Container, InputTick, Input, TickText} from './style';

function InputBox(props) {
  return (
    <Container>
      <InputTick>
        <TickText>{props.tick}</TickText>
      </InputTick>
      <Input
        onChangeText={(value) => props.onChange(value)}
        keyboardType="numeric"
        value={props.value}
        placeholder={props.placeholder ? props.placeholder : ''}
        style={{fontSize:10}}
      />
    </Container>
  );
}

export default InputBox;
