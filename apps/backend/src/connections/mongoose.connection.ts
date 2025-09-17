// libs
import mongoose from "mongoose";
import { config } from "dotenv";
// utils
import { log } from "@/utils/log";
// generators

import { insertUsers } from "@/seeds/user/user.generator";
import { insertCategory } from "@/seeds/category/category.generator";
import { insertAllergen } from "@/seeds/allergen/allergen.generator";
import { insertIngredient } from "@/seeds/ingredient/ingredient.generator";
import { insertRecipe } from "@/seeds/recipe/recipe.generator";
import { insertProduct } from "@/seeds/product/product.generator";

config();

export default function mongooseConnection(isMain = true) {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(process.env.DB_URL, {
      autoIndex: true,
    })
    .then(async () => {
      log(`Connected to MongoDB: %s \n ${process.env.DB_URL}`);
      if (isMain) {
        try {
          await insertUsers();
          await insertCategory();
          await insertAllergen();
          await insertIngredient();
          await insertRecipe();
          // await insertProduct();
        } catch (err) {
          log(`Error during insertion: ${err.message}`);
        }
      }
    })
    .catch((err: Error) => {
      log(`MongoDB connection error: %s \n ${err}`);
    });
}
