import mongoose from "mongoose";
import validator from "validator";
import mongooseAutoPopulate from "mongoose-autopopulate";

const AutoIncrementFactory = require("mongoose-sequence")(mongoose);

const companySchema = new mongoose.Schema(
  {
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
      required: [true, "Company name is required"],
      minlength: [3, "Company name must be at least 3 characters long"],
      maxlength: [100, "Company name must be at most 100 characters long"],
    },
    address: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: false,
      enum: ["PROVIDER", "CLIENT"],
    },
    email: {
      type: String,
      required: false,
      validate: {
        validator: (value: string) => (value ? validator.isEmail(value) : true),
        message: "Invalid email format",
      },
    },
    is_active: { type: Boolean, required: false, default: false },
    phone_number: {
      type: String,
      required: false,
      validate: {
        validator: (value: string) =>
          value ? validator.isMobilePhone(value) : true,
        message: "Invalid phone number.",
      },
    },
  },
  { timestamps: true }
);

companySchema.plugin(mongooseAutoPopulate);
companySchema.plugin(AutoIncrementFactory, { inc_field: "companyId" });

export default mongoose.model("companies", companySchema);
