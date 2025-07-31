import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import {
  authService,
  userService,
  tokenService,
  emailService
} from "../../domain/services";
import ApiError from "../../utils/ApiError";

const register = catchAsync(async (req, res) => {
  const user = await userService.create(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { identifier, password } = req.body;
  const user = await authService.loginWithPassword(identifier, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const user = await userService.findOne({
    $or: [{ username: req.body.identifier, email: req.body.identifier }]
  });

  if (!user) throw new ApiError(httpStatus.BAD_REQUEST, "Error fetching user");

  const resetPasswordToken = await tokenService.generateResetPasswordToken(
    user.email
  );

  await emailService.sendResetPasswordEmail(user.email, resetPasswordToken);

  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token as string, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(
    req.auth?.payload.sub as string
  );
  await emailService.sendVerificationEmail(
    req.auth?.payload.email as string,
    verifyEmailToken
  );
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token as string);
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail
};
