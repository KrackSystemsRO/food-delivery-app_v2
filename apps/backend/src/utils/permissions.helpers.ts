import defineUserPermissions from "@/permissions/user.permissions";
import { FastifyReply } from "fastify";

export class ForbiddenError extends Error {
  status = 403;
  constructor(message = "Access denied") {
    super(message);
    this.name = "ForbiddenError";
  }
}

/**
 * Checks if the given role has permission to perform an action on a subject.
 * If unauthorized, sends a 403 Forbidden response and returns false.
 * Otherwise, returns true.
 */
export function checkPermissionOrThrow(
  role: string,
  action: string,
  subject: string
): void {
  const abilities = defineUserPermissions(role);
  if (!abilities.can(action, subject)) {
    throw new ForbiddenError();
  }
}

/**
 * Sends a 403 Forbidden response.
 */
function sendForbidden(reply: FastifyReply): void {
  reply.status(403).send({ status: 403, message: "Access denied" });
}
