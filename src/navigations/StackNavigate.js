import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import ReigesterScreen from '../screens/ReigesterScreen';
import HomeScreen from '../screens/HomeScreen';
import FriendScreen from '../screens/FriendScreen';
import ChatScreen from '../screens/ChatScreen';
import ChatMessagesScreen from '../screens/ChatMessagesScreen';
import images from '../utils/ImageConst';

import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomTab from './BottomTab';

const Stack = createNativeStackNavigator();
const StackNavigate = () => {
  const [userDetails, setUserdetails] = useState();
  useEffect(() => {
    (async () => {
      const userdata = await AsyncStorage.getItem('userDetails');
      const data = JSON.parse(userdata);
      setUserdetails(data);
    })();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Reigester"
          component={ReigesterScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MyTab"
          component={BottomTab}
          options={{headerShown: false}}
        />
        {/* <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={props => ({
            headerTitle: '',
            headerLeft: () => <Text style={styles.headerLeft}>Chats</Text>,
            headerRight: () => (
              <View style={styles.headerRight}>
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate('Chats');
                  }}>
                  <Image
                    source={images.chatbox_ellipses_outline}
                    style={styles.headerImage}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate('Friend');
                  }}>
                  <Image
                    source={images.people_outline}
                    style={styles.headerImage}
                  />
                </TouchableOpacity>
              </View>
            ),
          })}
        />
        <Stack.Screen name="Friend" component={FriendScreen} />
        <Stack.Screen
          name="Chats"
          component={ChatScreen}
          options={props => ({
            headerTitle: '',
            headerLeft: () => (
              <View style={styles.headerView}>
                <TouchableOpacity onPress={() => props?.navigation.goBack()}>
                  <Image
                    source={images.arrow_back}
                    style={{height: 24, width: 24, tintColor: 'black'}}
                  />
                </TouchableOpacity>

                <View style={styles.headerImageView}>
                  <Image
                    style={styles.headerProfileImage}
                    source={{uri: userDetails?.image}}
                  />
                  <Text style={styles.headerName}>{userDetails?.name}</Text>
                </View>
              </View>
            ),
          })}
        /> */}
        <Stack.Screen name="Messages" component={ChatMessagesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigate;

const styles = StyleSheet.create({
  headerRight: {
    gap: 8,
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerLeft: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerImage: {
    width: 26.5,
    height: 25,
    tintColor: 'black',
  },
  headerView: {
    gap: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerImageView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerProfileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    resizeMode: 'cover',
  },
  headerName: {
    fontSize: 15,
    marginLeft: 5,
    fontWeight: 'bold',
  },
});
