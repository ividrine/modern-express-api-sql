import { auth } from "express-oauth2-jwt-bearer";
import config from "../config/config.js";
import httpStatus from "http-status";
import type { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError.js";
import { TokenType, Role } from "@prisma/client";
import { ROLE_PRIVILEGES } from "../constants/role.constants.js";

const { secret, issuer, audience } = config.jwt;

const authorize =
  (...permissions: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    auth({
      secret,
      issuer,
      audience,
      tokenSigningAlg: "HS256"
    })(req, res, () => {
      const payload = req.auth?.payload;

      if (payload?.type != TokenType.ACCESS) {
        next(new Error("Invalid token type"));
      }

      const privileges = ROLE_PRIVILEGES.get(payload?.role as Role) as string[];

      const hasPrivileges = permissions.every((permission) =>
        privileges.includes(permission)
      );

      // This is an import condition.
      // On /:userId routes a user doesn't need specific permissions to access / modify their own data.
      if (!hasPrivileges && req.params?.userId !== payload?.sub) {
        next(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
      }

      next();
    });
  };

export default authorize;
