import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { OrderConfirmPanel } from '../../components/organisms/OrderConfirmPanel';
import { useOrderConfirmStore } from '../../stores/orderConfirm.store';
import type { PendingOrderViewModel, ConfirmedOrderViewModel, FormViewModel, OrderTypeViewModel } from '../../types/order-confirm.types';
import {
  commonHandlers,
  noPendingOrdersHandlers,
  errorHandlers,
  FORMS,
  ORDER_TYPES,
} from '../../test/msw/handlers';

export { commonHandlers, noPendingOrdersHandlers, errorHandlers };

const MOCK_PENDING_ORDERS: PendingOrderViewModel[] = [
  {
    id: 'order-001',
    type: 'prescription',
    typeName: '投薬オーダー',
    detail: 'アスピリン 100mg 1錠/日',
    addedAt: '2026-05-11T09:00:00Z',
    scheduledAt: '2026-05-11T09:00:00Z',
  },
  {
    id: 'order-002',
    type: 'lab',
    typeName: '検体検査オーダー',
    detail: '血液一般・生化学',
    addedAt: '2026-05-11T09:05:00Z',
    scheduledAt: '2026-05-11T09:05:00Z',
  },
];

const MOCK_CONFIRMED_ORDERS: ConfirmedOrderViewModel[] = [
  {
    id: 'order-003',
    type: 'imaging',
    typeName: '画像オーダー',
    detail: '胸部X線（正面）',
    confirmedAt: '2026-05-10T14:00:00Z',
    status: 'confirmed',
    isRevoked: false,
  },
];

const MOCK_FORMS: FormViewModel[] = FORMS.map((f) => ({
  id: f.id,
  name: f.name,
  description: f.description,
  relatedOrderIds: f.relatedOrderIds,
}));

const MOCK_ORDER_TYPES: OrderTypeViewModel[] = ORDER_TYPES;

const meta = {
  title: '05_order/19_nursing-care-order/03_order-confirm/organisms/OrderConfirmPanel',
  component: OrderConfirmPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    msw: { handlers: commonHandlers },
  },
  args: {
    patientId: 'P001',
    patientName: '山田 太郎',
    confirmedBy: 'Dr.鈴木',
    isSubstituteUser: false,
    onSpecimenOrderOpen: fn(),
    onImagingOrderOpen: fn(),
  },
} satisfies Meta<typeof OrderConfirmPanel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SubstituteUser: Story = {
  args: {
    isSubstituteUser: true,
  },
};

export const NoPendingOrders: Story = {
  decorators: [
    (Story) => {
      const store = useOrderConfirmStore.getState();
      store.reset();
      store.setPendingOrders([]);
      store.setConfirmedOrders(MOCK_CONFIRMED_ORDERS);
      store.setAllForms(MOCK_FORMS);
      store.setOrderTypes(MOCK_ORDER_TYPES);
      return <Story />;
    },
  ],
  parameters: {
    msw: { handlers: noPendingOrdersHandlers },
  },
};

export const WithAllergyWarning: Story = {
  args: {
    patientAllergies: ['アスピリン'],
  },
};

export const ApiError: Story = {
  decorators: [
    (Story) => {
      useOrderConfirmStore.getState().reset();
      return <Story />;
    },
  ],
  parameters: {
    msw: { handlers: errorHandlers },
  },
};
