import * as z from "zod";
import {
  PW_LENGTH,
  PW_PATTERN,
  PW_REQUIRED,
  INVALID_EMAIL,
  EMAIL_REQUIRED,
  INVALID_TOKEN
} from "../constants/validate.constants.js";

import type { RequestSchema } from "../types/request.js";

const register: RequestSchema = {
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
      )
  })
};

const login: RequestSchema = {
  body: z.object({
    email: z.email({
      error: (iss) => (iss.input === undefined ? EMAIL_REQUIRED : INVALID_EMAIL)
    }),
    password: z.string(PW_REQUIRED)
  })
};

const logout: RequestSchema = {
  body: z.object({
    refreshToken: z.string(INVALID_TOKEN).min(1, INVALID_TOKEN)
  })
};

const refreshTokens: RequestSchema = {
  body: z.object({
    refreshToken: z.string(INVALID_TOKEN).min(1, INVALID_TOKEN)
  })
};

const forgotPassword: RequestSchema = {
  body: z.object({
    email: z.email({
      error: (iss) => (iss.input === undefined ? EMAIL_REQUIRED : INVALID_EMAIL)
    })
  })
};

const resetPassword: RequestSchema = {
  query: z.object({
    token: z.string(INVALID_TOKEN).min(1, INVALID_TOKEN)
  }),
  body: z.object({
    password: z
      .string(PW_REQUIRED)
      .min(8, PW_LENGTH)
      .refine(
        (password) => password.match(/\d/) && password.match(/[a-zA-Z]/),
        { message: PW_PATTERN }
      )
  })
};

const verifyEmail: RequestSchema = {
  query: z.object({
    token: z.string(INVALID_TOKEN).min(1, INVALID_TOKEN)
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
