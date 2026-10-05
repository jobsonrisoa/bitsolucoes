import { Controller, Post, Get, Body, Res, HttpCode, UseGuards, Request } from '@nestjs/common';
import { CookieOptions, Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginUseCase } from '../application/login.use-case';
import { GetCurrentUserUseCase } from '../application/get-current-user.use-case';
import { AuthGuard } from './auth.guard';
import { LoginDto } from './dtos/login.dto';
import { UserResponseDto } from './dtos/user-response.dto';

const sessionCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: 'strict',
  path: '/',
};

const legacySessionCookieOptions: CookieOptions = {
  ...sessionCookieOptions,
  path: '/api/v1/auth',
};

const authHintCookieOptions: CookieOptions = {
  secure: false,
  sameSite: 'strict',
  path: '/',
};

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
  ) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login with username and password' })
  @ApiResponse({ status: 200, description: 'Session cookie set' })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ success: boolean }> {
    const token = await this.loginUseCase.execute(body.username, body.password);
    res.cookie('session', token, sessionCookieOptions);
    res.cookie('logged_in', '1', authHintCookieOptions);
    return { success: true };
  }

  @Post('logout')
  @HttpCode(200)
  @ApiOperation({ summary: 'Logout and clear session cookie' })
  async logout(@Res({ passthrough: true }) res: Response): Promise<{ success: boolean }> {
    res.clearCookie('session', sessionCookieOptions);
    res.clearCookie('session', legacySessionCookieOptions);
    res.clearCookie('logged_in', authHintCookieOptions);
    return { success: true };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthenticated' })
  me(@Request() req: any): Promise<UserResponseDto> {
    return this.getCurrentUserUseCase.execute(req.user.sub as number);
  }
}
