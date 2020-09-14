import * as React from 'react';
import {Text, TextInput} from 'react-native';
import {Container, InputTick, Input, TickText} from './style';

function TextBox(props) {
  return (
    <Container>
      <InputTick>
        <TickText>{props.tick}</TickText>
      </InputTick>
      <Input onChangeText={(value)=>props.onChange(value)} value={props.value}/>
    </Container>
  );
}

export default TextBox;
