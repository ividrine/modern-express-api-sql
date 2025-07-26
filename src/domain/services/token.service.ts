import dayjs from "dayjs";
import httpStatus from "http-status";
import { v4 as uuid } from "uuid";
import config from "../../config/config.js";
import ApiError from "../../utils/ApiError.js";
import tokenTypes from "../../config/tokens.js";
import userService from "./user.service.js";
import { SignJWT, jwtVerify, JWTPayload } from "jose";
import tokenRepository from "../../infrastructure/repositories/token.repository.js";
import {
  PublicUser,
  SelectableToken
} from "../../infrastructure/types/wrappers.js";

const generateToken = async (payload: JWTPayload): Promise<string> => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuer(config.jwt.iss)
    .setAudience(config.jwt.aud)
    .setIssuedAt()
    .sign(new TextEncoder().encode(config.jwt.secret));
};

const verifyToken = async (token: string, type: string) => {
  const verifyResult = await jwtVerify(
    token,
    new TextEncoder().encode(config.jwt.secret)
  );
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

const generateAuthTokens = async (user: PublicUser) => {
  const accessTokenExpires = dayjs().add(
    config.jwt.accessExpirationMinutes,
    "minutes"
  );

  const accessToken = await generateToken({
    sub: user.id,
    exp: accessTokenExpires.unix(),
    jti: uuid(),
    type: tokenTypes.ACCESS,
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
    expires: expires.toISOString(),
    revoked: false,
    type: tokenTypes.RESET_PASSWORD
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
    type: tokenTypes.VERIFY_EMAIL
  });

  await tokenRepository.insertOne({
    userId: userId,
    token: verifyEmailToken,
    expires: expires.toISOString(),
    revoked: false,
    type: tokenTypes.VERIFY_EMAIL
  });

  return verifyEmailToken;
};

const deleteToken = async (tokenId: string) => {
  return await tokenRepository.deleteOne(tokenId);
};

const deleteManyTokens = async (userId: string, type: string) => {
  return await tokenRepository.deleteMany(userId, type);
};

const findToken = async (token: Partial<SelectableToken>) => {
  return await tokenRepository.findOne(token);
};

export default {
  generateToken,
  deleteToken,
  deleteManyTokens,
  verifyToken,
  findToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken
};
