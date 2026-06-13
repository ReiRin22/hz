import type { SchemaSaveRequest } from '@front_bff_shared/diagnosis/schema-creation/types/schema-creation.api.request';
import type { SchemaSaveResponse } from '@front_bff_shared/diagnosis/schema-creation/types/schema-creation.api.response';

const BFF_BASE_URL = process.env.NEXT_PUBLIC_BFF_URL ?? 'http://localhost:3001';

export async function postSchema(params: SchemaSaveRequest): Promise<SchemaSaveResponse> {
  const res = await fetch(`${BFF_BASE_URL}/bff/schemas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`POST /bff/schemas failed: ${res.status}`);
  }
  return res.json() as Promise<SchemaSaveResponse>;
}
