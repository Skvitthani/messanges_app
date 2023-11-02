import React from "react";
import { StyleSheet, TextInput } from "react-native";

const InputText = ({
  value,
  onChange,
  inputStyle,
  placeholder,
  secureTextEntry,
}) => {
  return (
    <TextInput
      value={value}
      style={[inputStyle]}
      autoCapitalize="none"
      onChangeText={onChange}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
    />
  );
};

export default InputText;

const styles = StyleSheet.create({});
