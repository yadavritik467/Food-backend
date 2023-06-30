import { Server } from 'socket.io';

let io;

export const startWebSocketServer = (server) => {
  io = new Server(server);
  
  let pendingOrders = 0;

  io.on('connection', (socket) => {
    socket.on('disconnect', () => {
      pendingOrders--;
      broadcastPendingOrdersCount();
    });
  });

  function broadcastPendingOrdersCount() {
    io.emit('pendingOrdersCount', pendingOrders);
  }
};

export const increasePendingOrdersCount = () => {
  pendingOrders++;
  broadcastPendingOrdersCount();
};

export const decreasePendingOrdersCount = () => {
  pendingOrders--;
  broadcastPendingOrdersCount();
};
