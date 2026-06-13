import { http, HttpResponse } from 'msw';

const BASE_URL = 'http://localhost:3001/bff';

const PENDING_ORDERS = [
  {
    id: 'order-001',
    type: 'prescription',
    name: '投薬オーダー',
    instructions: 'アスピリン 100mg 1錠/日',
    scheduledAt: '2026-05-11T09:00:00Z',
    status: 'pending',
  },
  {
    id: 'order-002',
    type: 'lab',
    name: '検体検査オーダー',
    instructions: '血液一般・生化学',
    scheduledAt: '2026-05-11T09:05:00Z',
    status: 'pending',
  },
];

const CONFIRMED_ORDERS = [
  {
    id: 'order-003',
    type: 'imaging',
    name: '画像オーダー',
    instructions: '胸部X線（正面）',
    confirmedAt: '2026-05-10T14:00:00Z',
    confirmedBy: 'Dr. 鈴木',
    status: 'confirmed',
  },
];

export const FORMS = [
  {
    id: 'form-001',
    type: 'PRESCRIPTION',
    name: '処方箋',
    description: '投薬指示書',
    relatedOrderIds: ['order-001'],
    patientId: 'P001',
    createdAt: '2026-05-11T09:00:00Z',
    createdBy: 'Dr. 鈴木',
    status: 'READY',
    priority: 'NORMAL',
  },
  {
    id: 'form-002',
    type: 'LAB_REQUEST',
    name: '検体検査依頼書',
    description: '検査オーダー依頼',
    relatedOrderIds: ['order-002'],
    patientId: 'P001',
    createdAt: '2026-05-11T09:05:00Z',
    createdBy: 'Dr. 鈴木',
    status: 'READY',
    priority: 'NORMAL',
  },
];

export const ORDER_TYPES = [
  { id: 'MEDICATION', name: '投薬オーダー', route: '/order/medication' },
  { id: 'LAB', name: '検体検査オーダー', route: '/order/lab' },
  { id: 'IMAGING', name: '画像オーダー', route: '/order/imaging' },
];

export const commonHandlers = [
  http.get(`${BASE_URL}/orders`, () =>
    HttpResponse.json({ orders: [...PENDING_ORDERS, ...CONFIRMED_ORDERS] })
  ),
  http.get(`${BASE_URL}/orders/forms`, () =>
    HttpResponse.json({ forms: FORMS })
  ),
  http.get(`${BASE_URL}/order-types`, () =>
    HttpResponse.json({ orderTypes: ORDER_TYPES })
  ),
  http.post(`${BASE_URL}/orders/confirm`, () =>
    HttpResponse.json({
      confirmedOrders: PENDING_ORDERS.map((o) => ({
        ...o,
        confirmedAt: new Date().toISOString(),
        status: 'confirmed',
      })),
    })
  ),
  http.delete(`${BASE_URL}/orders/:orderId`, () =>
    new HttpResponse(null, { status: 204 })
  ),
  http.post(`${BASE_URL}/orders/:orderId/revoke`, () =>
    HttpResponse.json({ order: { ...CONFIRMED_ORDERS[0], status: 'cancelled' } })
  ),
  http.post(`${BASE_URL}/orders/forms/output`, () =>
    HttpResponse.json({ outputForms: [{ formId: 'form-001', pdfUrl: '/pdf/form-001.pdf' }] })
  ),
];

export const noPendingOrdersHandlers = [
  http.get(`${BASE_URL}/orders`, () =>
    HttpResponse.json({ orders: CONFIRMED_ORDERS })
  ),
  ...commonHandlers.slice(1),
];

export const errorHandlers = [
  http.post(`${BASE_URL}/orders/confirm`, () =>
    new HttpResponse(null, { status: 503 })
  ),
  ...commonHandlers.filter((_, i) => i !== 3),
];
