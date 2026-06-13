import React, { useState } from 'react';
import { X, User, Building } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { Input } from '@/shared/components/atoms/input';

interface AdminRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminRequestDialog({ isOpen, onClose }: AdminRequestDialogProps) {
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    // Validation - Either userId or name must be provided
    if (!userId.trim() && !name.trim()) {
      setError('ユーザーIDまたは氏名のいずれかを入力してください。');
      return;
    }

    alert('管理者に再設定依頼を送信しました。');
    
    // Reset form
    setUserId('');
    setName('');
    setDepartment('');
    setError('');
    onClose();
  };

  const handleClose = () => {
    setUserId('');
    setName('');
    setDepartment('');
    setError('');
    onClose();
  };

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

        {/* Title */}
        <h2 className="mb-4" style={{ color: '#334155' }}>
          パスワード再設定依頼
        </h2>

        {/* Message */}
        <p className="mb-4" style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.6' }}>
          パスワードの再設定は管理者が対応いたします。<br />
          以下の情報を入力して依頼を送信してください。
        </p>
        
        <p className="mb-6" style={{ fontSize: '12px', color: '#DC2626' }}>
          ※ ユーザーIDまたは氏名のいずれかは必須です
        </p>

        {/* User Information Form */}
        <div className="mb-4 space-y-4">
          {/* User ID Input */}
          <div>
            <label className="block mb-2" style={{ fontSize: '13px', color: '#334155' }}>
              ユーザーID
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                type="text"
                placeholder="ユーザーID"
                value={userId}
                onChange={(e) => {
                  setUserId(e.target.value);
                  if (error) setError('');
                }}
                className="pl-10 w-full"
              />
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label className="block mb-2" style={{ fontSize: '13px', color: '#334155' }}>
              氏名
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                type="text"
                placeholder="氏名"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                className="pl-10 w-full"
              />
            </div>
          </div>

          {/* Department Input - Optional */}
          <div>
            <label className="block mb-2" style={{ fontSize: '13px', color: '#334155' }}>
              部署
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                type="text"
                placeholder="部署（任意）"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <p className="mb-4" style={{ fontSize: '12px', color: '#DC2626' }}>
            {error}
          </p>
        )}

        <div className="mb-4 p-4 rounded-md" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
          <p style={{ fontSize: '13px', color: '#334155', marginBottom: '8px' }}>
            <strong>連絡先：</strong>
          </p>
          <p style={{ fontSize: '13px', color: '#64748B' }}>
            システム管理部門<br />
            内線: 1234<br />
            メール: admin@hospital.example.jp
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            type="button"
            className="flex-1 h-[44px]"
            style={{ 
              backgroundColor: 'transparent', 
              borderRadius: '6px',
              color: '#64748B',
              border: '1px solid #E2E8F0'
            }}
            onClick={handleClose}
          >
            キャンセル
          </Button>
          <Button
            type="button"
            className="flex-1 h-[44px]"
            style={{ backgroundColor: '#2563EB', borderRadius: '6px' }}
            onClick={handleSubmit}
          >
            送信
          </Button>
        </div>
      </div>
    </div>
  );
}
