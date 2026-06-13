import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { useOrderConfirmInit } from '../hooks/useOrderConfirmInit';
import { useOrderConfirmStore } from '../stores/orderConfirm.store';

vi.mock('../api/getOrders.api');
vi.mock('../api/getForms.api');
vi.mock('../api/getOrderTypes.api');

import { getOrders } from '../api/getOrders.api';
import { getForms } from '../api/getForms.api';
import { getOrderTypes } from '../api/getOrderTypes.api';

const mockGetOrders = vi.mocked(getOrders);
const mockGetForms = vi.mocked(getForms);
const mockGetOrderTypes = vi.mocked(getOrderTypes);

const ORDERS_RESPONSE = {
  orders: [
    { id: 'order-001', type: 'prescription', name: '投薬オーダー', instructions: 'アスピリン', status: 'pending', scheduledAt: '2026-05-11T09:00:00Z' },
    { id: 'order-002', type: 'imaging', name: '画像オーダー', instructions: '胸部X線', status: 'confirmed', confirmedAt: '2026-05-10T14:00:00Z', confirmedBy: 'Dr. 鈴木', scheduledAt: '2026-05-11T09:00:00Z' },
  ],
};

const FORMS_RESPONSE = {
  forms: [
    { id: 'form-001', type: 'PRESCRIPTION', name: '処方箋', description: '投薬指示書', relatedOrderIds: ['order-001'], patientId: 'P001', createdAt: '2026-05-11T09:00:00Z', createdBy: 'Dr. 鈴木', status: 'READY', priority: 'NORMAL' },
  ],
};

const ORDER_TYPES_RESPONSE = {
  orderTypes: [
    { id: 'MEDICATION', name: '投薬オーダー', route: '/order/medication' },
  ],
};

beforeEach(() => {
  mockGetOrders.mockResolvedValue(ORDERS_RESPONSE as never);
  mockGetForms.mockResolvedValue(FORMS_RESPONSE as never);
  mockGetOrderTypes.mockResolvedValue(ORDER_TYPES_RESPONSE as never);
  useOrderConfirmStore.getState().reset();
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  useOrderConfirmStore.getState().reset();
});

describe('useOrderConfirmInit', () => {
  test('初期化: API を呼び出して pendingOrders・confirmedOrders・allForms・orderTypes がストアに設定される', async () => {
    const { result } = renderHook(() => useOrderConfirmInit('P001'));

    await waitFor(() => {
      const state = useOrderConfirmStore.getState();
      expect(state.pendingOrders).toHaveLength(1);
      expect(state.pendingOrders[0].id).toBe('order-001');
    }, { timeout: 3000 });

    const state = useOrderConfirmStore.getState();
    expect(state.confirmedOrders).toHaveLength(1);
    expect(state.confirmedOrders[0].id).toBe('order-002');
    expect(state.allForms).toHaveLength(1);
    expect(state.orderTypes).toHaveLength(1);
    expect(result.current.initError).toBeNull();
  });

  test('初期化成功: isLoadingOrders が false に戻る', async () => {
    renderHook(() => useOrderConfirmInit('P001'));

    await waitFor(() => {
      expect(useOrderConfirmStore.getState().isLoadingOrders).toBe(false);
    }, { timeout: 3000 });
  });

  test('API エラー時: initError が設定される', async () => {
    mockGetOrders.mockRejectedValue(new Error('Network Error'));
    const { result } = renderHook(() => useOrderConfirmInit('P001'));

    await waitFor(() => {
      expect(result.current.initError).toBeTruthy();
    }, { timeout: 3000 });
  });

  test('patientId が空文字の場合: API を呼び出さない', () => {
    renderHook(() => useOrderConfirmInit(''));
    expect(mockGetOrders).not.toHaveBeenCalled();
  });

  test('refresh: 再度 API を呼び出してストアが更新される', async () => {
    const { result } = renderHook(() => useOrderConfirmInit('P001'));

    await waitFor(() => {
      expect(useOrderConfirmStore.getState().pendingOrders).toHaveLength(1);
    }, { timeout: 3000 });

    mockGetOrders.mockResolvedValue({ orders: [] });
    mockGetForms.mockResolvedValue({ forms: [] });
    mockGetOrderTypes.mockResolvedValue({ orderTypes: [] });

    await act(async () => {
      await result.current.refresh();
    });

    expect(useOrderConfirmStore.getState().pendingOrders).toHaveLength(0);
  });
});
