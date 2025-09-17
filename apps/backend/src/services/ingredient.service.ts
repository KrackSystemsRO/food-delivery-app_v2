import mongoose from "mongoose";
import ingredientModel from "@/models/ingredient.model";
import { getQueryById } from "@/utils/getQueryById";
import { checkPermissionOrThrow } from "@/utils/permissions.helpers";

interface NutritionalInfo {
  calories?: number;
  protein?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
}

export async function createIngredient(data: {
  name: string;
  description?: string;
  allergens?: string[];
  nutritionalInfo?: NutritionalInfo;
  unit: string;
  is_active?: boolean;
}) {
  const {
    name,
    description,
    allergens = [],
    nutritionalInfo = {},
    unit,
    is_active = true,
  } = data;

  // Validate allergens IDs
  const validAllergens = allergens.filter((id) =>
    mongoose.Types.ObjectId.isValid(id)
  );

  const ingredient = new ingredientModel({
    name,
    description,
    allergens: validAllergens,
    nutritionalInfo,
    unit,
    is_active,
  });

  await ingredient.save();

  return ingredient.populate("allergens").then((d) => d.toObject());
}

export async function getIngredient(id: string, role: string) {
  checkPermissionOrThrow(role, "read", "ingredients");
  return ingredientModel
    .findOne(getQueryById(id, "ingredientId"))
    .populate("allergens")
    .lean()
    .exec();
}

export async function listIngredients(
  params: {
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string; // ✅ use camelCase like in categories
    order?: "asc" | "desc";
    is_active?: boolean;
  },
  role: string
) {
  checkPermissionOrThrow(role, "read", "ingredients");

  const {
    search = "",
    page = 1,
    limit = 10,
    sortBy = "createdAt", // ✅ renamed for consistency
    order = "asc",
    is_active,
  } = params;

  const skip = (page - 1) * limit;
  const sortOrder = order === "asc" ? 1 : -1;

  const filter: Record<string, any> = {};
  if (search) filter.name = { $regex: search, $options: "i" };
  if (is_active !== undefined) filter.is_active = is_active;

  // ✅ whitelist allowed sort fields (avoid injection / errors)
  const allowedSortFields = ["createdAt", "name", "updatedAt"];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

  const [ingredients, totalCount] = await Promise.all([
    ingredientModel
      .find(filter)
      .populate("allergens")
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec(),
    ingredientModel.countDocuments(filter),
  ]);

  return {
    result: ingredients,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
  };
}

export async function updateIngredient(
  id: string,
  role: string,
  data: Partial<{
    name: string;
    description: string;
    allergens: string[];
    nutritionalInfo: NutritionalInfo;
    unit: string;
    is_active: boolean;
  }>
) {
  checkPermissionOrThrow(role, "update", "ingredients");

  if (data.allergens) {
    data.allergens = data.allergens.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );
  }

  return ingredientModel
    .findOneAndUpdate(getQueryById(id, "ingredientId"), data, {
      new: true,
      runValidators: true,
    })
    .populate("allergens")
    .lean()
    .exec();
}

export async function deleteIngredient(id: string, role: string) {
  checkPermissionOrThrow(role, "delete", "ingredients");

  const deleted = await ingredientModel
    .findOneAndDelete(getQueryById(id, "ingredientId"))
    .lean();
  if (!deleted) throw new Error("Ingredient not found");

  return deleted;
}

export async function checkIngredientExists(name: string) {
  const ingredient = await ingredientModel.findOne({
    name: { $regex: new RegExp(`^${name}$`, "i") },
  });
  return ingredient ? { exists: true, ingredient } : { exists: false };
}
