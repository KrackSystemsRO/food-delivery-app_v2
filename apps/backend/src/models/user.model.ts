import mongooseAutoPopulate from "mongoose-autopopulate";
import validator from "validator";
import mongoose from "mongoose";

const DeliveryLocationSchema = new mongoose.Schema(
  {
    locationId: { type: Number, required: false },
    label: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String },
    postal_code: { type: String },
    lat: { type: Number },
    lng: { type: Number },
    is_default: { type: Boolean, default: false },
  },
  { _id: true }
);

const VehicleInfoSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["bike", "car", "scooter"], required: false },
    plate_number: { type: String },
    capacity: { type: String },
  },
  { _id: false }
);

const AutoIncrementFactory = require("mongoose-sequence")(mongoose);

const userSchema = new mongoose.Schema(
  {
    userId: { type: Number, unique: true },
    first_name: {
      type: String,
      required: [true, "First Name is required"],
      minlength: [3, "First name must be at least 3 characters long"],
      maxlength: [30, "First name must be at most 30 characters long"],
    },
    last_name: {
      type: String,
      required: [true, "Last Name is required"],
      minlength: [3, "Last name must be at least 3 characters long"],
      maxlength: [30, "Last name must be at most 30 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: "Invalid email format",
      },
    },
    role: {
      type: String,
      enum: ["ADMIN", "MANAGER", "EMPLOYEE", "CLIENT", "COURIER"],
      required: true,
    },
    phone_number: {
      type: String,
      validate: {
        validator: (value: string) => validator.isMobilePhone(value),
        message: "Invalid phone number.",
      },
    },
    is_active: { type: Boolean, default: true },
    password: {
      type: String,
      required: true,
      validate: {
        validator: (value: string) => validator.isStrongPassword(value),
        message:
          "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character.",
      },
    },

    company: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "companies",
        autopopulate: { maxDepth: 1 },
      },
    ],

    stores: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "store",
        autopopulate: { maxDepth: 1 },
      },
    ],

    department: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "departments",
        autopopulate: { maxDepth: 1 },
      },
    ],

    deliveryLocations: [DeliveryLocationSchema],
    deliveryLocationCounter: { type: Number, default: 0 },
    vehicle_info: VehicleInfoSchema,

    cityId: { type: String, default: "1" },
    zoneId: { type: String, default: "1" },

    resetToken: { type: String },
    resetTokenExpires: { type: Date },
  },
  { timestamps: true }
);

userSchema.plugin(mongooseAutoPopulate);
userSchema.plugin(AutoIncrementFactory, { inc_field: "userId" });

export default mongoose.model("users", userSchema);
