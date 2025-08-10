import dayjs from "dayjs";
import httpStatus from "http-status";
import { v4 as uuid } from "uuid";
import config from "../config/config.js";
import ApiError from "../utils/ApiError.js";
import { TokenType } from "@prisma/client";
import userService from "./user.service.js";
import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { User } from "@prisma/client";
import prisma from "../database/prisma/index.js";

const generateToken = async (payload: JWTPayload): Promise<string> => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuer(config.jwt.iss)
    .setAudience(config.jwt.aud)
    .setIssuedAt()
    .sign(new TextEncoder().encode(config.jwt.secret));
};

const saveToken = async (
  token: string,
  userId: string,
  expires: string,
  type: string,
  revoked: boolean = false
) => {
  const tokenRow = await prisma.token.create({
    data: {
      token,
      userId,
      expires,
      type,
      revoked
    }
  });
  return tokenRow;
};

const removeToken = async (token: string) =>
  await prisma.token.delete({ where: { token } });

const removeManyTokens = async (userId: string, type: string) =>
  await prisma.token.deleteMany({ where: { userId, type } });

const verifyToken = async (token: string, type: string) => {
  const verifyResult = await jwtVerify(
    token,
    new TextEncoder().encode(config.jwt.secret)
  );

  const { payload } = verifyResult;

  const tokenRow = await prisma.token.findUnique({
    where: { token, type, userId: payload.sub, revoked: false },
    include: { user: true }
  });

  if (!tokenRow) {
    throw new Error("Token not found");
  }

  return tokenRow;
};

const generateAuthTokens = async (
  user: Pick<User, "id" | "role" | "email">
) => {
  const accessTokenExpires = dayjs().add(
    config.jwt.accessExpirationMinutes,
    "minutes"
  );

  const accessToken = await generateToken({
    sub: user.id,
    exp: accessTokenExpires.unix(),
    jti: uuid(),
    type: TokenType.ACCESS,
    role: user.role,
    email: user.email
  });

  const refreshTokenExpires = dayjs().add(
    config.jwt.refreshExpirationDays,
    "days"
  );

  const refreshToken = await generateToken({
    sub: user.id,
    jti: uuid(),
    exp: accessTokenExpires.unix(),
    type: TokenType.REFRESH
  });

  await prisma.token.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expires: refreshTokenExpires.toISOString(),
      revoked: false,
      type: TokenType.REFRESH
    }
  });

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate()
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate()
    }
  };
};

const generateResetPasswordToken = async (email: string) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "No users found with this email");
  }
  const expires = dayjs().add(
    config.jwt.resetPasswordExpirationMinutes,
    "minutes"
  );

  const resetPasswordToken = await generateToken({
    sub: user.id,
    exp: expires.unix(),
    type: TokenType.RESET_PASSWORD
  });

  await prisma.token.create({
    data: {
      userId: user.id,
      token: resetPasswordToken,
      expires: expires.toISOString(),
      revoked: false,
      type: TokenType.RESET_PASSWORD
    }
  });

  return resetPasswordToken;
};

const generateVerifyEmailToken = async (userId: string) => {
  const expires = dayjs().add(
    config.jwt.verifyEmailExpirationMinutes,
    "minutes"
  );

  const verifyEmailToken = await generateToken({
    sub: userId,
    exp: expires.unix(),
    type: TokenType.VERIFY_EMAIL
  });

  await prisma.token.create({
    data: {
      userId: userId,
      token: verifyEmailToken,
      expires: expires.toISOString(),
      revoked: false,
      type: TokenType.VERIFY_EMAIL
    }
  });

  return verifyEmailToken;
};

export default {
  generateToken,
  saveToken,
  removeToken,
  removeManyTokens,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken
};
