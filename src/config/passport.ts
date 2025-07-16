import passport from "passport-jwt";
import config from "./config.js";
import tokenTypes from "./tokens.js";

const { Strategy, ExtractJwt } = passport;

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

const jwtVerify: passport.VerifyCallback = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error("Invalid token type");
    }

    // Todo implement user
    done(null, false);
  } catch (error) {
    done(error, false);
  }
};

export const jwtStrategy = new Strategy(jwtOptions, jwtVerify);
