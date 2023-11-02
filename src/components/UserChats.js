import {UserType} from './userContext';
import {useIsFocused} from '@react-navigation/native';
import {getMessagesAPI} from '../utils/services/APIAction';
import React, {useContext, useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const UserChats = ({item, onPress}) => {
  const {userId} = useContext(UserType);

  const [message, setMessages] = useState([]);

  const isfocuse = useIsFocused();

  useEffect(() => {
    (async () => {
      const request = {
        recepientId: item?._id,
        senderId: userId,
      };
      const getAllMessage = await getMessagesAPI(request);
      setMessages(getAllMessage);
    })();
  }, [isfocuse]);

  const getLastMessages = () => {
    const userMesages = message?.filter(item => item?.messageType == 'text');
    const n = userMesages.length;
    return userMesages[n - 1];
  };

  const lastMessage = getLastMessages();

  const formatTime = time => {
    const options = {hour: 'numeric', minute: 'numeric'};
    return new Date(time).toLocaleString('en-US', options);
  };

  return (
    <TouchableOpacity
      style={styles.mainView}
      onPress={() => onPress(item?._id)}>
      <Image source={{uri: item?.image}} style={styles.imageStyle} />
      <View style={{flex: 1}}>
        <Text style={styles.nameStyle}>{item?.name}</Text>
        <Text style={styles.lastMessage}>{lastMessage?.message}</Text>
      </View>
      <View>
        <Text style={styles.timeText}>
          {' '}
          {lastMessage && formatTime(lastMessage?.timeStamp)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default UserChats;

const styles = StyleSheet.create({
  imageStyle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: 'cover',
  },
  mainView: {
    gap: 10,
    padding: 10,
    borderWidth: 0.7,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#D0D0D0',
  },
  nameStyle: {
    fontSize: 15,
    fontWeight: '500',
  },
  lastMessage: {
    marginTop: 5,
    color: 'gray',
    fontWeight: '500',
  },
  timeText: {
    fontSize: 11,
    color: '#585858',
    fontWeight: '400',
  },
});
