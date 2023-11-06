import notifee, {AndroidImportance} from '@notifee/react-native';

const displayNotification = async remoteMessage => {
  const channelId = await notifee.createChannel({
    id: 'important',
    name: 'Important Notifications',
    importance: AndroidImportance.HIGH,
  });

  await notifee.displayNotification({
    title: remoteMessage?.data?.title,
    android: {
      channelId,
      importance: AndroidImportance.HIGH,
      largeIcon: remoteMessage?.data?.image,

      actions: [
        {
          title: 'Click to accept request',
          pressAction: {id: 'Accept', launchActivity: 'default'},
        },
      ],
    },
  });
};
export default displayNotification;
