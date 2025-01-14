import { Router } from "express";

import { AuthRepository } from "../repository/auth.repository";
import { AuthService } from "../service/auth.service";
import { AuthController } from "../controller/auth.controller";

const router = Router();

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

router.post("/google", authController.handleGoogleLogin.bind(authController));
router.post("/verify", authController.verifyLoginUser.bind(authController));

export default router;
