import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { User } from '../domain/user.entity';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUsername(username: string): Promise<User | null> {
    const raw = await this.prisma.user.findUnique({ where: { username } });
    if (!raw) return null;
    return new User(raw.id, raw.username, raw.name, raw.password_hash, raw.created_at);
  }

  async findById(id: number): Promise<User | null> {
    const raw = await this.prisma.user.findUnique({ where: { id } });
    if (!raw) return null;
    return new User(raw.id, raw.username, raw.name, raw.password_hash, raw.created_at);
  }
}