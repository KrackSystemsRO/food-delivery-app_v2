// models
import UserModel from "@/models/user.model";
import { getQueryById } from "@/utils/getQueryById";
import { checkPermissionOrThrow } from "@/utils/permissions.helpers";
import { Types } from "@my-monorepo/shared";
import { DeliveryLocationInput } from "@/interfaces/user.interface";

/**
 * Add a delivery location for a user
 */
export async function addDeliveryLocation(
  userId: string,
  data: DeliveryLocationInput,
  role: string
) {
  checkPermissionOrThrow(role, "update", "users");

  const user = await UserModel.findOne(getQueryById(userId, "userId"));
  if (!user) throw new Error("User not found");

  // Increment counter
  user.deliveryLocationCounter = (user.deliveryLocationCounter || 0) + 1;
  const newLocation = { ...data, locationId: user.deliveryLocationCounter };
  user.deliveryLocations.push(newLocation);

  await user.save();

  return user.deliveryLocations;
}

/**
 * Get all delivery locations for a user
 */
export async function getDeliveryLocations(userId: string, role: string) {
  checkPermissionOrThrow(role, "read", "users");

  const user = await UserModel.findOne(getQueryById(userId, "userId"))
    .select("deliveryLocations")
    .lean();
  if (!user) throw new Error("User not found");

  return user.deliveryLocations;
}

/**
 * Update a delivery location by its _id
 */
export async function updateDeliveryLocation(
  userId: string,
  locationId: string,
  data: Partial<DeliveryLocationInput>,
  role: string
) {
  checkPermissionOrThrow(role, "update", "users");

  const user = await UserModel.findOne(getQueryById(userId, "userId"));
  if (!user) throw new Error("User not found");

  const location = user.deliveryLocations.find((loc) => {
    return (
      loc.locationId === Number(locationId) ||
      loc._id?.toString() === locationId
    );
  });

  if (!location) throw new Error("Delivery location not found");

  Object.assign(location, data);
  await user.save();

  return location;
}

/**
 * Delete a delivery location by its _id
 */
export async function deleteDeliveryLocation(
  userId: string,
  locationId: string,
  role: string
) {
  checkPermissionOrThrow(role, "update", "users");

  const user = await UserModel.findOne(getQueryById(userId, "userId"));
  if (!user) throw new Error("User not found");

  const index = user.deliveryLocations.findIndex((loc) => {
    return (
      loc.locationId === Number(locationId) ||
      loc._id?.toString() === locationId
    );
  });

  if (index === -1) throw new Error("Delivery location not found");

  const [deletedLocation] = user.deliveryLocations.splice(index, 1);
  await user.save();

  return deletedLocation;
}
