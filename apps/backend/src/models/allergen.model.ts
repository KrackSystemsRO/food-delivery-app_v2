import mongoose from "mongoose";

const AutoIncrementFactory = require("mongoose-sequence")(mongoose);

const allergenSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

allergenSchema.plugin(AutoIncrementFactory, { inc_field: "allergenId" });

export default mongoose.model("allergen", allergenSchema);
