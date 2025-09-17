import mongoose from "mongoose";

const AutoIncrementFactory = require("mongoose-sequence")(mongoose);

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    is_active: { type: Boolean },
  },
  { timestamps: true }
);

categorySchema.plugin(AutoIncrementFactory, { inc_field: "categoryId" });

export default mongoose.model("category", categorySchema);
