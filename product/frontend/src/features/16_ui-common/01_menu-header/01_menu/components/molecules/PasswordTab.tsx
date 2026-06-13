import { Button } from "@/shared/components/atoms/button";
import { Input } from "@/shared/components/atoms/input";
import { Label } from "@/shared/components/atoms/label";
import { KeyRound, Check, X } from "lucide-react";
import { i18n } from "@/shared/i18n";

const t = i18n.menu;

type PasswordTabProps = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  passwordError: string;
  onCurrentPasswordChange: (value: string) => void;
  onNewPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onChangePassword: () => void;
};

export function PasswordTab({
  currentPassword,
  newPassword,
  confirmPassword,
  passwordError,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onChangePassword,
}: PasswordTabProps) {
  return (
    <div className="space-y-3">
      <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-3">
        <p className="text-sm text-red-700">{t.password.title}</p>
      </div>
      <div className="space-y-2">
        <Label className="text-sm text-gray-500">{t.password.currentLabel}</Label>
        <Input type="password" value={currentPassword} onChange={(e) => onCurrentPasswordChange(e.target.value)} className="w-full" />
      </div>
      <div className="space-y-2">
        <Label className="text-sm text-gray-500">{t.password.newLabel}</Label>
        <Input type="password" value={newPassword} onChange={(e) => onNewPasswordChange(e.target.value)} className="w-full" />
        {newPassword && (
          <div className="flex items-center gap-2 text-sm">
            {newPassword.length >= 8 ? (
              <><Check className="h-4 w-4 text-green-600" /><span className="text-green-600">{t.password.minLength}</span></>
            ) : (
              <><X className="h-4 w-4 text-red-600" /><span className="text-red-600">{t.password.minLength}</span></>
            )}
          </div>
        )}
      </div>
      <div className="space-y-2">
        <Label className="text-sm text-gray-500">{t.password.confirmLabel}</Label>
        <Input type="password" value={confirmPassword} onChange={(e) => onConfirmPasswordChange(e.target.value)} className="w-full" />
      </div>
      {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
      <Button variant="default" onClick={onChangePassword} className="w-full">
        <KeyRound className="h-4 w-4 mr-2" />
        {t.password.changeButton}
      </Button>
    </div>
  );
}
