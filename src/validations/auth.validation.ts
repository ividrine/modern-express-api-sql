import * as z from "zod";
import {
  PW_LENGTH,
  PW_PATTERN,
  PW_REQUIRED,
  INVALID_EMAIL,
  EMAIL_REQUIRED,
  INVALID_TOKEN
} from "../constants/validate.constants.js";

const register = {
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

const login = {
  body: z.object({
    email: z.email({
      error: (iss) => (iss.input === undefined ? EMAIL_REQUIRED : INVALID_EMAIL)
    }),
    password: z.string(PW_REQUIRED)
  })
};

const logout = {
  body: z.object({
    refreshToken: z.string(INVALID_TOKEN).min(1, INVALID_TOKEN)
  })
};

const refreshTokens = {
  body: z.object({
    refreshToken: z.string(INVALID_TOKEN).min(1, INVALID_TOKEN)
  })
};

const forgotPassword = {
  body: z.object({
    email: z.email({
      error: (iss) => (iss.input === undefined ? EMAIL_REQUIRED : INVALID_EMAIL)
    })
  })
};

const resetPassword = {
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

const verifyEmail = {
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
