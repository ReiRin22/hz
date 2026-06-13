import React, { useState, ChangeEvent } from 'react';

export const FileUploader = ({ onUpload }: { onUpload: (file: File) => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 許可するMIMEタイプ
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  // 最大サイズ (例: 5MB)
  const MAX_SIZE = 5 * 1024 * 1024;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setError(null);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    // 1. ファイル形式チェック
    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError('画像ファイル（jpg, png, gif, webp）を選択してください。');
      setFile(null);
      e.target.value = ""; // inputの中身をリセット
      return;
    }

    // 2. サイズチェック（任意）
    if (selectedFile.size > MAX_SIZE) {
      setError('ファイルサイズは5MB以下にしてください。');
      setFile(null);
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2 items-center">
        <input 
          type="file" 
          accept="image/*" // ダイアログで画像以外をグレーアウト
          onChange={handleFileChange} 
          className="text-sm file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
        />
        <button 
          onClick={() => file && onUpload(file)}
          disabled={!file}
          className="px-3 py-1 bg-blue-500 text-white rounded shadow-sm disabled:bg-gray-300 transition-colors"
        >
          変更
        </button>
      </div>
      
      {/* エラーメッセージの表示 */}
      {error && (
        <span className="text-red-500 text-xs font-medium mt-1">
          {error}
        </span>
      )}
    </div>
  );
};