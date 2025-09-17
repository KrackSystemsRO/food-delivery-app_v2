import mongoose from "mongoose";

export const getQueryById = (id: string, key: string) => {
  let query = {};
  if (typeof id === "string" && mongoose.Types.ObjectId.isValid(id)) {
    query = { _id: new mongoose.Types.ObjectId(id) };
  } else if (
    typeof id === "number" ||
    (!isNaN(Number(id)) && Number.isInteger(Number(id)))
  ) {
    query = { [key]: Number(id) };
  } else {
    throw new Error("Invalid id format");
  }
  return query;
};
