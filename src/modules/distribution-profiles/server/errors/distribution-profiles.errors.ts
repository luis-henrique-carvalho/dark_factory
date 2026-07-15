export class DistributionProfileError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
  ) {
    super(message)
    this.name = 'DistributionProfileError'
  }
}

export class DistributionProfileNotFoundError extends DistributionProfileError {
  constructor() {
    super('Distribution profile not found', 404)
    this.name = 'DistributionProfileNotFoundError'
  }
}

export class DistributionProfileConflictError extends DistributionProfileError {
  constructor() {
    super('A profile with this slug already exists for the brand', 409)
    this.name = 'DistributionProfileConflictError'
  }
}
