import {io }from 'socket.io-client';

export const socket = io('http://localhost:5000', {
  auth: (cb) => cb({ token: localStorage.getItem("token") }),
}); // Adjust the URL as needed 
