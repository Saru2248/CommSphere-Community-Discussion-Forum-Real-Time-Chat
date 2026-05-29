import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

let socket = null;

export const initiateSocket = (token) => {
  if (socket) return socket;
  
  socket = io(SOCKET_URL, {
    auth: {
      token,
    },
    transports: ['websocket'],
    autoConnect: true,
  });
  
  console.log('Socket initialized...');
  return socket;
};

export const getSocket = () => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('Socket disconnected...');
  }
};
