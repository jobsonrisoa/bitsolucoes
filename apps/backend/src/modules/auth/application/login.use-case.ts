import { Injectable } from '@nestjs/common';
import { UserRepository } from '../infrastructure/user.repository';
import { TokenService } from '../infrastructure/jwt.service';
import { BcryptPasswordHasher } from '../infrastructure/bcrypt-password-hasher';
import { ValidationError } from '../../../shared/domain/domain-error';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly hasher: BcryptPasswordHasher,
    private readonly tokenService: TokenService,
  ) {}

  async execute(username: string, password: string): Promise<string> {
    const user = await this.userRepo.findByUsername(username);
    if (!user) throw new ValidationError('Invalid credentials');

    const valid = await this.hasher.compare(password, user.passwordHash);
    if (!valid) throw new ValidationError('Invalid credentials');

    return this.tokenService.sign({ sub: user.id, username: user.username });
  }
}