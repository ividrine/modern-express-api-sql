import express from "express";
import helmet from "helmet";
import compression from "compression";
import passport from "passport";

const app = express();

app.use(helmet());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(compression());

app.use(passport.initialize());
