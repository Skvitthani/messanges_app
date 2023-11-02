import {
  getUserFriendsAPI,
  sendFriendRequest,
  getSentFriendrequest,
} from '../utils/services/APIAction';
import {UserType} from './userContext';
import ButtonConst from './ButtonConst';
import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';

const Users = ({item}) => {
  const {userId, setUserId} = useContext(UserType);
  const [requestSent, setRequestSent] = useState([]);
  const [userFriends, setUserFriends] = useState([]);

  useEffect(() => {
    (async () => {
      getFriend();
    })();
  }, []);

  const getFriend = async () => {
    const getAllMessage = await getSentFriendrequest(userId);
    const getUserfriends = await getUserFriendsAPI(userId);
    setUserFriends(getUserfriends);
    setRequestSent(getAllMessage);
  };

  const onSendButtonPress = async item => {
    try {
      let request = {
        currentUserId: userId,
        selectedUserId: item,
      };
      const sendrequest = await sendFriendRequest(request);
      if (sendrequest == 'OK') {
      }
      getFriend();
    } catch (error) {
      console.log('error on onSendButtonPress', error);
    }
  };

  return (
    <View style={styles.containerView}>
      <Image source={{uri: item?.image}} style={styles.imageStyle} />
      <View style={styles.textView}>
        <Text style={styles.nameFont}>{item?.name}</Text>
        <Text style={styles.emailFont}>{item?.email}</Text>
      </View>
      <ButtonConst
        disabled={
          userFriends?.includes(item?._id) ||
          requestSent?.some(i => i?._id == item?._id)
        }
        onPress={() => onSendButtonPress(item?._id)}
        title={
          userFriends?.includes(item?._id)
            ? 'Friends'
            : requestSent?.some(i => i?._id == item?._id)
            ? 'Request Sent'
            : 'Add Friend'
        }
        buttonStyle={[
          styles.buttonStyle,
          {
            backgroundColor: userFriends?.includes(item?._id)
              ? 'green'
              : requestSent?.some(i => i?._id == item?._id)
              ? 'gray'
              : '#567189',
          },
        ]}
        titleStyle={styles.buttontitlestyle}
      />
    </View>
  );
};

export default Users;

const styles = StyleSheet.create({
  containerView: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageStyle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: 'cover',
  },
  textView: {
    flex: 1,
    marginLeft: 12,
  },
  buttonStyle: {
    width: 105,
    padding: 10,
    borderRadius: 6,
  },
  buttontitlestyle: {
    fontSize: 13,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  nameFont: {
    fontWeight: 'bold',
  },
  emailFont: {
    marginTop: 4,
    color: 'gray',
  },
});
