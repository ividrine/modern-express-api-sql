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
      if (schema.params)
        Object.assign(req.params, schema.params.parse(req.params));
      if (schema.query) Object.assign(req.query, schema.query.parse(req.query));
      if (schema.body) Object.assign(schema.body, schema.body.parse(req.body));
      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        return next(
          new ApiError(
            httpStatus.BAD_REQUEST,
            err.issues.length > 0 ? err.issues[0].message : "Invalid request"
          )
        );
      } else {
        return next(err);
      }
    }
  };

export default validate;
