export default function Loading() {
  return (
    <div className="p-8 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="h-40 bg-gray-100 rounded-lg"></div>
      <p className="mt-4 text-gray-400">データを読み込み中...</p>
    </div>
  );
}