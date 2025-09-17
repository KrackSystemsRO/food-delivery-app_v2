import { Socket, Server } from "socket.io";

export const courierEvents = (socket: Socket, io: Server) => {
  /**
   * Courier joins rooms based on cityId and zoneId
   */
  socket.on(
    "joinCourierRoom",
    ({ cityId, zoneId }: { cityId: string; zoneId: string }) => {
      // Join city room
      socket.join(`city:${cityId.toString()}`);
      // Join zone room
      socket.join(`zone:${zoneId.toString()}`);
      console.log(
        `Courier ${
          socket.id
        } joined city:${cityId.toString()} and zone:${zoneId.toString()}`
      );
    }
  );

  /**
   * Example: orderCreated in a zone
   */
  socket.on(
    "orderCreated",
    ({ orderId, zoneId }: { orderId: string; zoneId: string }) => {
      io.to(`zone:${zoneId.toString()}`).emit("orderCreated", { orderId });
    }
  );

  /**
   * Example: city-wide order update
   */
  socket.on(
    "cityOrderUpdate",
    ({
      orderId,
      cityId,
      data,
    }: {
      orderId: string;
      cityId: string;
      data: any;
    }) => {
      io.to(`city:${cityId.toString()}`).emit("orderUpdated", {
        orderId,
        data,
      });
    }
  );
};
