import request from "supertest";
import buildApp from "@/app";
import mongoose from "mongoose";
import userModel from "@/models/user.model";
import jwt from "jsonwebtoken";
import defineUserPermissions from "@/permissions/user.permissions";
import { configDotenv } from "dotenv";
import { mockUserData } from "@/models/__mocks__/user.model";
import restaurantModel, {
  mockSave,
  mockRestaurantData,
} from "@/models/__mocks__/restaurant.model";
configDotenv();

jest.mock("@/models/user.model");
jest.mock("@/models/restaurant.model", () =>
  require("@/models/__mocks__/restaurant.model")
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

describe("Restaurant Service", () => {
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

  describe("Create Restaurant", () => {
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

    it("should create restaurant successfully", async () => {
      (defineUserPermissions as jest.Mock).mockReturnValue({
        can: () => true,
      });

      const payload = {
        name: "New Restaurant",
        description: "Great food",
        address: "100 Food St",
        owner: mockUserData._id,
      };

      mockSave.mockResolvedValue({
        ...payload,
        _id: new mongoose.Types.ObjectId(),
        toObject: () => payload,
      });

      const res = await request(app.server)
        .post("/api/v1/restaurant")
        .set("Cookie", [`access_token=${mockToken}`])
        .send(payload);

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("Restaurant created successfully!");
      expect(res.body.result.name).toBe("New Restaurant");
    });

    it("should return 403 if no permission", async () => {
      (defineUserPermissions as jest.Mock).mockReturnValue({
        can: () => false,
      });

      const res = await request(app.server)
        .post("/api/v1/restaurant")
        .set("Cookie", [`access_token=${mockToken}`])
        .send({ name: "Forbidden Restaurant" });

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe("Access denied");
    });

    it("should return 401 if token is missing", async () => {
      const res = await request(app.server)
        .post("/api/v1/restaurant")
        .send({ name: "Missing Token Restaurant" });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Missing or invalid Authorization token");
    });

    it("should fallback to _user_id if owner not provided", async () => {
      (defineUserPermissions as jest.Mock).mockReturnValue({
        can: () => true,
      });

      const payload = {
        name: "Owned by Me",
        description: "Owner not provided",
        address: "200 Main St",
      };

      const mockSaved = {
        ...payload,
        owner: mockUserData._id,
        _id: new mongoose.Types.ObjectId(),
        toObject: () => ({
          ...payload,
          owner: mockUserData._id,
        }),
      };

      mockSave.mockResolvedValue(mockSaved);

      const res = await request(app.server)
        .post("/api/v1/restaurant")
        .set("Cookie", [`access_token=${mockToken}`])
        .send(payload);

      expect(res.statusCode).toBe(201);
      expect(res.body.result.owner.toString()).toBe(
        mockUserData._id.toString()
      );
    });

    it("should return 500 if save throws error", async () => {
      (defineUserPermissions as jest.Mock).mockReturnValue({
        can: () => true,
      });

      mockSave.mockRejectedValue(new Error("Database save failed"));

      const payload = {
        name: "Failing Save",
        description: "Causes error",
        address: "400 Fail St",
      };

      const res = await request(app.server)
        .post("/api/v1/restaurant")
        .set("Cookie", [`access_token=${mockToken}`])
        .send(payload);

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe("Database save failed");
    });
  });

  describe("Read Restaurant", () => {
    const mockQueryChain = {
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn(),
    };

    beforeEach(() => {
      jest.clearAllMocks();

      (jwt.verify as jest.Mock).mockReturnValue({ _id: mockUserData._id });

      (userModel.findById as jest.Mock).mockResolvedValue({
        ...mockUserData,
        role: "ADMIN",
      });

      (defineUserPermissions as jest.Mock).mockReturnValue({
        can: () => true,
      });

      (restaurantModel.findOne as jest.Mock).mockReturnValue(mockQueryChain);
    });

    it("should return restaurant data", async () => {
      mockQueryChain.exec.mockResolvedValue(mockRestaurantData);

      const res = await request(app.server)
        .get(`/api/v1/restaurant/${mockRestaurantData.restaurantId}`)
        .set("Cookie", [`access_token=${mockToken}`]);

      expect(res.statusCode).toBe(200);
      expect(res.body.result).toMatchObject({
        name: mockRestaurantData.name,
        restaurantId: mockRestaurantData.restaurantId,
      });
    });

    it("should return 401 if token is missing", async () => {
      const res = await request(app.server).get(
        `/api/v1/restaurant/${mockRestaurantData.restaurantId}`
      );

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Missing or invalid Authorization token");
    });

    it("should return 401 if token is invalid", async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("jwt malformed");
      });

      const res = await request(app.server)
        .get(`/api/v1/restaurant/${mockRestaurantData.restaurantId}`)
        .set("Cookie", [`access_token=invalidtoken`]);

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toMatch(/jwt malformed/i);
    });

    it("should return 403 if user lacks permission", async () => {
      (defineUserPermissions as jest.Mock).mockReturnValue({
        can: () => false,
      });

      const res = await request(app.server)
        .get(`/api/v1/restaurant/${mockRestaurantData.restaurantId}`)
        .set("Cookie", [`access_token=${mockToken}`]);

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe("Access denied");
    });

    it("should return null if restaurant not found", async () => {
      mockQueryChain.exec.mockResolvedValue(null);

      const res = await request(app.server)
        .get(`/api/v1/restaurant/invalid-id`)
        .set("Cookie", [`access_token=${mockToken}`]);

      expect(res.statusCode).toBe(200);
      expect(res.body.result).toEqual({});
    });

    it("should return 500 if restaurantModel throws", async () => {
      mockQueryChain.exec.mockRejectedValue(new Error("DB read failed"));

      const res = await request(app.server)
        .get(`/api/v1/restaurant/${mockRestaurantData.restaurantId}`)
        .set("Cookie", [`access_token=${mockToken}`]);

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe("DB read failed");
    });
  });

  describe("List Restaurants", () => {
    beforeEach(() => {
      (defineUserPermissions as jest.Mock).mockReturnValue({
        can: () => true,
      });

      const mockQueryChain = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockRestaurantData]),
      };

      (restaurantModel.find as jest.Mock).mockReturnValue(mockQueryChain);
    });

    it("should return list of restaurants", async () => {
      const res = await request(app.server)
        .get("/api/v1/restaurant")
        .set("Cookie", [`access_token=${mockToken}`]);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.result)).toBe(true);
    });

    it("should return 401 if no token is provided", async () => {
      const res = await request(app.server).get("/api/v1/restaurant");

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Missing or invalid Authorization token");
    });

    it("should return 403 if user has no read permission", async () => {
      (defineUserPermissions as jest.Mock).mockReturnValue({
        can: () => false,
      });

      const res = await request(app.server)
        .get("/api/v1/restaurant")
        .set("Cookie", [`access_token=${mockToken}`]);

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe("Access denied");
    });

    it("should apply filters and sorting correctly", async () => {
      const filters = {
        name: "Test",
        is_active: "true",
        order: "asc",
        sort_by: "name",
      };

      const res = await request(app.server)
        .get("/api/v1/restaurant")
        .query(filters)
        .set("Cookie", [`access_token=${mockToken}`]);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.result)).toBe(true);

      expect(restaurantModel.find).toHaveBeenCalled();

      const filterArg = (restaurantModel.find as jest.Mock).mock.calls[0][0];
      expect(filterArg.name).toMatchObject({ $regex: "Test", $options: "i" });
      expect(filterArg.is_active).toBe(true);
    });

    it("should return 500 on database errors", async () => {
      (restaurantModel.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockRejectedValue(new Error("Database error")),
      });

      const res = await request(app.server)
        .get("/api/v1/restaurant")
        .set("Cookie", [`access_token=${mockToken}`]);

      expect(res.statusCode).toBe(500);
    });
  });

  describe("Update Restaurant", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      (userModel.findById as jest.Mock).mockResolvedValue({
        ...mockUserData,
        role: "ADMIN",
      });
    });

    it("should update restaurant successfully", async () => {
      (defineUserPermissions as jest.Mock).mockReturnValue({
        can: () => true,
      });

      (restaurantModel.findOneAndUpdate as jest.Mock).mockResolvedValue({
        ...mockRestaurantData,
        name: "Updated Restaurant",
      });

      const res = await request(app.server)
        .put(`/api/v1/restaurant/${mockRestaurantData.restaurantId}`)
        .set("Cookie", [`access_token=${mockToken}`])
        .send({ name: "Updated Restaurant" });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Restaurant updated successfully!");
      expect(res.body.result.name).toBe("Updated Restaurant");
    });

    it("should return 401 if no token provided", async () => {
      const res = await request(app.server)
        .put(`/api/v1/restaurant/${mockRestaurantData.restaurantId}`)
        .send({ name: "Updated Restaurant" });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Missing or invalid Authorization token");
    });

    it("should return 401 if token is invalid", async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("jwt malformed");
      });

      const res = await request(app.server)
        .put(`/api/v1/restaurant/${mockRestaurantData.restaurantId}`)
        .set("Cookie", [`access_token=invalidtoken`])
        .send({ name: "Updated Restaurant" });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe("jwt malformed");
    });

    it("should return 403 if user lacks update permission", async () => {
      (defineUserPermissions as jest.Mock).mockReturnValue({
        can: () => false,
      });

      const res = await request(app.server)
        .put(`/api/v1/restaurant/${mockRestaurantData.restaurantId}`)
        .set("Cookie", [`access_token=${mockToken}`])
        .send({ name: "Updated Restaurant" });

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe("Access denied");
    });

    it("should return 500 if findOneAndUpdate throws error", async () => {
      (defineUserPermissions as jest.Mock).mockReturnValue({
        can: () => true,
      });

      (restaurantModel.findOneAndUpdate as jest.Mock).mockRejectedValue(
        new Error("DB failure")
      );

      const res = await request(app.server)
        .put(`/api/v1/restaurant/${mockRestaurantData.restaurantId}`)
        .set("Cookie", [`access_token=${mockToken}`])
        .send({ name: "Updated Restaurant" });

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe("DB failure");
    });
  });

  describe("Delete Restaurant", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      (userModel.findById as jest.Mock).mockResolvedValue({
        ...mockUserData,
        role: "ADMIN",
      });
    });

    it("should delete restaurant successfully", async () => {
      (defineUserPermissions as jest.Mock).mockReturnValue({
        can: () => true,
      });

      (restaurantModel.deleteOne as jest.Mock).mockResolvedValue({
        deletedCount: 1,
      });

      const res = await request(app.server)
        .delete(`/api/v1/restaurant/${mockRestaurantData.restaurantId}`)
        .set("Cookie", [`access_token=${mockToken}`]);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Restaurant deleted successfully!");
    });

    it("should return 401 if no token provided", async () => {
      const res = await request(app.server).delete(
        `/api/v1/restaurant/${mockRestaurantData.restaurantId}`
      );

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Missing or invalid Authorization token");
    });

    it("should return 401 if token is invalid", async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("jwt malformed");
      });

      const res = await request(app.server)
        .delete(`/api/v1/restaurant/${mockRestaurantData.restaurantId}`)
        .set("Cookie", [`access_token=invalidtoken`])
        .send({ name: "Delete Restaurant" });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe("jwt malformed");
    });

    it("should return 403 if user lacks delete permission", async () => {
      (defineUserPermissions as jest.Mock).mockReturnValue({
        can: () => false,
      });

      const res = await request(app.server)
        .delete(`/api/v1/restaurant/${mockRestaurantData.restaurantId}`)
        .set("Cookie", [`access_token=${mockToken}`]);

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe("Access denied");
    });

    it("should return 500 if deleteOne throws error", async () => {
      (defineUserPermissions as jest.Mock).mockReturnValue({
        can: () => true,
      });

      (restaurantModel.deleteOne as jest.Mock).mockRejectedValue(
        new Error("DB failure")
      );

      const res = await request(app.server)
        .delete(`/api/v1/restaurant/${mockRestaurantData.restaurantId}`)
        .set("Cookie", [`access_token=${mockToken}`]);

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe("DB failure");
    });
  });
});
