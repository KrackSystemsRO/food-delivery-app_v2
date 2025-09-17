import mongoose, { Schema } from "mongoose";

const tokenSchema = new Schema(
  {
    token: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    type: { type: String, enum: ["refresh", "blacklist"], required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Token", tokenSchema);
