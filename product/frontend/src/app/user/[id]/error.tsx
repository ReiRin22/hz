"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-bold text-red-600">通信エラーが発生しました</h2>
      <button 
        onClick={() => reset()} 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        再試行する
      </button>
    </div>
  );
}