export class BrandError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
  ) {
    super(message)
    this.name = 'BrandError'
  }
}

export class BrandNotFoundError extends BrandError {
  constructor() {
    super('Brand not found', 404)
    this.name = 'BrandNotFoundError'
  }
}
