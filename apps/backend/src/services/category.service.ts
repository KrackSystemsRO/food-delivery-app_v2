import categoryModel from "@/models/category.model";
import { getQueryById } from "@/utils/getQueryById";
import { checkPermissionOrThrow } from "@/utils/permissions.helpers";

interface CreateCategoryParams {
  name: string;
  description?: string;
  role: string;
}

interface UpdateCategoryParams {
  id: string;
  updateData: Partial<{ name: string; description: string }>;
  role: string;
}

interface ListCategoriesParams {
  is_active?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}

export async function createCategory(params: CreateCategoryParams) {
  const { name, description, role } = params;
  checkPermissionOrThrow(role, "create", "categories");

  const existing = await categoryModel.findOne({ name });
  if (existing) throw new Error("Category already exists");

  const newCategory = new categoryModel({ name, description });
  await newCategory.save();

  return newCategory.toObject();
}

export async function readCategory(id: string, role: string) {
  checkPermissionOrThrow(role, "read", "categories");

  const category = await categoryModel
    .find(getQueryById(id, "categoryId"))
    .lean();
  if (!category) throw new Error("Category not found");

  return category;
}

export async function updateCategory(params: UpdateCategoryParams) {
  const { id, updateData, role } = params;
  checkPermissionOrThrow(role, "update", "categories");

  const updated = await categoryModel
    .findOneAndUpdate(getQueryById(id, "categoryId"), updateData, {
      new: true,
      runValidators: true,
    })
    .lean();

  if (!updated) throw new Error("Category not found");

  return updated;
}

export async function deleteCategory(id: string, role: string) {
  checkPermissionOrThrow(role, "delete", "categories");

  const deleted = await categoryModel
    .findOneAndDelete(getQueryById(id, "categoryId"))
    .lean();
  if (!deleted) throw new Error("Category not found");

  return deleted;
}

export async function listCategories(
  params: ListCategoriesParams,
  role: string
) {
  const {
    is_active,
    search = "",
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "asc",
  } = params;
  checkPermissionOrThrow(role, "read", "categories");

  const skip = (page - 1) * limit;
  const sortOrder = order === "asc" ? 1 : -1;

  const filter: Record<string, any> = {};
  if (search) filter.name = { $regex: search, $options: "i" };
  if (is_active !== undefined) filter.is_active = is_active;

  const [categories, totalCount] = await Promise.all([
    categoryModel
      .find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec(),
    categoryModel.countDocuments(filter),
  ]);

  return {
    result: categories,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
  };
}
