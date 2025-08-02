import { auth } from "express-oauth2-jwt-bearer";
import config from "../../config/config.js";
import httpStatus from "http-status";
import type { Request, Response, NextFunction } from "express";
import ApiError from "../../utils/ApiError.js";
import tokenTypes from "../../config/tokens.js";
import { roleRights } from "../../config/roles.js";

export const authorize = (...permissions: string[]) => [
  auth({
    secret: config.jwt.secret,
    tokenSigningAlg: "HS256",
    issuer: config.jwt.iss,
    audience: config.jwt.aud
  }),
  (req: Request, res: Response, next: NextFunction) => {
    const payload = req.auth?.payload;
    const userRole = payload?.role as string;
    const privileges = roleRights.get(userRole) as string[];

    const hasPrivileges = permissions.every((permission) =>
      privileges.includes(permission)
    );

    if (payload?.type != tokenTypes.ACCESS) {
      next(new Error("Invalid token type"));
    }

    // This is an import condition.
    // On /:userId routes a user doesn't need specific permissions to access / modify their own data.
    if (!hasPrivileges && req.params?.userId !== payload?.sub) {
      next(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
    }

    next();
  }
];
