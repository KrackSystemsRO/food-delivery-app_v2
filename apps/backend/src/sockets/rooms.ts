import Redis from "ioredis";

const redis = new Redis({ host: "localhost", port: 6379 });

/**
 * Add a user to a room
 */
export const addUserToRoom = async (room: string, socketId: string) => {
  await redis.sadd(`room:${room}`, socketId);
};

/**
 * Remove a user from a room
 */
export const removeUserFromRoom = async (room: string, socketId: string) => {
  await redis.srem(`room:${room}`, socketId);
  const size = await redis.scard(`room:${room}`);
  if (size === 0) await redis.del(`room:${room}`);
};

/**
 * Get all users in a room
 */
export const getUsersInRoom = async (room: string): Promise<string[]> => {
  return (await redis.smembers(`room:${room}`)) || [];
};

/**
 * Check if a user is in a room
 */
export const isUserInRoom = async (
  room: string,
  socketId: string
): Promise<boolean> => {
  return (await redis.sismember(`room:${room}`, socketId)) === 1;
};
