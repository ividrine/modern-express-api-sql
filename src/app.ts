import express from "express";
import config from "./config/config";
import helmet from "helmet";
import httpStatus from "http-status";
import ApiError from "./utils/ApiError.js";
import compression from "compression";
import { authLimiter } from "./http/middlewares/rateLimiter.middleware";
import {
  errorConverter,
  errorHandler
} from "./http/middlewares/error.middleware.js";

const app = express();

app.use(helmet());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(compression());

if (config.env === "production") {
  app.use("/v1/auth", authLimiter);
}

//app.use("/v1", routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
