"use client";
import { useCallback, useRef, useState } from 'react';
import { isAxiosError } from 'axios';
import { login } from '../api/auth.api';
import { useAuthStore } from '@/shared/stores/use-auth.store';
import type { LoginErrorResponse } from '@/front_bff_shared/features/ui-common/menu-header/login/types/responses/auth.response';
import { i18n } from '@/shared/i18n';

type LoginState = {
  isLoading: boolean;
  error: string | null;
};

export function useLogin(onSuccess: () => void) {
  const setAuth = useAuthStore((s) => s.setAuth);
  const [state, setState] = useState<LoginState>({ isLoading: false, error: null });
  const cancelledRef = useRef(false);

  const handleLogin = useCallback(async (userId: string, password: string) => {
    cancelledRef.current = false;
    setState({ isLoading: true, error: null });

    try {
      const response = await login({ userId, password });
      if (cancelledRef.current) return;
      setAuth({ userId: response.userId, userName: response.userName, role: response.role, token: response.token });
    } catch (err) {
      if (cancelledRef.current) return;
      if (isAxiosError(err) && err.response) {
        const body = err.response.data as LoginErrorResponse;
        setState({ isLoading: false, error: body.message ?? i18n.auth.login.errors.invalidCredentials });
      } else {
        setState({ isLoading: false, error: i18n.auth.login.errors.systemError });
      }
      return;
    }

    if (cancelledRef.current) return;
    setState({ isLoading: false, error: null });
    onSuccess();
  }, [setAuth, onSuccess]);

  return { ...state, handleLogin };
}
