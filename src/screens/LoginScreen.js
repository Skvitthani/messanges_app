import {
  Text,
  View,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';
import InputText from '../components/InputText';
import React, {useEffect, useState} from 'react';
import ButtonConst from '../components/ButtonConst';
import {loginUserApi} from '../utils/services/APIAction';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('sanket@gmail.com');
  const [password, setPassword] = useState('sanket');
  useEffect(() => {
    const fetchToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        navigation.navigate('Home');
      }
    };
    fetchToken();
  }, []);

  const onLoginPress = async () => {
    const request = {
      email: email,
      password: password,
    };
    const res = await loginUserApi(request);
    if (res?.token) {
      navigation.navigate('Home');
      AsyncStorage.setItem('token', res.token);
      setEmail('');
      setPassword('');
    } else {
      Alert.alert(JSON.stringify(res?.message));
    }
  };

  return (
    <View style={styles.containerView}>
      <KeyboardAvoidingView>
        <View style={styles.textView}>
          <Text style={styles.signInFont}>Sign In</Text>
          <Text style={styles.yourAccountFont}>Sign In to Your Account</Text>
        </View>
        <View style={styles.inputEmailViewStyle}>
          <Text style={styles.emainAndPassFont}>Email</Text>
          <InputText
            value={email}
            inputStyle={styles.inputStyle}
            placeholder={'Enter Your Email'}
            onChange={txt => setEmail(txt)}
          />
        </View>
        <View style={styles.inputPasswordViewStyle}>
          <Text style={styles.emainAndPassFont}>Password</Text>
          <InputText
            value={password}
            secureTextEntry={true}
            inputStyle={styles.inputStyle}
            placeholder={'Enter Your Password'}
            onChange={txt => setPassword(txt)}
          />
        </View>
        <ButtonConst
          title={'LogIn'}
          onPress={onLoginPress}
          titleStyle={styles.loginFont}
          buttonStyle={styles.loginButton}
        />
        <ButtonConst
          titleStyle={styles.signupFont}
          buttonStyle={styles.signupView}
          title={"Don't have an account? Sign up"}
          onPress={() => navigation.navigate('Reigester')}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;

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
  inputEmailViewStyle: {
    marginTop: 50,
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
