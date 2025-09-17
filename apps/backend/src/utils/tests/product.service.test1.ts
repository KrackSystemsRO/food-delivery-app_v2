import request from "supertest";
import buildApp from "@/app";
import userModel from "@/models/user.model";
import productModel from "@/models/product.model";
import jwt from "jsonwebtoken";
import defineUsersPermissions from "@/permissions/user.permissions";
import { configDotenv } from "dotenv";
import { mockUserData } from "@/models/__mocks__/user.model";
import mongoose from "mongoose";

configDotenv();

jest.mock("@/models/user.model");
jest.mock("@/models/product.model", () =>
  require("@/models/__mocks__/product.model")
);
jest.mock("jsonwebtoken");
jest.mock("@/permissions/user.permissions");

describe("Product Service", () => {
  let app;
  const mockToken = jwt.sign(
    { _id: mockUserData._id, id: mockUserData.userId },
    process.env.JWT_SECRET || "secret"
  );

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/v1/product - Create Product API", () => {
    it("should create a product successfully", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ _id: mockUserData._id });

      (userModel.findById as jest.Mock).mockResolvedValue({ role: "ADMIN" });

      (defineUsersPermissions as jest.Mock).mockReturnValue({
        can: () => true,
      });

      const mockProductPayload = {
        restaurant: "60f7a1a38f354d3b2a4d3c9f",
        name: "Mock Pizza",
        description: "Tasty mock pizza",
        price: 12.99,
        image: "mock.jpg",
        available: true,
      };

      const res = await request(app.server)
        .post("/api/v1/product")
        .set("Cookie", [`access_token=${mockToken}`])
        .send(mockProductPayload);

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Product created successfully!");
    });

    it("should return 401 if token is missing", async () => {
      const res = await request(app.server).post("/api/v1/product").send({});
      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Missing or invalid Authorization token");
    });

    it("should return 403 if user lacks permission", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ _id: mockUserData._id });
      (userModel.findById as jest.Mock).mockResolvedValue({ role: "STAFF" });

      (defineUsersPermissions as jest.Mock).mockReturnValue({
        can: () => false,
      });

      const res = await request(app.server)
        .post("/api/v1/product")
        .set("Cookie", [`access_token=${mockToken}`])
        .send({
          name: "Any",
          price: 10,
          available: true,
        });

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("Access denied");
    });
  });

  describe("GET /api/v1/product/:id - Read Product API", () => {
    const mockProduct = {
      _id: new mongoose.Types.ObjectId(),
      productId: 1,
      name: "Test Product",
      price: 9.99,
      restaurant: { name: "Mock Restaurant" },
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return product by ObjectId", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ _id: mockUserData._id });
      (userModel.findById as jest.Mock).mockResolvedValue({ role: "ADMIN" });
      (defineUsersPermissions as jest.Mock).mockReturnValue({
        can: () => true,
      });

      (productModel.findOne as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockProduct),
      });

      const res = await request(app.server)
        .get(`/api/v1/product/${mockProduct._id}`)
        .set("Cookie", [`access_token=${mockToken}`]);

      expect(res.status).toBe(200);
      expect(res.body.result.name).toBe("Test Product");
    });

    it("should return product by productId", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ _id: mockUserData._id });
      (userModel.findById as jest.Mock).mockResolvedValue({ role: "ADMIN" });
      (defineUsersPermissions as jest.Mock).mockReturnValue({
        can: () => true,
      });

      (productModel.findOne as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockProduct),
      });

      const res = await request(app.server)
        .get(`/api/v1/product/1`)
        .set("Cookie", [`access_token=${mockToken}`]);

      expect(res.status).toBe(200);
      expect(res.body.result.name).toBe("Test Product");
    });

    it("should return 401 if token missing", async () => {
      const res = await request(app.server).get("/api/v1/product/1");
      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Missing or invalid Authorization token");
    });

    it("should return 403 if not allowed to read products", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ _id: mockUserData._id });
      (userModel.findById as jest.Mock).mockResolvedValue({ role: "STAFF" });
      (defineUsersPermissions as jest.Mock).mockReturnValue({
        can: () => false,
      });

      const res = await request(app.server)
        .get(`/api/v1/product/${mockProduct._id}`)
        .set("Cookie", [`access_token=${mockToken}`]);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("Access denied");
    });

    it("should return 404 if product not found", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ _id: mockUserData._id });
      (userModel.findById as jest.Mock).mockResolvedValue({ role: "ADMIN" });
      (defineUsersPermissions as jest.Mock).mockReturnValue({
        can: () => true,
      });

      (productModel.findOne as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      });

      const res = await request(app.server)
        .get(`/api/v1/product/${mockProduct._id}`)
        .set("Cookie", [`access_token=${mockToken}`]);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Product not found");
    });
  });

  describe("GET /api/v1/product - List Product API", () => {
    const mockProducts = [
      {
        _id: new mongoose.Types.ObjectId(),
        name: "Burger",
        price: 5,
        restaurant: { name: "Resto 1" },
        available: true,
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: "Pizza",
        price: 10,
        restaurant: { name: "Resto 2" },
        available: false,
      },
    ];

    it("should return a filtered product list", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ _id: mockUserData._id });
      (userModel.findById as jest.Mock).mockResolvedValue({
        role: "ADMIN",
        company: [],
      });
      (defineUsersPermissions as jest.Mock).mockReturnValue({
        can: () => true,
      });

      (productModel.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockProducts),
      });

      const res = await request(app.server)
        .get(`/api/v1/product`)
        .set("Cookie", [`access_token=${mockToken}`])
        .query({
          name: "Pizza",
          available: "true",
          sort_by: "name",
          order: "asc",
        });

      expect(res.status).toBe(200);
      expect(res.body.result).toHaveLength(2);
      expect(productModel.find).toHaveBeenCalledWith(
        expect.objectContaining({
          name: expect.any(Object),
          available: true,
        })
      );
    });

    it("should return 401 if token is missing", async () => {
      const res = await request(app.server).get("/api/v1/product");
      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Missing or invalid Authorization token");
    });

    it("should return 403 if user lacks permission to read", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ _id: mockUserData._id });
      (userModel.findById as jest.Mock).mockResolvedValue({
        role: "STAFF",
        company: [],
      });
      (defineUsersPermissions as jest.Mock).mockReturnValue({
        can: () => false,
      });

      const res = await request(app.server)
        .get("/api/v1/product")
        .set("Cookie", [`access_token=${mockToken}`]);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("Access denied");
    });

    it("should apply manager role filtering on _id", async () => {
      const companyIds = [new mongoose.Types.ObjectId()];
      (jwt.verify as jest.Mock).mockReturnValue({ _id: mockUserData._id });
      (userModel.findById as jest.Mock).mockResolvedValue({
        role: "MANAGER_RESTAURANT",
        company: companyIds,
      });
      (defineUsersPermissions as jest.Mock).mockReturnValue({
        can: () => true,
      });

      (productModel.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockProducts),
      });

      const res = await request(app.server)
        .get(`/api/v1/product`)
        .set("Cookie", [`access_token=${mockToken}`]);

      expect(res.status).toBe(200);
      expect(productModel.find).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: { $in: companyIds },
        })
      );
    });
  });

  describe("PUT /api/v1/product/:id - Update Product API", () => {
    const productId = "1";
    const updatedProductData = {
      name: "Updated Product",
      price: 99,
      available: false,
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should update the product successfully", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ _id: mockUserData._id });
      (userModel.findById as jest.Mock).mockResolvedValue({
        role: "ADMIN",
      });
      (defineUsersPermissions as jest.Mock).mockReturnValue({
        can: () => true,
      });

      const updatedProduct = {
        ...updatedProductData,
        productId,
        _id: new mongoose.Types.ObjectId(),
        toObject: () => updatedProductData,
      };

      (productModel.findOneAndUpdate as jest.Mock).mockResolvedValue(
        updatedProduct
      );

      const res = await request(app.server)
        .put(`/api/v1/product/${productId}`)
        .set("Cookie", [`access_token=${mockToken}`])
        .send(updatedProductData);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Product updated successfully!");
      expect(productModel.findOneAndUpdate).toHaveBeenCalledWith(
        { productId },
        updatedProductData,
        { new: true, runValidators: true }
      );
    });

    it("should return 401 if token is missing", async () => {
      const res = await request(app.server)
        .put(`/api/v1/product/${productId}`)
        .send(updatedProductData);

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Missing or invalid Authorization token");
    });

    it("should return 403 if user is not allowed to update", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ _id: mockUserData._id });
      (userModel.findById as jest.Mock).mockResolvedValue({ role: "STAFF" });
      (defineUsersPermissions as jest.Mock).mockReturnValue({
        can: () => false,
      });

      const res = await request(app.server)
        .put(`/api/v1/product/${productId}`)
        .set("Cookie", [`access_token=${mockToken}`])
        .send(updatedProductData);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("Access denied");
    });

    it("should return 404 if product not found", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ _id: mockUserData._id });
      (userModel.findById as jest.Mock).mockResolvedValue({ role: "ADMIN" });
      (defineUsersPermissions as jest.Mock).mockReturnValue({
        can: () => true,
      });

      (productModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

      const res = await request(app.server)
        .put(`/api/v1/product/${productId}`)
        .set("Cookie", [`access_token=${mockToken}`])
        .send(updatedProductData);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Product not found");
      expect(productModel.findOneAndUpdate).toHaveBeenCalledWith(
        { productId },
        updatedProductData,
        { new: true, runValidators: true }
      );
    });
  });

  describe("DELETE /api/v1/product/:id", () => {
    const productId = "1";

    beforeEach(() => {
      jest.resetAllMocks();
    });

    it("should delete the product successfully", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ _id: mockUserData._id });
      (userModel.findById as jest.Mock).mockResolvedValue({ role: "ADMIN" });
      (defineUsersPermissions as jest.Mock).mockReturnValue({
        can: (action: string, resource: string) =>
          action === "delete" && resource === "products",
      });
      (productModel.deleteOne as jest.Mock).mockResolvedValue({
        deletedCount: 1,
      });

      const res = await request(app.server)
        .delete(`/api/v1/product/${productId}`)
        .set("Cookie", [`access_token=${mockToken}`]);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Product deleted successfully!");
      expect(productModel.deleteOne).toHaveBeenCalledWith({ productId });
    });

    it("should return 401 if no token", async () => {
      const res = await request(app.server).delete(
        `/api/v1/product/${productId}`
      );

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Missing or invalid Authorization token");
    });

    it("should return 403 if user cannot delete products", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ _id: mockUserData._id });
      (userModel.findById as jest.Mock).mockResolvedValue({ role: "USER" });
      (defineUsersPermissions as jest.Mock).mockReturnValue({
        can: () => false,
      });

      const res = await request(app.server)
        .delete(`/api/v1/product/${productId}`)
        .set("Cookie", [`access_token=${mockToken}`]);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("Access denied");
    });

    it("should return 500 if error occurs", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ _id: mockUserData._id });
      (userModel.findById as jest.Mock).mockResolvedValue({ role: "ADMIN" });
      (defineUsersPermissions as jest.Mock).mockReturnValue({
        can: () => true,
      });
      (productModel.deleteOne as jest.Mock).mockRejectedValue(
        new Error("DB error")
      );

      const res = await request(app.server)
        .delete(`/api/v1/product/${productId}`)
        .set("Cookie", [`access_token=${mockToken}`]);

      expect(res.status).toBe(500);
      expect(res.body.message).toBe("DB error");
    });
  });
});
