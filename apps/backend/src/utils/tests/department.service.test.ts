import request from "supertest";
import buildApp from "@/app";
import mongoose from "mongoose";
import userModel from "@/models/user.model";
import departmentModel from "@/models/department.model";
import { mockUserData } from "@/models/__mocks__/user.model";
import { mockDepartmentData } from "@/models/__mocks__/department.model";
import jwt from "jsonwebtoken";
import defineUsersPermissions from "@/permissions/user.permissions";
import { configDotenv } from "dotenv";

configDotenv();

jest.mock("@/models/user.model");
jest.mock("@/models/department.model", () =>
  require("@/models/__mocks__/department.model")
);
jest.mock("jsonwebtoken");
jest.mock("@/permissions/user.permissions", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockToken = jwt.sign(
  { _id: mockUserData._id, id: mockUserData.userId },
  process.env.JWT_SECRET || "secret"
);

describe("Department Service", () => {
  let app;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
    await mongoose.connection.close();
  }, 15000);

  beforeEach(() => {
    jest.clearAllMocks();

    (jwt.verify as jest.Mock).mockReturnValue({
      _id: mockUserData._id,
      id: mockUserData.userId,
    });

    (userModel.findById as jest.Mock).mockResolvedValue({
      ...mockUserData,
      role: "ADMIN",
    });
  });
  /*
  describe("Create Department", () => {
    beforeEach(() => {
      jest.clearAllMocks();

      (jwt.verify as jest.Mock).mockReturnValue({
        _id: mockUserData._id,
      });

      (userModel.findById as jest.Mock).mockResolvedValue({
        ...mockUserData,
        role: "ADMIN",
      });
    });

    it("should create department successfully", async () => {
      const mockDepartment = {
        _id: "departmentId123",
        name: "Marketing",
        company: "companyId123",
        admin: mockUserData._id,
        toObject: function () {
          return this;
        },
      };

      (defineUsersPermissions as jest.Mock).mockReturnValue({
        can: (action: string, subject: string) =>
          action === "create" && subject === "departments",
      });

      (departmentModel.create as jest.Mock).mockResolvedValue(
        mockDepartmentData
      );

      const res = await request(app.server)
        .post("/api/v1/department")
        .set("Cookie", [`access_token=${mockToken}`])
        .send({
          company: "companyId123",
          name: "Marketing",
          admin: mockUserData._id,
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("Department created successfully!");
      expect(res.body.result).toHaveProperty("name", "Marketing");
      expect(res.body.result).toHaveProperty("company", "companyId123");
    });

    it("should return 401 if token is missing", async () => {
      const res = await request(app.server).post("/api/v1/department").send({
        company: "companyId123",
        name: "Marketing",
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Missing or invalid Authorization token");
    });

    it("should return 403 if permission denied", async () => {
      (defineUsersPermissions as jest.Mock).mockReturnValue({
        can: () => false,
      });

      const res = await request(app.server)
        .post("/api/v1/department")
        .set("Cookie", [`access_token=${mockToken}`])
        .send({
          company: "companyId123",
          name: "Marketing",
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe("Access denied");
    });

    it("should return 401 if token is invalid", async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("jwt malformed");
      });

      const res = await request(app.server)
        .post("/api/v1/department")
        .set("Cookie", [`access_token=invalidtoken`])
        .send({
          company: "companyId123",
          name: "Marketing",
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe("jwt malformed");
    });

    it("should return 500 if department save fails", async () => {
      (defineUsersPermissions as jest.Mock).mockReturnValue({
        can: () => true,
      });

      (departmentModel.create as jest.Mock).mockRejectedValue(
        new Error("Save failed")
      );

      const res = await request(app.server)
        .post("/api/v1/department")
        .set("Cookie", [`access_token=${mockToken}`])
        .send({
          company: "companyId123",
          name: "Marketing",
        });

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe("Save failed");
    });
  });
  */
  /*
  describe("Read Department", () => {
    it("should fetch department successfully with valid token and permission", async () => {
      (defineUsersPermissions as jest.Mock).mockReturnValue({
        can: (action: string, subject: string) =>
          action === "read" && subject === "departments",
      });

      const mockDepartment = {
        departmentId: mockDepartmentData.departmentId,
        name: "Engineering",
        admin: [
          { first_name: "John", last_name: "Doe", email: "john@example.com" },
        ],
      };

      (departmentModel.findOne as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockDepartment),
      });

      const res = await request(app.server)
        .get(`/api/v1/department/${mockDepartmentData.departmentId}`)
        .set("Cookie", [`access_token=${mockToken}`]);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Department fetched successfully!");
      expect(res.body.result).toMatchObject({
        departmentId: mockDepartmentData.departmentId,
        name: "Engineering",
      });
    });

    it("should return 401 if token is missing", async () => {
      const res = await request(app.server).get(
        `/api/v1/department/${mockDepartmentData._id}`
      );

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Missing or invalid Authorization token");
    });

    it("should return 403 if user lacks read permission", async () => {
      (defineUsersPermissions as jest.Mock).mockReturnValue({
        can: () => false,
      });

      const res = await request(app.server)
        .get(`/api/v1/department/${mockDepartmentData._id}`)
        .set("Cookie", [`access_token=${mockToken}`]);

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe("Access denied");
    });

    it("should return 401 if an error is thrown", async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("jwt malformed");
      });

      const res = await request(app.server)
        .get(`/api/v1/department/${mockDepartmentData._id}`)
        .set("Cookie", [`access_token=${mockToken}`]);

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe("jwt malformed");
    });
  });*/

  describe("Department Service - list", () => {
    let app;

    beforeAll(async () => {
      app = await buildApp();
      await app.ready();
    });

    afterAll(async () => {
      await app.close();
      await mongoose.connection.close();
    });

    beforeEach(() => {
      jest.clearAllMocks();

      (jwt.verify as jest.Mock).mockReturnValue({ _id: mockUserData._id });
      (userModel.findById as jest.Mock).mockResolvedValue({
        ...mockUserData,
        role: "ADMIN",
        company: "companyId123",
      });
    });

    it("should list departments successfully", async () => {
      (defineUsersPermissions as jest.Mock).mockReturnValue({
        can: (action: string, subject: string) =>
          action === "read" && subject === "departments",
      });

      (departmentModel.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockDepartmentData]),
      });

      const res = await request(app.server)
        .get("/api/v1/department")
        .set("Cookie", [`access_token=${mockToken}`])
        .query({ name: "Marketing", order: "asc" });
      console.log(res.body);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Department fetched successfully!");
      expect(Array.isArray(res.body.result)).toBe(true);
      expect(res.body.result[0]).toHaveProperty(
        "name",
        mockDepartmentData.name
      );
    });

    it("should return 401 if token missing", async () => {
      const res = await request(app.server).get("/api/v1/department");
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Missing or invalid Authorization token");
    });

    it("should return 403 if permission denied", async () => {
      (defineUsersPermissions as jest.Mock).mockReturnValue({
        can: () => false,
      });

      const res = await request(app.server)
        .get("/api/v1/department")
        .set("Cookie", [`access_token=${mockToken}`]);

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe("Access denied");
    });

    it("should return 500 if database query fails", async () => {
      (defineUsersPermissions as jest.Mock).mockReturnValue({
        can: () => true,
      });

      (departmentModel.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockRejectedValue(new Error("DB error")),
      });

      const res = await request(app.server)
        .get("/api/v1/department")
        .set("Cookie", [`access_token=${mockToken}`]);

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe("DB error");
    });
  });
});
