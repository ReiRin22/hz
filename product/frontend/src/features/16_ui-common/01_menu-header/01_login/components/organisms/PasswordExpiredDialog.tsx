"use client";
import React, { useState, useMemo } from 'react';
import { X, AlertTriangle, Lock, Check, CheckCircle } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { Input } from '@/shared/components/atoms/input';
import { i18n } from '@/shared/i18n';

interface PasswordExpiredDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onResetPassword: () => void;
}

export function PasswordExpiredDialog({ isOpen, onClose, onResetPassword }: PasswordExpiredDialogProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

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

    if (!newPassword || !confirmPassword) {
      setError(i18n.auth.passwordExpired.validation.allRequired);
      return;
    }

    if (!isPasswordValid) {
      setError(i18n.auth.passwordExpired.validation.requirementsNotMet);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(i18n.auth.passwordExpired.validation.mismatch);
      return;
    }

    setError('');
    setIsSuccess(true);
  };

  const handleClose = () => {
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setIsSuccess(false);
    onClose();
  };

  const t = i18n.auth.passwordExpired;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div
        className="relative p-6 rounded-lg shadow-lg w-full max-w-md"
        style={{ backgroundColor: 'white' }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 hover:opacity-70"
          style={{ color: '#64748B' }}
        >
          <X className="size-5" />
        </button>

        {!isSuccess ? (
          <>
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#FEF3C7' }}
              >
                <AlertTriangle className="size-8" style={{ color: '#F59E0B' }} />
              </div>
            </div>

            {/* Title */}
            <h2 className="mb-4 text-center" style={{ color: '#334155' }}>
              {t.title}
            </h2>

            {/* Message */}
            <p className="mb-6 text-center" style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.6' }}>
              {t.message.split('\n').map((line, i) => (
                <React.Fragment key={i}>{line}{i < t.message.split('\n').length - 1 && <br />}</React.Fragment>
              ))}
            </p>

            <div className="mb-6 p-4 rounded-md" style={{ backgroundColor: '#FEF3C7', border: '1px solid #FDE68A' }}>
              <p style={{ fontSize: '13px', color: '#92400E', lineHeight: '1.5' }}>
                {t.warningNote.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {i === 0 ? <strong>{line}</strong> : line}
                    {i < t.warningNote.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </p>
            </div>

            {/* Password Reset Form */}
            <form onSubmit={handleSubmit}>
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

              {/* Action Button */}
              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="w-full h-[44px]"
                  style={{ backgroundColor: '#2563EB', borderRadius: '6px' }}
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
