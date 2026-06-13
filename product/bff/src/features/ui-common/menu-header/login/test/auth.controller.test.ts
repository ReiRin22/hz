import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import type { LoginResponse } from '@/front_bff_shared/features/ui-common/menu-header/login/types/responses/auth.response';

function makeService(overrides: Partial<AuthService> = {}): AuthService {
  return {
    login: vi.fn(),
    ...overrides,
  } as unknown as AuthService;
}

function makeController(service: AuthService): AuthController {
  return new AuthController(service);
}

const MOCK_RESPONSE: LoginResponse = {
  userId: 'demo',
  userName: '田中 太郎',
  role: 'doctor',
  token: 'mock-token',
};

describe('AuthController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('正常: 200 → LoginResponse を返す', async () => {
    const service = makeService({ login: vi.fn().mockResolvedValue(MOCK_RESPONSE) });
    const controller = makeController(service);

    const result = await controller.login({ userId: 'demo', password: 'demo123' });

    expect(result.userId).toBe('demo');
  });

  it('異常: 401 → UnauthorizedException をスロー', async () => {
    const service = makeService({
      login: vi.fn().mockRejectedValue(new UnauthorizedException({ errorCode: 'E004', message: 'ユーザーIDまたはパスワードが正しくありません。' })),
    });
    const controller = makeController(service);

    await expect(controller.login({ userId: 'wrong', password: 'wrong' })).rejects.toThrow(UnauthorizedException);
  });

  it('異常: 500 → InternalServerErrorException をスロー', async () => {
    const service = makeService({
      login: vi.fn().mockRejectedValue(new InternalServerErrorException({ errorCode: 'E500', message: 'システムエラーが発生しました。' })),
    });
    const controller = makeController(service);

    await expect(controller.login({ userId: 'demo', password: 'demo123' })).rejects.toThrow(InternalServerErrorException);
  });
});
