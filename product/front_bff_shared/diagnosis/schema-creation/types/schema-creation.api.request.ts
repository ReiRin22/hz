/** POST /bff/schemas リクエストボディ */
export type SchemaSaveRequest = {
  imageData: string;
};

/** PUT /bff/schemas/{schemaUuid} リクエストボディ */
export type SchemaUpdateRequest = {
  imageData: string;
};

/** POST /bff/favorites リクエストボディ */
export type FavoriteAddRequest = {
  templateId: string;
};
