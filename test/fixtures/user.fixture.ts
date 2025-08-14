import { faker } from "@faker-js/faker";
import { Role } from "@prisma/client";

const password = "password1";

export const userOne = {
  id: "1",
  email: faker.internet.email().toLowerCase(),
  password,
  role: Role.USER,
  isEmailVerified: false,
  createdAt: new Date(),
  updatedAt: new Date()
};

export const userTwo = {
  id: "2",
  email: faker.internet.email().toLowerCase(),
  password,
  role: Role.USER,
  isEmailVerified: false,
  createdAt: new Date(),
  updatedAt: new Date()
};

export const admin = {
  id: "3",
  email: faker.internet.email().toLowerCase(),
  password,
  role: Role.ADMIN,
  isEmailVerified: false,
  createdAt: new Date(),
  updatedAt: new Date()
};
