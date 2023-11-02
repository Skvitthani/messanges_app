import UserChats from '../components/UserChats';
import {UserType} from '../components/userContext';
import {getAllFriends} from '../utils/services/APIAction';
import React, {useContext, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity} from 'react-native';

const ChatScreen = ({navigation}) => {
  const {userId} = useContext(UserType);
  const [acceptedFriends, setAcceptedFriends] = useState([]);

  useEffect(() => {
    (async () => {
      const getFriend = await getAllFriends(userId);
      setAcceptedFriends(getFriend);
    })();
  }, []);
  return (
    <ScrollView>
      <TouchableOpacity>
        {acceptedFriends?.map((item, index) => (
          <UserChats
            key={index}
            item={item}
            onPress={item =>
              navigation.navigate('Messages', {receiverId: item})
            }
          />
        ))}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({});
