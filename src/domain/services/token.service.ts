import dayjs from "dayjs";
import httpStatus from "http-status";
import { v4 as uuid } from "uuid";
import config from "../../config/config.js";
import ApiError from "../../utils/ApiError.js";
import tokenTypes from "../../config/tokens.js";
import userService from "./user.service.js";
import { SignJWT, jwtVerify, JWTPayload } from "jose";
import tokenRepository from "../../infrastructure/repositories/token.repository.js";
import { SelectableUser } from "../../infrastructure/types/wrappers.js";

const generateToken = async (payload: JWTPayload): Promise<string> => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuer(config.jwt.iss)
    .setAudience(config.jwt.aud)
    .setIssuedAt()
    .sign(new TextEncoder().encode(config.jwt.secret));
};

const verifyToken = async (token: string, type: string) => {
  const verifyResult = await jwtVerify(token, config.jwt.secret);
  const user = await tokenRepository.findOneUser({
    token,
    userId: verifyResult.payload.sub,
    type,
    revoked: false
  });

  if (!user) {
    throw new Error("Token not found");
  }
  return user;
};

export const findOne = async (user: Partial<SelectableUser>) => {
  return await tokenRepository.findOne(user);
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user: Partial<SelectableUser>) => {
  const accessTokenExpires = dayjs().add(
    config.jwt.accessExpirationMinutes,
    "minutes"
  );

  const accessToken = await generateToken({
    sub: user.id,
    exp: accessTokenExpires.unix(),
    jti: uuid(),
    type: tokenTypes.ACCESS,
    role: user.role
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

  await tokenRepository.insertOne({
    userId: user.id,
    token: refreshToken,
    expires: refreshTokenExpires.toISOString(),
    revoked: false,
    type: tokenTypes.REFRESH
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
  const user = await userService.findUser({ email });
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

  await tokenRepository.insertOne({
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

  await tokenRepository.insertOne({
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
  return await tokenRepository.deleteOne(token);
};

export default {
  generateToken,
  deleteToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken
};
