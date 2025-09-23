// models
import userModel from "@/models/user.model";
import tokenModel from "@/models/token.model";
// utils & types
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { generateRandomPassword } from "@/utils/generateRndomPassword";
import { getQueryById } from "@/utils/getQueryById";
import { checkPermissionOrThrow } from "@/utils/permissions.helpers";
import { Types as MongooseTypes } from "mongoose";
import { Types } from "@my-monorepo/shared";

export const JWT_SECRET = process.env.JWT_SECRET || "GnuGcc1281";
export const JWT_EXPIRATION = process.env.JWT_EXPIRATION
  ? parseInt(process.env.JWT_EXPIRATION)
  : 36000000;
export const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION
  ? parseInt(process.env.REFRESH_TOKEN_EXPIRATION)
  : 604800000;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};

async function sendResetEmail(to: string, token: string) {
  const resetLink = `${process.env.APP_BASE_URL}/reset-password/${token}`;
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to,
    subject: "Resetare parolă / Password Reset",
    html: `
      <p>Ați solicitat o resetare a parolei contului dumneavoastră.</p>
      <p>Vă rugăm să accesați linkul de mai jos pentru a seta o parolă nouă:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Acest link este valabil timp de 1 oră.</p>
      <hr />
      <p>You have requested to reset your account password.</p>
      <p>Please click the link below to set a new password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link is valid for 1 hour.</p>
    `,
  };
  return transporter.sendMail(mailOptions);
}

export async function generateTokens(userId: string, _id: string) {
  const accessToken = jwt.sign({ userId, _id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });
  const refreshToken = jwt.sign({ userId, _id }, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRATION,
  });

  await tokenModel.create({
    token: refreshToken,
    userId,
    type: "refresh",
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRATION),
  });

  return { accessToken, refreshToken };
}

export async function registerUser(data: {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}) {
  const existingUser = await userModel.findOne({ email: data.email });
  if (existingUser) throw new Error("Email already exists");

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = new userModel({
    email: data.email,
    first_name: data.first_name,
    last_name: data.last_name,
    password: hashedPassword,
    role: "CLIENT",
  });

  await user.save();

  const tokens = await generateTokens(
    user.userId.toString(),
    user._id.toString()
  );
  const userObj = user.toObject();
  const { password, ...userWithoutPassword } = userObj;

  return { user: userWithoutPassword, ...tokens };
}

export async function loginUser(email: string, pswd: string) {
  const user = await userModel.findOne({ email });
  if (!user) throw new Error("User not found");

  const isValid = await bcrypt.compare(pswd, user.password);
  if (!isValid) throw new Error("Invalid email or password");

  const tokens = await generateTokens(
    user.userId.toString(),
    user._id.toString()
  );

  const userObj = user.toObject();
  const { password, ...userWithoutPassword } = userObj;

  return { user: userWithoutPassword, ...tokens };
}

export async function logoutUser(refreshToken: string) {
  await tokenModel.deleteOne({ token: refreshToken });
}

export async function createUser(
  data: Partial<Types.User.UserType>,
  role: string
) {
  checkPermissionOrThrow(role, "create", "users");

  const pswd = data.password || generateRandomPassword();
  const hashedPassword = await bcrypt.hash(pswd, 10);

  const user = new userModel({ ...data, password: hashedPassword });
  await user.save();

  const userObj = user.toObject();
  const { password, ...userWithoutPassword } = userObj;

  return userWithoutPassword;
}

export async function getUserById(
  userId: string | MongooseTypes.ObjectId,
  role: string
) {
  checkPermissionOrThrow(role, "read", "users");

  const user = await userModel
    .findById(userId)
    .populate("company")
    .populate("department")
    .lean();

  if (!user) throw new Error("User not found");

  const { password, ...userWithoutPassword } = user;

  return userWithoutPassword;
}

export async function listUsers(
  filter: Record<string, any>,
  page = 1,
  limit = 10,
  sortParam: Record<string, 1 | -1> = { createdAt: -1 },
  role: string
) {
  checkPermissionOrThrow(role, "read", "users");
  const skip = (page - 1) * limit;

  // Ensure the sort parameter is compatible with Mongoose
  const sort: { [key: string]: 1 | -1 } = sortParam;

  const [users, totalCount] = await Promise.all([
    userModel.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    userModel.countDocuments(filter),
  ]);

  // Remove passwords for security
  const sanitizedUsers = users.map((user) => {
    const u = { ...user };
    const { password, ...userWithoutPassword } = u;
    return userWithoutPassword;
  });

  return {
    result: sanitizedUsers,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
  };
}

export async function updateUser(
  userId: string,
  data: Partial<Types.User.UserType>,
  role: string
) {
  checkPermissionOrThrow(role, "update", "users");

  if (data.password) data.password = await bcrypt.hash(data.password, 10);

  const updatedUser = await userModel.findOneAndUpdate(
    getQueryById(userId, "userId"),
    data,
    { new: true }
  );
  if (!updatedUser) throw new Error("User not found");

  const userObj = updatedUser.toObject();
  const { password, ...userWithoutPassword } = userObj;

  return userWithoutPassword;
}

export async function deleteUser(userId: string, role: string) {
  checkPermissionOrThrow(role, "delete", "users");

  const deleted = await userModel
    .findOneAndDelete(getQueryById(userId, "userId"))
    .lean();
  if (!deleted) throw new Error("User not found");

  return deleted;
}

export async function forgotPassword(email: string) {
  const user = await userModel.findOne({ email });
  if (!user) return;

  const token = crypto.randomBytes(32).toString("hex");
  user.resetToken = token;
  user.resetTokenExpires = new Date(Date.now() + 3600000);
  await user.save();

  await sendResetEmail(user.email, token);
}

export async function resetPassword(token: string, newPassword: string) {
  const user = await userModel.findOne({
    resetToken: token,
    resetTokenExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Invalid or expired token");

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;

  await user.save();
}
export async function refreshTokens(oldRefreshToken: string) {
  if (!oldRefreshToken) throw new Error("Refresh token is required");

  // Check if the refresh token exists in DB
  const storedToken = await tokenModel.findOne({
    token: oldRefreshToken,
    type: "refresh",
  });
  if (!storedToken) throw new Error("Invalid refresh token");

  // Verify the token signature
  let decoded: any;
  try {
    decoded = jwt.verify(oldRefreshToken, JWT_SECRET) as {
      userId: string;
      _id: string;
    };
  } catch (err) {
    await tokenModel.deleteOne({ token: oldRefreshToken }); // remove invalid token
    throw new Error("Invalid or expired refresh token");
  }

  // Generate new tokens
  const { accessToken, refreshToken } = await generateTokens(
    decoded.userId,
    decoded._id
  );

  // Remove the old refresh token from DB
  await tokenModel.deleteOne({ token: oldRefreshToken });

  return { accessToken, refreshToken };
}
