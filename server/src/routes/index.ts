import authRoute from "./auth.route";
import uploadRoute from "./upload.route";

export default function setupRoutes(app: any) {
  app.use("/auth", authRoute);
  app.use("/upload", uploadRoute);
}
