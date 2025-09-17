import mongoose from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";

const AutoIncrementFactory = require("mongoose-sequence")(mongoose);

const recipeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    ingredients: [
      {
        ingredient: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ingredient",
          required: true,
          autopopulate: true,
        },
        quantity: String,
      },
    ],
    steps: [String],
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

recipeSchema.plugin(mongooseAutoPopulate);
recipeSchema.plugin(AutoIncrementFactory, { inc_field: "recipeId" });

export default mongoose.model("recipe", recipeSchema);
