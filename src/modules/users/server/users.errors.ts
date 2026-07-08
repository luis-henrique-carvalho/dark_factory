export class UserError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
  ) {
    super(message)
    this.name = 'UserError'
  }
}

export class UserNotFoundError extends UserError {
  constructor() {
    super('User not found', 404)
    this.name = 'UserNotFoundError'
  }
}

export class EmailAlreadyExistsError extends UserError {
  constructor() {
    super('Email already registered', 409)
    this.name = 'EmailAlreadyExistsError'
  }
}
