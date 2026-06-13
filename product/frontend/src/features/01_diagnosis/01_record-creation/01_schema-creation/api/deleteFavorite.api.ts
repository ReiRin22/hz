const BFF_BASE_URL = process.env.NEXT_PUBLIC_BFF_URL ?? 'http://localhost:3001';

export async function deleteFavorite(params: { templateId: string }): Promise<void> {
  const res = await fetch(
    `${BFF_BASE_URL}/bff/favorites/${encodeURIComponent(params.templateId)}`,
    {
      method: 'DELETE',
      cache: 'no-store',
    }
  );
  if (!res.ok) {
    throw new Error(`DELETE /bff/favorites/${params.templateId} failed: ${res.status}`);
  }
}
