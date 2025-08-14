import dayjs from "dayjs";
import { TokenType } from "@prisma/client";
import tokenService from "../../src/services/token.service";
import { userOne, admin } from "./user.fixture";

const accessTokenExpires = dayjs().add(30, "minutes");

export const userOneAccessToken = tokenService.generateToken(
  userOne.id,
  userOne.role,
  TokenType.ACCESS,
  accessTokenExpires.unix()
);

export const adminAccessToken = tokenService.generateToken(
  admin.id,
  admin.role,
  TokenType.ACCESS,
  accessTokenExpires.unix()
);
