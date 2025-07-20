import { GET_USERS, MANAGE_USERS } from "./permissions";

const allRoles = {
  user: [],
  admin: [GET_USERS, MANAGE_USERS]
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
