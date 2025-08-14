import { ZodType } from "zod";

export type RequestSchema = {
  params?: ZodType;
  query?: ZodType;
  body?: ZodType;
};
