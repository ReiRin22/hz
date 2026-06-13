'use client';

export default function KarteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-600">エラーが発生しました</h2>
        <p className="mt-4 text-gray-700">{error.message}</p>
        <button
          onClick={reset}
          className="mt-6 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          再試行
        </button>
      </div>
    </div>
  );
}
