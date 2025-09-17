import mongoose from "mongoose";
import receipesModel from "@/models/receipe.model";
import { checkPermissionOrThrow } from "@/utils/permissions.helpers";
import { getQueryById } from "@/utils/getQueryById";

interface IngredientInput {
  ingredient: string;
  quantity?: string;
}

interface ReceipesInput {
  name: string;
  description?: string;
  ingredients?: IngredientInput[];
  is_active?: boolean;
}

export async function createReceipes(data: ReceipesInput, role: string) {
  checkPermissionOrThrow(role, "create", "receipes");

  const { name, description, ingredients = [], is_active = true } = data;

  if (!name) {
    throw new Error("Name is required");
  }

  const existing = await receipesModel.findOne({ name });
  if (existing) {
    throw new Error("Receipes already exists");
  }

  for (const item of ingredients) {
    if (!mongoose.Types.ObjectId.isValid(item.ingredient)) {
      throw new Error(`Invalid ingredient id: ${item.ingredient}`);
    }
  }

  const newReceipes = new receipesModel({
    name,
    description,
    ingredients,
    is_active,
  });

  await newReceipes.save();
  await newReceipes.populate({ path: "ingredients.ingredient" });

  return newReceipes.toObject();
}

export async function getReceipes(id: string, role: string) {
  checkPermissionOrThrow(role, "read", "receipes");

  const receipes = await receipesModel
    .findOne(getQueryById(id, "receipesId"))
    .populate({
      path: "ingredients.ingredient",
      populate: { path: "allergens" },
    })
    .lean()
    .exec();

  if (!receipes) throw new Error("Receipes not found");
  return receipes;
}

// List receipes
export async function listReceipes(
  params: {
    search?: string;
    page?: number;
    limit?: number;
    sort_by?: string;
    order?: "asc" | "desc";
    is_active?: boolean;
  },
  role: string
) {
  checkPermissionOrThrow(role, "read", "receipes");

  const {
    search = "",
    page = 1,
    limit = 10,
    sort_by = "createdAt",
    order = "asc",
    is_active,
  } = params;

  const skip = (page - 1) * limit;
  const sortOrder = order === "asc" ? 1 : -1;

  const filter: Record<string, any> = {};
  if (search) filter.name = { $regex: search, $options: "i" };
  if (typeof is_active === "boolean") filter.is_active = is_active;

  const [receipes, totalCount] = await Promise.all([
    receipesModel
      .find(filter)
      .sort({ [sort_by]: sortOrder })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "ingredients.ingredient",
        populate: { path: "allergens" },
      })
      .lean()
      .exec(),
    receipesModel.countDocuments(filter),
  ]);

  return {
    result: receipes,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
  };
}

// Update receipes
export async function updateReceipes(
  id: string,
  data: Partial<ReceipesInput>,
  role: string
) {
  checkPermissionOrThrow(role, "update", "receipes");

  if (data.ingredients) {
    for (const item of data.ingredients) {
      if (!mongoose.Types.ObjectId.isValid(item.ingredient)) {
        throw new Error(`Invalid ingredient id: ${item.ingredient}`);
      }
    }
  }

  const updated = await receipesModel
    .findOneAndUpdate(getQueryById(id, "receipesId"), data, {
      new: true,
      runValidators: true,
    })
    .populate({
      path: "ingredients.ingredient",
      populate: { path: "allergens" },
    })
    .lean()
    .exec();

  if (!updated) throw new Error("Receipes not found");
  return updated;
}

// Delete receipes
export async function deleteReceipes(id: string, role: string) {
  checkPermissionOrThrow(role, "delete", "receipes");

  const deleted = await receipesModel
    .findOneAndDelete(getQueryById(id, "receipesId"))
    .lean();

  if (!deleted) throw new Error("Receipes not found");
  return deleted;
}
