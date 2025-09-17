import { Server } from "socket.io";

/**
 * Notify all relevant parties about an order change.
 * - Client: personal room "client:{clientId}"
 * - Managers: store room "store:{storeId}"
 * - Couriers: zone room "zone:{zoneId}" if needed
 */
export function emitOrderToRelevantSockets(io: Server, order: any) {
  // Notify the client about status changes or creation
  io.to(`client:${order.client._id}`).emit("orderStatusUpdate", {
    orderId: order._id,
    status: order.status,
  });

  // Notify managers of the specific store
  io.to(`store:${order.store._id}`).emit("orderUpdated", order);

  // Notify couriers for the store’s city/zone if applicable
  if (order.store.cityId && order.store.zoneId) {
    io.to(`courier:${order.store.cityId}:${order.store.zoneId}`).emit(
      "newOrder",
      order
    );
  }
}
