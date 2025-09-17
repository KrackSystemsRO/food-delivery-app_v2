import mongooseAutoPopulate from "mongoose-autopopulate";
import mongoose from "mongoose";
import validator from "validator";

const AutoIncrementFactory = require("mongoose-sequence")(mongoose);

const storeSchema = new mongoose.Schema(
  {
    storeId: { type: Number, unique: true },

    company: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "companies",
        required: false,
        autopopulate: { maxDepth: 1 },
      },
    ],

    admin: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: false,
        autopopulate: { maxDepth: 1 },
      },
    ],

    name: {
      type: String,
      required: true,
      minlength: [3, "Store name must be at least 3 characters long"],
      maxlength: [100, "Store name must be at most 100 characters long"],
    },

    type: {
      type: String,
      enum: ["RESTAURANT", "GROCERY", "BAKERY", "CAFE", "OTHER"],
      required: true,
    },

    phone_number: {
      type: String,
      required: false,
      validate: {
        validator: (value: string) =>
          value ? validator.isMobilePhone(value) : true,
        message: "Invalid phone number.",
      },
    },

    description: { type: String },

    address: {
      type: String,
      required: true,
    },

    location: {
      lat: { type: Number, required: false },
      lng: { type: Number, required: false },
    },

    cityId: { type: String, default: "1" }, // or ObjectId if you have a cities collection
    zoneId: { type: String, default: "1" },

    is_open: { type: Boolean, default: false },
    is_active: { type: Boolean, default: false },
  },
  { timestamps: true }
);

storeSchema.plugin(mongooseAutoPopulate);
storeSchema.plugin(AutoIncrementFactory, { inc_field: "storeId" });

export default mongoose.model("store", storeSchema);
