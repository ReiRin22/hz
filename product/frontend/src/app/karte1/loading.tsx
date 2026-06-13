export default function KarteLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
        <p className="mt-4 text-gray-700">読み込み中...</p>
      </div>
    </div>
  );
}
