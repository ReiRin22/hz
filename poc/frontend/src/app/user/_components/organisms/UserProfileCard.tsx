import { UserHeader } from '@/app/user/_components/molecules/UserHeader';
import { UserUpdateAction } from '@/app/user/_components/molecules/UserUpdateAction';
import { UserResponse } from '@/front_bff_shared/types/response/user.response.type';

export const UserProfileCard = ({ user }: { user: UserResponse }) => (
  <div className="p-6 border rounded-lg shadow-md bg-white">
    {/* 整形済みの displayName と ageGroup を渡す */}
    <UserHeader displayName={user.displayName} ageGroup={user.ageGroup} />
    
    <div className="mt-4 space-y-2">
      <p className="text-gray-700">
        <span className="font-semibold">自己紹介:</span> {user.bio}
      </p>
      <p className="text-blue-600 font-medium">
        <span className="text-gray-700 font-semibold">実績:</span> {user.statsSummary}
      </p>
    </div>
    {/* 検証用アクションを追加 */}
    <UserUpdateAction userId={user.id} />
  </div>
);