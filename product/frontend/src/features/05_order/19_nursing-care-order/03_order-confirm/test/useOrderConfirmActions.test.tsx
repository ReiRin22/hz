import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { useOrderConfirmActions } from '../hooks/useOrderConfirmActions';
import { useOrderConfirmStore } from '../stores/orderConfirm.store';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, back: vi.fn(), replace: vi.fn() }),
}));

beforeEach(() => {
  useOrderConfirmStore.getState().reset();
  vi.clearAllMocks();
});

afterEach(() => {
  cleanup();
  useOrderConfirmStore.getState().reset();
});

describe('useOrderConfirmActions', () => {
  test('handleOpenPrintDialog: isPrintDialogOpen が true になる', () => {
    const { result } = renderHook(() => useOrderConfirmActions(false));

    act(() => {
      result.current.handleOpenPrintDialog();
    });

    expect(useOrderConfirmStore.getState().isPrintDialogOpen).toBe(true);
  });

  test('handleOpenOrderTypeDialog: isOrderTypeDialogOpen が true になる', () => {
    const { result } = renderHook(() => useOrderConfirmActions(false));

    act(() => {
      result.current.handleOpenOrderTypeDialog();
    });

    expect(useOrderConfirmStore.getState().isOrderTypeDialogOpen).toBe(true);
  });

  test('handleEditPendingOrder: router.push が orderRoute で呼ばれる', () => {
    const { result } = renderHook(() => useOrderConfirmActions(false));

    act(() => {
      result.current.handleEditPendingOrder('order-001', '/order/medication/edit/order-001');
    });

    expect(mockPush).toHaveBeenCalledWith('/order/medication/edit/order-001');
  });

  test('handleOpenEditConfirmDialog: isEditConfirmDialogOpen が true になり targetOrderId が設定される', () => {
    const { result } = renderHook(() => useOrderConfirmActions(false));

    act(() => {
      result.current.handleOpenEditConfirmDialog('order-003');
    });

    const state = useOrderConfirmStore.getState();
    expect(state.isEditConfirmDialogOpen).toBe(true);
    expect(state.targetOrderId).toBe('order-003');
  });

  test('handleOpenRevokeConfirmDialog: isRevokeConfirmDialogOpen が true になり targetOrderId が設定される', () => {
    const { result } = renderHook(() => useOrderConfirmActions(false));

    act(() => {
      result.current.handleOpenRevokeConfirmDialog('order-003');
    });

    const state = useOrderConfirmStore.getState();
    expect(state.isRevokeConfirmDialogOpen).toBe(true);
    expect(state.targetOrderId).toBe('order-003');
  });

  test('handleSelectAllForms: selectedForms が allForms と同じになる', () => {
    useOrderConfirmStore.getState().setAllForms([
      { id: 'form-001', name: '処方箋', description: '', relatedOrderIds: [] },
      { id: 'form-002', name: '検査依頼書', description: '', relatedOrderIds: [] },
    ]);
    const { result } = renderHook(() => useOrderConfirmActions(false));

    act(() => {
      result.current.handleSelectAllForms();
    });

    expect(useOrderConfirmStore.getState().selectedForms).toHaveLength(2);
  });

  test('handleToggleFormSelection: selectedForms にフォームが追加される', () => {
    useOrderConfirmStore.getState().setAllForms([
      { id: 'form-001', name: '処方箋', description: '', relatedOrderIds: [] },
    ]);
    const { result } = renderHook(() => useOrderConfirmActions(false));

    act(() => {
      result.current.handleToggleFormSelection('form-001');
    });

    expect(useOrderConfirmStore.getState().selectedForms).toHaveLength(1);
  });

  test('handleSelectOrderType: lab タイプ選択時 onSpecimenOrderOpen が呼ばれる', () => {
    const onSpecimenOrderOpen = vi.fn();
    const { result } = renderHook(() =>
      useOrderConfirmActions(false, { onSpecimenOrderOpen })
    );

    act(() => {
      result.current.handleSelectOrderType({ id: 'lab', name: '検体検査オーダー', route: '/order/lab' });
    });

    expect(onSpecimenOrderOpen).toHaveBeenCalledOnce();
    expect(mockPush).not.toHaveBeenCalled();
  });

  test('handleSelectOrderType: imaging タイプ選択時 onImagingOrderOpen が呼ばれる', () => {
    const onImagingOrderOpen = vi.fn();
    const { result } = renderHook(() =>
      useOrderConfirmActions(false, { onImagingOrderOpen })
    );

    act(() => {
      result.current.handleSelectOrderType({ id: 'imaging', name: '画像オーダー', route: '/order/imaging' });
    });

    expect(onImagingOrderOpen).toHaveBeenCalledOnce();
    expect(mockPush).not.toHaveBeenCalled();
  });

  test('handleSelectOrderType: その他タイプ選択時 router.push が呼ばれる', () => {
    const { result } = renderHook(() => useOrderConfirmActions(false));

    act(() => {
      result.current.handleSelectOrderType({ id: 'MEDICATION', name: '投薬オーダー', route: '/order/medication' });
    });

    expect(mockPush).toHaveBeenCalledWith('/order/medication');
  });

  test('handleConfirmEdit: ダイアログを閉じて router.push が呼ばれる', () => {
    useOrderConfirmStore.getState().openEditConfirmDialog('order-003');
    const { result } = renderHook(() => useOrderConfirmActions(false));

    act(() => {
      result.current.handleConfirmEdit('/order/medication/edit/order-003');
    });

    expect(useOrderConfirmStore.getState().isEditConfirmDialogOpen).toBe(false);
    expect(mockPush).toHaveBeenCalledWith('/order/medication/edit/order-003');
  });
});
