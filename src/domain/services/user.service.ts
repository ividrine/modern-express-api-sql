import httpStatus from "http-status";
import ApiError from "../../utils/ApiError.js";
import bcrypt from "bcrypt";

import {
  InsertableUser,
  SelectableUser,
  UpdatableUser
} from "../../infrastructure/types/wrappers.js";

import userRepository from "../../infrastructure/repositories/user.repository.js";
import {
  QueryObject,
  QueryOptions
} from "../../infrastructure/types/queries.js";

const saltRounds = 10;

const create = async (userBody: InsertableUser) => {
  if (await userRepository.isEmailTaken(userBody.email))
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");

  if (await userRepository.isUsernameTaken(userBody.username))
    throw new ApiError(httpStatus.BAD_REQUEST, "Username already taken");

  const password = await bcrypt.hash(userBody.password, saltRounds);
  const user = { ...userBody, ...{ password } };
  return userRepository.insertOne(user);
};

const findOne = async (
  query?: QueryObject<SelectableUser>,
  options?: QueryOptions
) => {
  return userRepository.findOne(query, options);
};

const updateOne = async (userId: string, updateBody: UpdatableUser) => {
  const user = await userRepository.findOne({ id: userId });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (
    updateBody.email &&
    (await userRepository.isEmailTaken(updateBody.email, userId))
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  Object.assign(user, updateBody);

  await userRepository.updateOne(userId, updateBody);
};

const remove = async (userId: string) => {
  const user = await userRepository.findOne({ id: userId });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  await userRepository.remove({ id: user.id });
  return user;
};

export default {
  create,
  findOne,
  updateOne,
  remove
};
