import authRoute from "./auth.routes";

export default function setupRoutes(app: any) {
  app.use("/auth", authRoute);
}
