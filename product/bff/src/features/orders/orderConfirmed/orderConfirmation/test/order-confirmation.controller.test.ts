/**
 * OrderConfirmationController テスト
 *
 * テストケースの根拠: 個別機能設計書_オーダー共通_オーダー確定.pdf / ORD076
 *   - EVT_ORD076_02: オーダー確定ボタン押下 → 各部門に連携
 *   - EVT_ORD076_06: 未確定オーダー削除
 *   - EVT_ORD076_13: 確定済みオーダー取り消し（論理削除）
 *   - EVT_ORD076_10: 帳票出力
 *   - エラー①(E_ORD076_01): 検査連携システムとの通信障害
 *   - エラー②(E_ORD076_02): 予期しないエラー
 *   - エラー③(E_ORD076_03): 取り消し失敗
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrderConfirmationController, OrderTypesController } from '../order-confirmation.controller';
import { OrderConfirmationService } from '../order-confirmation.service';
import type {
  GetOrdersResponse,
  ConfirmOrdersResponse,
  RevokeOrderResponse,
  GetMedicalFormsResponse,
  OutputMedicalFormsResponse,
  GetOrderTypesResponse,
} from '../types/order-confirmation.api.response';
import type {
  GetOrdersRequest,
  GetMedicalFormsRequest,
  ConfirmOrdersRequest,
  RevokeOrderRequest,
  OutputMedicalFormsRequest,
} from '../types/order-confirmation.api.request';

function makeService(overrides: Partial<OrderConfirmationService> = {}): OrderConfirmationService {
  const service = Object.create(OrderConfirmationService.prototype) as OrderConfirmationService;
  Object.assign(service, {
    getOrders: vi.fn(),
    confirmOrders: vi.fn(),
    deleteOrder: vi.fn(),
    revokeOrder: vi.fn(),
    getForms: vi.fn(),
    outputForms: vi.fn(),
    getOrderTypes: vi.fn(),
    ...overrides,
  });
  return service;
}

const MOCK_GET_ORDERS_RESPONSE: GetOrdersResponse = {
  orders: [
    { id: 'pending-1', type: 'prescription', name: 'アセトアミノフェン錠500mg', status: 'pending' },
    { id: 'confirmed-1', type: 'lab', name: '血算（CBC）', status: 'confirmed' },
  ],
};

const MOCK_CONFIRM_RESPONSE: ConfirmOrdersResponse = {
  confirmedOrders: [{ id: 'pending-1', type: 'prescription', name: 'アセトアミノフェン錠500mg', status: 'confirmed' }],
};

const MOCK_REVOKE_RESPONSE: RevokeOrderResponse = {
  order: { id: 'confirmed-1', type: 'lab', name: '血算（CBC）', status: 'cancelled' },
};

const MOCK_FORMS_RESPONSE: GetMedicalFormsResponse = {
  forms: [{
    id: 'form-1',
    type: 'PRESCRIPTION',
    name: '処方指示書',
    description: '処方指示書の説明',
    relatedOrderIds: ['pending-1'],
    patientId: 'P001',
    createdAt: '2026/03/24 10:15',
    createdBy: '田中 医師',
    status: 'READY',
    priority: 'NORMAL',
  }],
};

const MOCK_OUTPUT_RESPONSE: OutputMedicalFormsResponse = {
  outputForms: [{ formId: 'form-1', pdfUrl: 'https://example.com/form-1.pdf' }],
};

const MOCK_ORDER_TYPES_RESPONSE: GetOrderTypesResponse = {
  orderTypes: [
    { id: 'prescription', name: '処方オーダー', route: '/orders/prescription' },
    { id: 'lab', name: '検体検査オーダー', route: '/orders/lab' },
  ],
};

const MOCK_TENANT_ID = 'tenant-001';
const MOCK_CORRELATION_ID = 'corr-001';
const MOCK_AUTH_HEADER = 'Bearer mock-token';

describe('OrderConfirmationController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getOrders', () => {
    it('正常: GET /orders が未確定・確定済みオーダー一覧を返す', async () => {
      const service = makeService({ getOrders: vi.fn().mockResolvedValue(MOCK_GET_ORDERS_RESPONSE) });
      const controller = new OrderConfirmationController(service);
      const body: GetOrdersRequest = { patientId: 'P001' };

      const result = await controller.getOrders(body, MOCK_TENANT_ID, MOCK_CORRELATION_ID, MOCK_AUTH_HEADER);

      expect(result.orders).toHaveLength(2);
    });

    it('正常: getOrders は Service に patientId・status・correlationId・tenantId・authHeader を渡して呼び出す', async () => {
      const mockGet = vi.fn().mockResolvedValue(MOCK_GET_ORDERS_RESPONSE);
      const service = makeService({ getOrders: mockGet });
      const controller = new OrderConfirmationController(service);
      const body: GetOrdersRequest = { patientId: 'P001', status: 'pending' };

      await controller.getOrders(body, MOCK_TENANT_ID, MOCK_CORRELATION_ID, MOCK_AUTH_HEADER);

      expect(mockGet).toHaveBeenCalledWith('P001', 'pending', MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);
    });

    it('異常(エラー①②): Service がエラーを投げた場合、エラーを伝播させる', async () => {
      const service = makeService({ getOrders: vi.fn().mockRejectedValue(new Error('通信障害')) });
      const controller = new OrderConfirmationController(service);
      const body: GetOrdersRequest = { patientId: 'P001' };

      await expect(controller.getOrders(body, MOCK_TENANT_ID, MOCK_CORRELATION_ID, MOCK_AUTH_HEADER)).rejects.toThrow('通信障害');
    });
  });

  describe('confirmOrders', () => {
    const body: ConfirmOrdersRequest = { patientId: 'P001', orderIds: ['pending-1'], confirmedBy: '田中 医師' };

    it('正常(EVT_ORD076_02): POST /orders/confirm が確定済みオーダーを返す', async () => {
      const service = makeService({ confirmOrders: vi.fn().mockResolvedValue(MOCK_CONFIRM_RESPONSE) });
      const controller = new OrderConfirmationController(service);

      const result = await controller.confirmOrders(body, MOCK_TENANT_ID, MOCK_CORRELATION_ID, MOCK_AUTH_HEADER);

      expect(result.confirmedOrders).toHaveLength(1);
    });

    it('正常: confirmOrders は Service に body・correlationId・tenantId・authHeader を渡して呼び出す', async () => {
      const mockConfirm = vi.fn().mockResolvedValue(MOCK_CONFIRM_RESPONSE);
      const service = makeService({ confirmOrders: mockConfirm });
      const controller = new OrderConfirmationController(service);

      await controller.confirmOrders(body, MOCK_TENANT_ID, MOCK_CORRELATION_ID, MOCK_AUTH_HEADER);

      expect(mockConfirm).toHaveBeenCalledWith(body, MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);
    });

    it('異常(エラー①②): Service がエラーを投げた場合、エラーを伝播させる', async () => {
      const service = makeService({ confirmOrders: vi.fn().mockRejectedValue(new Error('通信障害')) });
      const controller = new OrderConfirmationController(service);

      await expect(controller.confirmOrders(body, MOCK_TENANT_ID, MOCK_CORRELATION_ID, MOCK_AUTH_HEADER)).rejects.toThrow('通信障害');
    });
  });

  describe('deleteOrder', () => {
    it('正常(EVT_ORD076_06): DELETE /orders/:orderId が void を返す', async () => {
      const service = makeService({ deleteOrder: vi.fn().mockResolvedValue(undefined) });
      const controller = new OrderConfirmationController(service);

      const result = await controller.deleteOrder('pending-1', MOCK_TENANT_ID, MOCK_CORRELATION_ID, MOCK_AUTH_HEADER);

      expect(result).toBeUndefined();
    });

    it('正常: deleteOrder は Service に orderId・correlationId・tenantId・authHeader を渡して呼び出す', async () => {
      const mockDelete = vi.fn().mockResolvedValue(undefined);
      const service = makeService({ deleteOrder: mockDelete });
      const controller = new OrderConfirmationController(service);

      await controller.deleteOrder('pending-1', MOCK_TENANT_ID, MOCK_CORRELATION_ID, MOCK_AUTH_HEADER);

      expect(mockDelete).toHaveBeenCalledWith('pending-1', MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);
    });

    it('異常: Service がエラーを投げた場合、エラーを伝播させる', async () => {
      const service = makeService({ deleteOrder: vi.fn().mockRejectedValue(new Error('削除失敗')) });
      const controller = new OrderConfirmationController(service);

      await expect(controller.deleteOrder('pending-1', MOCK_TENANT_ID, MOCK_CORRELATION_ID, MOCK_AUTH_HEADER)).rejects.toThrow('削除失敗');
    });
  });

  describe('revokeOrder', () => {
    const body: RevokeOrderRequest = { reason: '投薬不要のため', revokedBy: '田中 医師' };

    it('正常(EVT_ORD076_13): POST /orders/:orderId/revoke が取り消し済みオーダーを返す', async () => {
      const service = makeService({ revokeOrder: vi.fn().mockResolvedValue(MOCK_REVOKE_RESPONSE) });
      const controller = new OrderConfirmationController(service);

      const result = await controller.revokeOrder('confirmed-1', body, MOCK_TENANT_ID, MOCK_CORRELATION_ID, MOCK_AUTH_HEADER);

      expect(result.order.status).toBe('cancelled');
    });

    it('正常: revokeOrder は Service に orderId・body・correlationId・tenantId・authHeader を渡して呼び出す', async () => {
      const mockRevoke = vi.fn().mockResolvedValue(MOCK_REVOKE_RESPONSE);
      const service = makeService({ revokeOrder: mockRevoke });
      const controller = new OrderConfirmationController(service);

      await controller.revokeOrder('confirmed-1', body, MOCK_TENANT_ID, MOCK_CORRELATION_ID, MOCK_AUTH_HEADER);

      expect(mockRevoke).toHaveBeenCalledWith('confirmed-1', body, MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);
    });

    it('異常(エラー③): Service がエラーを投げた場合、エラーを伝播させる', async () => {
      const service = makeService({ revokeOrder: vi.fn().mockRejectedValue(new Error('取り消し失敗')) });
      const controller = new OrderConfirmationController(service);

      await expect(controller.revokeOrder('confirmed-1', body, MOCK_TENANT_ID, MOCK_CORRELATION_ID, MOCK_AUTH_HEADER)).rejects.toThrow('取り消し失敗');
    });
  });

  describe('getForms', () => {
    it('正常(EVT_ORD076_01): GET /orders/forms が帳票一覧を返す', async () => {
      const service = makeService({ getForms: vi.fn().mockResolvedValue(MOCK_FORMS_RESPONSE) });
      const controller = new OrderConfirmationController(service);
      const body: GetMedicalFormsRequest = { patientId: 'P001' };

      const result = await controller.getForms(body, MOCK_TENANT_ID, MOCK_CORRELATION_ID, MOCK_AUTH_HEADER);

      expect(result.forms).toHaveLength(1);
    });

    it('正常: getForms は Service に patientId・undefined・ヘッダーを渡して呼び出す（orderIds なし）', async () => {
      const mockGet = vi.fn().mockResolvedValue(MOCK_FORMS_RESPONSE);
      const service = makeService({ getForms: mockGet });
      const controller = new OrderConfirmationController(service);
      const body: GetMedicalFormsRequest = { patientId: 'P001' };

      await controller.getForms(body, MOCK_TENANT_ID, MOCK_CORRELATION_ID, MOCK_AUTH_HEADER);

      expect(mockGet).toHaveBeenCalledWith('P001', undefined, MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);
    });

    it('正常: getForms は orderIds が単一文字列の場合に配列に正規化して Service に渡す', async () => {
      const mockGet = vi.fn().mockResolvedValue(MOCK_FORMS_RESPONSE);
      const service = makeService({ getForms: mockGet });
      const controller = new OrderConfirmationController(service);
      const body = { patientId: 'P001', orderIds: 'pending-1' } as unknown as GetMedicalFormsRequest;

      await controller.getForms(body, MOCK_TENANT_ID, MOCK_CORRELATION_ID, MOCK_AUTH_HEADER);

      expect(mockGet).toHaveBeenCalledWith('P001', ['pending-1'], MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);
    });

    it('正常: getForms は orderIds が配列の場合にそのまま Service に渡す', async () => {
      const mockGet = vi.fn().mockResolvedValue(MOCK_FORMS_RESPONSE);
      const service = makeService({ getForms: mockGet });
      const controller = new OrderConfirmationController(service);
      const body: GetMedicalFormsRequest = { patientId: 'P001', orderIds: ['pending-1', 'pending-2'] };

      await controller.getForms(body, MOCK_TENANT_ID, MOCK_CORRELATION_ID, MOCK_AUTH_HEADER);

      expect(mockGet).toHaveBeenCalledWith('P001', ['pending-1', 'pending-2'], MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);
    });

    it('異常(エラー②): Service がエラーを投げた場合、エラーを伝播させる', async () => {
      const service = makeService({ getForms: vi.fn().mockRejectedValue(new Error('帳票取得失敗')) });
      const controller = new OrderConfirmationController(service);
      const body: GetMedicalFormsRequest = { patientId: 'P001' };

      await expect(controller.getForms(body, MOCK_TENANT_ID, MOCK_CORRELATION_ID, MOCK_AUTH_HEADER)).rejects.toThrow('帳票取得失敗');
    });
  });

  describe('outputForms', () => {
    const body: OutputMedicalFormsRequest = { patientId: 'P001', formIds: ['form-1'] };

    it('正常(EVT_ORD076_10): POST /orders/forms/output が出力結果を返す', async () => {
      const service = makeService({ outputForms: vi.fn().mockResolvedValue(MOCK_OUTPUT_RESPONSE) });
      const controller = new OrderConfirmationController(service);

      const result = await controller.outputForms(body, MOCK_TENANT_ID, MOCK_CORRELATION_ID, MOCK_AUTH_HEADER);

      expect(result.outputForms).toHaveLength(1);
    });

    it('正常: outputForms は Service に body・correlationId・tenantId・authHeader を渡して呼び出す', async () => {
      const mockOutput = vi.fn().mockResolvedValue(MOCK_OUTPUT_RESPONSE);
      const service = makeService({ outputForms: mockOutput });
      const controller = new OrderConfirmationController(service);

      await controller.outputForms(body, MOCK_TENANT_ID, MOCK_CORRELATION_ID, MOCK_AUTH_HEADER);

      expect(mockOutput).toHaveBeenCalledWith(body, MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);
    });

    it('異常(エラー②): Service がエラーを投げた場合、エラーを伝播させる', async () => {
      const service = makeService({ outputForms: vi.fn().mockRejectedValue(new Error('出力失敗')) });
      const controller = new OrderConfirmationController(service);

      await expect(controller.outputForms(body, MOCK_TENANT_ID, MOCK_CORRELATION_ID, MOCK_AUTH_HEADER)).rejects.toThrow('出力失敗');
    });
  });
});

describe('OrderTypesController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('正常(EVT_ORD076_03): GET /order-types がオーダー種別一覧を返す', async () => {
    const service = makeService({ getOrderTypes: vi.fn().mockResolvedValue(MOCK_ORDER_TYPES_RESPONSE) });
    const controller = new OrderTypesController(service);

    const result = await controller.getOrderTypes(MOCK_TENANT_ID, MOCK_CORRELATION_ID, MOCK_AUTH_HEADER);

    expect(result.orderTypes).toHaveLength(2);
  });

  it('正常: getOrderTypes は Service に correlationId・tenantId・authHeader を渡して呼び出す', async () => {
    const mockGet = vi.fn().mockResolvedValue(MOCK_ORDER_TYPES_RESPONSE);
    const service = makeService({ getOrderTypes: mockGet });
    const controller = new OrderTypesController(service);

    await controller.getOrderTypes(MOCK_TENANT_ID, MOCK_CORRELATION_ID, MOCK_AUTH_HEADER);

    expect(mockGet).toHaveBeenCalledWith(MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);
  });

  it('異常(エラー②): Service がエラーを投げた場合、エラーを伝播させる', async () => {
    const service = makeService({ getOrderTypes: vi.fn().mockRejectedValue(new Error('種別取得失敗')) });
    const controller = new OrderTypesController(service);

    await expect(controller.getOrderTypes(MOCK_TENANT_ID, MOCK_CORRELATION_ID, MOCK_AUTH_HEADER)).rejects.toThrow('種別取得失敗');
  });
});
