import request from "supertest";
import buildApp from "@/app";
import mongoose from "mongoose";
import userModel from "@/models/user.model";
import companyModel from "@/models/company.model";
import { compare, hash } from "bcryptjs";
import { mockCompanyData } from "@/models/__mocks__/company.model";
import jwt from "jsonwebtoken";
import defineUsersPermissions from "@/permissions/user.permissions";
import { configDotenv } from "dotenv";
import { mockUserData } from "@/models/__mocks__/user.model";
import { console } from "inspector";

configDotenv();

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

jest.mock("@/models/user.model");
jest.mock("@/models/company.model", () =>
  require("@/models/__mocks__/company.model")
);
jest.mock("jsonwebtoken");
jest.mock("@/permissions/user.permissions", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Helper: generate valid JWT token
const generateMockToken = () =>
  jwt.sign(
    { _id: mockUserData._id, id: mockUserData.userId },
    process.env.JWT_SECRET || "GnuGcc1281"
  );

describe("Company Service", () => {
  let app;
  let mockToken = generateMockToken();

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

    (jwt.verify as jest.Mock).mockReturnValue({
      _id: mockUserData._id,
      id: mockUserData.userId,
    });

    (userModel.findById as jest.Mock).mockResolvedValue({
      ...mockUserData,
      role: "ADMIN",
      company: [new mongoose.Types.ObjectId()],
    });
  });

  // Helper: mock permission to true or false
  function mockPermission(can = true) {
    (defineUsersPermissions as jest.Mock).mockReturnValue({
      can: () => can,
    });
  }

  // Helper: mock companyModel query chain
  function mockCompanyQueryChain(
    method:
      | "findOne"
      | "find"
      | "findOneAndUpdate"
      | "findOneAndDelete"
      | "findById",
    returnValue: any
  ) {
    if (method === "findOne" || method === "find") {
      const execMock = jest.fn().mockResolvedValue(returnValue);
      const leanMock = jest.fn(() => ({ exec: execMock }));

      // Create a query chain object that supports chaining of populate, sort, lean
      const queryChain = {
        populate: jest.fn(() => queryChain),
        sort: jest.fn(() => queryChain),
        lean: leanMock,
        exec: execMock,
      };

      (companyModel[method] as jest.Mock).mockReturnValue(queryChain);
    } else {
      (companyModel[method] as jest.Mock).mockResolvedValue(returnValue);
    }
  }

  describe("Create Company", () => {
    beforeEach(() => {
      mockPermission(true);
    });

    it("creates a company successfully", async () => {
      const createPayload = {
        name: "Acme Inc",
        email: "acme@example.com",
        phone_number: "1234567890",
      };

      // Mock create call, if necessary
      (companyModel.create as jest.Mock).mockResolvedValue({
        ...createPayload,
        companyId: 1,
      });

      const res = await request(app.server)
        .post("/api/v1/company")
        .set("Cookie", [`access_token=${mockToken}`])
        .send(createPayload);

      expect(res.statusCode).toBe(201);
      expect(res.body).toMatchObject({
        status: 201,
        message: "Company created successfully!",
        result: expect.objectContaining({
          name: "Acme Inc",
          email: "acme@example.com",
        }),
      });
    });

    it("returns 401 if no token is provided", async () => {
      const res = await request(app.server)
        .post("/api/v1/company")
        .send({ name: "Test" });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty(
        "message",
        "Missing or invalid Authorization token"
      );
    });

    it("returns 403 if user lacks permission", async () => {
      mockPermission(false);

      const res = await request(app.server)
        .post("/api/v1/company")
        .set("Cookie", [`access_token=${mockToken}`])
        .send({ name: "Test" });

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty("message", "Access denied");
    });
  });

  describe("Read Company", () => {
    beforeEach(() => {
      mockPermission(true);
      mockCompanyQueryChain("findOne", mockCompanyData);
      mockCompanyQueryChain("findById", mockCompanyData);
      (userModel.findById as jest.Mock).mockResolvedValue(mockUserData);
    });

    it("returns 200 and the company data when authorized", async () => {
      const res = await request(app.server)
        .get(`/api/v1/company/${mockCompanyData.companyId}`)
        .set("Cookie", [`access_token=${mockToken}`]);

      expect(res.statusCode).toBe(200);

      expect(res.body).toMatchObject({
        status: 200,
        result: expect.objectContaining({
          name: mockCompanyData.name,
          email: mockCompanyData.email,
        }),
      });

      expect(userModel.findById).toHaveBeenCalledWith(mockUserData._id);

      expect(companyModel.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          companyId: String(mockCompanyData.companyId),
        })
      );
    });

    it("returns 401 if no token is provided", async () => {
      const res = await request(app.server).get(
        `/api/v1/company/${mockCompanyData.companyId}`
      );

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty(
        "message",
        "Missing or invalid Authorization token"
      );
    });

    it("returns 403 if user lacks read permission", async () => {
      mockPermission(false);

      const res = await request(app.server)
        .get(`/api/v1/company/${mockCompanyData.companyId}`)
        .set("Cookie", [`access_token=${mockToken}`]);

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty("message", "Access denied");
    });

    it("returns 500 on error", async () => {
      (companyModel.findOne as jest.Mock).mockImplementation(() => {
        throw new Error("DB error");
      });

      const res = await request(app.server)
        .get(`/api/v1/company/${mockCompanyData.companyId}`)
        .set("Cookie", [`access_token=${mockToken}`]);

      expect(res.statusCode).toBe(500);
      expect(res.body).toMatchObject({
        status: 500,
        message: "DB error",
      });
    });
  });

  describe("List Companies", () => {
    beforeEach(() => {
      mockPermission(true);
      mockCompanyQueryChain("find", [mockCompanyData]);
    });

    it("returns 200 and list of companies when authorized", async () => {
      const res = await request(app.server)
        .get("/api/v1/company")
        .query({
          name: "Acme",
          is_active: "true",
          sort_by: "name",
          order: "asc",
        })
        .set("Cookie", [`access_token=${mockToken}`]);

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({
        status: 200,
        message: "Companies fetched successfully!",
      });
      expect(Array.isArray(res.body.result)).toBe(true);
      expect(res.body.result[0]).toMatchObject({
        name: mockCompanyData.name,
        email: mockCompanyData.email,
      });

      expect(userModel.findById).toHaveBeenCalledWith(mockUserData._id);
      expect(companyModel.find).toHaveBeenCalledWith(
        expect.objectContaining({
          name: { $regex: "Acme", $options: "i" },
          is_active: true,
        })
      );
    });

    it("returns 401 if no token is provided", async () => {
      const res = await request(app.server).get("/api/v1/company");

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty(
        "message",
        "Missing or invalid Authorization token"
      );
    });

    it("returns 403 if user lacks read permission", async () => {
      mockPermission(false);

      const res = await request(app.server)
        .get("/api/v1/company")
        .set("Cookie", [`access_token=${mockToken}`]);

      expect(res.statusCode).toBe(403);
      expect(res.body).toMatchObject({
        status: 403,
        message: "Access denied",
      });
    });

    it("returns 500 on unexpected error", async () => {
      (companyModel.find as jest.Mock).mockImplementation(() => {
        throw new Error("DB error");
      });

      const res = await request(app.server)
        .get("/api/v1/company")
        .set("Cookie", [`access_token=${mockToken}`]);

      expect(res.statusCode).toBe(500);
      expect(res.body).toMatchObject({
        status: 500,
        message: "DB error",
      });
    });
  });

  describe("Update Company", () => {
    beforeEach(() => {
      mockPermission(true);
    });

    it("returns 200 and updated company on success", async () => {
      const updatePayload = {
        name: "Updated Name",
        phone_number: "9999999999",
      };

      (companyModel.findOneAndUpdate as jest.Mock).mockResolvedValue({
        ...mockCompanyData,
        ...updatePayload,
      });

      const res = await request(app.server)
        .put(`/api/v1/company/${mockCompanyData.companyId}`)
        .set("Cookie", [`access_token=${mockToken}`])
        .send(updatePayload);

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({
        status: 200,
        message: "Company updated successfully!",
        result: expect.objectContaining(updatePayload),
      });

      expect(userModel.findById).toHaveBeenCalledWith(mockUserData._id);
      expect(companyModel.findOneAndUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          companyId: String(mockCompanyData.companyId),
        }),
        updatePayload,
        expect.objectContaining({ new: true })
      );
    });

    it("returns 401 if no token is provided", async () => {
      const res = await request(app.server)
        .put(`/api/v1/company/${mockCompanyData.companyId}`)
        .send({ name: "Fail" });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty(
        "message",
        "Missing or invalid Authorization token"
      );
    });

    it("returns 403 if user lacks update permission", async () => {
      mockPermission(false);

      const res = await request(app.server)
        .put(`/api/v1/company/${mockCompanyData.companyId}`)
        .set("Cookie", [`access_token=${mockToken}`])
        .send({ name: "Fail" });

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty("message", "Access denied");
    });

    it("returns 404 if company not found", async () => {
      (companyModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

      const res = await request(app.server)
        .put(`/api/v1/company/${mockCompanyData.companyId}`)
        .set("Cookie", [`access_token=${mockToken}`])
        .send({ name: "NoCompany" });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message", "Company not found");
    });

    it("returns 500 on unexpected error", async () => {
      (companyModel.findOneAndUpdate as jest.Mock).mockImplementation(() => {
        throw new Error("DB error");
      });

      const res = await request(app.server)
        .put(`/api/v1/company/${mockCompanyData.companyId}`)
        .set("Cookie", [`access_token=${mockToken}`])
        .send({ name: "Fail" });

      expect(res.statusCode).toBe(500);
      expect(res.body).toMatchObject({
        status: 500,
        message: "DB error",
      });
    });
  });

  describe("Delete Company", () => {
    beforeEach(() => {
      mockPermission(true);
    });

    it("returns 200 when company deleted successfully", async () => {
      (companyModel.deleteOne as jest.Mock).mockResolvedValue({
        deletedCount: 1,
      });

      const res = await request(app.server)
        .delete(`/api/v1/company/${mockCompanyData.companyId}`)
        .set("Cookie", [`access_token=${mockToken}`]);

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({
        status: 200,
        message: "Company deleted successfully!",
      });

      expect(userModel.findById).toHaveBeenCalledWith(mockUserData._id);
      expect(companyModel.deleteOne).toHaveBeenCalledWith(
        expect.objectContaining({
          companyId: String(mockCompanyData.companyId),
        })
      );
    });

    it("returns 401 if no token is provided", async () => {
      const res = await request(app.server).delete(
        `/api/v1/company/${mockCompanyData.companyId}`
      );

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty(
        "message",
        "Missing or invalid Authorization token"
      );
    });

    it("returns 403 if user lacks delete permission", async () => {
      mockPermission(false);

      const res = await request(app.server)
        .delete(`/api/v1/company/${mockCompanyData.companyId}`)
        .set("Cookie", [`access_token=${mockToken}`]);

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty("message", "Access denied");
    });

    it("returns 404 if company not found", async () => {
      (companyModel.deleteOne as jest.Mock).mockResolvedValue({
        deletedCount: 0,
      });

      const res = await request(app.server)
        .delete(`/api/v1/company/${mockCompanyData.companyId}`)
        .set("Cookie", [`access_token=${mockToken}`]);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message", "Company not found");
    });

    it("returns 500 on unexpected error", async () => {
      (companyModel.deleteOne as jest.Mock).mockRejectedValue(
        new Error("DB error")
      );

      const res = await request(app.server)
        .delete(`/api/v1/company/${mockCompanyData.companyId}`)
        .set("Cookie", [`access_token=${mockToken}`]);

      expect(res.statusCode).toBe(500);
      expect(res.body).toMatchObject({
        status: 500,
        message: "DB error",
      });
    });
  });
});
