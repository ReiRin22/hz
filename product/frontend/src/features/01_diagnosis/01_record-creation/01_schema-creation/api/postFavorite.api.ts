import type { FavoriteAddRequest } from '@front_bff_shared/diagnosis/schema-creation/types/schema-creation.api.request';

const BFF_BASE_URL = process.env.NEXT_PUBLIC_BFF_URL ?? 'http://localhost:3001';

export async function postFavorite(params: FavoriteAddRequest): Promise<void> {
  const res = await fetch(`${BFF_BASE_URL}/bff/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`POST /bff/favorites failed: ${res.status}`);
  }
}
