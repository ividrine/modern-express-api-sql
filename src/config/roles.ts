import {
  CREATE_USERS,
  READ_USERS,
  UPDATE_USERS,
  DELETE_USERS
} from "../constants/permission.constants.js";

const allRoles = {
  user: [],
  admin: [CREATE_USERS, READ_USERS, UPDATE_USERS, DELETE_USERS]
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
