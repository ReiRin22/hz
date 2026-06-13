import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import { afterAll, afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import * as stories from '../stories/organisms/OrderConfirmPanel.stories';
import { useOrderConfirmStore } from '../stores/orderConfirm.store';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('../api/getOrders.api');
vi.mock('../api/getForms.api');
vi.mock('../api/getOrderTypes.api');
vi.mock('../api/confirmOrders.api');
vi.mock('../api/deleteOrder.api');
vi.mock('../api/revokeOrder.api');
vi.mock('../api/outputForms.api');

import * as getOrdersApi from '../api/getOrders.api';
import * as getFormsApi from '../api/getForms.api';
import * as getOrderTypesApi from '../api/getOrderTypes.api';
import * as confirmOrdersApi from '../api/confirmOrders.api';

const PENDING_ORDERS = [
  {
    id: 'order-001',
    type: 'prescription' as const,
    name: '投薬オーダー',
    instructions: 'アスピリン 100mg 1錠/日',
    scheduledAt: '2026-05-11T09:00:00Z',
    status: 'pending' as const,
  },
  {
    id: 'order-002',
    type: 'lab' as const,
    name: '検体検査オーダー',
    instructions: '血液一般・生化学',
    scheduledAt: '2026-05-11T09:05:00Z',
    status: 'pending' as const,
  },
];

const CONFIRMED_ORDERS = [
  {
    id: 'order-003',
    type: 'imaging' as const,
    name: '画像オーダー',
    instructions: '胸部X線（正面）',
    confirmedAt: '2026-05-10T14:00:00Z',
    confirmedBy: 'Dr. 鈴木',
    status: 'confirmed' as const,
  },
];

const FORMS = [
  {
    id: 'form-001',
    type: 'PRESCRIPTION' as const,
    name: '処方箋',
    description: '投薬指示書',
    relatedOrderIds: ['order-001'],
    patientId: 'P001',
    createdAt: '2026-05-11T09:00:00Z',
    createdBy: 'Dr. 鈴木',
    status: 'READY' as const,
    priority: 'NORMAL' as const,
  },
];

const ORDER_TYPES = [
  { id: 'MEDICATION', name: '投薬オーダー', route: '/order/medication' },
  { id: 'LAB', name: '検体検査オーダー', route: '/order/lab' },
  { id: 'IMAGING', name: '画像オーダー', route: '/order/imaging' },
];

function setupDefaultMocks() {
  vi.mocked(getOrdersApi.getOrders).mockResolvedValue({
    orders: [...PENDING_ORDERS, ...CONFIRMED_ORDERS],
  });
  vi.mocked(getFormsApi.getForms).mockResolvedValue({ forms: FORMS });
  vi.mocked(getOrderTypesApi.getOrderTypes).mockResolvedValue({ orderTypes: ORDER_TYPES });
  vi.mocked(confirmOrdersApi.confirmOrders).mockResolvedValue({
    confirmedOrders: PENDING_ORDERS.map((o) => ({
      ...o,
      confirmedAt: new Date().toISOString(),
      status: 'confirmed' as const,
    })),
  });
}

const { Default, SubstituteUser, NoPendingOrders, ApiError, WithAllergyWarning } = composeStories(stories);

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  useOrderConfirmStore.getState().reset();
});

afterAll(() => {
  vi.restoreAllMocks();
});

describe('OrderConfirmPanel / Default', () => {
  beforeEach(() => {
    setupDefaultMocks();
  });

  test('初期表示: 見出しと件数ラベルが表示される', async () => {
    render(<Default />);

    await waitFor(() => {
      expect(screen.getByText(/件登録済み/)).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(screen.getByText('オーダー確定')).toBeInTheDocument();
  });

  test('初期表示: 未確定オーダーセクションが表示される', async () => {
    render(<Default />);

    await waitFor(() => {
      expect(screen.getByText(/未確定/)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('初期表示: 確定済みオーダーセクションが表示される', async () => {
    render(<Default />);

    await waitFor(() => {
      expect(screen.getByText(/確定済み/)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('帳票出力ボタン押下: PrintDialog が開く', async () => {
    const user = userEvent.setup();
    render(<Default />);

    await waitFor(() => {
      expect(screen.getByText('帳票出力')).toBeInTheDocument();
    }, { timeout: 3000 });

    await user.click(screen.getByText('帳票出力'));

    await waitFor(() => {
      expect(screen.getByText(/出力する帳票を選択/)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('オーダー追加ボタン押下: OrderTypeSelectDialog が開く', async () => {
    const user = userEvent.setup();
    render(<Default />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'オーダー追加' })).toBeInTheDocument();
    }, { timeout: 3000 });

    await user.click(screen.getByRole('button', { name: 'オーダー追加' }));

    await waitFor(() => {
      expect(screen.getByText('オーダー種別選択')).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});

describe('OrderConfirmPanel / NoPendingOrders', () => {
  test('未確定オーダーなし: 確定ボタンが disabled', async () => {
    vi.mocked(getOrdersApi.getOrders).mockResolvedValue({ orders: CONFIRMED_ORDERS });
    vi.mocked(getFormsApi.getForms).mockResolvedValue({ forms: FORMS });
    vi.mocked(getOrderTypesApi.getOrderTypes).mockResolvedValue({ orderTypes: ORDER_TYPES });

    render(<NoPendingOrders />);

    await waitFor(() => {
      const confirmBtn = screen.getByRole('button', { name: /オーダー確定/ });
      expect(confirmBtn).toBeDisabled();
    }, { timeout: 3000 });
  });
});

describe('OrderConfirmPanel / SubstituteUser', () => {
  test('代行入力者: 確定済みオーダーセクションが表示される', async () => {
    setupDefaultMocks();
    render(<SubstituteUser />);

    await waitFor(() => {
      expect(screen.getByText(/確定済み/)).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});

describe('OrderConfirmPanel / WithAllergyWarning', () => {
  test('アレルギーマッチ: 確定ボタン押下でアレルギー警告ダイアログが表示される', async () => {
    setupDefaultMocks();
    const user = userEvent.setup();
    render(<WithAllergyWarning />);

    let confirmBtn: HTMLElement | null = null;
    await waitFor(() => {
      const btn = screen.getByRole('button', { name: /オーダー確定/ });
      expect(btn).not.toBeDisabled();
      confirmBtn = btn;
    }, { timeout: 3000 });

    if (confirmBtn) await user.click(confirmBtn);

    await waitFor(() => {
      expect(screen.getByText('アレルギー警告')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('アレルギー警告キャンセル: ダイアログが閉じる', async () => {
    setupDefaultMocks();
    const user = userEvent.setup();
    render(<WithAllergyWarning />);

    await waitFor(() => {
      const btn = screen.getByRole('button', { name: /オーダー確定/ });
      expect(btn).not.toBeDisabled();
    }, { timeout: 3000 });

    await user.click(screen.getByRole('button', { name: /オーダー確定/ }));

    await waitFor(() => {
      expect(screen.getByText('アレルギー警告')).toBeInTheDocument();
    }, { timeout: 3000 });

    await user.click(screen.getByRole('button', { name: 'キャンセル' }));

    await waitFor(() => {
      expect(screen.queryByText('アレルギー警告')).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('アレルギー警告確認後確定: 警告を確認して確定ボタンで確定が実行される', async () => {
    setupDefaultMocks();
    const user = userEvent.setup();
    render(<WithAllergyWarning />);

    await waitFor(() => {
      const btn = screen.getByRole('button', { name: /オーダー確定/ });
      expect(btn).not.toBeDisabled();
    }, { timeout: 3000 });

    await user.click(screen.getByRole('button', { name: /オーダー確定/ }));

    await waitFor(() => {
      expect(screen.getByText('アレルギー警告')).toBeInTheDocument();
    }, { timeout: 3000 });

    await user.click(screen.getByRole('button', { name: '警告を確認して確定' }));

    await waitFor(() => {
      expect(screen.queryByText('アレルギー警告')).not.toBeInTheDocument();
    }, { timeout: 5000 });
  });
});

describe('OrderConfirmPanel / ApiError', () => {
  test('API エラー: エラーメッセージが表示される', async () => {
    vi.mocked(getOrdersApi.getOrders).mockResolvedValue({
      orders: [...PENDING_ORDERS, ...CONFIRMED_ORDERS],
    });
    vi.mocked(getFormsApi.getForms).mockResolvedValue({ forms: FORMS });
    vi.mocked(getOrderTypesApi.getOrderTypes).mockResolvedValue({ orderTypes: ORDER_TYPES });
    vi.mocked(confirmOrdersApi.confirmOrders).mockRejectedValue(new Error('Server Error'));

    const user = userEvent.setup();
    render(<ApiError />);

    let confirmBtn: HTMLElement | null = null;
    await waitFor(() => {
      const btn = screen.getByRole('button', { name: /オーダー確定/ });
      expect(btn).not.toBeDisabled();
      confirmBtn = btn;
    }, { timeout: 3000 });

    if (confirmBtn) await user.click(confirmBtn);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    }, { timeout: 5000 });
  });
});
