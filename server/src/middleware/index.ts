import { notFoundMiddleware } from "./notfound.middleware";
import { errorHandler } from "./error.middleware";

const middlewares = {
  notFoundMiddleware,
  errorHandlerMiddleware: errorHandler,
};

export default middlewares;
