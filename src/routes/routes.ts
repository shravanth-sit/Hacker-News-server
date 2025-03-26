import { Hono } from "hono";
import { authenticationRoutes } from "./authentication-routes";
import { usersRoutes } from "./users-routes";
import { logger } from "hono/logger";

export const allRoutes = new Hono();

allRoutes.use(logger())

// allRoutes.use(async (context, next) => {
//     console.log("HTTP METHOD:", context.req.method);
//     console.log("URL", context.req.url);
//     console.log("HEADERS:", context.req.header());

//     await next();   
// });
 

allRoutes.route("/authentication", authenticationRoutes);
allRoutes.route("/users", usersRoutes);

allRoutes.get(
  "/health",
  (context) => {
    console.log("Health checked");
    return context.json({ message: "OK" }, 200);
  }
);