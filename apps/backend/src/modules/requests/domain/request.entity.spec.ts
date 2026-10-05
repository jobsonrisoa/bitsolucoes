import { ConflictError, ValidationError } from '../../../shared/domain/domain-error';
import { Category, CategoryEnum } from './category.value-object';
import { Request } from './request.entity';
import { Status, StatusEnum } from './status.value-object';

const makeRequest = (status = StatusEnum.OPEN) =>
  new Request(
    7n,
    'Acesso financeiro',
    'Preciso de acesso ao sistema financeiro.',
    new Category(CategoryEnum.FINANCEIRO),
    new Status(status),
    1,
    new Date('2026-01-01T10:00:00.000Z'),
    new Date('2026-01-01T10:00:00.000Z'),
  );

describe('Request entity', () => {
  it('formats its public request code', () => {
    expect(makeRequest().requestCode).toBe('SOL-000007');
  });

  it('updates editable requests and refreshes updatedAt', () => {
    const request = makeRequest();
    const previousUpdatedAt = request.updatedAt;

    request.update('Notebook novo', 'Preciso de notebook para o onboarding.', new Category(CategoryEnum.TI));

    expect(request.title).toBe('Notebook novo');
    expect(request.description).toBe('Preciso de notebook para o onboarding.');
    expect(request.category.value).toBe(CategoryEnum.TI);
    expect(request.updatedAt.getTime()).toBeGreaterThanOrEqual(previousUpdatedAt.getTime());
  });

  it('rejects invalid title or description', () => {
    expect(
      () =>
        new Request(
          1n,
          'No',
          'Curta',
          new Category(CategoryEnum.TI),
          new Status(StatusEnum.OPEN),
          1,
          new Date(),
          new Date(),
        ),
    ).toThrow(ValidationError);
  });

  it('blocks edits when request is not open', () => {
    expect(() => makeRequest(StatusEnum.IN_PROGRESS).update('Outro titulo')).toThrow(ConflictError);
  });

  it('allows only valid status transitions', () => {
    const request = makeRequest();

    request.changeStatus(StatusEnum.IN_PROGRESS);
    expect(request.status.value).toBe(StatusEnum.IN_PROGRESS);
    request.changeStatus(StatusEnum.DONE);
    expect(request.status.value).toBe(StatusEnum.DONE);
    expect(() => request.changeStatus(StatusEnum.OPEN)).toThrow(ConflictError);
  });
});
