import express from "express";
import authorize from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import userValidation from "../../validations/user.validation.js";
import userController from "../../controllers/user.controller.js";
import {
  CREATE_USERS,
  READ_USERS,
  UPDATE_USERS,
  DELETE_USERS
} from "../../constants/permission.constants.js";

const router = express.Router();

router
  .route("/")
  .post(
    authorize(CREATE_USERS),
    validate(userValidation.createUser),
    userController.createUser
  )
  .get(
    authorize(READ_USERS),
    validate(userValidation.getUsers),
    userController.getUsers
  );

router
  .route("/:userId")
  .get(
    authorize(READ_USERS),
    validate(userValidation.getUser),
    userController.getUser
  )
  .patch(
    authorize(UPDATE_USERS),
    validate(userValidation.updateUser),
    userController.updateUser
  )
  .delete(
    authorize(DELETE_USERS),
    validate(userValidation.deleteUser),
    userController.deleteUser
  );

export default router;
