import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenService } from '../infrastructure/jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const token: string | undefined = req.cookies?.session;
    if (!token) throw new UnauthorizedException('UNAUTHENTICATED');

    try {
      const payload = this.tokenService.verify(token);
      req.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('INVALID_TOKEN');
    }
  }
}
