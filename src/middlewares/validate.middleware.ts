import httpStatus from "http-status";
import ApiError from "../utils/ApiError.js";
import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";

export type APIRequestSchema = {
  params?: ZodType;
  query?: ZodType;
  body?: ZodType;
};

const validate =
  (schema: APIRequestSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.params) {
        req.params = schema.params.parse(req.params) as Record<string, string>;
      }
      if (schema.query) {
        req.query = schema.query.parse(req.query) as Record<string, string>;
      }
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }
      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errorMessage = err.issues
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join(", ");
        return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
      } else {
        return next(err);
      }
    }
  };

export default validate;
