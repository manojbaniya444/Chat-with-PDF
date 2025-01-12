interface IError {
  code: string;
  message: string;
  status: number;
}

export class BaseError extends Error implements IError {
  public message: string;
  public status: number;
  public code: string;
  constructor(message: string, status: number, code: string) {
    super(message);
    this.message = message;
    this.status = status;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}
