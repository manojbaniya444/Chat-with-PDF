import express from "express";
import setupRoutes from "./routes";
import middlewares from "./middleware";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

setupRoutes(app);
app.use(middlewares.notFoundMiddleware);
app.use(middlewares.errorHandlerMiddleware);

export default app;
