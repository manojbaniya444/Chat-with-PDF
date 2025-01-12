import { AuthService } from "../service/auth.service";
import { Request, Response } from "express";

export interface CustomResponse extends Response {
  user?: any;
}
export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async handleGoogleLogin(req: Request, res: Response): Promise<any> {
    const { googleCredential } = req.body;

    if (!googleCredential) {
      return res.status(401).json({
        success: false,
        message: "No google credential provided, Unauthorized",
      });
    }

    try {
      const savedUser = await this.authService.register(googleCredential);

      if (savedUser) {
        const accessToken = this.authService.generateJwtToken(savedUser);

        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 1000 * 60 * 60 * 24 * 10,
        });

        return res.status(201).json({
          success: true,
          message: "New user successfully created",
          user: savedUser,
        });
      } else {
        return res.status(500).json({
          success: false,
          message:
            "Something went wrong, user object not found to create token",
          user: null,
        });
      }
    } catch (error) {
      console.log("user save error: ", error);
      return res.status(400).json({
        message: "",
      });
    }
  }

  async verifyLoginUser(req: Request, res: CustomResponse): Promise<any> {
    const cookies = req.cookies;

    const accessToken = cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "No access token in the cookie",
        user: null,
      });
    }

    const userDetails = this.authService.verifyJwtToken(accessToken);

    res.user = userDetails;

    return res.status(200).json({
      success: true,
      message: "User Authorization success",
      user: userDetails,
    });
  }
}
