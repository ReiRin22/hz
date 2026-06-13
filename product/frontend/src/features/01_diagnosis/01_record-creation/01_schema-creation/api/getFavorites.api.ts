import type { FavoritesResponse } from '@front_bff_shared/diagnosis/schema-creation/types/schema-creation.api.response';

const BFF_BASE_URL = process.env.NEXT_PUBLIC_BFF_URL ?? 'http://localhost:3001';

export async function getFavorites(): Promise<FavoritesResponse> {
  const res = await fetch(`${BFF_BASE_URL}/bff/favorites`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`GET /bff/favorites failed: ${res.status}`);
  }
  return res.json() as Promise<FavoritesResponse>;
}
