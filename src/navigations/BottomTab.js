import React from 'react';
import images from '../utils/ImageConst';
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import FriendScreen from '../screens/FriendScreen';
import {View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

function MyTabBar({state, descriptors, navigation}) {
  return (
    <View style={styles.tabView}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            style={styles.tabButtonView}>
            <Image
              source={
                label == 'Home'
                  ? images?.home
                  : label == 'Chat'
                  ? images?.live_chat
                  : images?.friends
              }
              style={{
                height: label == 'Chat' ? 45 : label == 'Home' ? 35 : 40,
                width: label == 'Chat' ? 45 : label == 'Home' ? 35 : 40,
                tintColor: isFocused ? '#fff' : 'gray',
              }}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const BottomTab = () => {
  return (
    <Tab.Navigator
      tabBar={props => <MyTabBar {...props} />}
      screenOptions={{headerShown: false}}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="FriendScreen" component={FriendScreen} />
    </Tab.Navigator>
  );
};

export default BottomTab;

const styles = StyleSheet.create({
  tabView: {
    marginBottom: 40,
    borderRadius: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: '#210754',
  },
  tabButtonView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
