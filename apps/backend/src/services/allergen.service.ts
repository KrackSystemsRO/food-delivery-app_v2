// services/allergenService.ts
import allergenModel from "@/models/allergen.model";
import { getQueryById } from "@/utils/getQueryById";
import { checkPermissionOrThrow } from "@/utils/permissions.helpers";

interface CreateAllergenParams {
  name: string;
  description?: string;
  isActive?: boolean;
  role: string;
}

interface UpdateAllergenParams {
  id: string;
  updateData: Partial<{
    name: string;
    description: string;
    is_active: boolean;
  }>;
  role: string;
}

interface ListAllergensParams {
  role: string;
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}

export async function createAllergen(params: CreateAllergenParams) {
  const { name, description, isActive, role } = params;
  checkPermissionOrThrow(role, "create", "allergens");

  const existing = await allergenModel.findOne({ name });
  if (existing) throw new Error("Allergen already exists");

  const newAllergen = new allergenModel({
    name,
    description,
    is_active: isActive,
  });
  await newAllergen.save();

  return newAllergen.toObject();
}

export async function readAllergen(id: string, role: string) {
  checkPermissionOrThrow(role, "read", "allergens");

  const allergen = await allergenModel
    .find(getQueryById(id, "allergenId"))
    .lean();
  if (!allergen) throw new Error("Allergen not found");

  return allergen;
}

export async function updateAllergen(params: UpdateAllergenParams) {
  const { id, updateData, role } = params;
  checkPermissionOrThrow(role, "update", "allergens");

  const updated = await allergenModel
    .findOneAndUpdate(getQueryById(id, "allergenId"), updateData, {
      new: true,
      runValidators: true,
    })
    .lean();

  if (!updated) throw new Error("Allergen not found");

  return updated;
}

export async function deleteAllergen(id: string, role: string) {
  checkPermissionOrThrow(role, "delete", "allergens");

  const deleted = await allergenModel
    .findOneAndDelete(getQueryById(id, "allergenId"))
    .lean();
  if (!deleted) throw new Error("Allergen not found");

  return deleted;
}

export async function listAllergens(params: ListAllergensParams) {
  const {
    role,
    search = "",
    isActive,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc",
  } = params;
  checkPermissionOrThrow(role, "read", "allergens");

  const skip = (page - 1) * limit;
  const sortOrder = order === "asc" ? 1 : -1;

  const filter: Record<string, any> = {};
  if (search) filter.name = { $regex: search, $options: "i" };
  if (typeof isActive === "boolean") filter.is_active = isActive;

  const [allergens, totalCount] = await Promise.all([
    allergenModel
      .find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec(),
    allergenModel.countDocuments(filter),
  ]);

  return {
    result: allergens,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
  };
}
