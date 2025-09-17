import mongoose from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";

const AutoIncrementFactory = require("mongoose-sequence")(mongoose);

const departmentSchema = new mongoose.Schema(
  {
    company: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "companies",
        required: true,
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
      required: [true, "Department name is required"],
      minlength: [3, "Department name must be at least 3 characters long"],
      maxlength: [
        100,
        "Department name must must be at most 100 characters long",
      ],
    },
    description: {
      type: String,
      required: false,
    },
    is_active: { type: Boolean, required: false, default: false },
  },
  { timestamps: true }
);

departmentSchema.plugin(mongooseAutoPopulate);
departmentSchema.plugin(AutoIncrementFactory, { inc_field: "departmentId" });

export default mongoose.model("departments", departmentSchema);
