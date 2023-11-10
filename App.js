import {LogBox, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import StackNavigate from './src/navigations/StackNavigate';
import {UserContext} from './src/components/userContext';
import messaging from '@react-native-firebase/messaging';

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

const App = () => {
  useEffect(() => {
    const unsubscribe = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      console.log('enabled', enabled);
      if (enabled) {
        var fcmToken = await messaging().getToken();
        console.log('fcmToken', fcmToken);
      }
    };

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
