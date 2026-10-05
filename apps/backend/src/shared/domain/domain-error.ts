export abstract class DomainError extends Error {
  public readonly isDomainError = true;
  constructor(public readonly code: string, message: string, public readonly status: number = 400) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) { super('VALIDATION_ERROR', message, 400); }
}

export class NotFoundError extends DomainError {
  constructor(message: string) { super('NOT_FOUND', message, 404); }
}

export class ConflictError extends DomainError {
  constructor(code: string, message: string) { super(code, message, 409); }
}