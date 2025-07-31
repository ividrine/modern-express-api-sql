import * as z from "zod";
import {
  PW_LENGTH_ERROR,
  PW_PATTERN_ERROR
} from "../constants/errors.constants";

const createUser = {
  body: z.strictObject({
    email: z.email(),
    password: z
      .string()
      .min(8, PW_LENGTH_ERROR)
      .refine(
        (password) => password.match(/\d/) && password.match(/[a-zA-Z]/),
        {
          message: PW_PATTERN_ERROR
        }
      ),
    username: z.string(),
    role: z.enum(["user", "admin"])
  })
};

const getUsers = {
  query: z.strictObject({
    username: z.string(),
    role: z.string(),
    sortBy: z.string(),
    limit: z.number().int(),
    page: z.number().int()
  })
};

const getUser = {
  params: z.strictObject({
    userId: z.string()
  })
};

const updateUser = {
  params: z.strictObject({ userId: z.string() }),
  body: z.object({
    email: z.email().optional(),
    username: z.string().optional(),
    password: z
      .string()
      .min(8, PW_LENGTH_ERROR)
      .refine(
        (password) => password.match(/\d/) && password.match(/[a-zA-Z]/),
        {
          message: PW_PATTERN_ERROR
        }
      )
      .optional()
  })
};

const deleteUser = {
  params: z.strictObject({ userId: z.string() })
};

export default {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser
};
