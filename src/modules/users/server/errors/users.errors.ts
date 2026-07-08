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

function isUniqueEmailConstraintError(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === '23505' &&
    'constraint' in error &&
    error.constraint === 'user_email_unique'
  )
}

export async function mapUniqueEmailConstraint<T>(
  operation: () => Promise<T>,
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    if (isUniqueEmailConstraintError(error)) {
      throw new EmailAlreadyExistsError()
    }

    throw error
  }
}
