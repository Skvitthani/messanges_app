/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import displayNotification from './src/utils/ShowNotification';
import {navigate} from './src/navigations/NavigateRef';
import notifee, {EventType} from '@notifee/react-native';

AppRegistry.registerComponent(appName, () => App);

messaging().onMessage(async remoteMessage => {
  console.log('remoteMessage', remoteMessage);
  displayNotification(remoteMessage);
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background! :::::::', remoteMessage);
  displayNotification(remoteMessage);
  notifee.onBackgroundEvent(async ({type, detail}) => {
    const {notification, pressAction} = detail;
    console.log('pressAction', pressAction);
    if (type === EventType.ACTION_PRESS && pressAction.id === 'Accept') {
      navigate('FriendScreen');
    }
  });
});
