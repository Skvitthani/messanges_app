import {
  Text,
  View,
  Image,
  StyleSheet,
  ScrollView,
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
import {UserType} from '../components/userContext';
import EmojiSelector from 'react-native-emoji-selector';
import ImagePicker from 'react-native-image-crop-picker';
import MessageInputView from '../components/MessageInputView';

const ChatMessagesScreen = ({route, navigation}) => {
  const {userId} = useContext(UserType);
  const recepientId = route.params.receiverId;
  const [message, setMessage] = useState('');
  const [getMessages, setgetMessages] = useState([]);
  const [recepientData, setRecepientData] = useState();
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);

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
      if (res?.message == 'Message sent Successfully') {
        setMessage('');
        const request = {
          recepientId: recepientId,
          senderId: userId,
        };
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

  // const onCameraPress = async () => {
  //   ImagePicker.openPicker({
  //     width: 300,
  //     height: 400,
  //     cropping: true,
  //     includeBase64: true,
  //   }).then(image => {
  //     console.log('imageimageimageiomaofmie', image);
  //     console.log('imageimageimageiomaofmie', image?.path);
  //     onSendTextMessage('image', image?.path);
  //   });
  // };

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
    <KeyboardAvoidingView style={styles.mainView}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{flexGrow: 1}}
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({animated: false})
        }>
        {getMessages?.map((item, index) => {
          if (item?.messageType == 'text') {
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
          }
          // if (item.messageType === 'image') {
          //   const baseURL =
          //     'file:///Users/mac/Documents/SVDev/messanger_backend/files/';
          //   const imageUrl = item.imageUrl;
          //   const filename = imageUrl.split('/').pop();
          //   const source = baseURL + filename;
          //   console.log('source', source);
          //   return (
          //     <TouchableOpacity
          //       key={index}
          //       style={[
          //         item?.senderId?._id == userId
          //           ? [
          //               styles.messageBoxView,
          //               {backgroundColor: '#DCF8C6', alignSelf: 'flex-end'},
          //             ]
          //           : [
          //               styles.messageBoxView,
          //               {backgroundColor: 'white', alignSelf: 'flex-start'},
          //             ],
          //       ]}>
          //       <View>
          //         <Image source={{uri: source}} style={styles.imageMessage} />
          //         <Text style={styles.imageMessageTimeFont}>
          //           {formateTime(item?.timeStamp)}
          //         </Text>
          //       </View>
          //     </TouchableOpacity>
          //   );
          // }
        })}
      </ScrollView>
      <MessageInputView
        // onCameraPress={onCameraPress}
        bottomInputView={{marginBottom: showEmojiSelector ? 0 : 25}}
        value={message}
        onChange={txt => setMessage(txt)}
        onEmojiPress={() => {
          setShowEmojiSelector(!showEmojiSelector);
        }}
        onSendButtonpress={() => onSendTextMessage('text')}
      />
      {showEmojiSelector && (
        <EmojiSelector
          style={{height: 250}}
          onEmojiSelected={emoji =>
            setMessage(prevMessage => prevMessage + emoji)
          }
        />
      )}
    </KeyboardAvoidingView>
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
});
