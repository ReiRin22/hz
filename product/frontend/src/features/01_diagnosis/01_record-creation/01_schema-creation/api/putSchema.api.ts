import type { SchemaUpdateRequest } from '@front_bff_shared/diagnosis/schema-creation/types/schema-creation.api.request';
import type { SchemaUpdateResponse } from '@front_bff_shared/diagnosis/schema-creation/types/schema-creation.api.response';

const BFF_BASE_URL = process.env.NEXT_PUBLIC_BFF_URL ?? 'http://localhost:3001';

export async function putSchema(params: {
  schemaUuid: string;
} & SchemaUpdateRequest): Promise<SchemaUpdateResponse> {
  const { schemaUuid, ...body } = params;
  const res = await fetch(
    `${BFF_BASE_URL}/bff/schemas/${encodeURIComponent(schemaUuid)}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    }
  );
  if (!res.ok) {
    throw new Error(`PUT /bff/schemas/${schemaUuid} failed: ${res.status}`);
  }
  return res.json() as Promise<SchemaUpdateResponse>;
}
