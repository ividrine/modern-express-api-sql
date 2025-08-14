// test/sample.test.ts
import { expect, test, vi } from "vitest";
import userService from "../../../src/services/user.service.ts";
import prisma from "../../../src/database/prisma/__mocks__/prisma.ts";
import { userOne } from "../../fixtures/user.fixture.ts";

vi.mock("../../../src/database/prisma/prisma.ts");

test("createUser should return the generated user", async () => {
  prisma.user.findUnique.mockResolvedValue(null);
  prisma.user.create.mockResolvedValue(userOne);
  const user = await userService.createUser(userOne);
  expect(user).toStrictEqual(userOne);
});

test("createUser should fail", async () => {
  prisma.user.findUnique.mockResolvedValue(userOne);
  await expect(() => userService.createUser(userOne)).rejects.toThrowError();
});
