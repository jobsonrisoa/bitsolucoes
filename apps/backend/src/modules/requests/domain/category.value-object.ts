import { ValidationError } from '../../../shared/domain/domain-error';

export enum CategoryEnum {
  TI = 'TI',
  RH = 'RH',
  COMPRAS = 'COMPRAS',
  FINANCEIRO = 'FINANCEIRO',
  INFRAESTRUTURA = 'INFRAESTRUTURA',
}

export class Category {
  constructor(public readonly value: CategoryEnum) {
    if (!Object.values(CategoryEnum).includes(value)) {
      throw new ValidationError(`Invalid category: ${value}`);
    }
  }
}