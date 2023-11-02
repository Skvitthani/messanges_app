import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity} from 'react-native';
import ButtonConst from './ButtonConst';

const FriendRequest = ({item, onAcceptFriendrequest}) => {
  return (
    <TouchableOpacity style={styles.containerView}>
      <Image source={{uri: item?.image}} style={styles.imageStyle} />
      <Text style={styles.nameFont}>
        {item?.name} sent you a friend request
      </Text>
      <ButtonConst
        title={'Accept'}
        titleStyle={styles.buttonFont}
        buttonStyle={styles.acceptButtonStyle}
        onPress={() => onAcceptFriendrequest(item?._id)}
      />
    </TouchableOpacity>
  );
};

export default FriendRequest;

const styles = StyleSheet.create({
  containerView: {
    marginVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  acceptButtonStyle: {
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#0066b2',
  },
  buttonFont: {
    color: 'white',
    textAlign: 'center',
  },
  imageStyle: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  nameFont: {
    flex: 1,
    fontSize: 15,
    marginLeft: 10,
    fontWeight: 'bold',
  },
});
