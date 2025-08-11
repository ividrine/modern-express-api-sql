import * as z from "zod";
import { Role } from "@prisma/client";
import {
  PW_LENGTH,
  PW_PATTERN,
  EMAIL_REQUIRED,
  INVALID_EMAIL,
  PW_REQUIRED
} from "../constants/validate.constants.js";

const createUser = {
  body: z.object({
    email: z.email({
      error: (iss) => (iss.input === undefined ? EMAIL_REQUIRED : INVALID_EMAIL)
    }),
    password: z
      .string(PW_REQUIRED)
      .min(8, PW_LENGTH)
      .refine(
        (password) => password.match(/\d/) && password.match(/[a-zA-Z]/),
        {
          message: PW_PATTERN
        }
      ),
    role: z.enum(Role)
  })
};

const getUsers = {
  query: z.object({
    email: z.string().optional(),
    role: z.string().optional(),
    sortBy: z.string().optional(),
    limit: z.number().int().optional(),
    page: z.number().int().optional()
  })
};

const getUser = {
  params: z.object({
    userId: z.string()
  })
};

const updateUser = {
  params: z.object({ userId: z.string() }),
  body: z.object({
    email: z.email().optional(),
    password: z
      .string()
      .min(8, PW_LENGTH)
      .refine(
        (password) => password.match(/\d/) && password.match(/[a-zA-Z]/),
        {
          message: PW_PATTERN
        }
      )
      .optional()
  })
};

const deleteUser = {
  params: z.object({ userId: z.string() })
};

export default {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser
};
