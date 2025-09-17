// utils
import { log } from "@/utils/log";
// models
import categoryModel from "@/models/category.model";
// JSON data for feed
import categoryData from "./category.seed.json";

export async function insertCategory() {
  let checked = true;
  try {
    for (const category of categoryData) {
      if (!(await categoryModel.findOne({ name: category.name }))) {
        const newCategory = await categoryModel.create(category);

        log(`Inserted new category: ${JSON.stringify(newCategory)}`);
        checked = false;
      }
    }
    if (checked)
      log(`I checked if the category exist in the database. Result: TRUE`);
  } catch (err) {
    log(err, true);
  }
}
