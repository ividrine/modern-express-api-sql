import httpStatus from "http-status";
import ApiError from "../../utils/ApiError.js";
import {
  InsertableUser,
  UpdatableUser
} from "../../infrastructure/types/wrappers.js";
import {
  findUserById,
  findUserByEmail,
  insertUser,
  isEmailTaken,
  deleteUser,
  updateUser
} from "../../infrastructure/repositories/user.repository.js";

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody: InsertableUser) => {
  if (await isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  return insertUser(userBody);
};
/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id: string) => {
  return findUserById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email: string) => {
  return findUserByEmail(email);
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId: string, updateBody: UpdatableUser) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (updateBody.email && (await isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  Object.assign(user, updateBody);

  await updateUser(userId, updateBody);
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId: string) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  await deleteUser(userId);
  return user;
};

export default {
  createUser,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById
};
