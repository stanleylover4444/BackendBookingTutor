import { Server } from 'socket.io';

let io: Server | null = null;

export const initSocket = (serverIO: Server) => {
  io = serverIO;
};

export const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};
