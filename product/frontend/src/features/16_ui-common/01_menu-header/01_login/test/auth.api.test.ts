import { describe, it, expect, vi, beforeEach } from 'vitest';
import { axiosClient } from '@/shared/plugins/axiosClient';
import { login } from '../api/auth.api';

vi.mock('@/shared/plugins/axiosClient', () => ({
  axiosClient: { post: vi.fn() },
}));

const mockPost = vi.mocked(axiosClient.post);

describe('auth.api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('正常: 200 → LoginResponse を返す', async () => {
    mockPost.mockResolvedValue({
      data: { userId: 'demo', userName: 'デモユーザー', role: 'doctor', token: 'mock-token' },
    });

    const result = await login({ userId: 'demo', password: 'demo123' });

    expect(result.userId).toBe('demo');
  });

  it('異常: 401 → AxiosError をそのままスロー', async () => {
    const error = Object.assign(new Error('Unauthorized'), { response: { status: 401, data: { errorCode: 'E004', message: 'ユーザーIDまたはパスワードが正しくありません。' } } });
    mockPost.mockRejectedValue(error);

    await expect(login({ userId: 'wrong', password: 'wrong' })).rejects.toThrow('Unauthorized');
  });

  it('異常: 500 → AxiosError をそのままスロー', async () => {
    const error = Object.assign(new Error('Internal Server Error'), { response: { status: 500 } });
    mockPost.mockRejectedValue(error);

    await expect(login({ userId: 'demo', password: 'demo123' })).rejects.toThrow('Internal Server Error');
  });
});
