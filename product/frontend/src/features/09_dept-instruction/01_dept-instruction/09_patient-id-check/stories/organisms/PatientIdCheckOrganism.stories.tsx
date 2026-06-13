import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { http, HttpResponse } from 'msw';
import { PatientIdCheckOrganism } from '../../components/organisms/PatientIdCheckOrganism';
import { usePatientIdCheckStore } from '../../stores/usePatientIdCheckStore';

const BASE_URL = '/bff';

const EXPECTATIONS = {
  patient: {
    id: 'P00012345',
    name: '山田 太郎',
    kana: 'ヤマダ タロウ',
    birthDate: '1965-04-15',
    barcode: 'PT-12345678',
  },
  item: {
    name: '生理食塩水 500mL',
    lotNumber: 'LOT-20250101',
    barcode: 'IT-98765432',
  },
  order: { id: 'ORD-001', orderType: '注射' },
};

export const commonHandlers = [
  http.get(`${BASE_URL}/dept-instructions/:orderId/patient-id-check/expectations`, () =>
    HttpResponse.json(EXPECTATIONS),
  ),
  http.get(`${BASE_URL}/dept-instructions/patient-id-check/reason-templates`, () =>
    HttpResponse.json({
      templates: [
        { code: 'T001', label: '本人確認書類（保険証）で確認' },
        { code: 'T002', label: '医療スタッフ2名で確認' },
      ],
    }),
  ),
  http.get(`${BASE_URL}/dept-instructions/patient-id-check/staff/:barcode`, () =>
    HttpResponse.json({ staff: { id: 'STAFF-001', name: '看護師 佐藤' } }),
  ),
  http.post(`${BASE_URL}/dept-instructions/:orderId/patient-id-check/complete`, () =>
    HttpResponse.json({
      sessionId: 'SESSION-001',
      completedAt: new Date().toISOString(),
      recordedAt: new Date().toISOString(),
    }),
  ),
  http.post(`${BASE_URL}/dept-instructions/:orderId/patient-id-check/confirm-reason`, () =>
    HttpResponse.json({ reasonId: 'REASON-001', savedAt: new Date().toISOString() }),
  ),
];

// SCOPE-OUT: axiosClientが未接続のため、storeに期待値を直接セットして初期化エラーを回避する。
// チケット#11377 完了後は不要になる。
const preloadStoreDecorator: Decorator = (Story) => {
  const store = usePatientIdCheckStore.getState();
  store.reset();
  store.setOrderId('ORD-001');
  store.setExpectations({
    patient: {
      id: EXPECTATIONS.patient.id,
      name: EXPECTATIONS.patient.name,
      kana: EXPECTATIONS.patient.kana,
      birthDate: EXPECTATIONS.patient.birthDate,
      barcode: EXPECTATIONS.patient.barcode,
    },
    item: {
      name: EXPECTATIONS.item.name,
      lotNumber: EXPECTATIONS.item.lotNumber,
      barcode: EXPECTATIONS.item.barcode,
    },
    order: {
      id: EXPECTATIONS.order.id,
      orderType: EXPECTATIONS.order.orderType,
    },
  });
  return <Story />;
};

const meta = {
  title: '09_dept-instruction/01_dept-instruction/09_patient-id-check/organisms/PatientIdCheckOrganism',
  component: PatientIdCheckOrganism,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    msw: { handlers: commonHandlers },
  },
  decorators: [preloadStoreDecorator],
  args: {
    orderId: 'ORD-001',
    onComplete: fn(),
    onCancel: fn(),
  },
} satisfies Meta<typeof PatientIdCheckOrganism>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LoadError: Story = {
  decorators: [
    (Story) => {
      usePatientIdCheckStore.getState().reset();
      return <Story />;
    },
  ],
  parameters: {
    msw: {
      handlers: [
        http.get(`${BASE_URL}/dept-instructions/:orderId/patient-id-check/expectations`, () =>
          HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 }),
        ),
        http.get(`${BASE_URL}/dept-instructions/patient-id-check/reason-templates`, () =>
          HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 }),
        ),
      ],
    },
  },
};
