"use client";
import React from 'react';
import { User, Lock, HeartPulse, CreditCard } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { Input } from '@/shared/components/atoms/input';
import { PasswordResetDialog } from './PasswordResetDialog';
import { AdminRequestDialog } from './AdminRequestDialog';
import { PasswordExpiredDialog } from './PasswordExpiredDialog';
import { NotificationPanel } from '../molecules/NotificationPanel';
import { useLoginActions } from '../../hooks/use-login-actions';
import { i18n } from '@/shared/i18n';

export function LoginOrganism() {
  const {
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
  } = useLoginActions();

  return (
    <div className="min-h-screen flex items-center justify-center relative" style={{ backgroundColor: '#F8FAFC' }}>
      {/* Notification Panel - Right Top */}
      <div className="fixed top-6 right-6 hidden lg:block z-10">
        <NotificationPanel />
      </div>

      <div className="w-full max-w-md px-6 py-10">
        {authStep === 'login' && (
          <form onSubmit={handleFormSubmit} className="flex flex-col items-center">
            {/* Logo */}
            <div className="mb-8">
              <div
                className="w-[120px] h-[120px] rounded-full shadow-md flex items-center justify-center"
                style={{ backgroundColor: '#2563EB' }}
              >
                <HeartPulse className="size-16 text-white" />
              </div>
            </div>

            {/* Title */}
            <h1 className="mb-6 text-center">
              {i18n.auth.login.title}
            </h1>

            {/* User ID Input */}
            <div className="relative w-[320px] mb-3">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                type="text"
                placeholder={i18n.auth.login.userIdPlaceholder}
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="pl-10 w-full"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative w-[320px] mb-2">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                type="password"
                placeholder={i18n.auth.login.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 w-full"
                required
              />
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-[320px] h-[44px] mt-4"
              style={{ backgroundColor: '#2563EB', borderRadius: '6px' }}
              disabled={isLoading}
            >
              {isLoading ? i18n.auth.login.loggingIn : i18n.auth.login.loginButton}
            </Button>

            {/* Error Message */}
            {loginError && (
              <p className="mt-3 text-center" style={{ fontSize: '12px', color: '#DC2626' }}>
                {loginError}
              </p>
            )}

            {/* Forgot Password Link */}
            <a
              href="#"
              className="mt-4 hover:underline"
              style={{ fontSize: '12px', color: '#2563EB' }}
              onClick={handleForgotPassword}
            >
              {i18n.auth.login.forgotPassword}
            </a>

            {/* Version Info */}
            <p className="mt-8" style={{ fontSize: '10px', color: '#94A3B8' }}>
              {i18n.auth.login.version}
            </p>
          </form>
        )}

        {authStep === 'ic-card' && (
          <div className="flex flex-col items-center">
            {/* Logo */}
            <div className="mb-8">
              <div
                className="w-[120px] h-[120px] rounded-full shadow-md flex items-center justify-center"
                style={{ backgroundColor: '#2563EB' }}
              >
                <CreditCard className="size-16 text-white" />
              </div>
            </div>

            {/* Title */}
            <h1 className="mb-6 text-center">
              {i18n.auth.icCard.title}
            </h1>

            <p className="mb-6 text-center" style={{ fontSize: '14px', color: '#64748B' }}>
              {i18n.auth.icCard.instruction}
            </p>

            {/* IC Card Scan Button */}
            {/* TODO: ICカード実読み取りはスコープ外。将来的にカードリーダーSDK連携後にスキャン完了コールバックに差し替える */}
            <Button
              type="button"
              className="w-[320px] h-[44px]"
              style={{ backgroundColor: '#2563EB', borderRadius: '6px' }}
              onClick={handleIcCardScan}
            >
              {i18n.auth.icCard.scanButton}
            </Button>

            {/* Back Button */}
            <Button
              type="button"
              className="w-[320px] h-[44px] mt-3"
              style={{
                backgroundColor: 'transparent',
                borderRadius: '6px',
                color: '#2563EB',
                border: '1px solid #2563EB'
              }}
              onClick={handleBackToLogin}
            >
              {i18n.auth.icCard.backButton}
            </Button>

            {/* Version Info */}
            <p className="mt-8" style={{ fontSize: '10px', color: '#94A3B8' }}>
              {i18n.auth.login.version}
            </p>
          </div>
        )}
      </div>

      {/* Password Reset Dialog */}
      <PasswordResetDialog
        isOpen={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
      />

      {/* Admin Request Dialog */}
      <AdminRequestDialog
        isOpen={isAdminRequestDialogOpen}
        onClose={() => setIsAdminRequestDialogOpen(false)}
      />

      {/* Password Expired Dialog */}
      <PasswordExpiredDialog
        isOpen={isPasswordExpiredDialogOpen}
        onClose={() => setIsPasswordExpiredDialogOpen(false)}
        onResetPassword={handlePasswordExpiredReset}
      />
    </div>
  );
}
