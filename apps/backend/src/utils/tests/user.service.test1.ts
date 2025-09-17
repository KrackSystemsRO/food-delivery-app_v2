import request from "supertest";
import buildApp from "@/app";
import mongoose from "mongoose";
import userModel from "@/models/user.model";
import { compare, hash } from "bcryptjs";
import { mockUserData } from "@/models/__mocks__/user.model";
import jwt from "jsonwebtoken";
import defineUsersPermissions from "@/permissions/user.permissions";
import { configDotenv } from "dotenv";

configDotenv();

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

jest.mock("@/models/user.model");
jest.mock("jsonwebtoken");
jest.mock("@/permissions/user.permissions", () => ({
  __esModule: true,
  default: jest.fn(),
}));

import * as userService from "@/services/user.service";
import { UserType } from "@/types/user.type";

const JWT_SECRET = process.env.JWT_SECRET || "GnuGcc1281";

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

  // Default common mocks
  (userModel.findOne as jest.Mock).mockResolvedValue(null);
  (hash as jest.Mock).mockResolvedValue("mockHashedPassword");
  (defineUsersPermissions as jest.Mock).mockReturnValue({
    can: jest.fn(() => true),
  });
  (jwt.verify as jest.Mock).mockReturnValue({
    _id: mockUserData._id,
    userId: mockUserData.userId,
  });
  jest.spyOn(userService, "generateTokens").mockReturnValue({
    accessToken: "mocked_access_token",
    refreshToken: "mocked_refresh_token",
  });
});

function getAuthCookie(token = "mock.jwt.token") {
  return [`access_token=${token}`];
}

function getRefreshCookie(token = "mock.refresh.token") {
  return [`refresh_token=${token}`];
}

function mockLoggedInUser(overrides: Partial<UserType> = {}) {
  (userModel.findOne as jest.Mock).mockResolvedValue({
    ...mockUserData,
    ...overrides,
  });

  (userModel.findById as jest.Mock).mockResolvedValue({
    ...mockUserData,
    ...overrides,
  } as UserType);
}

describe("User Service - register", () => {
  it("should register a new user", async () => {
    const res = await request(app.server).post("/api/v1/register").send({
      email: "test@example.com",
      first_name: "John",
      last_name: "Doe",
      password: "SecurePass123",
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User registered successfully!");
  });
});

describe("User Service - login", () => {
  beforeEach(() => {
    mockLoggedInUser({ password: "hashedPassword" });
    (compare as jest.Mock).mockResolvedValue(true);
  });

  it("logs in a user", async () => {
    const res = await request(app.server)
      .post("/api/v1/login")
      .send({ email: "test@example.com", password: "plainPassword" });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("200");
    expect(res.body.message).toBe("Login successful!");
  });
});

describe("GET /api/v1/refresh-token", () => {
  it("returns 401 when no refresh token is provided", async () => {
    const res = await request(app.server).get("/api/v1/refresh-token").send();
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Refresh token is required" });
  });

  it("returns 403 for invalid refresh token", async () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    const res = await request(app.server)
      .get("/api/v1/refresh-token")
      .set("Cookie", getRefreshCookie("invalid.token"));

    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/invalid/i);
  });

  it("issues new tokens and sets cookies when refresh token is valid", async () => {
    const res = await request(app.server)
      .get("/api/v1/refresh-token")
      .set("Cookie", getRefreshCookie("valid.mock.token"));

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBe("mocked_access_token");
    expect(res.body.refreshToken).toBe("mocked_refresh_token");
  });
});

describe("GET /api/v1/user - getUserDetails", () => {
  beforeEach(() => {
    mockLoggedInUser();
  });

  it("returns 401 if no access_token cookie", async () => {
    const res = await request(app.server).get(`/api/v1/user`);
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Missing or invalid Authorization token");
  });

  it("returns 403 if user does not have read users permission", async () => {
    (defineUsersPermissions as jest.Mock).mockReturnValue({
      can: jest.fn(() => false),
    });
    mockLoggedInUser({ role: "CLIENT" });

    const token = jwt.sign(
      { _id: mockUserData._id, userId: mockUserData.userId },
      JWT_SECRET
    );
    const res = await request(app.server)
      .get(`/api/v1/user`)
      .set("Cookie", getAuthCookie(token));

    expect(res.status).toBe(403);
    expect(res.body.message).toBe("Access denied");
  });

  it("returns 404 if user not found by ID", async () => {
    mockLoggedInUser({ role: "CLIENT" });
    (userModel.findOne as jest.Mock).mockResolvedValue(null);

    const token = jwt.sign(
      { _id: mockUserData._id, userId: 99999 },
      JWT_SECRET
    );
    (jwt.verify as jest.Mock).mockReturnValue({
      _id: mockUserData._id,
      userId: 99999,
    });

    const res = await request(app.server)
      .get(`/api/v1/user`)
      .set("Cookie", getAuthCookie(token));

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("User not found");
  });

  it("returns 200 and user data excluding password on success", async () => {
    const token = jwt.sign(
      { _id: mockUserData._id, userId: mockUserData.userId },
      JWT_SECRET
    );

    (userModel.findOne as jest.Mock).mockResolvedValue({
      toObject: () => mockUserData,
    });

    const res = await request(app.server)
      .get(`/api/v1/user`)
      .set("Cookie", getAuthCookie(token));

    expect(res.status).toBe(200);
    expect(res.body.status).toBe(200);
    expect(res.body.result).toBeDefined();
    expect(res.body.result.password).toBeUndefined();
    expect(res.body.result.userId).toBe(mockUserData.userId);
  });

  it("returns 500 if an unexpected error occurs", async () => {
    const token = jwt.sign(
      { _id: mockUserData._id.toString(), userId: mockUserData.userId },
      JWT_SECRET
    );

    (userModel.findById as jest.Mock).mockImplementation(() => {
      throw new Error("Database failure");
    });

    const res = await request(app.server)
      .get(`/api/v1/user`)
      .set("Cookie", getAuthCookie(token));

    expect(res.status).toBe(500);
    expect(res.body.status).toBe(500);
    expect(res.body.message).toBe("Database failure");
  });
});

describe.each([
  ["/api/v1/user/:id", (id) => `/api/v1/user/${id}`],
  ["/api/v1/user (logged in user update)", () => "/api/v1/user"],
])("User Service - update tests for %s", (desc, getUrl) => {
  const mockToken = "mock.jwt.token";
  const updatePayload = {
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com",
    role: "ADMIN",
    phone_number: "1234567890",
    is_active: true,
    password: "newPassword",
    department: "Engineering",
    company: "Acme Inc",
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (jwt.verify as jest.Mock).mockReturnValue({
      _id: mockUserData._id,
      userId: mockUserData.userId,
    });

    (userModel.findOne as jest.Mock).mockResolvedValue({
      toObject: () => mockUserData,
    });

    (userModel.findById as jest.Mock).mockResolvedValue({
      role: mockUserData.role || "ADMIN",
    });

    (defineUsersPermissions as jest.Mock).mockReturnValue({
      can: () => true,
    });

    (hash as jest.Mock).mockResolvedValue("hashedNewPassword");

    (userModel.findOneAndUpdate as jest.Mock).mockResolvedValue(updatePayload);
  });

  it(`updates user info and returns 200 for ${desc}`, async () => {
    const url = getUrl(mockUserData.userId);
    const res = await request(app.server)
      .put(url)
      .send(updatePayload)
      .set("Cookie", [`access_token=${mockToken}`]);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User updated successfully!");
    expect(userModel.findOneAndUpdate).toHaveBeenCalled();
  });
});
