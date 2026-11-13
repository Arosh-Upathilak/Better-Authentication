export class AppError extends Error {
  public statusCode: number;

  constructor(
    message: string,
    statusCode: number,
  ) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  public errors?: unknown;

  constructor(message: string, errors?: unknown) {
    super(message, 400);
    this.errors = errors;
  }
}


export class NotFoundError extends AppError{
  constructor(message:string ){
    super(message,404)
  }
}