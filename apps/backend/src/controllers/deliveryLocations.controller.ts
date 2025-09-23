import { FastifyRequest, FastifyReply } from "fastify";
import * as deliveryLocationService from "@/services/deliveryLocation.service";
import { getUserFromRequest } from "@/utils/auth.helpers";
import { DeliveryLocationInput } from "@/interfaces/user.interface";

const deliveryLocationController = {
  list: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);

      const locations = await deliveryLocationService.getDeliveryLocations(
        user._id as string,
        user.role
      );

      return reply.status(200).send({
        status: 200,
        message: "Delivery locations fetched successfully",
        deliveryLocations: locations,
      });
    } catch (err: any) {
      return reply.status(404).send({ status: 404, message: err.message });
    }
  },

  read: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);
      const { locationId } = request.params as any;

      const locations = await deliveryLocationService.getDeliveryLocations(
        user._id as string,
        user.role
      );
      const locationIdNumber = parseInt(locationId as string, 10);
      const location = locations.find(
        (loc) => loc.locationId === locationIdNumber
      );

      if (!location) throw new Error("Delivery location not found");

      return reply.status(200).send({
        status: 200,
        message: "Delivery location fetched successfully",
        result: location,
      });
    } catch (err: any) {
      return reply.status(404).send({ status: 404, message: err.message });
    }
  },

  create: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);
      const data = request.body as DeliveryLocationInput;

      const locations = await deliveryLocationService.addDeliveryLocation(
        user._id as string,
        data,
        user.role
      );

      return reply.status(201).send({
        status: 201,
        message: "Delivery location added successfully",
        deliveryLocations: locations,
      });
    } catch (err: any) {
      return reply.status(400).send({ status: 400, message: err.message });
    }
  },

  update: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);
      const { locationId } = request.params as any;
      const data = request.body as DeliveryLocationInput;

      const updatedLocation =
        await deliveryLocationService.updateDeliveryLocation(
          user._id as string,
          locationId,
          data,
          user.role
        );

      return reply.status(200).send({
        status: 200,
        message: "Delivery location updated successfully",
        result: updatedLocation,
      });
    } catch (err: any) {
      return reply.status(404).send({ status: 404, message: err.message });
    }
  },

  delete: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);
      const { locationId } = request.params as any;

      const deletedLocation =
        await deliveryLocationService.deleteDeliveryLocation(
          user._id as string,
          locationId,
          user.role
        );

      return reply.status(200).send({
        status: 200,
        message: "Delivery location deleted successfully",
        result: deletedLocation,
      });
    } catch (err: any) {
      return reply.status(404).send({ status: 404, message: err.message });
    }
  },
};

export default deliveryLocationController;
