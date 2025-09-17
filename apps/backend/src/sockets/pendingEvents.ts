import Redis from "ioredis";

const redis = new Redis({ host: "localhost", port: 6379 });

export interface PendingEvent {
  event: string;
  payload: any;
  room?: string;
  to?: string;
}

/**
 * Add a pending event to Redis
 */
export const addPendingEvent = async (event: PendingEvent) => {
  await redis.rpush("pendingEvents", JSON.stringify(event));
};

/**
 * Dispatch pending events (consume Redis list)
 */
export const dispatchPendingEvents = async (io: any) => {
  while (true) {
    const eventStr = await redis.lpop("pendingEvents");
    if (!eventStr) break;

    const { event, payload, room, to }: PendingEvent = JSON.parse(eventStr);

    if (to) io.to(to).emit(event, payload);
    else if (room) io.to(room).emit(event, payload);
    else io.emit(event, payload);
  }
};

/**
 * Get all pending events without removing
 */
export const getPendingEvents = async (): Promise<PendingEvent[]> => {
  const list = await redis.lrange("pendingEvents", 0, -1);
  return list.map((item) => JSON.parse(item));
};
