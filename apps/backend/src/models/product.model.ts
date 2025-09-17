import mongoose from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";
const AutoIncrementFactory = require("mongoose-sequence")(mongoose);

const energeticValuesSchema = new mongoose.Schema(
  {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 },
    sugar: { type: Number, default: 0 },
  },
  { _id: false }
);

const variantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    unit: { type: String },
    stock_quantity: { type: Number, default: 0 },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    store: {
      type: mongoose.Types.ObjectId,
      ref: "store",
      required: true,
      autopopulate: { maxDepth: 1 },
    },
    product_type: {
      type: String,
      enum: ["prepared_food", "grocery"],
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String },
    brand: { type: String },
    unit: { type: String },
    weight: {
      type: Number,
      required: false,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      set: (v: number) => Number(v.toFixed(2)),
    },
    image: { type: String },
    available: { type: Boolean, default: true },
    is_active: { type: Boolean, default: true },
    category: [
      {
        type: mongoose.Types.ObjectId,
        ref: "category",
        autopopulate: true,
        required: false,
      },
    ],
    recipe: {
      type: mongoose.Types.ObjectId,
      ref: "recipe",
      autopopulate: true,
    },
    energetic_values: energeticValuesSchema,
    variants: [variantSchema],
  },
  { timestamps: true }
);

productSchema.plugin(mongooseAutoPopulate);
productSchema.plugin(AutoIncrementFactory, { inc_field: "productId" });

export default mongoose.model("product", productSchema);
