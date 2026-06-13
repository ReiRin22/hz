import { getUser } from '@/app/user/_api/user.api';
import { UserProfileCard } from '@/app/user/_components/organisms/UserProfileCard';

// params 自体が Promise になるため、型の定義も Promise に包みます
export default async function UserDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // ここで await して中身を取り出す
  const { id } = await params; 
  
  const user = await getUser(id);

  return (
    <main className="p-8">
      <h1>User Detail Page</h1>
      <UserProfileCard user={user} />
    </main>
  );
}