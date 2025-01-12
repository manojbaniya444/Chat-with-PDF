import { BaseError } from "./base.error";

export class DatabaseError extends BaseError {
  constructor(message: string) {
    super(message, 500, "DATABASE_ERROR");
  }
}
