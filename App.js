import {LogBox, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import StackNavigate from './src/navigations/StackNavigate';
import {UserContext} from './src/components/userContext';

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

const App = () => {
  return (
    <UserContext>
      <StackNavigate />
    </UserContext>
  );
};

export default App;

const styles = StyleSheet.create({});
