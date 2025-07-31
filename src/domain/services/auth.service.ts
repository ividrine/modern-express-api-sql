import httpStatus from "http-status";
import tokenService from "./token.service.js";
import userService from "./user.service.js";
import ApiError from "../../utils/ApiError.js";
import tokenTypes from "../../config/tokens.js";
import bcrypt from "bcrypt";

const loginWithPassword = async (identifier: string, password: string) => {
  const user = await userService.findOne(
    {
      $or: [{ username: identifier, email: identifier }]
    },
    { omitSensitive: false }
  );

  const isPasswordValid = await bcrypt.compare(password, user?.password);

  if (!user || !isPasswordValid) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }

  return { ...user, ...{ password: undefined } };
};

const logout = async (token: string) => {
  const refreshToken = await tokenService.findOne({
    token,
    type: tokenTypes.REFRESH,
    revoked: false
  });
  if (!refreshToken) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not found");
  }
  await tokenService.remove({ id: refreshToken.id });
};

const refreshAuth = async (refreshToken: string) => {
  const user = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User does not exist.");
  }
  await tokenService.remove({ token: refreshToken });
  return await tokenService.generateAuthTokens(user);
};

const resetPassword = async (
  resetPasswordToken: string,
  newPassword: string
) => {
  const user = await tokenService.verifyToken(
    resetPasswordToken,
    tokenTypes.RESET_PASSWORD
  );

  if (!user) throw new Error();

  await userService.updateOne(user.id, { password: newPassword });

  await tokenService.remove({
    userId: user.id,
    type: tokenTypes.RESET_PASSWORD
  });
};

const verifyEmail = async (verifyEmailToken: string) => {
  const user = await tokenService.verifyToken(
    verifyEmailToken,
    tokenTypes.VERIFY_EMAIL
  );

  await tokenService.remove({
    userId: user.id,
    type: tokenTypes.VERIFY_EMAIL
  });
  await userService.updateOne(user.id, { is_email_verified: true });
};

export default {
  loginWithPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail
};
