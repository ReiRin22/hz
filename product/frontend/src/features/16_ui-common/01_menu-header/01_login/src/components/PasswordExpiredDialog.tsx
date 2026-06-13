import React, { useState, useMemo } from 'react';
import { X, AlertTriangle, Lock, Check, CheckCircle } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { Input } from '@/shared/components/atoms/input';

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

  // パスワード要件のチェック
  const passwordRequirements = useMemo(() => {
    return {
      minLength: newPassword.length >= 8,
      hasUpperCase: /[A-Z]/.test(newPassword),
      hasLowerCase: /[a-z]/.test(newPassword),
      hasNumber: /[0-9]/.test(newPassword),
      hasSymbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword),
    };
  }, [newPassword]);

  // すべての要件が満たされているかチェック
  const isPasswordValid = useMemo(() => {
    return passwordRequirements.minLength && 
           passwordRequirements.hasUpperCase &&
           passwordRequirements.hasLowerCase &&
           passwordRequirements.hasNumber &&
           passwordRequirements.hasSymbol;
  }, [passwordRequirements]);

  // パスワードが一致しているかチェック
  const isPasswordMatch = confirmPassword.length > 0 && newPassword === confirmPassword;

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!newPassword || !confirmPassword) {
      setError('すべての項目を入力してください。');
      return;
    }

    if (!isPasswordValid) {
      setError('パスワードは8文字以上で、大文字、小文字、数字、記号を含めて入力してください。');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('新しいパスワードが一致しません。');
      return;
    }

    // Mock password reset - in real app, this would call an API
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

  if (!isOpen) return null;

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
              パスワード有効期限切れ
            </h2>

            {/* Message */}
            <p className="mb-6 text-center" style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.6' }}>
              パスワードの有効期限が切れています。<br />
              セキュリティ保護のため、新しいパスワードに変更してください。
            </p>

            <div className="mb-6 p-4 rounded-md" style={{ backgroundColor: '#FEF3C7', border: '1px solid #FDE68A' }}>
              <p style={{ fontSize: '13px', color: '#92400E', lineHeight: '1.5' }}>
                <strong>ご注意：</strong><br />
                パスワードを変更しない限り、システムにログインできません。
              </p>
            </div>

            {/* Password Reset Form */}
            <form onSubmit={handleSubmit}>
              {/* New Password Input */}
              <div className="mb-4">
                <label className="block mb-2" style={{ fontSize: '13px', color: '#334155' }}>
                  新しいパスワード
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <Input
                    type="password"
                    placeholder="新しいパスワード（8文字以上）"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (error) setError('');
                    }}
                    className="pl-10 w-full"
                    required
                  />
                </div>
                
                {/* パスワード要件チェックリスト */}
                {newPassword && (
                  <div className="mt-3 p-3 rounded-md" style={{ backgroundColor: '#F1F5F9' }}>
                    <p className="mb-2" style={{ fontSize: '12px', color: '#64748B' }}>
                      パスワード要件:
                    </p>
                    <div className="space-y-1">
                      <RequirementItem 
                        met={passwordRequirements.minLength}
                        text="8文字以上"
                      />
                      <RequirementItem 
                        met={passwordRequirements.hasUpperCase}
                        text="大文字を含む"
                      />
                      <RequirementItem 
                        met={passwordRequirements.hasLowerCase}
                        text="小文字を含む"
                      />
                      <RequirementItem 
                        met={passwordRequirements.hasNumber}
                        text="数字を含む"
                      />
                      <RequirementItem 
                        met={passwordRequirements.hasSymbol}
                        text="記号を含む"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="mb-4">
                <label className="block mb-2" style={{ fontSize: '13px', color: '#334155' }}>
                  新しいパスワード（再入力）
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <Input
                    type="password"
                    placeholder="新しいパスワードを再入力"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (error) setError('');
                    }}
                    className="pl-10 w-full"
                    required
                  />
                </div>
                
                {/* パスワード一致チェック */}
                {confirmPassword && (
                  <div className="mt-2 flex items-center gap-2">
                    {isPasswordMatch ? (
                      <>
                        <Check className="size-4" style={{ color: '#10B981' }} />
                        <span style={{ fontSize: '12px', color: '#10B981' }}>
                          パスワードが一致しています
                        </span>
                      </>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#DC2626' }}>
                        パスワードが一致しません
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
                  変更
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
              <h2 className="mb-2">変更完了</h2>
              <p className="mb-6" style={{ fontSize: '14px', color: '#64748B' }}>
                パスワードが正常に変更されました。<br />
                新しいパスワードでログインしてください。
              </p>
              <Button
                onClick={handleClose}
                className="w-full"
                style={{ backgroundColor: '#2563EB' }}
              >
                閉じる
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