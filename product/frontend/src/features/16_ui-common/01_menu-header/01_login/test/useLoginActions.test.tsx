import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLoginActions } from '../hooks/use-login-actions';
import * as authApi from '../api/auth.api';
import { useAuthStore } from '@/shared/stores/use-auth.store';

vi.mock('../api/auth.api');
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const mockLogin = vi.mocked(authApi.login);

describe('useLoginActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({ userId: null, userName: null, role: null, token: null });
  });

  it('初期値: authStep が login である', () => {
    const { result } = renderHook(() => useLoginActions());
    expect(result.current.authStep).toBe('login');
  });

  it('正常: ログイン成功後に authStep が ic-card になる', async () => {
    mockLogin.mockResolvedValue({ userId: 'u01', userName: 'テスト', role: 'doctor', token: 'tok' });

    const { result } = renderHook(() => useLoginActions());

    await act(async () => {
      result.current.setUserId('u01');
      result.current.setPassword('pass');
    });

    await act(async () => {
      await result.current.handleFormSubmit({ preventDefault: vi.fn() } as unknown as React.FormEvent);
    });

    expect(result.current.authStep).toBe('ic-card');
  });

  it('handleBackToLogin: authStep が login に戻る', async () => {
    mockLogin.mockResolvedValue({ userId: 'u01', userName: 'テスト', role: 'doctor', token: 'tok' });

    const { result } = renderHook(() => useLoginActions());

    await act(async () => {
      result.current.setUserId('u01');
      result.current.setPassword('pass');
      await result.current.handleFormSubmit({ preventDefault: vi.fn() } as unknown as React.FormEvent);
    });

    act(() => {
      result.current.handleBackToLogin();
    });

    expect(result.current.authStep).toBe('login');
  });

  it('handleForgotPassword: isAdminRequestDialogOpen が true になる', () => {
    const { result } = renderHook(() => useLoginActions());

    act(() => {
      result.current.handleForgotPassword({ preventDefault: vi.fn() } as unknown as React.MouseEvent<HTMLAnchorElement>);
    });

    expect(result.current.isAdminRequestDialogOpen).toBe(true);
  });

  it('handlePasswordExpiredReset: isPasswordExpiredDialogOpen が false になり isResetDialogOpen が true になる', () => {
    const { result } = renderHook(() => useLoginActions());

    act(() => {
      result.current.setIsPasswordExpiredDialogOpen(true);
    });

    act(() => {
      result.current.handlePasswordExpiredReset();
    });

    expect(result.current.isPasswordExpiredDialogOpen).toBe(false);
    expect(result.current.isResetDialogOpen).toBe(true);
  });
});
