import BottomTab from './BottomTab';
import {StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import LoginScreen from '../screens/LoginScreen';
import ReigesterScreen from '../screens/ReigesterScreen';
import {NavigationContainer} from '@react-navigation/native';
import ChatMessagesScreen from '../screens/ChatMessagesScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
