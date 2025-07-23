import dayjs from "dayjs";
import httpStatus from "http-status";
import { v4 as uuid } from "uuid";
import config from "../../config/config.js";
import ApiError from "../../utils/ApiError.js";
import tokenTypes from "../../config/tokens.js";
import userService from "./user.service.js";
import { SignJWT, jwtVerify, JWTPayload } from "jose";
import {
  insertToken,
  findToken,
  deleteTokenByValue
} from "../../infrastructure/repositories/token.repository.js";
import { User } from "../domain/user.js";

const generateToken = async (payload: JWTPayload): Promise<string> => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .sign(config.jwt.secret);
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token: string, type: string) => {
  const verifyResult = await jwtVerify(token, config.jwt.secret);
  const tokenRow = await findToken({
    token,
    userId: verifyResult.payload.sub,
    type
  });

  if (!tokenRow) {
    throw new Error("Token not found");
  }
  return tokenRow;
};

export const findOne = async (user: Partial<User>) => {
  return await findToken(user);
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user: { id: string }) => {
  const accessTokenExpires = dayjs().add(
    config.jwt.accessExpirationMinutes,
    "minutes"
  );

  const accessToken = await generateToken({
    sub: user.id,
    exp: accessTokenExpires.unix(),
    jti: uuid(),
    type: tokenTypes.ACCESS
  });

  const refreshTokenExpires = dayjs().add(
    config.jwt.refreshExpirationDays,
    "days"
  );

  const refreshToken = await generateToken({
    sub: user.id,
    jti: uuid(),
    exp: accessTokenExpires.unix(),
    type: tokenTypes.REFRESH
  });

  await insertToken({
    userId: user.id,
    token: refreshToken,
    expires: refreshTokenExpires.toDate(),
    revoked: false,
    type: tokenTypes.REFRESH,
    updated_at: Date.now().toString()
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

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
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
    type: tokenTypes.RESET_PASSWORD
  });

  await insertToken({
    userId: user.id,
    token: resetPasswordToken,
    expires: expires.toDate(),
    revoked: false,
    type: tokenTypes.RESET_PASSWORD,
    updated_at: Date.now().toString()
  });

  return resetPasswordToken;
};

/**
 * Generate verify email token
 * @param {User} user
 * @returns {Promise<string>}
 */
const generateVerifyEmailToken = async (userId: string) => {
  const expires = dayjs().add(
    config.jwt.verifyEmailExpirationMinutes,
    "minutes"
  );

  const verifyEmailToken = await generateToken({
    sub: userId,
    exp: expires.unix(),
    type: tokenTypes.VERIFY_EMAIL
  });

  await insertToken({
    userId: userId,
    token: verifyEmailToken,
    expires: expires.toDate(),
    revoked: false,
    type: tokenTypes.VERIFY_EMAIL,
    updated_at: Date.now().toString()
  });

  return verifyEmailToken;
};

const deleteToken = async (token: string) => {
  return await deleteTokenByValue(token);
};

export default {
  generateToken,
  deleteToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken
};
