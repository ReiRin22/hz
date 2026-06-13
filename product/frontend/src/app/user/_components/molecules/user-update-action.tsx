'use client';
import { updateUser } from '@/app/user/_api/user.api';

export const UserUpdateAction = ({ userId }: { userId: string }) => {
  const handleUpdate = async () => {
    console.log('--- [個別画面] 更新ボタンが押されました ---');
    
    // 生のデータを引数に渡す（ここでは暗号化を意識しない）
    const data = { 
      name: "テスト太郎",
      timestamp: new Date().toISOString() 
    };

    try {
      await updateUser(userId, data.name);
      alert('送信完了（コンソールを確認してください）');
    } catch (error) {
      console.error('送信失敗:', error);
    }
  };

  return (
    <div className="mt-6 p-4 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50">
      <p className="text-sm text-blue-600 mb-2 font-bold">【共通基盤 隠蔽検証用】</p>
      <button 
        onClick={handleUpdate}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        ユーザー名を「テスト太郎」に更新（POST送信）
      </button>
    </div>
  );
};