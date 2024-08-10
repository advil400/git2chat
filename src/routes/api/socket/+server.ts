import { Server } from 'socket.io';
import type { RequestHandler } from '@sveltejs/kit';
import { Server as HttpServer } from 'http';
import { WebSocketServer } from 'ws';

let io: Server;

export const GET: RequestHandler = async () => {
  if (!io) {
    const httpServer = new HttpServer();
    const wsServer = new WebSocketServer({ server: httpServer });
    io = new Server(wsServer, {
      cors: {
        origin: '*',
      },
      path: '/api/socket'
    });

    io.on('connection', (socket) => {
      console.log('A user connected');
      
      socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
      });

      socket.on('leave-room', (roomId) => {
        socket.leave(roomId);
        console.log(`User left room: ${roomId}`);
      });

      socket.on('content-update', ({ roomId, content }) => {
        socket.to(roomId).emit('content-update', content);
      });

      socket.on('disconnect', () => {
        console.log('A user disconnected');
      });
    });
  }

  return new Response(null, {
    status: 101,
    headers: {
      Upgrade: 'websocket',
      Connection: 'Upgrade',
    }
  });
};