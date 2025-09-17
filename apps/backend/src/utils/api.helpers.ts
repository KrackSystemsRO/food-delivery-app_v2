import mongoose from "mongoose";

export const isObjectId = (value: any): boolean => {
  return mongoose.Types.ObjectId.isValid(value);
};

export const toObjectId = (id: any): mongoose.Types.ObjectId | null => {
  if (typeof id === "string" && mongoose.Types.ObjectId.isValid(id)) {
    return new mongoose.Types.ObjectId(id);
  }
  return null;
};

export const safeObjectId = (id: any): mongoose.Types.ObjectId | null => {
  if (!id) return null;
  if (typeof id === "string" && mongoose.Types.ObjectId.isValid(id)) {
    return new mongoose.Types.ObjectId(id);
  }
  return null;
};

export const isNumber = (value: any): boolean => {
  return typeof value === "number" || /^\d+$/.test(value);
};

export function buildQueryById(id: string | number) {
  if (typeof id === "string" && mongoose.Types.ObjectId.isValid(id)) {
    return { _id: new mongoose.Types.ObjectId(id) };
  } else if (
    typeof id === "number" ||
    (!isNaN(Number(id)) && Number.isInteger(Number(id)))
  ) {
    return { departmentId: Number(id) };
  } else {
    throw new Error("Invalid id format");
  }
}
