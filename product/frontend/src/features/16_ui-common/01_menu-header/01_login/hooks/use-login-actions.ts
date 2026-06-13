'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin } from './use-login';

export function useLoginActions() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [authStep, setAuthStep] = useState<'login' | 'ic-card'>('login');
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isAdminRequestDialogOpen, setIsAdminRequestDialogOpen] = useState(false);
  const [isPasswordExpiredDialogOpen, setIsPasswordExpiredDialogOpen] = useState(false);

  const onLoginSuccess = useCallback(() => setAuthStep('ic-card'), []);

  // TODO: パスワード期限切れ検知は LoginErrorResponse に専用エラーコードが定義され次第実装。
  // 現状 E004 は認証エラー全般を示すため、isPasswordExpiredDialogOpen のトリガーは未接続。
  const { isLoading, error: loginError, handleLogin: loginSubmit } = useLogin(onLoginSuccess);

  const handleFormSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    await loginSubmit(userId, password);
  }, [loginSubmit, userId, password]);

  const handleIcCardScan = useCallback(() => {
    router.push('/ui-common/menu-header/menu');
  }, [router]);

  const handleBackToLogin = useCallback(() => {
    setAuthStep('login');
  }, []);

  const handleForgotPassword = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsAdminRequestDialogOpen(true);
  }, []);

  const handlePasswordExpiredReset = useCallback(() => {
    setIsPasswordExpiredDialogOpen(false);
    setIsResetDialogOpen(true);
  }, []);

  return {
    userId,
    password,
    setUserId,
    setPassword,
    authStep,
    isLoading,
    loginError,
    handleFormSubmit,
    handleIcCardScan,
    handleBackToLogin,
    handleForgotPassword,
    handlePasswordExpiredReset,
    isResetDialogOpen,
    isAdminRequestDialogOpen,
    isPasswordExpiredDialogOpen,
    setIsResetDialogOpen,
    setIsAdminRequestDialogOpen,
    setIsPasswordExpiredDialogOpen,
  };
}
