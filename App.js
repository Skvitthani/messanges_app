import {LogBox, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import StackNavigate from './src/navigations/StackNavigate';
import {UserContext} from './src/components/userContext';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import displayNotification from './src/utils/ShowNotification';
import {navigate} from './src/navigations/NavigateRef';

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

const App = () => {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('remoteMessage', remoteMessage);
      displayNotification(remoteMessage);
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background! :::::::', remoteMessage);
      displayNotification(remoteMessage);
      notifee.onBackgroundEvent(async ({type, detail}) => {
        const {notification, pressAction} = detail;
        if (type === EventType.ACTION_PRESS && pressAction.id === 'Accept') {
          navigate('FriendScreen');
        }
      });
    });

    return unsubscribe;
  }, []);

  return (
    <UserContext>
      <StackNavigate />
    </UserContext>
  );
};

export default App;

const styles = StyleSheet.create({});
