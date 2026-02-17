import {io }from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const socket = io(SOCKET_URL, {
  auth: (cb) => cb({ token: localStorage.getItem("token") }),
}); // Adjust the URL as needed 
