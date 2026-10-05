import { AuthController } from './auth.controller';

describe('AuthController', () => {
  const makeController = () => {
    const loginUseCase = {
      execute: jest.fn().mockResolvedValue('signed-token'),
    };
    const getCurrentUserUseCase = {
      execute: jest.fn().mockResolvedValue({ id: 1, username: 'ana' }),
    };
    const response = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    };

    return {
      controller: new AuthController(loginUseCase as any, getCurrentUserUseCase as any),
      loginUseCase,
      getCurrentUserUseCase,
      response,
    };
  };

  it('sets the httpOnly session cookie and logged-in hint on login', async () => {
    const { controller, loginUseCase, response } = makeController();

    await expect(controller.login({ username: 'ana', password: 'demo123' }, response as any)).resolves.toEqual({
      success: true,
    });

    expect(loginUseCase.execute).toHaveBeenCalledWith('ana', 'demo123');
    expect(response.cookie).toHaveBeenCalledWith('session', 'signed-token', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path: '/',
    });
    expect(response.cookie).toHaveBeenCalledWith('logged_in', '1', {
      secure: false,
      sameSite: 'strict',
      path: '/',
    });
  });

  it('clears current and legacy auth cookies on logout', async () => {
    const { controller, response } = makeController();

    await expect(controller.logout(response as any)).resolves.toEqual({ success: true });

    expect(response.clearCookie).toHaveBeenCalledWith('session', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path: '/',
    });
    expect(response.clearCookie).toHaveBeenCalledWith('session', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path: '/api/v1/auth',
    });
    expect(response.clearCookie).toHaveBeenCalledWith('logged_in', {
      secure: false,
      sameSite: 'strict',
      path: '/',
    });
  });
});
