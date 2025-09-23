import { type FastifyRequest, type FastifyReply } from "fastify";
import {
  verifyToken,
  unauthorized,
  getUserFromRequest,
} from "@/utils/auth.helpers";
import * as userService from "@/services/user.service";
import { Types } from "@my-monorepo/shared";

const userController = {
  register: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { user, accessToken, refreshToken } =
        await userService.registerUser(
          request.body as {
            email: string;
            first_name: string;
            last_name: string;
            password: string;
          }
        );

      reply.setCookie("access_token", accessToken, userService.cookieOptions);
      reply.setCookie("refresh_token", refreshToken, userService.cookieOptions);

      return reply.status(201).send({
        status: 201,
        message: "User registered successfully!",
        user,
        accessToken,
        refreshToken,
      });
    } catch (err: any) {
      return reply.status(400).send({ status: 400, message: err.message });
    }
  },

  login: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { email, password } = request.body as {
        email: string;
        password: string;
      };
      const { user, accessToken, refreshToken } = await userService.loginUser(
        email,
        password
      );

      reply.setCookie("access_token", accessToken, userService.cookieOptions);
      reply.setCookie("refresh_token", refreshToken, userService.cookieOptions);

      return reply.status(200).send({
        status: 200,
        message: "Login successful!",
        accessToken,
        refreshToken,
      });
    } catch (err: any) {
      return reply.status(401).send({ status: 401, message: err.message });
    }
  },

  logout: async (request: FastifyRequest, reply: FastifyReply) => {
    const refreshToken = request.cookies["refresh_token"];
    if (refreshToken) await userService.logoutUser(refreshToken);

    reply.clearCookie("access_token");
    reply.clearCookie("refresh_token");

    return reply
      .status(200)
      .send({ status: 200, message: "Logged out successfully" });
  },

  refreshToken: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const oldRefreshToken = request.cookies["refresh_token"];
      if (!oldRefreshToken)
        return reply
          .status(401)
          .send({ status: 401, message: "Refresh token missing" });

      const { accessToken, refreshToken } = await userService.refreshTokens(
        oldRefreshToken
      );

      reply.setCookie("access_token", accessToken, userService.cookieOptions);
      reply.setCookie("refresh_token", refreshToken, userService.cookieOptions);

      return reply.status(200).send({ status: 200, accessToken, refreshToken });
    } catch (err: any) {
      return reply.status(401).send({ status: 401, message: err.message });
    }
  },

  forgotPassword: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { email } = request.body as { email: string };
      await userService.forgotPassword(email);

      return reply.status(200).send({
        status: 200,
        message: "If the email exists, a reset link will be sent.",
      });
    } catch (err: any) {
      return reply.status(500).send({ status: 500, message: err.message });
    }
  },

  resetPassword: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { token, new_password } = request.body as {
        token: string;
        new_password: string;
      };
      await userService.resetPassword(token, new_password);

      return reply
        .status(200)
        .send({ status: 200, message: "Password reset successful" });
    } catch (err: any) {
      return reply.status(400).send({ status: 400, message: err.message });
    }
  },

  getUserDetails: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userData = await getUserFromRequest(request, reply);
      const user = await userService.getUserById(userData._id, userData.role);
      return reply.status(200).send({ status: 200, result: user });
    } catch (err: any) {
      return reply.status(403).send({ status: 403, message: err.message });
    }
  },

  listAll: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);

      const {
        page = 1,
        limit = 20,
        sort_by = "createdAt",
        order = "desc",
      } = request.query as Partial<{
        page: number;
        limit: number;
        sort_by: string;
        order: "asc" | "desc";
      }>;

      const sortParam: Record<string, 1 | -1> = {
        [sort_by]: order === "asc" ? 1 : -1,
      };
      const userList = await userService.listUsers(
        {},
        page,
        limit,
        sortParam,
        user.role
      );

      return reply.status(200).send({ status: 200, ...userList });
    } catch (err: any) {
      return reply.status(500).send({ status: 500, message: err.message });
    }
  },
  createUser: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);

      const data = request.body as Partial<Types.User.UserType>;
      const newUser = await userService.createUser(data, user.role);

      return reply.status(201).send({
        status: 201,
        message: "User created successfully",
        result: newUser,
      });
    } catch (err: any) {
      return reply.status(400).send({ status: 400, message: err.message });
    }
  },
  updateUser: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);

      const { id } = request.params as { id: string };
      const data = request.body as Partial<Types.User.UserType>;

      const updatedUser = await userService.updateUser(id, data, user.role);
      return reply.status(200).send({
        status: 200,
        message: "User updated successfully",
        result: updatedUser,
      });
    } catch (err: any) {
      return reply.status(400).send({ status: 400, message: err.message });
    }
  },
  deleteUser: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);

      const { id } = request.params as { id: string };
      await userService.deleteUser(id, user.role);

      return reply
        .status(200)
        .send({ status: 200, message: "User deleted successfully" });
    } catch (err: any) {
      return reply.status(400).send({ status: 400, message: err.message });
    }
  },
};

export default userController;
