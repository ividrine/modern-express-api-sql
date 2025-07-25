import httpStatus from "http-status";
import tokenService from "./token.service.js";
import userService from "./user.service.js";
import ApiError from "../../utils/ApiError.js";
import tokenTypes from "../../config/tokens.js";
import bcrypt from "bcrypt";

const loginUserWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  const user = await userService.findUserByEmailOrUsername(email);
  if (!user || !bcrypt.compare(user.password, password)) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  return { ...user, ...{ password: undefined } };
};

const logout = async (token: string) => {
  const refreshToken = await tokenService.findToken({
    token,
    type: tokenTypes.REFRESH,
    revoked: false
  });
  if (!refreshToken) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not found");
  }
  await tokenService.deleteToken(refreshToken.id);
};

const refreshAuth = async (refreshToken: string) => {
  try {
    const user = await tokenService.verifyToken(
      refreshToken,
      tokenTypes.REFRESH
    );
    if (!user) {
      throw new Error();
    }
    await tokenService.deleteToken(refreshToken);
    return await tokenService.generateAuthTokens(user);
  } catch {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
  }
};

const resetPassword = async (
  // eslint-disable-next-line
  resetPasswordToken: string | undefined,
  // eslint-disable-next-line
  newPassword: string
) => {
  throw new ApiError(
    httpStatus.INTERNAL_SERVER_ERROR,
    "Method not implemented"
  );
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
// eslint-disable-next-line
const verifyEmail = async (verifyEmailToken: string) => {
  const user = await tokenService.verifyToken(
    verifyEmailToken,
    tokenTypes.VERIFY_EMAIL
  );

  await tokenService.deleteManyTokens(user.id, tokenTypes.VERIFY_EMAIL);
  await userService.updateUserById(user.id, { is_email_verified: true });
};

export default {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail
};
