import httpStatus from "http-status";
import ApiError from "../utils/ApiError.js";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import prisma from "../lib/prisma/index.js";
import type { PaginationArgs } from "../lib/prisma/extensions/paginate.js";
import { InsertableUser, SelectableUser } from "../types/user.js";

const salt = 10;

const createUser = async (userBody: InsertableUser) => {
  if (await prisma.user.findUnique({ where: { email: userBody.email } }))
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");

  const password = await bcrypt.hash(userBody.password, salt);

  return await prisma.user.create({ data: { ...userBody, password } });
};

const queryUsers = async (args: PaginationArgs<SelectableUser>) =>
  await prisma.user.paginate(args);

const getUserById = async (id: string, withPassword: boolean = false) =>
  await prisma.user.findUnique({
    where: { id },
    omit: { password: !withPassword }
  });

const getUserByEmail = async (email: string, withPassword: boolean = false) =>
  await prisma.user.findUnique({
    where: { email },
    omit: { password: !withPassword }
  });

const updateUserById = async (id: string, updateBody: Partial<User>) => {
  const user = await getUserById(id);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");

  const isEmailTaken =
    updateBody.email &&
    (await prisma.user.findFirst({
      where: { email: updateBody.email, id: { not: id } }
    }));

  if (isEmailTaken)
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");

  if (updateBody.password)
    updateBody.password = await bcrypt.hash(updateBody.password, salt);

  const updatedUser = await prisma.user.update({
    where: { id },
    data: updateBody
  });

  return updatedUser;
};

const deleteUserById = async (id: string) => {
  const user = await getUserById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  return await prisma.user.delete({ where: { id } });
};

export default {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById
};
