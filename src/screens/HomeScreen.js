import {
  Text,
  View,
  Image,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {
  getUerApi,
  getUserFriendsAPI,
  sendFriendRequest,
  getSentFriendrequest,
} from '../utils/services/APIAction';
import jwt_decode from 'jwt-decode';
import {UserType} from '../components/userContext';
import ButtonConst from '../components/ButtonConst';
import React, {useContext, useEffect, useState} from 'react';
import SendNotification from '../utils/services/SendNotification';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const {setUserId} = useContext(UserType);

  const [userID, setUserID] = useState();
  const [userData, setUserData] = useState([]);
  const [requestSent, setRequestSent] = useState([]);
  const [userFriends, setUserFriends] = useState([]);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('token');
      const decoded = jwt_decode(token);
      const userId = decoded.userId;
      setUserId(userId);
      setUserID(userId);
      getFriend(userId);

      const getUser = await getUerApi(userId);
      setUserData(getUser);
    })();
  }, []);

  const onSendButtonPress = async item => {
    try {
      let notification = {
        token: item?.fcmToken,
        name: item?.name,
        image: item?.image,
      };
      SendNotification.sendNotification(notification);
      let request = {
        currentUserId: userID,
        selectedUserId: item?._id,
      };

      const sendrequest = await sendFriendRequest(request);
      console.log('sendrequest', sendrequest);
      if (sendrequest == 'OK') {
        getFriend(userID);
      }
    } catch (error) {
      console.log('error on onSendButtonPress', error);
    }
  };

  const getFriend = async userId => {
    const getAllMessage = await getSentFriendrequest(userId);
    const getUserfriends = await getUserFriendsAPI(userId);
    setUserFriends(getUserfriends);
    setRequestSent(getAllMessage);
  };

  return (
    <SafeAreaView>
      <View style={styles.userView}>
        <FlatList
          data={userData}
          renderItem={({item, index}) => {
            return (
              <View style={styles.containerView} key={index}>
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
                  onPress={() => onSendButtonPress(item)}
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
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  userView: {
    padding: 10,
  },
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
