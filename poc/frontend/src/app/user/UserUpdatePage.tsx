import { UserUpdateForm } from '@/app/user/_components/molecules/UserUpdateForm';

// lazyロードされるため、必ず「default export」にする必要があります
export default function UserUpdatePage() {
  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-xl font-bold mb-6 text-center">プロフィール編集</h1>
      <UserUpdateForm />
    </div>
  );
}