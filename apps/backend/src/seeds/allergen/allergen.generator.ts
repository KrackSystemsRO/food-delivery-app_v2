// utils
import { log } from "@/utils/log";
// models
import allergenModel from "@/models/allergen.model";
// JSON data for feed
import allergenData from "./allergen.seed.json";

export async function insertAllergen() {
  let checked = true;
  try {
    for (const allergen of allergenData) {
      if (!(await allergenModel.findOne({ name: allergen.name }))) {
        const newAllergen = await allergenModel.create(allergen);

        log(`Inserted new allergen: ${JSON.stringify(newAllergen)}`);
        checked = false;
      }
    }
    if (checked)
      log(`I checked if the allergen exist in the database. Result: TRUE`);
  } catch (err) {
    log(err, true);
  }
}
