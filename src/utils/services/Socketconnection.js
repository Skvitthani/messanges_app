import {io} from 'socket.io-client';

export const socket = io.connect('http://192.168.24.107:3000');
