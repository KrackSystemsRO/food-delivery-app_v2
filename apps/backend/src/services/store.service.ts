// models
import mongoose from "mongoose";
import storeModel from "@/models/store.model";
import { getQueryById } from "@/utils/getQueryById";
import { checkPermissionOrThrow } from "@/utils/permissions.helpers";
import { Types as MongooseTypes } from "mongoose";
import { Types } from "@my-monorepo/shared";
import { StoreListQuery, StoreInput } from "@/interfaces/store.interface";

const validStoreTypes = ["RESTAURANT", "GROCERY", "BAKERY", "CAFE", "OTHER"];

export async function createStore(
  data: StoreInput,
  adminId: string | MongooseTypes.ObjectId,
  role: string
) {
  checkPermissionOrThrow(role, "create", "stores");
  if (!validStoreTypes.includes(data.type)) {
    throw new Error("Invalid or missing store type");
  }

  const newStore = new storeModel({
    ...data,
    admin: data.admin || adminId,
    is_active: data.is_active ?? true,
    is_open: data.is_open ?? true,
  });

  await newStore.save();

  await newStore.populate([
    {
      path: "admin",
      select: "first_name last_name email",
      options: { lean: true },
      populate: { path: "company", select: "name", options: { lean: true } },
    },
    {
      path: "company",
      select: "name type",
      options: { lean: true },
      populate: { path: "admin", select: "first_name last_name email" },
    },
  ]);

  return newStore.toObject();
}

export async function getStore(id: string, role: string) {
  checkPermissionOrThrow(role, "read", "stores");
  return storeModel
    .findOne(getQueryById(id, "storeId"))
    .populate({ path: "company", select: "name type" })
    .populate({ path: "admin", select: "first_name last_name email" })
    .lean()
    .exec();
}

export async function listStores(
  params: StoreListQuery,
  user: Types.User.UserType
) {
  checkPermissionOrThrow(user.role, "read", "stores");

  const {
    search = "",
    type,
    page = 1,
    limit = 10,
    sort_by = "createdAt",
    order = "asc",
    is_active,
    is_open,
    company,
  } = params;

  const skip = (page - 1) * limit;
  const sortOrder = order === "asc" ? 1 : -1;

  const filter: Record<string, any> = {};

  if (search) filter.name = { $regex: `.*${search}.*`, $options: "i" };
  if (type) filter.type = type;
  if (is_active) filter.is_active = is_active;
  if (is_open) filter.is_open = is_open;

  if (user.role === "MANAGER") {
    filter.admin = user._id;
  } else if (company) {
    filter.company =
      typeof company === "string"
        ? new mongoose.Types.ObjectId(company)
        : company;
  }

  const [stores, totalCount] = await Promise.all([
    storeModel
      .find(filter)
      .populate({ path: "company", select: "name type" })
      .populate({ path: "admin", select: "first_name last_name email" })
      .sort({ [sort_by]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec(),
    storeModel.countDocuments(filter),
  ]);

  return {
    result: stores,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
  };
}

export async function updateStore(
  id: string,
  data: Partial<StoreInput>,
  role: string
) {
  checkPermissionOrThrow(role, "update", "stores");
  return storeModel
    .findOneAndUpdate(getQueryById(id, "storeId"), data, {
      new: true,
      runValidators: true,
    })
    .populate([
      {
        path: "admin",
        select: "first_name last_name email",
        options: { lean: true },
        populate: { path: "company", select: "name", options: { lean: true } },
      },
      {
        path: "company",
        select: "name type",
        options: { lean: true },
        populate: { path: "admin", select: "first_name last_name email" },
      },
    ])
    .lean()
    .exec();
}

export async function deleteStore(id: string, role: string) {
  checkPermissionOrThrow(role, "delete", "stores");

  const deleted = await storeModel
    .findOneAndDelete(getQueryById(id, "storeId"))
    .lean();
  if (!deleted) throw new Error("Store not found");

  return deleted;
}
