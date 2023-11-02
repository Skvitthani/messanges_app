import React from 'react';
import InputText from './InputText';
import ButtonConst from './ButtonConst';
import images from '../utils/ImageConst';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';

const MessageInputView = ({
  value,
  onChange,
  onEmojiPress,
  onCameraPress,
  bottomInputView,
  onSendButtonpress,
}) => {
  return (
    <View style={[styles.bottomInputView, bottomInputView]}>
      {/* <Entypo
        onPress={onEmojiPress}
        size={24}
        color="gray"
        name="emoji-happy"
        style={{marginRight: 5}}
      /> */}
      <TouchableOpacity onPress={onEmojiPress}>
        <Image
          source={images.emoji_happy}
          style={{height: 25, width: 27, marginRight: 5}}
        />
      </TouchableOpacity>
      <InputText
        value={value}
        onChange={onChange}
        inputStyle={styles.inputStyle}
        placeholder={'Type you message ...'}
      />
      <View style={styles.cameraViewStyle}>
        <TouchableOpacity onPress={onCameraPress}>
          <Image source={images.camera} style={{height: 25, width: 27}} />
        </TouchableOpacity>
        <Image source={images.mic} style={{height: 25, width: 27}} />
        {/* <Entypo name="camera" size={24} color="gray" onPress={onCameraPress} />
        <Feather name="mic" size={24} color="gray" /> */}
      </View>
      <ButtonConst
        disabled={value === ''}
        title={'Send'}
        onPress={onSendButtonpress}
        titleStyle={styles.sendTextStyle}
        buttonStyle={[
          styles.sendButtonStyle,
          {backgroundColor: value === '' ? 'gray' : '#007bff'},
        ]}
      />
    </View>
  );
};

export default MessageInputView;

const styles = StyleSheet.create({
  inputStyle: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    borderColor: '#dddddd',
  },
  bottomInputView: {
    borderTopWidth: 1,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderColor: '#dddddd',
  },
  sendButtonStyle: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  sendTextStyle: {
    color: 'white',
    fontWeight: 'bold',
  },
  cameraViewStyle: {
    gap: 7,
    marginHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
