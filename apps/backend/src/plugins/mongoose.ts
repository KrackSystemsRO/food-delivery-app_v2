// libs
import fp from "fastify-plugin";
import mongoose from "mongoose";
import { config } from "dotenv";
// utils
import { log } from "@/utils/log";

config();

const mongoosePlugin = fp(async function (fastify, opts) {
  mongoose.set("strictQuery", false);

  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.DB_URL!, {
        autoIndex: true,
      });
      log(`Connected to MongoDB: %s \n ${process.env.DB_URL}`);
    } catch (err) {
      log(`MongoDB connection error: %s \n ${err}`);
      throw err;
    }
  }
});

export default mongoosePlugin;
