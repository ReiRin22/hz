import { SystemInfo } from '../molecules/SystemInfo';
import { UserInfo } from '../molecules/UserInfo';
import { CurrentDateTime } from '../molecules/CurrentDateTime';
import { UserHeaderActions } from '../molecules/UserHeaderActions';

interface UserHeaderProps {
  systemName: string;
  facilityName: string;
  userName: string;
  department: string;
  onLogout?: () => void;
  onHelp?: () => void;
}

export function UserHeader({
  systemName,
  facilityName,
  userName,
  department,
  onLogout,
  onHelp
}: UserHeaderProps) {
  return (
    <div className="bg-white border-b px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left Section - System and User Info */}
        <div className="flex items-center gap-8">
          <SystemInfo
            systemName={systemName}
            facilityName={facilityName}
          />
          
          <div className="w-px h-10 bg-gray-200"></div>
          
          <UserInfo
            userName={userName}
            department={department}
          />
        </div>

        {/* Right Section - DateTime and Actions */}
        <div className="flex items-center gap-6">
          <CurrentDateTime />
          
          <div className="w-px h-8 bg-gray-200"></div>
          
          <UserHeaderActions
            onLogout={onLogout}
            onHelp={onHelp}
          />
        </div>
      </div>
    </div>
  );
}
