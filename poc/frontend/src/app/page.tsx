import Link from 'next/link';
import { UserUpdateForm } from '@/app/user/_components/molecules/UserUpdateForm';

export default function HomePage() {
  return (
    
    <div className="p-10">
      <h1>プリフェッチ検証画面</h1>
      <div style={{ marginTop: '100px' }}>
        <Link href="/user/500" className="p-4 bg-blue-500 text-white">
          ユーザー500の詳細を見る（プリフェッチ対象）
        </Link>
      </div>
      <main className="container mx-auto p-8 space-y-8">
        <h1 className="text-2xl font-bold">PoC機能検証：型安全バリデーション</h1>
        
        <section className="max-w-md">
          <h2 className="text-lg mb-4 text-gray-600">▼ フォームバリデーション検証</h2>
          {/* 作成したフォームを配置 */}
          <UserUpdateForm />
        </section>

        {/* 既存の表示用コンポーネントがあればここに並べる */}
      </main>
    </div>
  );
}