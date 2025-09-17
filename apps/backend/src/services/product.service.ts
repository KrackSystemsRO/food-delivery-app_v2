import mongoose from "mongoose";
import productModel from "@/models/product.model";
import storeModel from "@/models/store.model";
import recipeModel from "@/models/receipe.model";
import { getQueryById } from "@/utils/getQueryById";
import { checkPermissionOrThrow } from "@/utils/permissions.helpers";
import { safeObjectId, toObjectId } from "@/utils/api.helpers";

interface EnergeticValues {
  calories?: number;
  protein?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
}

interface Variant {
  name: string;
  price: number;
  unit?: string;
  stock_quantity?: number;
}

export interface CreateProductData {
  store: string;
  product_type: "prepared_food" | "grocery";
  name: string;
  description?: string;
  price: number;
  image?: string;
  available?: boolean;
  category?: string;
  recipe?: string;
  brand?: string;
  unit?: string;
  barcode?: string;
  stock_quantity?: number;
  energetic_values?: EnergeticValues;
  variants?: Variant[];
}

export async function createProduct(data: CreateProductData, role: string) {
  checkPermissionOrThrow(role, "create", "products");
  const { store, product_type, recipe } = data;
  // Validate store
  const storeExists = await storeModel.findById(store);
  if (!storeExists) throw new Error("Store not found");

  // Validate recipe if prepared_food
  if (product_type === "prepared_food" && recipe) {
    const recipeExists = await recipeModel.findById(recipe);
    if (!recipeExists) throw new Error("Recipe not found");
  }

  const product = new productModel({
    ...data,
    recipe: product_type === "prepared_food" ? recipe : undefined,
    brand: product_type === "grocery" ? data.brand : undefined,
    available: data.available ?? true,
  });

  await product.save();

  return product
    .populate([
      { path: "store", select: "name type" },
      { path: "category", select: "name description" },
      {
        path: "recipe",
        populate: [
          {
            path: "ingredients.ingredient",
            select: "name description nutritionalInfo is_active",
          },
          { path: "allergens", select: "name description" },
        ],
      },
    ])
    .then((d) => d.toObject());
}

export async function getProduct(id: string, role: string) {
  checkPermissionOrThrow(role, "read", "products");

  return productModel
    .findOne(getQueryById(id, "productId"))
    .populate([
      { path: "store", select: "name type is_open is_active" },
      { path: "category", select: "name description" },
      {
        path: "recipe",
        populate: [
          {
            path: "ingredients.ingredient",
            select: "name description nutritionalInfo is_active",
          },
          { path: "allergens", select: "name description" },
        ],
      },
    ])
    .lean()
    .exec();
}

interface ListProductsParams {
  _id?: string;
  store?: string;
  product_type?: string;
  name?: string;
  price?: number;
  available?: boolean | string;
  category?: string;
  brand?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  order?: "asc" | "desc";
}

export async function listProducts(
  query: ListProductsParams,
  userRole: string
) {
  checkPermissionOrThrow(userRole, "read", "products");

  const {
    _id,
    store,
    product_type,
    name,
    price,
    available,
    category,
    brand,
    page = 1,
    limit = 10,
    sort_by = "createdAt",
    order = "asc",
  } = query;

  const pageNumber = Math.max(Number(page), 1);
  const limitNumber = Math.max(Number(limit), 1);
  const skip = (pageNumber - 1) * limitNumber;
  const sortOrder = order === "asc" ? 1 : -1;

  const filter: any = {};

  // Safe _id filter
  if (_id) {
    const idObj = safeObjectId(_id);
    if (!idObj) throw new Error("Invalid product ID");
    filter._id = idObj;
  }

  // Name filter
  if (name) filter.name = { $regex: name, $options: "i" };

  // Safe store filter from query
  if (store) {
    const storeId = typeof store === "string" ? store : store._id;
    const objId = safeObjectId(storeId);
    if (!objId) throw new Error("Invalid store ID");
    filter.store = objId;
  }

  // Product type, price, brand, category, available
  if (product_type) filter.product_type = product_type;
  if (price !== undefined) filter.price = price;
  if (brand) filter.brand = { $regex: brand, $options: "i" };
  if (available !== undefined)
    filter.available = available === "true" || available === true;
  if (category) filter.category = category;

  // Role-based store filtering
  // if ([ "MANAGER"].includes(userRole)) {
  //   const ids = userCompany
  //     .map(safeObjectId)
  //     .filter((id): id is mongoose.Types.ObjectId => !!id);
  //   if (ids.length === 0) throw new Error("No valid store IDs for your role");
  //   filter.store = { $in: ids };
  // }

  // Fetch products with pagination and population
  const [products, totalCount] = await Promise.all([
    productModel
      .find(filter)
      .populate([
        { path: "store", select: "name type is_open is_active" },
        { path: "category", select: "name description" },
        {
          path: "recipe",
          populate: [
            {
              path: "ingredients.ingredient",
              select: "name description nutritionalInfo is_active",
            },
            { path: "allergens", select: "name description" },
          ],
        },
      ])
      .sort({ [sort_by]: sortOrder })
      .skip(skip)
      .limit(limitNumber)
      .lean()
      .exec(),
    productModel.countDocuments(filter),
  ]);

  return {
    result: products,
    totalCount,
    totalPages: Math.ceil(totalCount / limitNumber),
    currentPage: pageNumber,
  };
}

export async function updateProduct(
  id: string,
  data: Partial<CreateProductData>,
  role: string
) {
  checkPermissionOrThrow(role, "update", "products");

  return productModel
    .findOneAndUpdate(getQueryById(id, "productId"), data, {
      new: true,
      runValidators: true,
    })
    .populate([
      { path: "store", select: "name type is_open is_active" },
      { path: "category", select: "name description" },
      {
        path: "recipe",
        populate: [
          {
            path: "ingredients.ingredient",
            select: "name description nutritionalInfo is_active",
          },
          { path: "allergens", select: "name description" },
        ],
      },
    ])
    .lean()
    .exec();
}

export async function deleteProduct(id: string, role: string) {
  checkPermissionOrThrow(role, "delete", "products");

  const deleted = await productModel
    .findOneAndDelete(getQueryById(id, "productId"))
    .lean();
  if (!deleted) throw new Error("Product not found");

  return deleted;
}
