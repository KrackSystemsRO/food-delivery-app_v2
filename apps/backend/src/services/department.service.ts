import mongoose from "mongoose";
import departmentModel from "@/models/department.model";
import { checkPermissionOrThrow } from "@/utils/permissions.helpers";
import { getQueryById } from "@/utils/getQueryById";
import { Types } from "@my-monorepo/shared";

export interface ListDepartmentsParams {
  role: string;
  userCompanyIds?: string[];
  search?: string;
  is_active?: boolean;
  type?: string;
  company?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}

export async function listDepartments(params: ListDepartmentsParams) {
  const {
    role,
    userCompanyIds,
    search = "",
    is_active,
    type,
    company,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc",
  } = params;

  checkPermissionOrThrow(role, "read", "departments");

  const skip = (page - 1) * limit;
  const sortOrder = order === "asc" ? 1 : -1;

  const filter: any = {};

  // Limit to user companies if role requires
  if ((role === "MANAGER_RESTAURANT" || role === "COURIER") && userCompanyIds) {
    filter.company = {
      $in: userCompanyIds.map((id) => new mongoose.Types.ObjectId(id)),
    };
  }

  if (search) filter.name = { $regex: search, $options: "i" };
  if (is_active !== undefined) filter.is_active = is_active;
  if (type) filter.type = type;
  if (company && mongoose.Types.ObjectId.isValid(company))
    filter.company = company;

  const [departments, totalCount] = await Promise.all([
    departmentModel
      .find(filter)
      .populate({ path: "admin", select: "first_name last_name email" })
      .populate({
        path: "company",
        populate: { path: "admin", select: "first_name last_name email" },
      })
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec(),
    departmentModel.countDocuments(filter),
  ]);

  return {
    result: departments,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
  };
}

export async function readDepartment(id: string, role: string) {
  checkPermissionOrThrow(role, "read", "departments");

  const department = await departmentModel
    .find(getQueryById(id, "departmentId"))
    .populate({ path: "admin", select: "first_name last_name email" })
    .populate({
      path: "company",
      populate: { path: "admin", select: "first_name last_name email" },
    })
    .lean();

  if (!department) throw new Error("Department not found");
  return department;
}

export async function createDepartment(
  data: { company: string; admin?: string; name: string; is_active: boolean },
  role: string
) {
  checkPermissionOrThrow(role, "create", "departments");

  const department = new departmentModel({
    company: data.company,
    admin: data.admin,
    name: data.name,
    is_active: data.is_active,
  });

  await department.save();
  await department.populate({
    path: "admin",
    select: "first_name last_name email",
  });

  await department.populate({
    path: "company",
    populate: { path: "admin", select: "first_name last_name email" },
  });

  return department.toObject();
}

export async function updateDepartment(
  id: string,
  updateData: Partial<Types.Department.DepartmentType>,
  role: string
) {
  checkPermissionOrThrow(role, "update", "departments");

  const updated = await departmentModel
    .findOneAndUpdate(getQueryById(id, "departmentId"), updateData, {
      new: true,
      runValidators: true,
    })
    .populate({ path: "admin", select: "first_name last_name email" })
    .populate({
      path: "company",
      populate: { path: "admin", select: "first_name last_name email" },
    })
    .lean();

  if (!updated) throw new Error("Department not found");
  return updated;
}

export async function deleteDepartment(id: string, role: string) {
  checkPermissionOrThrow(role, "delete", "departments");

  const deleted = await departmentModel.findOneAndDelete(
    getQueryById(id, "departmentId")
  );
  if (!deleted) throw new Error("Department not found");
}
