import { Injectable } from '@nestjs/common';
import { UserRepository } from '../infrastructure/user.repository';
import { NotFoundError } from '../../../shared/domain/domain-error';
import { UserResponseDto } from '../presentation/dtos/user-response.dto';

@Injectable()
export class GetCurrentUserUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(userId: number): Promise<UserResponseDto> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundError(`User ${userId} not found`);
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.username = user.username;
    return dto;
  }
}