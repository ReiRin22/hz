import type { SchemaGetResponse } from '@front_bff_shared/diagnosis/schema-creation/types/schema-creation.api.response';

const BFF_BASE_URL = process.env.NEXT_PUBLIC_BFF_URL ?? 'http://localhost:3001';

export async function getSchema(params: { schemaUuid: string }): Promise<SchemaGetResponse> {
  const res = await fetch(
    `${BFF_BASE_URL}/bff/schemas/${encodeURIComponent(params.schemaUuid)}`,
    { cache: 'no-store' }
  );
  if (!res.ok) {
    throw new Error(`GET /bff/schemas/${params.schemaUuid} failed: ${res.status}`);
  }
  return res.json() as Promise<SchemaGetResponse>;
}
