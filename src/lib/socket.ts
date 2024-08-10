import { io } from 'socket.io-client';
import { writable } from 'svelte/store';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

const SOCKET_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-vercel-app-url.vercel.app'
  : 'http://localhost:3000';

const socket = io(SOCKET_URL, {
  path: '/api/socket',
  transports: ['websocket'],
});

const connected = writable(false);

socket.on('connect', () => {
  console.log('Connected to server');
  connected.set(true);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
  connected.set(false);
});

export const joinRoom = (roomId: string) => {
  socket.emit('join-room', roomId);
};

export const leaveRoom = (roomId: string) => {
  socket.emit('leave-room', roomId);
};

// Yjs setup
const ydoc = new Y.Doc();
const ytext = ydoc.getText('editor');
const provider = new WebsocketProvider(SOCKET_URL, 'your-room-name', ydoc);

export { socket, connected, ydoc, ytext, provider };