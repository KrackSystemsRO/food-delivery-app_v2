import { FastifyRequest, FastifyReply } from "fastify";
import * as departmentService from "@/services/department.service";
import { getUserFromRequest } from "@/utils/auth.helpers";

const departmentController = {
  list: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);
      const { search, type, is_active, company, page, limit, sortBy, order } =
        request.query as any;

      const result = await departmentService.listDepartments({
        role: user.role,
        userCompanyIds: user.company.map((id) =>
          typeof id === "string" ? id : id.toString()
        ),
        search,
        type,
        is_active: is_active !== undefined ? is_active === "true" : undefined,
        company,
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 10,
        sortBy,
        order,
      });

      return reply.status(200).send({
        status: 200,
        message: "Departments fetched successfully",
        ...result,
      });
    } catch (err: any) {
      return reply.status(500).send({ status: 500, message: err.message });
    }
  },

  read: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);
      const { id } = request.params as any;

      const department = await departmentService.readDepartment(id, user.role);
      return reply.status(200).send({
        status: 200,
        result: department,
        message: "Department fetched successfully",
      });
    } catch (err: any) {
      return reply.status(404).send({ status: 404, message: err.message });
    }
  },

  create: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);
      const { company, admin, name, is_active } = request.body as any;

      const department = await departmentService.createDepartment(
        { company, admin: admin || user._id, name, is_active },
        user.role
      );
      return reply.status(201).send({
        status: 201,
        result: department,
        message: "Department created successfully",
      });
    } catch (err: any) {
      return reply.status(400).send({ status: 400, message: err.message });
    }
  },

  update: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);
      const { id } = request.params as any;
      const updateData = request.body;

      const department = await departmentService.updateDepartment(
        id,
        updateData,
        user.role
      );
      return reply.status(200).send({
        status: 200,
        result: department,
        message: "Department updated successfully",
      });
    } catch (err: any) {
      return reply.status(404).send({ status: 404, message: err.message });
    }
  },

  delete: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);
      const { id } = request.params as any;

      await departmentService.deleteDepartment(id, user.role);
      return reply
        .status(200)
        .send({ status: 200, message: "Department deleted successfully" });
    } catch (err: any) {
      return reply.status(404).send({ status: 404, message: err.message });
    }
  },
};

export default departmentController;
