import request from "supertest";
import buildApp from "@/app";
import mongoose from "mongoose";
import userModel from "@/models/user.model";
import orderModel from "@/models/order.model";
import { mockUserData } from "@/models/__mocks__/user.model";
import { mockOrderData } from "@/models/__mocks__/order.model";
import jwt from "jsonwebtoken";
import defineUsersPermissions from "@/permissions/user.permissions";
import { configDotenv } from "dotenv";

configDotenv();

jest.mock("@/models/user.model");
jest.mock("@/models/order.model", () =>
  require("@/models/__mocks__/order.model")
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

describe("Order Service", () => {
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

    (jwt.verify as jest.Mock).mockReturnValue({
      _id: mockUserData._id,
      id: mockUserData.userId,
    });

    (userModel.findById as jest.Mock).mockResolvedValue({
      ...mockUserData,
      role: "ADMIN",
    });
  });

  describe("Create Order", () => {
    beforeEach(() => {
      (defineUsersPermissions as jest.Mock).mockReturnValue({
        can: (action: string, subject: string) =>
          action === "create" && subject === "orders",
      });
    });

    it("should create order successfully", async () => {
      const payload = {
        restaurant: "restaurantId",
        items: [{ product: "productId", quantity: 2 }],
        deliveryLocation: { lat: 12.34, lng: 56.78, address: "Test Street" },
      };

      const res = await request(app.server)
        .post("/api/v1/order")
        .set("Cookie", [`access_token=${mockToken}`])
        .send(payload);

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("Order created successfully!");
      expect(res.body.result).toHaveProperty("restaurant", "restaurantId");
    });

    it("should return 403 if permission denied", async () => {
      (defineUsersPermissions as jest.Mock).mockReturnValue({
        can: () => false,
      });

      const res = await request(app.server)
        .post("/api/v1/order")
        .set("Cookie", [`access_token=${mockToken}`])
        .send({
          restaurant: "restaurantId",
          items: [],
          deliveryLocation: { lat: 0, lng: 0, address: "" },
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe("Access denied");
    });

    it("should return 401 if token is missing", async () => {
      const res = await request(app.server).post("/api/v1/order").send({});

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Missing or invalid Authorization token");
    });

    it("should return 401 if token is invalid", async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("jwt malformed");
      });

      const res = await request(app.server)
        .post(`/api/v1/order`)
        .set("Cookie", [`access_token=invalidtoken`])
        .send({});

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe("jwt malformed");
    });
  });

  describe("Read Order", () => {
    beforeEach(() => {
      jest.clearAllMocks();

      (jwt.verify as jest.Mock).mockReturnValue({
        _id: mockUserData._id,
      });

      (userModel.findById as jest.Mock).mockResolvedValue({
        ...mockUserData,
        role: "ADMIN",
        company: "companyId",
      });
    });

    it("should fetch order successfully", async () => {
      const mockQueryChain = {
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockOrderData),
      };

      (orderModel.findOne as jest.Mock).mockReturnValue(mockQueryChain);

      (defineUsersPermissions as jest.Mock).mockReturnValue({
        can: (action: string, subject: string) =>
          action === "read" && subject === "orders",
      });

      const res = await request(app.server)
        .get(`/api/v1/order/${mockOrderData.orderId}`)
        .set("Cookie", [`access_token=${mockToken}`]);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Order fetched successfully!");
      expect(res.body.result.orderId).toBe(mockOrderData.orderId);
    });

    it("should return 403 if user has no permission", async () => {
      (defineUsersPermissions as jest.Mock).mockReturnValue({
        can: () => false,
      });

      const res = await request(app.server)
        .get(`/api/v1/order/${mockOrderData.orderId}`)
        .set("Cookie", [`access_token=${mockToken}`]);

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe("Access denied");
    });

    it("should return 401 if token is missing", async () => {
      const res = await request(app.server).get(
        `/api/v1/order/${mockOrderData.orderId}`
      );

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Missing or invalid Authorization token");
    });

    it("should return 401 if token is invalid", async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("jwt malformed");
      });

      const res = await request(app.server)
        .get(`/api/v1/order/${mockOrderData.orderId}`)
        .set("Cookie", [`access_token=invalidtoken`])
        .send({});

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe("jwt malformed");
    });
  });

  describe("List Orders", () => {
    beforeEach(() => {
      jest.clearAllMocks();

      (jwt.verify as jest.Mock).mockReturnValue({
        _id: mockUserData._id,
      });

      (userModel.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue({
          ...mockUserData,
          role: "ADMIN",
          company: "companyId",
        }),
      });
    });

    it("should return 401 if token is missing", async () => {
      const res = await request(app.server).get("/api/v1/order");

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Missing or invalid Authorization token");
    });

    it("should return 401 if token is invalid", async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("jwt malformed");
      });

      const res = await request(app.server)
        .get(`/api/v1/order`)
        .set("Cookie", [`access_token=invalidtoken`])
        .send({});

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe("jwt malformed");
    });

    it("should return 403 if permission denied", async () => {
      (defineUsersPermissions as jest.Mock).mockReturnValue({
        can: () => false,
      });

      const res = await request(app.server)
        .get("/api/v1/order")
        .set("Cookie", [`access_token=${mockToken}`]);

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe("Access denied");
    });

    it("should fetch list of orders successfully", async () => {
      (defineUsersPermissions as jest.Mock).mockReturnValue({
        can: (action: string, subject: string) =>
          action === "read" && subject === "orders",
      });

      const mockQueryChain = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockOrderData]),
      };

      (orderModel.find as jest.Mock).mockReturnValue(mockQueryChain);

      const res = await request(app.server)
        .get("/api/v1/order")
        .set("Cookie", [`access_token=${mockToken}`])
        .query({ status: "pending", sort_by: "createdAt", order: "desc" });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Orders fetched successfully!");
      expect(Array.isArray(res.body.result)).toBe(true);
      expect(res.body.result[0]).toHaveProperty(
        "orderId",
        mockOrderData.orderId
      );
    });
  });

  describe("Update Order", () => {
    beforeEach(() => {
      jest.clearAllMocks();

      (jwt.verify as jest.Mock).mockReturnValue({
        _id: mockUserData._id,
      });

      (userModel.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue({
          ...mockUserData,
          role: "ADMIN",
        }),
      });
    });

    it("should update order successfully", async () => {
      (defineUsersPermissions as jest.Mock).mockReturnValue({
        can: (action: string, subject: string) =>
          action === "update" && subject === "orders",
      });

      const mockUpdatedOrder = {
        orderId: "1",
        status: "delivered",
        user: {
          _id: "user123",
          first_name: "John",
          last_name: "Doe",
          email: "john@example.com",
        },
        restaurant: {
          _id: "rest123",
          name: "Test Restaurant",
          is_open: true,
        },
        items: [
          {
            product: {
              _id: "prod123",
              name: "Product 1",
              image: "image.jpg",
              available: true,
            },
            quantity: 2,
          },
        ],
      };

      const mockQueryChain = {
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockUpdatedOrder),
      };

      (orderModel.findOneAndUpdate as jest.Mock).mockReturnValue(
        mockQueryChain
      );

      const updatePayload = { status: "delivered" };

      const res = await request(app.server)
        .put("/api/v1/order/1")
        .set("Cookie", [`access_token=${mockToken}`])
        .send(updatePayload);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Order updated successfully!");
      expect(res.body.result).toHaveProperty("orderId", 1);
      expect(res.body.result.status).toBe("delivered");
    });

    it("should return 403 if permission denied", async () => {
      (defineUsersPermissions as jest.Mock).mockReturnValue({
        can: () => false,
      });

      const res = await request(app.server)
        .put("/api/v1/order/1")
        .set("Cookie", [`access_token=${mockToken}`])
        .send({ status: "delivered" });

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe("Access denied");
    });

    it("should return 401 if token is missing", async () => {
      const res = await request(app.server)
        .put("/api/v1/order/1")
        .send({ status: "delivered" });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Missing or invalid Authorization token");
    });

    it("should return 401 if token is invalid", async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("jwt malformed");
      });

      const res = await request(app.server)
        .put("/api/v1/order/1")
        .set("Cookie", [`access_token=invalidtoken`])
        .send({ status: "delivered" });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe("jwt malformed");
    });

    it("should return 404 if order not found", async () => {
      (defineUsersPermissions as jest.Mock).mockReturnValue({
        can: () => true,
      });

      const mockQueryChain = {
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(null),
      };

      (orderModel.findOneAndUpdate as jest.Mock).mockReturnValue(
        mockQueryChain
      );

      const res = await request(app.server)
        .put("/api/v1/order/nonexistentOrder")
        .set("Cookie", [`access_token=${mockToken}`])
        .send({ status: "delivered" });

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Order not found");
    });

    it("should return 500 on server error", async () => {
      (defineUsersPermissions as jest.Mock).mockReturnValue({
        can: () => true,
      });

      (orderModel.findOneAndUpdate as jest.Mock).mockImplementation(() => {
        throw new Error("Database error");
      });

      const res = await request(app.server)
        .put("/api/v1/order/1")
        .set("Cookie", [`access_token=${mockToken}`])
        .send({ status: "delivered" });

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe("Database error");
    });
  });

  describe("Delete Order", () => {
    beforeEach(() => {
      jest.clearAllMocks();

      (jwt.verify as jest.Mock).mockReturnValue({
        _id: mockUserData._id,
      });

      (userModel.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue({
          ...mockUserData,
          role: "ADMIN",
        }),
      });
    });

    it("should delete order successfully", async () => {
      (defineUsersPermissions as jest.Mock).mockReturnValue({
        can: (action: string, subject: string) =>
          action === "delete" && subject === "orders",
      });

      (orderModel.deleteOne as jest.Mock).mockResolvedValue({
        deletedCount: 1,
      });

      const res = await request(app.server)
        .delete("/api/v1/order/order123")
        .set("Cookie", [`access_token=${mockToken}`]);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Order deleted successfully!");
    });

    it("should return 403 if permission denied", async () => {
      (defineUsersPermissions as jest.Mock).mockReturnValue({
        can: () => false,
      });

      const res = await request(app.server)
        .delete("/api/v1/order/order123")
        .set("Cookie", [`access_token=${mockToken}`]);

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe("Access denied");
    });

    it("should return 401 if token is missing", async () => {
      const res = await request(app.server).delete("/api/v1/order/order123");

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Missing or invalid Authorization token");
    });

    it("should return 401 if token is invalid", async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("jwt malformed");
      });

      const res = await request(app.server)
        .delete("/api/v1/order/order123")
        .set("Cookie", [`access_token=invalidtoken`]);

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe("jwt malformed");
    });

    it("should return 500 on server error", async () => {
      (defineUsersPermissions as jest.Mock).mockReturnValue({
        can: () => true,
      });

      (orderModel.deleteOne as jest.Mock).mockImplementation(() => {
        throw new Error("Database error");
      });

      const res = await request(app.server)
        .delete("/api/v1/order/order123")
        .set("Cookie", [`access_token=${mockToken}`]);

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe("Database error");
    });
  });
});
