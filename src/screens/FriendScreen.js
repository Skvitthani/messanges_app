import {UserType} from '../components/userContext';
import FriendRequest from '../components/FriendRequest';
import {SafeAreaView, StyleSheet, Text} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {acceptFriendAPI, getfriendRequest} from '../utils/services/APIAction';

const FriendScreen = () => {
  const {userId} = useContext(UserType);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    (async () => {
      const getFriend = await getfriendRequest(userId);
      setFriends(getFriend);
    })();
  }, []);

  const onAcceptFriendrequest = async item => {
    try {
      const request = {
        senderId: item,
        receiverId: userId,
      };

      const response = await acceptFriendAPI(request);
      if (response?.message == 'Friend request accepted sucessfully.') {
        const remove = friends?.filter(ite => ite?._id !== item);
        setFriends(remove);
      }
    } catch (error) {
      console.log('error on onAcceptFriendrequest', error);
    }
  };

  return (
    <SafeAreaView style={styles?.container}>
      {friends?.length > 0 ? <Text>Your Friend Request</Text> : null}
      {friends?.map((item, index) => (
        <FriendRequest
          key={index}
          item={item}
          onAcceptFriendrequest={onAcceptFriendrequest}
        />
      ))}
    </SafeAreaView>
  );
};

export default FriendScreen;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginHorizontal: 12,
  },
});
