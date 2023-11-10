import {
  Text,
  Image,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {UserType} from '../components/userContext';
import ButtonConst from '../components/ButtonConst';
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
      <FlatList
        data={friends}
        renderItem={({item}) => {
          return (
            <TouchableOpacity style={styles.containerView}>
              <Image source={{uri: item?.image}} style={styles.imageStyle} />
              <Text style={styles.nameFont}>
                {item?.name} sent you a friend request
              </Text>
              <ButtonConst
                title={'Accept'}
                titleStyle={styles.buttonFont}
                buttonStyle={styles.acceptButtonStyle}
                onPress={() => onAcceptFriendrequest(item?._id)}
              />
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={() => {
          return <Text>No Data Found</Text>;
        }}
      />
    </SafeAreaView>
  );
};

export default FriendScreen;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginHorizontal: 12,
  },
  containerView: {
    marginVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  acceptButtonStyle: {
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#0066b2',
  },
  buttonFont: {
    color: 'white',
    textAlign: 'center',
  },
  imageStyle: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  nameFont: {
    flex: 1,
    fontSize: 15,
    marginLeft: 10,
    fontWeight: 'bold',
  },
});
