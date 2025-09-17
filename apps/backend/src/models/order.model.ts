import mongooseAutoPopulate from "mongoose-autopopulate";
import mongoose from "mongoose";

const AutoIncrementFactory = require("mongoose-sequence")(mongoose);

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Types.ObjectId, ref: "product" },
  quantity: { type: Number, default: 1 },
  observations: { type: String, default: "" },
});

const CourierTrackingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
      autopopulate: true,
    },
    procedure: {
      type: String,
      enum: ["picked", "delivering", "delivered", "realocated"],
      required: true,
    },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "users" },
    store: { type: mongoose.Types.ObjectId, ref: "store" },
    items: [OrderItemSchema],
    total: Number,
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "delivering",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    deliveryLocation: {
      lat: Number,
      lng: Number,
      address: String,
    },
    couriers: [CourierTrackingSchema], // 👈 new field
  },
  { timestamps: true }
);

orderSchema.plugin(mongooseAutoPopulate);
orderSchema.plugin(AutoIncrementFactory, { inc_field: "orderId" });

export default mongoose.model("order", orderSchema);
