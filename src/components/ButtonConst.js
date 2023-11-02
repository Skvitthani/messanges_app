import React from 'react';
import {Text, TouchableOpacity} from 'react-native';

const ButtonConst = ({title, buttonStyle, titleStyle, onPress, disabled}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[buttonStyle]}>
      <Text style={[titleStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default ButtonConst;
