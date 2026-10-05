import { ValidationError } from '../../../shared/domain/domain-error';
import { User } from '../domain/user.entity';
import { LoginUseCase } from './login.use-case';

describe('LoginUseCase', () => {
  const user = new User(1, 'ana', 'Ana', 'hash-demo', new Date('2026-01-01T10:00:00.000Z'));

  const makeUseCase = (overrides?: {
    foundUser?: User | null;
    passwordMatches?: boolean;
    token?: string;
  }) => {
    const foundUser = overrides && 'foundUser' in overrides ? overrides.foundUser : user;
    const userRepo = {
      findByUsername: jest.fn().mockResolvedValue(foundUser),
    };
    const hasher = {
      compare: jest.fn().mockResolvedValue(overrides?.passwordMatches ?? true),
    };
    const tokenService = {
      sign: jest.fn().mockReturnValue(overrides?.token ?? 'signed-token'),
    };

    return {
      useCase: new LoginUseCase(userRepo as any, hasher as any, tokenService as any),
      userRepo,
      hasher,
      tokenService,
    };
  };

  it('returns a signed token for valid credentials', async () => {
    const { useCase, userRepo, hasher, tokenService } = makeUseCase();

    await expect(useCase.execute('ana', 'demo123')).resolves.toBe('signed-token');
    expect(userRepo.findByUsername).toHaveBeenCalledWith('ana');
    expect(hasher.compare).toHaveBeenCalledWith('demo123', 'hash-demo');
    expect(tokenService.sign).toHaveBeenCalledWith({ sub: 1, username: 'ana' });
  });

  it('rejects unknown users without comparing passwords', async () => {
    const { useCase, hasher } = makeUseCase({ foundUser: null });

    await expect(useCase.execute('missing', 'demo123')).rejects.toThrow(ValidationError);
    expect(hasher.compare).not.toHaveBeenCalled();
  });

  it('rejects invalid passwords', async () => {
    const { useCase, tokenService } = makeUseCase({ passwordMatches: false });

    await expect(useCase.execute('ana', 'wrong')).rejects.toThrow(ValidationError);
    expect(tokenService.sign).not.toHaveBeenCalled();
  });
});
