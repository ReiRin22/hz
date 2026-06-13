import { http, HttpResponse } from 'msw';

const BFF_BASE_URL = 'http://localhost:3001';

const SAMPLE_HISTORY = [
  {
    id: 'sh-001',
    date: '2025-04-01',
    testName: '血液一般',
    orderCode: 'LAB-BLD-001',
    specimenType: 'blood',
    status: 'confirmed',
    confirmedAt: '2025-04-01T09:00:00Z',
    confirmedBy: 'Dr. 鈴木',
  },
];

const SAMPLE_SPECIMEN_SETS = [
  {
    id: 'labset-1',
    name: '基本血液検査セット',
    description: '血算・生化学・凝固を含む基本セット',
    setType: 'hospital',
    items: [
      {
        id: 'sh-101',
        date: '2025-01-01',
        testName: '血算',
        orderCode: 'LAB-CBC-001',
        specimenType: 'blood',
        status: 'confirmed',
        confirmedAt: '2025-01-01T00:00:00Z',
        confirmedBy: 'system',
      },
    ],
  },
];

const SAMPLE_CONFIRMED_ORDERS = [
  {
    id: 'ORDER-001',
    testName: '血算',
    orderCode: 'LAB-CBC-001',
    specimenType: 'blood',
    status: 'confirmed',
    confirmedAt: new Date().toISOString(),
    confirmedBy: 'current-user',
  },
];

const SAMPLE_SPECIMEN_ITEMS = {
  items: [
    { id: 'si-001', code: 'CBC', name: '血算（CBC）', category: '血液', specimenType: 'blood' },
    { id: 'si-002', code: 'BMP', name: '生化学', category: '血液', specimenType: 'blood' },
    { id: 'si-003', code: 'UA', name: '尿一般', category: '尿', specimenType: 'urine' },
    { id: 'si-004', code: 'CULT', name: '尿培養', category: '尿', specimenType: 'urine' },
  ],
};

/** ORD023 Feature / SpecimenOrderEntryOrganism 共通ハンドラー */
export const commonHandlers = [
  http.get(`${BFF_BASE_URL}/bff/patients/:patientId/specimen-history`, () =>
    HttpResponse.json({ history: SAMPLE_HISTORY })
  ),
  http.get(`${BFF_BASE_URL}/bff/order-sets/specimen-sets`, () =>
    HttpResponse.json({ specimenSets: SAMPLE_SPECIMEN_SETS })
  ),
  http.post(`${BFF_BASE_URL}/bff/patients/:patientId/specimen-orders`, () =>
    HttpResponse.json({ confirmedOrders: SAMPLE_CONFIRMED_ORDERS }, { status: 201 })
  ),
];

/** SpecimenOrderEditForm 用ハンドラー（検体項目マスタ取得を追加） */
export const editFormHandlers = [
  ...commonHandlers,
  http.get(`${BFF_BASE_URL}/bff/master/specimen-items`, () =>
    HttpResponse.json(SAMPLE_SPECIMEN_ITEMS)
  ),
];

/** エラーシナリオ: specimen-history 500 */
export const historyErrorHandlers = [
  http.get(`${BFF_BASE_URL}/bff/patients/:patientId/specimen-history`, () =>
    HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  ),
  http.get(`${BFF_BASE_URL}/bff/order-sets/specimen-sets`, () =>
    HttpResponse.json({ specimenSets: [] })
  ),
  http.post(`${BFF_BASE_URL}/bff/patients/:patientId/specimen-orders`, () =>
    HttpResponse.json({ confirmedOrders: [] }, { status: 201 })
  ),
];

/** エラーシナリオ: specimen-items 500（EditForm用） */
export const itemsFetchErrorHandlers = [
  http.get(`${BFF_BASE_URL}/bff/master/specimen-items`, () =>
    HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  ),
];
