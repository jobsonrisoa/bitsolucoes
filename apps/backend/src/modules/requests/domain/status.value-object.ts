import { ConflictError, ValidationError } from '../../../shared/domain/domain-error';

export enum StatusEnum {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export class Status {
  constructor(public readonly value: StatusEnum) {
    if (!Object.values(StatusEnum).includes(value)) {
      throw new ValidationError(`Invalid status: ${value}`);
    }
  }

  next(newStatus: StatusEnum): Status {
    if (this.value === StatusEnum.OPEN && newStatus === StatusEnum.IN_PROGRESS) {
      return new Status(newStatus);
    }
    if (this.value === StatusEnum.IN_PROGRESS && newStatus === StatusEnum.DONE) {
      return new Status(newStatus);
    }
    throw new ConflictError('INVALID_STATUS_TRANSITION', `Cannot transition from ${this.value} to ${newStatus}`);
  }

  isEditable(): boolean {
    return this.value === StatusEnum.OPEN;
  }
}