import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './presentation/auth.controller';
import { AuthGuard } from './presentation/auth.guard';
import { TokenService } from './infrastructure/jwt.service';
import { UserRepository } from './infrastructure/user.repository';
import { BcryptPasswordHasher } from './infrastructure/bcrypt-password-hasher';
import { LoginUseCase } from './application/login.use-case';
import { GetCurrentUserUseCase } from './application/get-current-user.use-case';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'change-me-in-production',
      signOptions: {
        expiresIn: (process.env.JWT_EXPIRES_IN ?? '8h') as any,
        issuer: process.env.JWT_ISSUER ?? 'atrio-backend',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    TokenService,
    UserRepository,
    BcryptPasswordHasher,
    LoginUseCase,
    GetCurrentUserUseCase,
    AuthGuard,
  ],
  exports: [AuthGuard, TokenService, JwtModule],
})
export class AuthModule {}
