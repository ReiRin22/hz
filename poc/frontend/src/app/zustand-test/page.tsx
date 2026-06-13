'use client'; // Client Componentに変更
import { useStore } from '@shared/stores/use.store'; // Zustandをインポート
import { useEffect, useState } from 'react';

export default function UserDetailPage() {
  // 1. URLパラメータとZustandの状態を取得
  const { selectedKarteId } = useStore(); // Zustandから「さっき選んだID」を取得
  
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState(false);

  // 2. クライアント側でデータ取得（検証用）
  useEffect(() => {
    fetch(`http://localhost:3001/api/user/${selectedKarteId}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => setError(true));
  }, [selectedKarteId]);

  if (error) return <div className="p-8">ユーザーが見つかりませんでした</div>;
  if (!user) return <div className="p-8">読み込み中...</div>;

  return (
    <div className="p-8">
      {/* ★ここがZustandの検証ポイント★ */}
      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="font-bold text-green-800">【Zustand 連携検証】</h3>
        <p>一覧画面で選択されていたID: <span className="font-mono font-bold text-lg">{selectedKarteId}</span></p>
        <p className="text-sm text-green-600">※URLのIDと一致していれば、ページを跨いだ状態共有に成功しています。</p>
      </div>

      <h1 className="text-2xl font-bold mb-4">ユーザー詳細画面（Client Side）</h1>
      <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
        <p className="text-gray-500">URLパラメータからのID: {selectedKarteId}</p>
        <h2 className="text-xl mt-2">名前: {user.displayName}</h2>
        <div className="mt-4 p-4 bg-gray-50 rounded">
          <p className="font-semibold">BFFからの詳細メッセージ:</p>
          <p>{user.statsSummary || '詳細情報はありません'}</p>
        </div>
      </div>
      <div className="mt-6">
        <a href="/karte" className="text-blue-500 hover:underline">← リストに戻る</a>
      </div>
    </div>
  );
}