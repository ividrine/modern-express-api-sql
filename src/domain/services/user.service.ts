import httpStatus from "http-status";
import ApiError from "../../utils/ApiError.js";
import bcrypt from "bcrypt";

import {
  InsertableUser,
  SelectableUser,
  UpdatableUser
} from "../../infrastructure/types/wrappers.js";

import userRepository from "../../infrastructure/repositories/user.repository.js";

const saltRounds = 10;
/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody: InsertableUser) => {
  if (await userRepository.isEmailTaken(userBody.email))
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  const password = await bcrypt.hash(userBody.password, saltRounds);
  const user = { ...userBody, ...{ password } };
  return userRepository.insertOne(user);
};
/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const findUserByEmailOrUsername = async (identifier: string) => {
  return userRepository.findByEmailOrUsername(identifier);
};

const findUser = async (criteria: Partial<SelectableUser>) => {
  return userRepository.findOne(criteria);
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId: string, updateBody: UpdatableUser) => {
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

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId: string) => {
  const user = await userRepository.findOne({ id: userId });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  await userRepository.deleteOne(userId);
  return user;
};

export default {
  createUser,
  findUserByEmailOrUsername,
  findUser,
  updateUserById,
  deleteUserById
};
