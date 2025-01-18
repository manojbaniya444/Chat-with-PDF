import authRoute from "./auth.route";
import uploadRoute from "./upload.route";

import { verifyLoginUser } from "../middleware/auth.middleware";

export default function setupRoutes(app: any) {
  app.use("/auth", authRoute);
  app.use("/upload", verifyLoginUser, uploadRoute);
}
