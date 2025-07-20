import express from "express";
import authRoute from "./auth.route.js";

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute
  }
];

// Todo add docs

// const devRoutes = [
//   {
//     path: "/docs",
//     route: docsRoute
//   }
// ];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

// Todo add docs

// if (config.env === "development") {
//   devRoutes.forEach((route) => {
//     router.use(route.path, route.route);
//   });
// }

export default router;
