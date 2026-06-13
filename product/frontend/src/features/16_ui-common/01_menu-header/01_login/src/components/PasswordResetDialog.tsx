import React, { useState, useMemo } from 'react';
import { Lock, X, CheckCircle, Check } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { Input } from '@/shared/components/atoms/input';

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
    if (!currentPassword || !newPassword || !confirmPassword) {
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
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsSuccess(false);
    setError('');
    onClose();
  };

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
            <h2 className="mb-2">パスワード再設定</h2>
            <p className="mb-6" style={{ fontSize: '14px', color: '#64748B' }}>
              現在のパスワードと新しいパスワードを入力してください。
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Current Password Input */}
              <div className="mb-4">
                <label className="block mb-2" style={{ fontSize: '13px', color: '#334155' }}>
                  現在のパスワード
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <Input
                    type="password"
                    placeholder="現在のパスワード"
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

              {/* Buttons */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={handleClose}
                  className="flex-1"
                  style={{ backgroundColor: '#E2E8F0', color: '#475569' }}
                >
                  キャンセル
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  style={{ backgroundColor: '#2563EB' }}
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

// パスワード要件チェックリストのアイテム
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