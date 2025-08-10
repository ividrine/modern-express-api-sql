import * as z from "zod";
import {
  PW_LENGTH_ERROR,
  PW_PATTERN_ERROR
} from "../constants/validate.constants.js";

import { APIRequestSchema } from "../middlewares/validate.middleware.js";

const register: APIRequestSchema = {
  body: z.strictObject({
    email: z.email(),
    username: z.string(),
    password: z
      .string()
      .min(8, PW_LENGTH_ERROR)
      .refine(
        (password) => password.match(/\d/) && password.match(/[a-zA-Z]/),
        {
          message: PW_PATTERN_ERROR
        }
      )
  })
};

const login: APIRequestSchema = {
  body: z.strictObject({
    identifier: z.string(),
    password: z.string()
  })
};

const logout: APIRequestSchema = {
  body: z.strictObject({
    refreshToken: z.string()
  })
};

const refreshTokens: APIRequestSchema = {
  body: z.strictObject({
    refreshToken: z.string()
  })
};

const forgotPassword: APIRequestSchema = {
  body: z.strictObject({
    identifier: z.string() || z.email()
  })
};

const resetPassword: APIRequestSchema = {
  query: z.strictObject({
    token: z.string()
  }),
  body: z.strictObject({
    password: z
      .string()
      .min(8, PW_LENGTH_ERROR)
      .refine(
        (password) => password.match(/\d/) && password.match(/[a-zA-Z]/),
        {
          message: PW_PATTERN_ERROR
        }
      )
  })
};

const verifyEmail: APIRequestSchema = {
  query: z.strictObject({
    token: z.string()
  })
};

export default {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail
};
