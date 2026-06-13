import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { http, HttpResponse } from 'msw';
import { RecordInputOrganism } from '../../components/organisms/RecordInputOrganism';

const BFF_BASE = '';

export const commonHandlers = [
  http.get(`${BFF_BASE}/bff/records/:patientId/soap/drafts`, () =>
    HttpResponse.json({ drafts: [] })
  ),
  http.get(`${BFF_BASE}/bff/comments`, () =>
    HttpResponse.json({ comments: [] })
  ),
  http.get(`${BFF_BASE}/bff/templates/soap`, () =>
    HttpResponse.json({ templates: [] })
  ),
  http.post(`${BFF_BASE}/bff/records/:patientId/soap`, () =>
    HttpResponse.json({ recordId: 'record-new-001', status: 'CONFIRMED' })
  ),
  http.post(`${BFF_BASE}/bff/records/:patientId/soap/draft`, () =>
    HttpResponse.json({ draftId: 'draft-new-001' })
  ),
  http.delete(`${BFF_BASE}/bff/records/:patientId/soap/draft/:draftId`, () =>
    new HttpResponse(null, { status: 204 })
  ),
  http.post(`${BFF_BASE}/bff/comments/my`, () =>
    HttpResponse.json({ commentId: 'mc-new-001' })
  ),
  http.put(`${BFF_BASE}/bff/comments/my/:commentId`, () =>
    new HttpResponse(null, { status: 204 })
  ),
  http.delete(`${BFF_BASE}/bff/comments/my/:commentId`, () =>
    new HttpResponse(null, { status: 204 })
  ),
];

export const editModeHandlers = [
  ...commonHandlers,
  http.get(`${BFF_BASE}/bff/records/:patientId/soap/:recordId`, () =>
    HttpResponse.json({
      recordId: 'record-001',
      recordDate: '2026-05-12',
      recorderName: '山田 太郎',
      soapContent: 'S: 既存のSOAP記録内容\nO: バイタル安定\nA: 診断済み\nP: 治療継続',
      status: 'DRAFT',
    })
  ),
];

// MSW は最初にマッチしたハンドラーを使うため、ドラフトハンドラーを先頭に置く
export const withDraftHandlers = [
  http.get(`${BFF_BASE}/bff/records/:patientId/soap/drafts`, () =>
    HttpResponse.json({
      drafts: [
        {
          id: 'draft-001',
          soapContent: 'S: 下書きの内容\nO: バイタル安定\nA: 診断中\nP: 経過観察',
          savedAt: '2026-05-12T10:30:00Z',
        },
      ],
    })
  ),
  ...commonHandlers,
];

const meta = {
  title: '01_diagnosis/01_record-creation/01_examination-input/organisms/RecordInputOrganism',
  component: RecordInputOrganism,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    msw: { handlers: commonHandlers },
  },
  args: {
    onConfirmed: fn(),
  },
} satisfies Meta<typeof RecordInputOrganism>;
export default meta;
type Story = StoryObj<typeof meta>;

export const NewMode: Story = {
  args: {
    patientId: 'patient-001',
    receptionId: 'reception-001',
    loginUserName: '山田 太郎',
    recorderId: 'recorder-001',
  },
};

export const EditMode: Story = {
  parameters: {
    msw: { handlers: editModeHandlers },
  },
  args: {
    patientId: 'patient-001',
    receptionId: 'reception-001',
    recordId: 'record-001',
    loginUserName: '山田 太郎',
    recorderId: 'recorder-001',
  },
};

export const WithDraft: Story = {
  parameters: {
    msw: { handlers: withDraftHandlers },
  },
  args: {
    patientId: 'patient-001',
    receptionId: 'reception-001',
    loginUserName: '山田 太郎',
    recorderId: 'recorder-001',
  },
};
