import mongoose from "mongoose";

export interface ProductFilter {
  _id?: mongoose.Types.ObjectId | { $in: mongoose.Types.ObjectId[] };
  restaurant?: string;
  name?: { $regex: string; $options: string };
  description?: string;
  price?: number;
  available?: boolean;
  is_open?: boolean;
  is_active?: boolean;

  category?: string | mongoose.Types.ObjectId;
  allergens?:
    | string
    | mongoose.Types.ObjectId
    | { $in: (string | mongoose.Types.ObjectId)[] };
}
