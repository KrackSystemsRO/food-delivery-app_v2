import mongoose from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";
const AutoIncrementFactory = require("mongoose-sequence")(mongoose);

const ingredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    allergens: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "allergen",
        autopopulate: true,
      },
    ],
    nutritionalInfo: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
      fiber: { type: Number, default: 0 },
      sugar: { type: Number, default: 0 },
    },
    unit: {
      type: String,
      enum: ["piece", "gram", "liter"],
      required: true,
    },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ingredientSchema.plugin(mongooseAutoPopulate);
ingredientSchema.plugin(AutoIncrementFactory, { inc_field: "ingredientId" });

export default mongoose.model("ingredient", ingredientSchema);
