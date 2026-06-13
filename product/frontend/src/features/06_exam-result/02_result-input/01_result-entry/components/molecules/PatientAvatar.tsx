import { User } from 'lucide-react';

interface PatientAvatarProps {
  name: string; // 将来的にイニシャル表示などに使用予定
}

export function PatientAvatar({ name }: PatientAvatarProps) {
  return (
    <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center">
      <User className="w-6 h-6 text-white" />
    </div>
  );
}