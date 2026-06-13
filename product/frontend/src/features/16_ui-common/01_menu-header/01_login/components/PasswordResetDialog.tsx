"use client";
import React, { useState, useMemo } from 'react';
import { Lock, X, CheckCircle, Check } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { Input } from '@/shared/components/atoms/input';
import { i18n } from '@/shared/i18n';

interface PasswordResetDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PasswordResetDialog({ isOpen, onClose }: PasswordResetDialogProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const passwordRequirements = useMemo(() => {
    return {
      minLength: newPassword.length >= 8,
      hasUpperCase: /[A-Z]/.test(newPassword),
      hasLowerCase: /[a-z]/.test(newPassword),
      hasNumber: /[0-9]/.test(newPassword),
      hasSymbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword),
    };
  }, [newPassword]);

  const isPasswordValid = useMemo(() => {
    return passwordRequirements.minLength &&
           passwordRequirements.hasUpperCase &&
           passwordRequirements.hasLowerCase &&
           passwordRequirements.hasNumber &&
           passwordRequirements.hasSymbol;
  }, [passwordRequirements]);

  const isPasswordMatch = confirmPassword.length > 0 && newPassword === confirmPassword;

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError(i18n.auth.passwordReset.validation.allRequired);
      return;
    }

    if (!isPasswordValid) {
      setError(i18n.auth.passwordReset.validation.requirementsNotMet);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(i18n.auth.passwordReset.validation.mismatch);
      return;
    }

    setError('');
    setIsSuccess(true);
  };

  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsSuccess(false);
    setError('');
    onClose();
  };

  const t = i18n.auth.passwordReset;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div
        className="relative bg-white rounded-lg shadow-lg w-[400px] p-6"
        style={{ maxWidth: '90vw' }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X className="size-5" />
        </button>

        {!isSuccess ? (
          <>
            {/* Title */}
            <h2 className="mb-2">{t.title}</h2>
            <p className="mb-6" style={{ fontSize: '14px', color: '#64748B' }}>
              {t.subtitle}
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Current Password Input */}
              <div className="mb-4">
                <label className="block mb-2" style={{ fontSize: '13px', color: '#334155' }}>
                  {t.currentPasswordLabel}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <Input
                    type="password"
                    placeholder={t.currentPasswordPlaceholder}
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      if (error) setError('');
                    }}
                    className="pl-10 w-full"
                    required
                  />
                </div>
              </div>

              {/* New Password Input */}
              <div className="mb-4">
                <label className="block mb-2" style={{ fontSize: '13px', color: '#334155' }}>
                  {t.newPasswordLabel}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <Input
                    type="password"
                    placeholder={t.newPasswordPlaceholder}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (error) setError('');
                    }}
                    className="pl-10 w-full"
                    required
                  />
                </div>

                {newPassword && (
                  <div className="mt-3 p-3 rounded-md" style={{ backgroundColor: '#F1F5F9' }}>
                    <p className="mb-2" style={{ fontSize: '12px', color: '#64748B' }}>
                      {t.requirementsTitle}
                    </p>
                    <div className="space-y-1">
                      <RequirementItem met={passwordRequirements.minLength} text={t.requirements.minLength} />
                      <RequirementItem met={passwordRequirements.hasUpperCase} text={t.requirements.hasUpperCase} />
                      <RequirementItem met={passwordRequirements.hasLowerCase} text={t.requirements.hasLowerCase} />
                      <RequirementItem met={passwordRequirements.hasNumber} text={t.requirements.hasNumber} />
                      <RequirementItem met={passwordRequirements.hasSymbol} text={t.requirements.hasSymbol} />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="mb-4">
                <label className="block mb-2" style={{ fontSize: '13px', color: '#334155' }}>
                  {t.confirmPasswordLabel}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <Input
                    type="password"
                    placeholder={t.confirmPasswordPlaceholder}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (error) setError('');
                    }}
                    className="pl-10 w-full"
                    required
                  />
                </div>

                {confirmPassword && (
                  <div className="mt-2 flex items-center gap-2">
                    {isPasswordMatch ? (
                      <>
                        <Check className="size-4" style={{ color: '#10B981' }} />
                        <span style={{ fontSize: '12px', color: '#10B981' }}>
                          {t.passwordMatch}
                        </span>
                      </>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#DC2626' }}>
                        {t.passwordMismatch}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <p className="mb-4" style={{ fontSize: '12px', color: '#DC2626' }}>
                  {error}
                </p>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={handleClose}
                  className="flex-1"
                  style={{ backgroundColor: '#E2E8F0', color: '#475569' }}
                >
                  {i18n.common.buttons.cancel}
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  style={{ backgroundColor: '#2563EB' }}
                  disabled={!isPasswordValid || !isPasswordMatch}
                >
                  {i18n.common.buttons.change}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <>
            {/* Success Message */}
            <div className="text-center py-4">
              <div className="mb-4 flex justify-center">
                <div
                  className="rounded-full flex items-center justify-center"
                  style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: '#DBEAFE'
                  }}
                >
                  <CheckCircle className="size-8" style={{ color: '#2563EB' }} />
                </div>
              </div>
              <h2 className="mb-2">{t.successTitle}</h2>
              <p className="mb-6" style={{ fontSize: '14px', color: '#64748B' }}>
                {t.successMessage.split('\n').map((line, i) => (
                  <React.Fragment key={i}>{line}{i < t.successMessage.split('\n').length - 1 && <br />}</React.Fragment>
                ))}
              </p>
              <Button
                onClick={handleClose}
                className="w-full"
                style={{ backgroundColor: '#2563EB' }}
              >
                {i18n.common.buttons.close}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface RequirementItemProps {
  met: boolean;
  text: string;
}

function RequirementItem({ met, text }: RequirementItemProps) {
  return (
    <div className="flex items-center gap-2">
      {met ? (
        <Check className="size-4" style={{ color: '#10B981' }} />
      ) : (
        <X className="size-4" style={{ color: '#DC2626' }} />
      )}
      <span style={{ fontSize: '12px', color: met ? '#10B981' : '#DC2626' }}>
        {text}
      </span>
    </div>
  );
}
