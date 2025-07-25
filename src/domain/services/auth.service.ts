import httpStatus from "http-status";
import tokenService from "./token.service.js";
import userService from "./user.service.js";
import ApiError from "../../utils/ApiError.js";
import tokenTypes from "../../config/tokens.js";
import bcrypt from "bcrypt";

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
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

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
// eslint-disable-next-line
const logout = async (refreshToken: string) => {
  throw new ApiError(
    httpStatus.INTERNAL_SERVER_ERROR,
    "Method not implemented"
  );
  // const refreshTokenDoc = await Token.findOne({
  //   token: refreshToken,
  //   type: tokenTypes.REFRESH,
  //   blacklisted: false
  // });
  // if (!refreshTokenDoc) {
  //   throw new ApiError(httpStatus.NOT_FOUND, "Not found");
  // }
  // await refreshTokenDoc.deleteOne();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
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

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
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
  throw new ApiError(
    httpStatus.INTERNAL_SERVER_ERROR,
    "Method not implemented"
  );
};

export default {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail
};
