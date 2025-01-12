import { OAuth2Client } from "google-auth-library";
import { config } from "../config/env.config";
import { AuthError } from "../utils/errors/auth.error";
import { AuthRepository } from "../repository/auth.repository";
import { User, IUser } from "../model/user.model";

import jwt from "jsonwebtoken";

const client = new OAuth2Client(config.auth.googleClientId);

export class AuthService {
  authRepository: AuthRepository;
  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  async register(credential: string): Promise<User | null> {
    const userDetails = await this.verifyGoogleCredential(credential);

    if (!userDetails.email || !userDetails.username) {
      throw new AuthError("no email or username is given");
    }

    const registeredUser = await this.authRepository.findByEmailName(
      userDetails.email!
    );

    if (registeredUser) {
      return registeredUser;
    }

    const newUser = await this.authRepository.createUser(userDetails);

    return newUser;
  }

  private async verifyGoogleCredential(credential: string) {
    const googleResponse = await client.verifyIdToken({
      idToken: credential,
      audience: config.auth.googleClientId,
    });

    const userData = googleResponse.getPayload();

    if (!userData) {
      throw new AuthError("Invalid google token given");
    }

    return {
      email: userData.email,
      username: userData.name,
      profileUrl: userData.picture,
    };
  }

  generateJwtToken(userData: Partial<IUser>): string {
    const token = jwt.sign(
      { username: userData.username, email: userData.email },
      config.auth.jwtSecret,
      {
        expiresIn: config.auth.jwtExpiry,
      }
    );
    return token;
  }

  verifyJwtToken(accessToken: string) {
    try {
      const decoded = jwt.verify(accessToken, config.auth.jwtSecret);
      return decoded;
    } catch (error) {
      console.log("jwt token not verified not authorized user");
      throw new AuthError("jwt token not verified, user authentication error");
    }
  }
}
