// utils
import { log } from "@/utils/log";
// models
import recipeModel from "@/models/receipe.model";
import ingredientModel from "@/models/ingredient.model";
// JSON data for feed
import recipeData from "./recipe.seed.json";

export async function insertRecipe() {
  let checked = true;
  try {
    for (const recipe of recipeData) {
      try {
        const existingRecipe = await recipeModel.findOne({ name: recipe.name });
        if (existingRecipe) continue;

        const ingredientsWithIds = await Promise.all(
          recipe.ingredients.map(async (ingr) => {
            const ingredientDoc = await ingredientModel.findOne({
              name: ingr.ingredientName,
            });
            if (!ingredientDoc) {
              log(`Ingredient not found: ${ingr.ingredientName}`, true);
              throw new Error(`Ingredient not found: ${ingr.ingredientName}`);
            }
            return {
              ingredient: ingredientDoc._id,
              quantity: ingr.quantity,
            };
          })
        );

        const newRecipe = await recipeModel.create({
          name: recipe.name,
          description: recipe.description,
          ingredients: ingredientsWithIds,
          steps: recipe.steps,
          is_active: recipe.is_active ?? true,
        });

        log(`Inserted new recipe: ${JSON.stringify(newRecipe)}`);
        checked = false;
      } catch (error) {
        log(`Failed to insert recipe "${recipe.name}": ${error.message}`, true);
      }
    }
    if (checked)
      log(`I checked if the recipe exists in the database. Result: TRUE`);
  } catch (err) {
    log(err, true);
  }
}
