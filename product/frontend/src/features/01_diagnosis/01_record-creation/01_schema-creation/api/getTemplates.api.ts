import type { TemplatesResponse } from '@front_bff_shared/diagnosis/schema-creation/types/schema-creation.api.response';

const BFF_BASE_URL = process.env.NEXT_PUBLIC_BFF_URL ?? 'http://localhost:3001';

export async function getTemplates(params: { category: string }): Promise<TemplatesResponse> {
  const url = new URL(`${BFF_BASE_URL}/bff/templates`);
  url.searchParams.set('category', params.category);

  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`GET /bff/templates failed: ${res.status}`);
  }
  return res.json() as Promise<TemplatesResponse>;
}
