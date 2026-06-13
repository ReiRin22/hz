import type { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { OrderEntryOrganism } from '../../components/organisms/OrderEntryOrganism';

const BFF_BASE = '';

export const commonHandlers = [
  http.get(`${BFF_BASE}/api/orders/history`, () =>
    HttpResponse.json({
      orders: [
        {
          id: 'h1',
          name: 'アムロジピン錠5mg',
          orderDate: '2026-05-01',
          orderType: 'prescription',
          items: [{ itemId: 'drug-001', name: 'アムロジピン錠5mg', orderType: 'prescription' }],
        },
      ],
      total: 1,
    })
  ),
  http.get(`${BFF_BASE}/api/orders/sets`, () =>
    HttpResponse.json({
      sets: [
        {
          id: 's1',
          name: '高血圧セット',
          type: 'my-set',
          orderType: 'prescription',
          items: ['アムロジピン錠5mg', 'エナラプリル錠5mg'],
        },
      ],
    })
  ),
  http.post(`${BFF_BASE}/api/orders/entry`, () =>
    HttpResponse.json({ success: true, orderId: 'order-001', confirmedAt: '2026-05-14T09:00:00Z' })
  ),
  http.post(`${BFF_BASE}/api/orders/temporary`, () =>
    HttpResponse.json({ success: true, saveId: 'save-001', savedAt: '2026-05-14T09:00:00Z' })
  ),
  http.get(`${BFF_BASE}/api/orders/drugs/search`, () =>
    HttpResponse.json({
      drugs: [
        { id: 'drug-001', name: 'アムロジピン錠5mg', code: 'D001', dosage: '5mg', unit: '錠' },
        { id: 'drug-002', name: 'エナラプリル錠5mg', code: 'D002', dosage: '5mg', unit: '錠' },
      ],
      total: 2,
    })
  ),
];

export const errorHandlers = [
  http.get(`${BFF_BASE}/api/orders/history`, () =>
    HttpResponse.json({ message: '履歴取得に失敗しました' }, { status: 500 })
  ),
  http.get(`${BFF_BASE}/api/orders/sets`, () =>
    HttpResponse.json({ message: 'セット取得に失敗しました' }, { status: 500 })
  ),
];

const meta = {
  title: '16_ui-common/01_menu-header/01_left-sidemenu/organisms/OrderEntryOrganism',
  component: OrderEntryOrganism,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    msw: { handlers: commonHandlers },
  },
} satisfies Meta<typeof OrderEntryOrganism>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ApiError: Story = {
  parameters: {
    msw: { handlers: errorHandlers },
  },
};
