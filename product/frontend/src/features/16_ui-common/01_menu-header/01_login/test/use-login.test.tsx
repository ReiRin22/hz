import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useLogin } from '../hooks/use-login';
import * as authApi from '../api/auth.api';
import { useAuthStore } from '@/shared/stores/use-auth.store';

vi.mock('../api/auth.api');

const mockLogin = vi.mocked(authApi.login);

describe('useLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({ userId: null, userName: null, role: null, token: null });
  });

  it('正常: login 成功時に useAuthStore.setAuth が呼ばれる', async () => {
    mockLogin.mockResolvedValue({ userId: 'demo', userName: 'デモユーザー', role: 'doctor', token: 'mock-token' });

    const onSuccess = vi.fn();
    const { result } = renderHook(() => useLogin(onSuccess));

    await act(async () => {
      await result.current.handleLogin('demo', 'demo123');
    });

    await waitFor(() => {
      expect(useAuthStore.getState().userId).toBe('demo');
    }, { timeout: 3000 });
  });
});
