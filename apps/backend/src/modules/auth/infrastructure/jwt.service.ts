import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: NestJwtService) {}

  sign(payload: object): string {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET ?? 'change-me-in-production',
      expiresIn: (process.env.JWT_EXPIRES_IN ?? '8h') as any,
      issuer: process.env.JWT_ISSUER ?? 'atrio-backend',
      algorithm: 'HS256',
    });
  }

  verify(token: string): Record<string, unknown> {
    return this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET ?? 'change-me-in-production',
    }) as Record<string, unknown>;
  }
}