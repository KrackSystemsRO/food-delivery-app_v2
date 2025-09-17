// utils
import { log } from "@/utils/log";
// models
import ingredientModel from "@/models/ingredient.model";
// JSON data for feed
import ingredientData from "./ingredient.seed.json";
import allergenModel from "@/models/allergen.model";

export async function insertIngredient() {
  let checked = true;
  try {
    for (const ingredient of ingredientData) {
      if (!(await ingredientModel.findOne({ name: ingredient.name }))) {
        const allergensSelect = await allergenModel
          .find({
            name: { $in: ingredient.allergens },
          })
          .select("_id")
          .lean();

        const allergens = allergensSelect.map((a) => a._id.toString());

        const newIngredient = await ingredientModel.create({
          ...ingredient,
          allergens: allergens,
        });

        log(`Inserted new ingredient: ${JSON.stringify(newIngredient)}`);
        checked = false;
      }
    }
    if (checked)
      log(`I checked if the ingredient exist in the database. Result: TRUE`);
  } catch (err) {
    log(err, true);
  }
}
