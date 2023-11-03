import jwt_decode from 'jwt-decode';
import Users from '../components/Users';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {UserType} from '../components/userContext';
import {getUerApi} from '../utils/services/APIAction';
import React, {useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const {setUserId} = useContext(UserType);

  const [userData, setUserData] = useState([]);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('token');
      const decoded = jwt_decode(token);
      const userId = decoded.userId;

      setUserId(userId);
      const getUser = await getUerApi(userId);
      setUserData(getUser);
    })();
  }, []);
  return (
    <SafeAreaView>
      <View style={styles.userView}>
        {userData?.map((item, index) => (
          <Users item={item} key={index} />
        ))}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  userView: {
    padding: 10,
  },
});
