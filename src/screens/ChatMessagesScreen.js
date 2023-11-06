import {
  Text,
  View,
  Image,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import React, {
  useRef,
  useState,
  useEffect,
  useContext,
  useLayoutEffect,
} from 'react';
import {
  messageAPI,
  getMessagesAPI,
  deleteMessageAPI,
  getReceiverProfile,
} from '../utils/services/APIAction';
import images from '../utils/ImageConst';
import InputText from '../components/InputText';
import {UserType} from '../components/userContext';
import ButtonConst from '../components/ButtonConst';
import {socket} from '../utils/services/Socketconnection';

const ChatMessagesScreen = ({route, navigation}) => {
  const {userId} = useContext(UserType);
  const recepientId = route.params.receiverId;
  const [message, setMessage] = useState('');
  const [getMessages, setgetMessages] = useState([]);
  const [recepientData, setRecepientData] = useState();
  const [selectedMessages, setSelectedMessages] = useState([]);

  useEffect(() => {
    (async () => {
      const request = {
        recepientId: recepientId,
        senderId: userId,
      };
      const getReceiver = await getReceiverProfile(recepientId);
      const getAllMessage = await getMessagesAPI(request);
      setgetMessages(getAllMessage);
      setRecepientData(getReceiver);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      socket.on('loadNewchat', async messages => {
        setgetMessages(messages);
      });
    })();
  }, [socket]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerLeft: () => (
        <View style={styles.headerView}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={images.arrow_back}
              style={{height: 24, width: 24, tintColor: 'black'}}
            />
          </TouchableOpacity>

          {selectedMessages.length > 0 ? (
            <Text style={styles.selectedMessageView}>
              {selectedMessages.length}
            </Text>
          ) : (
            <View style={styles.headerImageView}>
              <Image
                style={styles.headerImage}
                source={{uri: recepientData?.image}}
              />
              <Text style={styles.headerName}>{recepientData?.name}</Text>
            </View>
          )}
        </View>
      ),
      headerRight: () =>
        selectedMessages.length > 0 ? (
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
            <TouchableOpacity onPress={onDeletePress}>
              <Image source={images.delete} style={{height: 24, width: 24}} />
            </TouchableOpacity>
          </View>
        ) : null,
    });
  }, [selectedMessages, recepientData]);

  const onDeletePress = async () => {
    try {
      const deleteRes = await deleteMessageAPI(selectedMessages);
      if (deleteRes?.message == 'Messages deleted successfully') {
        const request = {
          recepientId: recepientId,
          senderId: userId,
        };
        const getAllMessage = await getMessagesAPI(request);
        setgetMessages(getAllMessage);
        setSelectedMessages([]);
      }
    } catch (error) {
      console.log('error on onDeletePress', error);
    }
  };

  const onSendTextMessage = async (messageType, imageURL) => {
    try {
      const formData = new FormData();
      formData.append('senderId', userId);
      formData.append('recepientId', recepientId);

      if (messageType === 'image') {
        formData.append('messageType', 'image');
        formData.append('imageFile', {
          uri: imageURL,
          name: 'image.jpg',
          type: 'image/jpeg',
        });
      } else {
        formData.append('messageType', 'text');
        formData.append('messageText', message);
      }

      const res = await messageAPI(formData);
      if (res) {
        setMessage('');
        const request = {
          recepientId: recepientId,
          senderId: userId,
        };
        socket.emit('newChat', request);
        const getAllMessage = await getMessagesAPI(request);
        setgetMessages(getAllMessage);
      }
    } catch (error) {
      console.log('error on message send', error);
    }
  };

  const formateTime = time => {
    const options = {hour: 'numeric', minute: 'numeric'};
    return new Date(time).toLocaleString('en-US', options);
  };

  const onLogMessagePress = async message => {
    const isSelected = selectedMessages?.includes(message._id);

    if (isSelected) {
      const removeSelected = selectedMessages.filter(
        item => item !== message._id,
      );
      setSelectedMessages(removeSelected);
    } else {
      setSelectedMessages([...selectedMessages, message._id]);
    }
  };
  const scrollViewRef = useRef(null);

  return (
    <SafeAreaView style={styles.mainView}>
      <KeyboardAvoidingView style={{flex: 1}}>
        <FlatList
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current.scrollToEnd({animated: false})
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1, justifyContent: 'flex-end'}}
          data={getMessages}
          renderItem={({item, index}) => {
            const isSelected = selectedMessages.includes(item._id);
            return (
              <TouchableOpacity
                onLongPress={() => onLogMessagePress(item)}
                key={index}
                style={[
                  item?.senderId?._id == userId
                    ? [
                        styles.messageBoxView,
                        {backgroundColor: '#DCF8C6', alignSelf: 'flex-end'},
                      ]
                    : [
                        styles.messageBoxView,
                        {backgroundColor: 'white', alignSelf: 'flex-start'},
                      ],
                  isSelected && {width: '100%', backgroundColor: '#F0FFFF'},
                ]}>
                <Text
                  style={{
                    fontSize: 13,
                    textAlign: isSelected ? 'right' : 'left',
                  }}>
                  {item?.message}
                </Text>
                <Text style={styles.messageTimeText}>
                  {formateTime(item?.timeStamp)}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
        <View style={styles.bottomInputView}>
          <InputText
            value={message}
            onChange={txt => setMessage(txt)}
            inputStyle={styles.inputStyle}
            placeholder={'Type you message ...'}
          />
          <ButtonConst
            disabled={message === ''}
            title={'Send'}
            onPress={() => onSendTextMessage('text')}
            titleStyle={styles.sendTextStyle}
            buttonStyle={[
              styles.sendButtonStyle,
              {backgroundColor: message === '' ? 'gray' : '#007bff'},
            ]}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatMessagesScreen;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  headerView: {
    gap: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  selectedMessageView: {
    fontSize: 16,
    fontWeight: '500',
  },
  headerImageView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerImage: {
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
  messageBoxView: {
    margin: 10,
    padding: 10,
    maxWidth: '60%',
    borderRadius: 7,
  },
  messageTimeText: {
    fontSize: 9,
    marginTop: 5,
    color: 'gray',
    textAlign: 'right',
  },
  imageMessageTimeFont: {
    right: 10,
    bottom: 7,
    fontSize: 9,
    marginTop: 5,
    color: 'white',
    textAlign: 'right',
    position: 'absolute',
  },
  imageMessage: {
    width: 200,
    height: 200,
    borderRadius: 7,
  },
  inputStyle: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    borderColor: '#dddddd',
  },
  sendButtonStyle: {
    marginLeft: 10,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  sendTextStyle: {
    color: 'white',
    fontWeight: 'bold',
  },
  bottomInputView: {
    marginBottom: 25,
    borderTopWidth: 1,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderColor: '#dddddd',
    justifyContent: 'center',
  },
});
