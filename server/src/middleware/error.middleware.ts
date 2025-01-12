import { BaseError } from "../utils/errors/base.error";
import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: BaseError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.status = err.status || 500;
  err.code = err.code || "UNKNOWN_ERROR";

  // log the error

  if (err instanceof BaseError) {
    res.status(err.status).json({
      status: err.status,
      error: err,
      message: err.message,
      code: err.code,
    });
  } else {
    res.status(500).json({
      status: 500,
      error: err,
      message: "something went wrong",
      code: "UNKNOWN_ERROR",
    });
  }
};
