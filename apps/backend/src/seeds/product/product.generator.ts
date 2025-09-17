// utils
import { log } from "@/utils/log";
// models
import restaurantModel from "@/models/store.model";
// JSON data for feed
import productData from "./product.seed.json";
import productModel from "@/models/product.model";
import categoryModel from "@/models/category.model";
import recipeModel from "@/models/receipe.model";

export async function insertProduct() {
  let checked = true;
  try {
    for (const product of productData) {
      if (!(await productModel.findOne({ name: product.name }))) {
        const restaurantDoc = await restaurantModel.findOne({
          name: product.restaurant,
        });
        const categoryDoc = await categoryModel.findOne({
          name: product.category,
        });
        const recipeDoc = await recipeModel.findOne({ name: product.recipe }); // find recipe by name

        if (!restaurantDoc) {
          log(`Restaurant not found for product: ${product.name}`, true);
          continue;
        }
        if (!categoryDoc) {
          log(`Category not found for product: ${product.name}`, true);
          continue;
        }
        if (!recipeDoc) {
          log(`Recipe not found for product: ${product.name}`, true);
          continue;
        }

        await productModel.create({
          ...product,
          restaurant: restaurantDoc._id,
          category: categoryDoc._id,
          recipe: recipeDoc._id,
        });

        log(`Inserted new product: ${JSON.stringify(product)}`);
      }
    }
    if (checked) log(`Checked all products; all already exist in DB.`);
  } catch (err) {
    log(err, true);
  }
}
