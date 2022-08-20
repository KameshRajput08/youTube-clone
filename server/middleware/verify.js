import { createError } from "./errorMiddleware.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  !token && next(createError(401, "You are not authenticated."));

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    err && next(err);
    req.user = user;
    next();
  });
};
