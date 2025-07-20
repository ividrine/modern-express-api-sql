import express from "express";
import validate from "../../middlewares/validate.middleware.js";
import authValidator from "../../validators/auth.validator.js";
import authController from "../../controllers/auth.controller.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

router.post(
  "/register",
  validate(authValidator.register),
  authController.register
);
router.post("/login", validate(authValidator.login), authController.login);
router.post("/logout", validate(authValidator.logout), authController.logout);
router.post(
  "/refresh-tokens",
  validate(authValidator.refreshTokens),
  authController.refreshTokens
);
router.post(
  "/forgot-password",
  validate(authValidator.forgotPassword),
  authController.forgotPassword
);
router.post(
  "/reset-password",
  validate(authValidator.resetPassword),
  authController.resetPassword
);
router.post(
  "/send-verification-email",
  auth(),
  authController.sendVerificationEmail
);
router.post(
  "/verify-email",
  validate(authValidator.verifyEmail),
  authController.verifyEmail
);

export default router;
