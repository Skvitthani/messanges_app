import axios from 'axios';

var base_URL = 'http://192.168.24.107:3000';

export const registerUserApi = async request => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(`${base_URL}/register`, request);
      resolve(response?.data);
    } catch (error) {
      reject(error);
      console.log('error on registerUserApi', error);
    }
  });
};

export const loginUserApi = async request => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${base_URL}/login`, {
        method: 'POST',
        body: JSON.stringify(request),
        headers: {'Content-Type': 'application/json'},
      });
      const res = await response?.json();
      resolve(res);
    } catch (error) {
      console.log('error on loginUserApi', error);
      resolve(error?.response?.data);
    }
  });
};

export const getUerApi = async request => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(`${base_URL}/users?userId=${request}`);
      resolve(response?.data);
    } catch (error) {
      resolve(error?.response?.data);
    }
  });
};

export const sendFriendRequest = async request => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(`${base_URL}/friend-request`, request, {
        Headers: {'Content-Type': 'application/json'},
      });
      resolve(response?.data);
    } catch (error) {
      resolve(error?.response?.data);
    }
  });
};

export const getfriendRequest = async request => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(
        `${base_URL}/get-friend-request?userId=${request}`,
      );
      resolve(response?.data);
    } catch (error) {
      resolve(error?.response?.data);
    }
  });
};

export const getAllFriends = async request => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(
        `${base_URL}/accepted-friend-request?userId=${request}`,
      );
      resolve(response?.data);
    } catch (error) {
      resolve(error?.response?.data);
    }
  });
};

export const acceptFriendAPI = async request => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${base_URL}/friend-request-accept`, {
        method: 'POST',
        body: JSON.stringify(request),
        headers: {'Content-Type': 'application/json'},
      });
      const res = await response?.json();
      resolve(res);
    } catch (error) {
      console.log('error on acceptFriendAPI', error);
      resolve(error?.response?.data);
    }
  });
};

export const getReceiverProfile = async request => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(`${base_URL}/user?userId=${request}`);
      resolve(response?.data);
    } catch (error) {
      resolve(error?.response?.data);
    }
  });
};

export const messageAPI = async request => {
  console.log('request', request);
  return new Promise(async (resolve, reject) => {
    try {
      // var myHeaders = new Headers();
      // myHeaders.append('Content-Type', 'application/json');
      // var raw = JSON.stringify(request);
      // var requestOptions = {
      //   method: 'POST',
      //   headers: myHeaders,
      //   body: raw,
      //   redirect: 'follow',
      // };
      // fetch('http://192.168.24.107:3000/messages', requestOptions)
      //   .then(response => response.text())
      //   .then(result => console.log(result))
      //   .catch(error => console.log('error', error));
      const response = await axios.post(`${base_URL}/messages`, request);
      console.log('response', response?.data);
      resolve(response?.data);
    } catch (error) {
      console.log('error on messageAPI', error);
      resolve(error?.response?.data);
    }
  });
};

export const getMessagesAPI = async request => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        `${base_URL}/get-messages?senderId=${request?.senderId}&recepientId=${request?.recepientId}`,
      );
      const data = response?.json();
      resolve(data);
    } catch (error) {
      resolve(error?.response?.data);
    }
  });
};

export const deleteMessageAPI = async request => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${base_URL}/delete-messages`, {
        method: 'POST',
        body: JSON.stringify({messages: request}),
        headers: {'Content-Type': 'application/json'},
      });
      const data = await response.json();
      resolve(data);
    } catch (error) {
      console.log('error on deleteMessageAPI', error);
      resolve(error?.response?.data);
    }
  });
};

export const getSentFriendrequest = async request => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(
        `${base_URL}/friend-request/sent?userId=${request}`,
      );
      resolve(response?.data);
    } catch (error) {
      resolve(error?.response?.data);
    }
  });
};

export const getUserFriendsAPI = async request => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(`${base_URL}/friends?userId=${request}`);
      resolve(response?.data);
    } catch (error) {
      resolve(error?.response?.data);
    }
  });
};
