import jwt, { JwtPayload as JwtVerifyPayload } from "jsonwebtoken";
import { FastifyReply, FastifyRequest } from "fastify";
import userModel from "@/models/user.model";
import { Types } from "@my-monorepo/shared";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
}

export interface JwtPayload extends JwtVerifyPayload {
  _id: string;
  userId: string;
}

/**
 * Verifies a JWT token and returns the decoded payload.
 * Throws an Error if verification fails.
 */
export function verifyToken(token: string | undefined): JwtPayload {
  if (!token) throw new Error("Token is required");
  if (!process.env.JWT_SECRET) throw new Error("JWT secret is not set");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as unknown;

    if (typeof decoded === "string") {
      throw new Error("Invalid token payload format");
    }

    // cast safely after checking type
    return decoded as JwtPayload;
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
}

/**
 * Sends a 401 Unauthorized response with a given message.
 */
export class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message = "Authorization required") {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = 401;
  }
}

export function unauthorized(message = "Authorization required"): never {
  throw new UnauthorizedError(message);
}

/**
 * Sends a 403 Forbidden response with a given message.
 */
export function forbidden(
  reply: FastifyReply,
  message = "Access denied"
): void {
  reply.status(403).send({ status: 403, message });
}

// export async function getUserFromRequest(
//   request: FastifyRequest,
//   reply: FastifyReply
// ) {
//   const token = request.cookies?.accessToken || request.cookies?.access_token;
//   if (!token) return unauthorized();

//   let payload;
//   try {
//     payload = verifyToken(token);
//   } catch {
//     return unauthorized();
//   }

//   const user = await userModel.findById(payload._id);
//   if (!user) return unauthorized();

//   return user;
// }

export async function getUserFromRequest(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<Types.User.UserType> {
  const token = request.cookies?.accessToken || request.cookies?.access_token;
  if (!token) return unauthorized();

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    return unauthorized();
  }

  const doc = await userModel
    .findById(payload._id)
    .populate("company") // now company is CompanyType[]
    .populate("department"); // now department is DepartmentType[]

  if (!doc) return unauthorized();

  const user = doc.toObject();

  // Normalize _id and return
  return {
    ...user,
    _id: user._id.toString(),
  } as unknown as Types.User.UserType;
}
