import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { useOrderConfirmSubmit } from '../hooks/useOrderConfirmSubmit';
import { useOrderConfirmStore } from '../stores/orderConfirm.store';
import type { PendingOrderViewModel } from '../types/order-confirm.types';

vi.mock('../api/confirmOrders.api');
vi.mock('../api/deleteOrder.api');
vi.mock('../api/revokeOrder.api');
vi.mock('../api/outputForms.api');

import { confirmOrders } from '../api/confirmOrders.api';
import { deleteOrder } from '../api/deleteOrder.api';
import { revokeOrder } from '../api/revokeOrder.api';
import { outputForms } from '../api/outputForms.api';

const mockConfirmOrders = vi.mocked(confirmOrders);
const mockDeleteOrder = vi.mocked(deleteOrder);
const mockRevokeOrder = vi.mocked(revokeOrder);
const mockOutputForms = vi.mocked(outputForms);

const PENDING_ORDER: PendingOrderViewModel = {
  id: 'order-001',
  type: 'prescription',
  typeName: '投薬オーダー',
  detail: 'アスピリン 100mg',
  addedAt: '2026-05-11T09:00:00Z',
};

const CONFIRMED_ORDER_RESPONSE = {
  confirmedOrders: [
    { id: 'order-001', type: 'prescription', name: '投薬オーダー', instructions: 'アスピリン', status: 'confirmed', confirmedAt: new Date().toISOString(), confirmedBy: 'Dr. 鈴木', scheduledAt: '2026-05-11T09:00:00Z' },
  ],
};

beforeEach(() => {
  useOrderConfirmStore.getState().reset();
  useOrderConfirmStore.getState().setPendingOrders([PENDING_ORDER]);
  vi.clearAllMocks();
});

afterEach(() => {
  cleanup();
  useOrderConfirmStore.getState().reset();
});

describe('useOrderConfirmSubmit / handleConfirmOrders', () => {
  test('アレルギーなし・成功: moveOrdersToConfirmed が呼ばれ true を返す', async () => {
    mockConfirmOrders.mockResolvedValue(CONFIRMED_ORDER_RESPONSE as never);
    const { result } = renderHook(() =>
      useOrderConfirmSubmit('P001', 'Dr. 鈴木', [])
    );

    let returnValue: unknown;
    await act(async () => {
      returnValue = await result.current.handleConfirmOrders(['order-001']);
    });

    expect(returnValue).toBe(true);
    expect(useOrderConfirmStore.getState().pendingOrders).toHaveLength(0);
  });

  test('アレルギー検出: allergy_warning を返す', async () => {
    const { result } = renderHook(() =>
      useOrderConfirmSubmit('P001', 'Dr. 鈴木', ['アスピリン'])
    );

    let returnValue: unknown;
    await act(async () => {
      returnValue = await result.current.handleConfirmOrders(['order-001']);
    });

    expect(returnValue).toBe('allergy_warning');
    expect(result.current.allergyWarnings.length).toBeGreaterThan(0);
    expect(mockConfirmOrders).not.toHaveBeenCalled();
  });

  test('API 503 エラー: error.code が E_ORD076_01 になる', async () => {
    const axiosError = Object.assign(new Error('Service Unavailable'), {
      isAxiosError: true,
      response: { status: 503 },
    });
    mockConfirmOrders.mockRejectedValue(axiosError);
    const { result } = renderHook(() =>
      useOrderConfirmSubmit('P001', 'Dr. 鈴木', [])
    );

    await act(async () => {
      await result.current.handleConfirmOrders(['order-001']);
    });

    expect(result.current.error?.code).toBe('E_ORD076_01');
  });

  test('API 500 エラー（接続エラー以外）: error.code が E_ORD076_02 になる', async () => {
    const axiosError = Object.assign(new Error('Internal Server Error'), {
      isAxiosError: true,
      response: { status: 500 },
    });
    mockConfirmOrders.mockRejectedValue(axiosError);
    const { result } = renderHook(() =>
      useOrderConfirmSubmit('P001', 'Dr. 鈴木', [])
    );

    await act(async () => {
      await result.current.handleConfirmOrders(['order-001']);
    });

    expect(result.current.error?.code).toBe('E_ORD076_02');
  });

  test('handleConfirmOrdersForced: allergyWarnings をクリアして確定を実行する', async () => {
    mockConfirmOrders.mockResolvedValue(CONFIRMED_ORDER_RESPONSE as never);
    const { result } = renderHook(() =>
      useOrderConfirmSubmit('P001', 'Dr. 鈴木', ['アスピリン'])
    );

    // まずアレルギー警告を発生させる
    await act(async () => {
      await result.current.handleConfirmOrders(['order-001']);
    });
    expect(result.current.allergyWarnings.length).toBeGreaterThan(0);

    // アレルギー確認後に強制確定
    let returnValue: unknown;
    await act(async () => {
      returnValue = await result.current.handleConfirmOrdersForced(['order-001']);
    });

    expect(returnValue).toBe(true);
    expect(result.current.allergyWarnings).toHaveLength(0);
  });
});

describe('useOrderConfirmSubmit / handleDeletePendingOrder', () => {
  test('成功: pendingOrders からオーダーが除去される', async () => {
    mockDeleteOrder.mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useOrderConfirmSubmit('P001', 'Dr. 鈴木')
    );

    let returnValue: unknown;
    await act(async () => {
      returnValue = await result.current.handleDeletePendingOrder('order-001');
    });

    expect(returnValue).toBe(true);
    expect(useOrderConfirmStore.getState().pendingOrders).toHaveLength(0);
  });

  test('失敗: error が設定される', async () => {
    mockDeleteOrder.mockRejectedValue(new Error('Network Error'));
    const { result } = renderHook(() =>
      useOrderConfirmSubmit('P001', 'Dr. 鈴木')
    );

    await act(async () => {
      await result.current.handleDeletePendingOrder('order-001');
    });

    expect(result.current.error).not.toBeNull();
  });
});

describe('useOrderConfirmSubmit / handleRevokeOrder', () => {
  test('成功: ダイアログが閉じて true を返す', async () => {
    mockRevokeOrder.mockResolvedValue({ order: {} } as never);
    useOrderConfirmStore.getState().openRevokeConfirmDialog('order-003');
    const { result } = renderHook(() =>
      useOrderConfirmSubmit('P001', 'Dr. 鈴木')
    );

    let returnValue: unknown;
    await act(async () => {
      returnValue = await result.current.handleRevokeOrder('order-003', '患者申し出');
    });

    expect(returnValue).toBe(true);
    expect(useOrderConfirmStore.getState().isRevokeConfirmDialogOpen).toBe(false);
  });

  test('失敗: error.code が E_ORD076_03 になる', async () => {
    mockRevokeOrder.mockRejectedValue(new Error('Network Error'));
    const { result } = renderHook(() =>
      useOrderConfirmSubmit('P001', 'Dr. 鈴木')
    );

    await act(async () => {
      await result.current.handleRevokeOrder('order-003', '患者申し出');
    });

    expect(result.current.error?.code).toBe('E_ORD076_03');
  });
});

describe('useOrderConfirmSubmit / handleOutputForms', () => {
  test('成功: PrintDialog が閉じて true を返す', async () => {
    mockOutputForms.mockResolvedValue({ outputForms: [] } as never);
    useOrderConfirmStore.getState().openPrintDialog();
    const { result } = renderHook(() =>
      useOrderConfirmSubmit('P001', 'Dr. 鈴木')
    );

    let returnValue: unknown;
    await act(async () => {
      returnValue = await result.current.handleOutputForms(['form-001']);
    });

    expect(returnValue).toBe(true);
    expect(useOrderConfirmStore.getState().isPrintDialogOpen).toBe(false);
  });
});

describe('useOrderConfirmSubmit / clearError', () => {
  test('clearError: error が null になる', async () => {
    mockConfirmOrders.mockRejectedValue(new Error('Network Error'));
    const { result } = renderHook(() =>
      useOrderConfirmSubmit('P001', 'Dr. 鈴木')
    );

    await act(async () => {
      await result.current.handleConfirmOrders(['order-001']);
    });
    expect(result.current.error).not.toBeNull();

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });
});
