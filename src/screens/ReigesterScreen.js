import React, {useState} from 'react';
import InputText from '../components/InputText';
import ButtonConst from '../components/ButtonConst';
import {registerUserApi} from '../utils/services/APIAction';
import {KeyboardAvoidingView, StyleSheet, Text, View} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const ReigesterScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState('https://picsum.photos/200');

  const onRegisterPress = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      var fcmToken = await messaging().getToken();
      AsyncStorage.setItem('token', JSON.stringify(fcmToken));
    }
    const request = {
      name: name,
      email: email,
      image: image,
      password: password,
      fcmToken: fcmToken,
    };
    const res = await registerUserApi(request);
    if (res?.message == 'User Entered Sucessfully') {
      navigation.navigate('Login');
      setEmail('');
      setName('');
      setPassword('');
    } else {
      Alert.alert(JSON.stringify(res.message));
    }
  };
  return (
    <View style={styles.containerView}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always">
        <View style={styles.textView}>
          <Text style={styles.signInFont}>Register</Text>
          <Text style={styles.yourAccountFont}>Register Your Account</Text>
        </View>
        <View style={styles.inputNameViewStyle}>
          <Text style={styles.emainAndPassFont}>Name</Text>
          <InputText
            value={name}
            placeholder={'Enter Your Name'}
            inputStyle={styles.inputStyle}
            onChange={txt => setName(txt)}
          />
        </View>
        <View style={styles.inputEmailViewStyle}>
          <Text style={styles.emainAndPassFont}>Email</Text>
          <InputText
            value={email}
            placeholder={'Enter Your Email'}
            inputStyle={styles.inputStyle}
            onChange={txt => setEmail(txt)}
          />
        </View>
        <View style={styles.inputPasswordViewStyle}>
          <Text style={styles.emainAndPassFont}>Password</Text>
          <InputText
            value={password}
            secureTextEntry={true}
            placeholder={'Enter Your Password'}
            inputStyle={styles.inputStyle}
            onChange={txt => setPassword(txt)}
          />
        </View>
        <View style={styles.inputPasswordViewStyle}>
          <Text style={styles.emainAndPassFont}>Image</Text>
          <InputText
            value={image}
            placeholder={'Image'}
            inputStyle={styles.inputStyle}
            onChange={txt => setImage(txt)}
          />
        </View>
        <ButtonConst
          onPress={onRegisterPress}
          title={'Register'}
          titleStyle={styles.loginFont}
          buttonStyle={styles.loginButton}
        />
        <ButtonConst
          buttonStyle={styles.signupView}
          titleStyle={styles.signupFont}
          title={'Already have an account? Sign In'}
          onPress={() => navigation.goBack()}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default ReigesterScreen;

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  textView: {
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInFont: {
    fontSize: 17,
    color: '#4A55A2',
    fontWeight: '700',
  },
  yourAccountFont: {
    fontSize: 17,
    marginTop: 15,
    fontWeight: '700',
  },
  inputNameViewStyle: {
    marginTop: 50,
  },
  inputEmailViewStyle: {
    marginTop: 20,
  },
  emainAndPassFont: {
    fontSize: 18,
    color: 'gray',
    fontWeight: '600',
  },

  inputStyle: {
    borderBottomWidth: 1,
    marginTop: 20,
    width: 300,
    fontSize: 18,
  },
  inputPasswordViewStyle: {
    marginTop: 20,
  },
  loginButton: {
    width: 200,
    padding: 15,
    marginTop: 50,
    borderRadius: 6,
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: '#4A55A2',
  },
  loginFont: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signupView: {
    marginTop: 15,
  },
  signupFont: {
    color: 'gray',
    fontSize: 16,
    textAlign: 'center',
  },
});
