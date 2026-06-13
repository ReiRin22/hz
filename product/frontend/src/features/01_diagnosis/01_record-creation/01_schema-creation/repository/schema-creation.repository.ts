import { getTemplates } from '../api/getTemplates.api';
import { getFavorites } from '../api/getFavorites.api';
import { getSchema } from '../api/getSchema.api';
import { postSchema } from '../api/postSchema.api';
import { putSchema } from '../api/putSchema.api';
import { postFavorite } from '../api/postFavorite.api';
import { deleteFavorite } from '../api/deleteFavorite.api';
import type {
  TemplatesResponse,
  FavoritesResponse,
  SchemaGetResponse,
  SchemaSaveResponse,
  SchemaUpdateResponse,
} from '@front_bff_shared/diagnosis/schema-creation/types/schema-creation.api.response';

export type SchemaCreationInitData = {
  templates: TemplatesResponse;
  favorites: FavoritesResponse;
  existing: SchemaGetResponse | null;
};

/** EVT_INIT01: 初期表示 — テンプレート・お気に入りを並列取得し、編集時は既存シェーマを直列取得 */
export async function initializeSchemaCreation(params: {
  category: string;
  mode: 'new' | 'edit';
  schemaUuid?: string;
}): Promise<SchemaCreationInitData> {
  const [templates, favorites] = await Promise.all([
    getTemplates({ category: params.category }),
    getFavorites(),
  ]);

  let existing: SchemaGetResponse | null = null;
  if (params.mode === 'edit' && params.schemaUuid) {
    existing = await getSchema({ schemaUuid: params.schemaUuid });
  }

  return { templates, favorites, existing };
}

/** EVT_CONFIRM: 確定 — 新規時は POST、編集時は PUT で保存 */
export async function saveSchema(params: {
  mode: 'new' | 'edit';
  schemaUuid?: string;
  imageData: string;
}): Promise<SchemaSaveResponse | SchemaUpdateResponse> {
  if (params.mode === 'new') {
    return postSchema({ imageData: params.imageData });
  }
  return putSchema({ schemaUuid: params.schemaUuid!, imageData: params.imageData });
}

/** EVT_UI_CHANGE_PART: 部位変更 — GET /bff/templates をトリガー（EVT_INIT01 相当の再取得） */
export async function fetchTemplatesByCategory(params: {
  category: string;
}): Promise<TemplatesResponse> {
  return getTemplates({ category: params.category });
}

/** EVT_FAVORITE_TOGGLE: お気に入りトグル — 登録は POST、解除は DELETE */
export async function toggleFavorite(params: {
  templateId: string;
  isFavorite: boolean;
}): Promise<void> {
  if (params.isFavorite) {
    await postFavorite({ templateId: params.templateId });
  } else {
    await deleteFavorite({ templateId: params.templateId });
  }
}
