import { FastifyRequest, FastifyReply } from "fastify";
import * as companyService from "@/services/company.service";
import { getUserFromRequest } from "@/utils/auth.helpers";

const companyController = {
  create: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);
      const { admin, name, email, phone_number, is_active, address, type } =
        request.body as {
          admin: string;
          name: string;
          email: string;
          phone_number: string;
          is_active: boolean;
          address: string;
          type: "PROVIDER" | "CLIENT";
        };
      const result = await companyService.createCompany(
        {
          admin,
          name,
          email,
          phone_number,
          is_active,
          address,
          type,
        },
        user.role
      );
      return reply.status(201).send({
        status: 201,
        message: "Company created successfully!",
        result,
      });
    } catch (err: any) {
      return reply.status(400).send({ status: 400, message: err.message });
    }
  },

  read: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);
      const { id } = request.params as any;
      const result = await companyService.readCompany(id, user.role);
      return reply.status(200).send({ status: 200, result });
    } catch (err: any) {
      return reply.status(404).send({ status: 404, message: err.message });
    }
  },

  update: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);
      const { id } = request.params as any;
      const result = await companyService.updateCompany(
        id,
        request.body,
        user.role
      );
      return reply.status(200).send({
        status: 200,
        message: "Company updated successfully!",
        result,
      });
    } catch (err: any) {
      return reply.status(404).send({ status: 404, message: err.message });
    }
  },

  delete: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);
      const { id } = request.params as any;
      await companyService.deleteCompany(id, user.role);
      return reply
        .status(200)
        .send({ status: 200, message: "Company deleted successfully!" });
    } catch (err: any) {
      return reply.status(404).send({ status: 404, message: err.message });
    }
  },

  list: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);
      const { search, type, is_active, page, limit, sort_by, order } =
        request.query as any;

      const result = await companyService.listCompanies(
        {
          role: user.role,
          userCompanyIds: (user as any).company,
          search,
          type,
          is_active: is_active !== undefined ? is_active === "true" : undefined,
          page: page ? parseInt(page) : 1,
          limit: limit ? parseInt(limit) : 10,
          sortBy: sort_by,
          order,
        },
        user.role
      );

      return reply.status(200).send({
        status: 200,
        message: "Companies fetched successfully!",
        ...result,
      });
    } catch (err: any) {
      return reply.status(500).send({ status: 500, message: err.message });
    }
  },
};

export default companyController;
