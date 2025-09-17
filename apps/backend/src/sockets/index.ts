import { Server, Socket } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import Redis from "ioredis";
import fs from "fs";
import path from "path";

export const initSockets = (server: any): Server => {
  const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  // Redis adapter for scaling
  const pubClient = new Redis({ host: "localhost", port: 6379 });
  const subClient = pubClient.duplicate();
  io.adapter(createAdapter(pubClient, subClient));

  // Auto-load all events in 'events' folder
  const eventsPath = path.join(__dirname, "events");
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((f) => f.endsWith(".ts") || f.endsWith(".js"));

  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    // Register all events
    eventFiles.forEach((file) => {
      const eventModule = require(path.join(eventsPath, file));
      const eventFn = eventModule.default || Object.values(eventModule)[0];
      if (typeof eventFn === "function") eventFn(socket, io);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};
