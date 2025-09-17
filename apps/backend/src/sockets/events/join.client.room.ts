import { Socket, Server } from "socket.io";

const clientEvents = (socket: Socket, io: Server) => {
  /**
   * Client joins their personal room
   */
  socket.on("joinClientRoom", ({ clientId }: { clientId: string }) => {
    socket.join(`client:${clientId.toString()}`);
    console.log(`Client ${socket.id} joined client:${clientId}`);
  });

  /**
   * Update client about their order status
   */
  socket.on(
    "orderStatusUpdate",
    ({
      clientId,
      orderId,
      status,
    }: {
      clientId: string;
      orderId: string;
      status: string;
    }) => {
      io.to(`client:${clientId.toString()}`).emit("orderStatusUpdate", {
        orderId,
        status,
      });
    }
  );

  /**
   * Notify client about new order (e.g., confirmation)
   */
  socket.on(
    "orderCreated",
    ({ clientId, order }: { clientId: string; order: any }) => {
      io.to(`client:${clientId.toString()}`).emit("orderCreated", order);
    }
  );
};
export default clientEvents;
