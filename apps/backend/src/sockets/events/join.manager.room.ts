import { Socket, Server } from "socket.io";

export const managerEvents = (socket: Socket, io: Server) => {
  /**
   * Manager joins their store room
   */
  socket.on(
    "joinManagerRoom",
    ({
      storeId,
      cityId,
      zoneId,
    }: {
      storeId: string;
      cityId?: string;
      zoneId?: string;
    }) => {
      // Join store room
      socket.join(`store:${storeId.toString()}`);

      // Optional: join city and zone rooms
      if (cityId) socket.join(`city:${cityId.toString()}`);
      if (zoneId) socket.join(`zone:${zoneId.toString()}`);

      console.log(
        `Manager ${socket.id} joined store:${storeId}${
          cityId ? `, city:${cityId}` : ""
        }${zoneId ? `, zone:${zoneId}` : ""}`
      );
    }
  );

  /**
   * New order for the store
   */
  socket.on(
    "newOrder",
    ({ storeId, order }: { storeId: string; order: any }) => {
      io.to(`store:${storeId.toString()}`).emit("newOrder", order);
    }
  );

  /**
   * Updated order info
   */
  socket.on(
    "orderUpdated",
    ({
      storeId,
      orderId,
      data,
    }: {
      storeId: string;
      orderId: string;
      data: any;
    }) => {
      io.to(`store:${storeId.toString()}`).emit("orderUpdated", {
        orderId,
        data,
      });
    }
  );

  /**
   * Optional: broadcast to city/zone if needed
   */
  socket.on(
    "cityOrderUpdate",
    ({
      cityId,
      orderId,
      data,
    }: {
      cityId: string;
      orderId: string;
      data: any;
    }) => {
      io.to(`city:${cityId.toString()}`).emit("orderUpdated", {
        orderId,
        data,
      });
    }
  );
};
