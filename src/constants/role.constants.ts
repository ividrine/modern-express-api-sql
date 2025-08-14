import {
  CREATE_USERS,
  READ_USERS,
  UPDATE_USERS,
  DELETE_USERS
} from "./permission.constants.js";

import { Role } from "@prisma/client";

const rolePrivileges = {
  [Role.USER]: [],
  [Role.ADMIN]: [CREATE_USERS, READ_USERS, UPDATE_USERS, DELETE_USERS]
};

export const ROLE_PRIVILEGES = new Map(Object.entries(rolePrivileges));
