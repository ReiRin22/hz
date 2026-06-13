import { User } from 'lucide-react';

interface UserInfoProps {
  userName: string;
  department: string;
}

export function UserInfo({ userName, department }: UserInfoProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
        <User className="w-5 h-5 text-white" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium">{userName}</span>
        <span className="text-xs text-muted-foreground">{department}</span>
      </div>
    </div>
  );
}
