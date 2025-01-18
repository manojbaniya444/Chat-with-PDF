import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../controller/auth.controller";
import { AuthError } from "../utils/errors/auth.error";
import jwt from "jsonwebtoken";
import { config } from "../config/env.config";
import { logger } from "../utils/logger";

// authentication middleware to check if the user is logged in or not
export function verifyLoginUser(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const cookies = req.cookies;
  const accessToken = cookies.accessToken;

  if (!accessToken) {
    logger.error("No access token");
    return res.status(401).json({
      success: false,
      message: "No access token in the cookie",
      user: null,
    });
  }

  // decode the accesstoken
  try {
    const decoded = jwt.verify(accessToken, config.auth.jwtSecret);
    if (decoded) {
      req.user = decoded;
      next();
    }
  } catch (error) {
    console.log("jwt token not verified not authorized user");
    throw new AuthError("jwt token not verified, user authentication error");
  }
}
