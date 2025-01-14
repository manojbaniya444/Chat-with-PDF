import { IUser, User } from "../model/user.model";
import { DatabaseError } from "../utils/errors/db.error";
import { BaseRepository } from "./base.repository";

export class AuthRepository extends BaseRepository {
  // find user by email
  async findByEmailName(email: string) {
    try {
      const query = `SELECT * FROM users WHERE email = $1`;
      const result = await this.executeQuery(query, [email]);
      return result.length ? result[0] : null;
    } catch (error) {
      throw new DatabaseError("Error querying database to find user by email");
    }
  }
  // new user
  async createUser(userDetails: Partial<IUser>): Promise<User | null> {
    try {
      const query = `
      INSERT INTO users
      (email, username, profile)
      VALUES ($1, $2, $3)
      RETURNING *
      `;
      const response = await this.executeQuery(query, [
        userDetails.email,
        userDetails.username,
        userDetails.profile,
      ]);
      return response.length ? new User(response[0]) : null;
    } catch (error) {
      throw new DatabaseError("Error inserting new user");
    }
  }
}
