/** テンプレート1件 */
export type TemplateItem = {
  templateId: string;
  name: string;
  category: string;
  thumbnailUrl: string;
  svgComponent: string;
};

/** GET /bff/templates?category={category} レスポンス */
export type TemplatesResponse = {
  templates: TemplateItem[];
  favoriteTemplateIds: string[];
};

/** GET /bff/favorites レスポンス */
export type FavoritesResponse = {
  favoriteTemplateIds: string[];
};

/** GET /bff/schemas/{schemaUuid} レスポンス */
export type SchemaGetResponse = {
  schemaUuid: string;
  imageData: string;
  createdAt: string;
  updatedAt: string;
};

/** POST /bff/schemas レスポンス */
export type SchemaSaveResponse = {
  schemaUuid: string;
  savedAt: string;
};

/** PUT /bff/schemas/{schemaUuid} レスポンス */
export type SchemaUpdateResponse = {
  schemaUuid: string;
  savedAt: string;
};

/** BFF統一エラーレスポンス */
export type BffErrorResponse = {
  type: 'AUTH_ERROR' | 'FORBIDDEN' | 'BUSINESS_ERROR' | 'SYSTEM_ERROR';
  code: string;
};
