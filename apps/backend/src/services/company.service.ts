import companyModel from "@/models/company.model";
import { checkPermissionOrThrow } from "@/utils/permissions.helpers";
import { CompanyFilter } from "@/interfaces/company.interface";
import mongoose from "mongoose";
import { getQueryById } from "@/utils/getQueryById";

interface CreateCompanyParams {
  admin?: string;
  name: string;
  email: string;
  phone_number: string;
  is_active: boolean;
  address: string;
  type: "PROVIDER" | "CLIENT";
}

interface ListCompaniesParams {
  role: string;
  userCompanyIds?: string[];
  search?: string;
  type?: string;
  is_active?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}

export async function createCompany(params: CreateCompanyParams, role: string) {
  const { admin, name, email, phone_number, is_active, address, type } = params;

  checkPermissionOrThrow(role, "create", "companies");

  const newCompany = new companyModel({
    admin,
    name,
    email,
    phone_number,
    is_active,
    address,
    type,
  });

  await newCompany.save();
  const result = await newCompany.populate({
    path: "admin",
    select: "first_name last_name email",
    options: { lean: true },
  });
  return result.toObject();
}

export async function readCompany(id: string, role: string) {
  checkPermissionOrThrow(role, "read", "companies");

  const company = await companyModel
    .find(getQueryById(id, "companyId"))
    .populate({ path: "admin", select: "first_name last_name email" })
    .lean();

  if (!company) throw new Error("Company not found");
  return company;
}

export async function updateCompany(id: string, updateData: any, role: string) {
  checkPermissionOrThrow(role, "update", "companies");

  const updated = await companyModel
    .findOneAndUpdate(getQueryById(id, "companyId"), updateData, {
      new: true,
      runValidators: true,
    })
    .populate({
      path: "admin",
      select: "first_name last_name email",
      options: { strictPopulate: false },
    })
    .lean();

  if (!updated) throw new Error("Company not found");
  return updated;
}

export async function deleteCompany(id: string, role: string) {
  checkPermissionOrThrow(role, "delete", "companies");

  const deleted = await companyModel
    .findOneAndDelete(getQueryById(id, "companyId"))
    .lean();
  if (!deleted) throw new Error("Company not found");
  return deleted;
}

export async function listCompanies(
  params: ListCompaniesParams,
  roleUserAuthenticated: string
) {
  const {
    role,
    userCompanyIds,
    search = "",
    type,
    is_active,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc",
  } = params;
  checkPermissionOrThrow(roleUserAuthenticated, "read", "companies");

  const skip = (page - 1) * limit;
  const sortOrder = order === "asc" ? 1 : -1;

  const filter: CompanyFilter = {};

  if (role === "MANAGER_RESTAURANT" && userCompanyIds) {
    filter._id = {
      $in: userCompanyIds.map((id) =>
        typeof id === "string" ? new mongoose.Types.ObjectId(id) : id
      ) as mongoose.Types.ObjectId[],
    };
  }

  if (search) filter.name = { $regex: search, $options: "i" };
  if (is_active !== undefined) filter.is_active = is_active;
  if (type) filter.type = type;

  const [companies, totalCount] = await Promise.all([
    companyModel
      .find(filter)
      .populate({ path: "admin", select: "first_name last_name email" })
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean(),
    companyModel.countDocuments(filter),
  ]);

  return {
    result: companies,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
  };
}
