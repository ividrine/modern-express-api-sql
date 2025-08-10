import httpStatus from "http-status";
import tokenService from "./token.service.js";
import userService from "./user.service.js";
import ApiError from "../utils/ApiError.js";
import { TokenType } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../database/prisma/index.js";

const loginWithPassword = async (email: string, password: string) => {
  const user = await userService.getUserByEmail(email, true);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  return { ...user, ...{ password: undefined } };
};

const logout = async (token: string) => {
  const refreshToken = await prisma.token.findUnique({
    where: { token, type: TokenType.REFRESH, revoked: false }
  });
  if (!refreshToken) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not found");
  }
  await tokenService.removeToken(token);
};

const refreshAuth = async (refreshToken: string) => {
  const token = await tokenService.verifyToken(refreshToken, TokenType.REFRESH);

  const user = await userService.getUserById(token.userId);

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User does not exist.");
  }

  await tokenService.removeToken(refreshToken);
  return await tokenService.generateAuthTokens(user);
};

const resetPassword = async (
  resetPasswordToken: string,
  newPassword: string
) => {
  const resetPasswordTokenRow = await tokenService.verifyToken(
    resetPasswordToken,
    TokenType.RESET_PASSWORD
  );

  const user = resetPasswordTokenRow.user;

  await userService.updateUserById(user.id, {
    password: newPassword
  });

  await tokenService.removeManyTokens(user.id, TokenType.RESET_PASSWORD);
};

const verifyEmail = async (verifyEmailToken: string) => {
  const verifyEmailTokenRow = await tokenService.verifyToken(
    verifyEmailToken,
    TokenType.VERIFY_EMAIL
  );

  const user = verifyEmailTokenRow.user;

  await tokenService.removeManyTokens(user.id, TokenType.VERIFY_EMAIL);
  await userService.updateUserById(user.id, { is_email_verified: true });
};

export default {
  loginWithPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail
};
