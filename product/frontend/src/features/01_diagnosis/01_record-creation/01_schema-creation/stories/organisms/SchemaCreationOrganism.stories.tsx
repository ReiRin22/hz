import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { http, HttpResponse } from 'msw';
import SchemaCreationOrganism from '../../components/organisms/SchemaCreationOrganism';

const BFF = '';

const SAMPLE_TEMPLATES = [
  { templateId: 'tmpl-001', name: '全身図（前面）', category: '全身図', thumbnailUrl: '', svgComponent: '' },
  { templateId: 'tmpl-002', name: '全身図（背面）', category: '全身図', thumbnailUrl: '', svgComponent: '' },
  { templateId: 'tmpl-003', name: '頭部', category: '頭部', thumbnailUrl: '', svgComponent: '' },
];

/** NewMode / MSW不要story で使う共通ハンドラー（named export でテストから参照） */
export const commonHandlers = [
  http.get(`${BFF}/bff/templates`, () =>
    HttpResponse.json({
      templates: SAMPLE_TEMPLATES.filter(t => t.category === '全身図'),
      favoriteTemplateIds: ['tmpl-001'],
    })
  ),
  http.get(`${BFF}/bff/favorites`, () =>
    HttpResponse.json({ favoriteTemplateIds: ['tmpl-001'] })
  ),
  http.post(`${BFF}/bff/favorites`, () => new HttpResponse(null, { status: 204 })),
  http.delete(`${BFF}/bff/favorites/:templateId`, () => new HttpResponse(null, { status: 204 })),
  http.post(`${BFF}/bff/schemas`, () =>
    HttpResponse.json({ schemaUuid: 'schema-uuid-new-001', savedAt: new Date().toISOString() })
  ),
];

/** EditMode 固有ハンドラー（GET /bff/schemas/:schemaUuid + PUT を追加） */
export const editModeHandlers = [
  ...commonHandlers,
  http.get(`${BFF}/bff/schemas/:schemaUuid`, () =>
    HttpResponse.json({
      schemaUuid: 'schema-uuid-001',
      imageData: '',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    })
  ),
  http.put(`${BFF}/bff/schemas/:schemaUuid`, () =>
    HttpResponse.json({ schemaUuid: 'schema-uuid-001', savedAt: new Date().toISOString() })
  ),
];

/** テンプレート取得エラー時のハンドラー */
export const templateFetchErrorHandlers = [
  http.get(`${BFF}/bff/templates`, () =>
    HttpResponse.json({ type: 'SYSTEM_ERROR', code: 'E-9999' }, { status: 500 })
  ),
  http.get(`${BFF}/bff/favorites`, () =>
    HttpResponse.json({ favoriteTemplateIds: [] })
  ),
];

const meta = {
  title: '01_diagnosis/01_record-creation/01_schema-creation/organisms/SchemaCreationOrganism',
  component: SchemaCreationOrganism,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    msw: { handlers: commonHandlers },
  },
  args: {
    onConfirm: fn(),
    onCancel: fn(),
  },
} satisfies Meta<typeof SchemaCreationOrganism>;
export default meta;
type Story = StoryObj<typeof meta>;

export const NewMode: Story = {
  args: {
    mode: 'new',
    initialCategory: '全身図',
  },
};

export const EditMode: Story = {
  parameters: {
    msw: { handlers: editModeHandlers },
  },
  args: {
    mode: 'edit',
    schemaUuid: 'schema-uuid-001',
    initialCategory: '全身図',
  },
};

export const TemplateFetchError: Story = {
  parameters: {
    msw: { handlers: templateFetchErrorHandlers },
  },
  args: {
    mode: 'new',
    initialCategory: '全身図',
  },
};
