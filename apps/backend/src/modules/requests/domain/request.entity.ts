import { Status, StatusEnum } from './status.value-object';
import { Category } from './category.value-object';
import { ConflictError, ValidationError } from '../../../shared/domain/domain-error';

export class Request {
  constructor(
    public readonly id: bigint,
    public title: string,
    public description: string,
    public category: Category,
    public status: Status,
    public readonly requesterId: number,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {
    this.validate();
  }

  get requestCode(): string {
    return `SOL-${this.id.toString().padStart(6, '0')}`;
  }

  private validate() {
    if (this.title.length < 3 || this.title.length > 120) {
      throw new ValidationError('Title must be between 3 and 120 characters');
    }
    if (this.description.length < 10 || this.description.length > 2000) {
      throw new ValidationError('Description must be between 10 and 2000 characters');
    }
  }

  update(title?: string, description?: string, category?: Category) {
    if (!this.status.isEditable()) {
      throw new ConflictError('REQUEST_NOT_EDITABLE', 'Cannot edit request unless it is OPEN');
    }
    if (title) this.title = title;
    if (description) this.description = description;
    if (category) this.category = category;
    this.updatedAt = new Date();
    this.validate();
  }

  changeStatus(newStatus: StatusEnum) {
    this.status = this.status.next(newStatus);
    this.updatedAt = new Date();
  }

  ensureDeletable() {
    if (!this.status.isEditable()) {
      throw new ConflictError('REQUEST_NOT_EDITABLE', 'Cannot delete request unless it is OPEN');
    }
  }
}