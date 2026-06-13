/**
 * OrderConfirmationService テスト
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
import { OrderConfirmationService } from '../order-confirmation.service';
import { OrderConfirmationClient } from '../order-confirmation.client';
import type { UpstreamOrder, UpstreamMedicalForm, UpstreamOrderType } from '../types/order-confirmation.type';
import type { ConfirmOrdersRequest, RevokeOrderRequest, OutputMedicalFormsRequest } from '../types/order-confirmation.api.request';

function makeClient(overrides: Partial<OrderConfirmationClient> = {}): OrderConfirmationClient {
  const client = Object.create(OrderConfirmationClient.prototype) as OrderConfirmationClient;
  Object.assign(client, {
    fetchOrders: vi.fn(),
    confirmOrders: vi.fn(),
    deleteOrder: vi.fn(),
    revokeOrder: vi.fn(),
    fetchForms: vi.fn(),
    outputForms: vi.fn(),
    fetchOrderTypes: vi.fn(),
    ...overrides,
  });
  return client;
}

const MOCK_PENDING_ORDER: UpstreamOrder = {
  orderId: 'pending-1',
  orderType: 'PRESCRIPTION',
  orderName: 'アセトアミノフェン錠500mg',
  dosage: '500mg',
  frequency: '1日3回 毎食後',
  priority: '通常',
  orderStatus: 'PENDING',
};

const MOCK_CONFIRMED_ORDER: UpstreamOrder = {
  orderId: 'confirmed-1',
  orderType: 'LAB',
  orderName: '血算（CBC）',
  orderStatus: 'CONFIRMED',
  confirmedAt: '2026/03/24 10:15',
  confirmedBy: '田中 医師',
};

const MOCK_REVOKED_ORDER: UpstreamOrder = {
  orderId: 'confirmed-1',
  orderType: 'LAB',
  orderName: '血算（CBC）',
  orderStatus: 'CANCELLED',
  cancelledAt: '2026/03/25 09:00',
  cancelledBy: '田中 医師',
};

const MOCK_FORM: UpstreamMedicalForm = {
  formId: 'form-1',
  formType: 'PRESCRIPTION',
  formName: '処方指示書',
  description: 'アセトアミノフェン錠500mg 指示書',
  relatedOrderIds: ['pending-1'],
  patientId: 'P001',
  createdAt: '2026/03/24 10:15',
  createdBy: '田中 医師',
  status: 'READY',
  priority: 'NORMAL',
};

const MOCK_ORDER_TYPE: UpstreamOrderType = {
  id: 'prescription',
  name: '処方オーダー',
  route: '/orders/prescription',
};

const CORRELATION_ID = 'corr-001';
const TENANT_ID = 'tenant-001';
const AUTH_HEADER = 'Bearer mock-token';

describe('OrderConfirmationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getOrders', () => {
    it('正常: Client が UpstreamOrder[] を返した場合、orders の件数が 1 になる', async () => {
      const client = makeClient({ fetchOrders: vi.fn().mockResolvedValue([MOCK_PENDING_ORDER]) });
      const service = new OrderConfirmationService(client);

      const result = await service.getOrders('P001', undefined, CORRELATION_ID, TENANT_ID, AUTH_HEADER);

      expect(result.orders).toHaveLength(1);
    });

    it('正常: getOrders は Client に patientId・status・correlationId・tenantId・authHeader を渡して呼び出す', async () => {
      const mockFetch = vi.fn().mockResolvedValue([MOCK_PENDING_ORDER]);
      const client = makeClient({ fetchOrders: mockFetch });
      const service = new OrderConfirmationService(client);

      await service.getOrders('P001', 'pending', CORRELATION_ID, TENANT_ID, AUTH_HEADER);

      expect(mockFetch).toHaveBeenCalledWith('P001', 'pending', CORRELATION_ID, TENANT_ID, AUTH_HEADER);
    });

    it('正常: transformOrder が orderId を id にマッピングする', async () => {
      const client = makeClient({ fetchOrders: vi.fn().mockResolvedValue([MOCK_PENDING_ORDER]) });
      const service = new OrderConfirmationService(client);

      const result = await service.getOrders('P001', undefined, CORRELATION_ID, TENANT_ID, AUTH_HEADER);

      expect(result.orders.at(0)?.id).toBe('pending-1');
    });

    it('正常: transformOrder が orderType PRESCRIPTION を prescription にマッピングする', async () => {
      const client = makeClient({ fetchOrders: vi.fn().mockResolvedValue([MOCK_PENDING_ORDER]) });
      const service = new OrderConfirmationService(client);

      const result = await service.getOrders('P001', undefined, CORRELATION_ID, TENANT_ID, AUTH_HEADER);

      expect(result.orders.at(0)?.type).toBe('prescription');
    });

    it('正常: transformOrder が orderName を name にマッピングする', async () => {
      const client = makeClient({ fetchOrders: vi.fn().mockResolvedValue([MOCK_PENDING_ORDER]) });
      const service = new OrderConfirmationService(client);

      const result = await service.getOrders('P001', undefined, CORRELATION_ID, TENANT_ID, AUTH_HEADER);

      expect(result.orders.at(0)?.name).toBe('アセトアミノフェン錠500mg');
    });

    it('正常: transformOrder が orderStatus PENDING を pending にマッピングする', async () => {
      const client = makeClient({ fetchOrders: vi.fn().mockResolvedValue([MOCK_PENDING_ORDER]) });
      const service = new OrderConfirmationService(client);

      const result = await service.getOrders('P001', undefined, CORRELATION_ID, TENANT_ID, AUTH_HEADER);

      expect(result.orders.at(0)?.status).toBe('pending');
    });

    it('正常: transformOrder が dosage を含めるオプションフィールドをマッピングする', async () => {
      const client = makeClient({ fetchOrders: vi.fn().mockResolvedValue([MOCK_PENDING_ORDER]) });
      const service = new OrderConfirmationService(client);

      const result = await service.getOrders('P001', undefined, CORRELATION_ID, TENANT_ID, AUTH_HEADER);

      expect(result.orders.at(0)?.dosage).toBe('500mg');
    });

    it('正常: transformOrder が frequency を含めるオプションフィールドをマッピングする', async () => {
      const client = makeClient({ fetchOrders: vi.fn().mockResolvedValue([MOCK_PENDING_ORDER]) });
      const service = new OrderConfirmationService(client);

      const result = await service.getOrders('P001', undefined, CORRELATION_ID, TENANT_ID, AUTH_HEADER);

      expect(result.orders.at(0)?.frequency).toBe('1日3回 毎食後');
    });

    it('正常: transformOrder がオプションフィールド未定義の場合は dosage キーを含まない', async () => {
      const minimalOrder: UpstreamOrder = { orderId: 'x', orderType: 'LAB', orderName: '検査' };
      const client = makeClient({ fetchOrders: vi.fn().mockResolvedValue([minimalOrder]) });
      const service = new OrderConfirmationService(client);

      const result = await service.getOrders('P001', undefined, CORRELATION_ID, TENANT_ID, AUTH_HEADER);

      expect(result.orders.at(0)).not.toHaveProperty('dosage');
    });

    it('正常: transformOrder がオプションフィールド未定義の場合は status キーを含まない', async () => {
      const minimalOrder: UpstreamOrder = { orderId: 'x', orderType: 'LAB', orderName: '検査' };
      const client = makeClient({ fetchOrders: vi.fn().mockResolvedValue([minimalOrder]) });
      const service = new OrderConfirmationService(client);

      const result = await service.getOrders('P001', undefined, CORRELATION_ID, TENANT_ID, AUTH_HEADER);

      expect(result.orders.at(0)).not.toHaveProperty('status');
    });

    it('正常: Client が空配列を返した場合、orders が空配列になる', async () => {
      const client = makeClient({ fetchOrders: vi.fn().mockResolvedValue([]) });
      const service = new OrderConfirmationService(client);

      const result = await service.getOrders('P001', undefined, CORRELATION_ID, TENANT_ID, AUTH_HEADER);

      expect(result.orders).toEqual([]);
    });

    it('異常(エラー①②): Client が例外を投げた場合、エラーを伝播させる', async () => {
      const client = makeClient({ fetchOrders: vi.fn().mockRejectedValue(new Error('通信障害')) });
      const service = new OrderConfirmationService(client);

      await expect(service.getOrders('P001', undefined, CORRELATION_ID, TENANT_ID, AUTH_HEADER)).rejects.toThrow('通信障害');
    });
  });

  describe('confirmOrders', () => {
    const body: ConfirmOrdersRequest = {
      patientId: 'P001',
      orderIds: ['pending-1'],
      confirmedBy: '田中 医師',
    };

    it('正常(EVT_ORD076_02): Client が UpstreamOrder[] を返した場合、confirmedOrders の件数が 1 になる', async () => {
      const client = makeClient({ confirmOrders: vi.fn().mockResolvedValue([MOCK_CONFIRMED_ORDER]) });
      const service = new OrderConfirmationService(client);

      const result = await service.confirmOrders(body, CORRELATION_ID, TENANT_ID, AUTH_HEADER);

      expect(result.confirmedOrders).toHaveLength(1);
    });

    it('正常: confirmOrders は Client に patientId・orderIds・confirmedBy・ヘッダーを渡して呼び出す', async () => {
      const mockConfirm = vi.fn().mockResolvedValue([MOCK_CONFIRMED_ORDER]);
      const client = makeClient({ confirmOrders: mockConfirm });
      const service = new OrderConfirmationService(client);

      await service.confirmOrders(body, CORRELATION_ID, TENANT_ID, AUTH_HEADER);

      expect(mockConfirm).toHaveBeenCalledWith('P001', ['pending-1'], '田中 医師', CORRELATION_ID, TENANT_ID, AUTH_HEADER);
    });

    it('正常: transformOrder が orderStatus CONFIRMED を confirmed にマッピングする', async () => {
      const client = makeClient({ confirmOrders: vi.fn().mockResolvedValue([MOCK_CONFIRMED_ORDER]) });
      const service = new OrderConfirmationService(client);

      const result = await service.confirmOrders(body, CORRELATION_ID, TENANT_ID, AUTH_HEADER);

      expect(result.confirmedOrders.at(0)?.status).toBe('confirmed');
    });

    it('異常(エラー①②): Client が例外を投げた場合、エラーを伝播させる', async () => {
      const client = makeClient({ confirmOrders: vi.fn().mockRejectedValue(new Error('通信障害')) });
      const service = new OrderConfirmationService(client);

      await expect(service.confirmOrders(body, CORRELATION_ID, TENANT_ID, AUTH_HEADER)).rejects.toThrow('通信障害');
    });
  });

  describe('deleteOrder', () => {
    it('正常(EVT_ORD076_06): Client の deleteOrder を orderId・ヘッダーで呼び出す', async () => {
      const mockDelete = vi.fn().mockResolvedValue(undefined);
      const client = makeClient({ deleteOrder: mockDelete });
      const service = new OrderConfirmationService(client);

      await service.deleteOrder('pending-1', CORRELATION_ID, TENANT_ID, AUTH_HEADER);

      expect(mockDelete).toHaveBeenCalledWith('pending-1', CORRELATION_ID, TENANT_ID, AUTH_HEADER);
    });

    it('正常: deleteOrder は void を返す', async () => {
      const client = makeClient({ deleteOrder: vi.fn().mockResolvedValue(undefined) });
      const service = new OrderConfirmationService(client);

      const result = await service.deleteOrder('pending-1', CORRELATION_ID, TENANT_ID, AUTH_HEADER);

      expect(result).toBeUndefined();
    });

    it('異常: Client が例外を投げた場合、エラーを伝播させる', async () => {
      const client = makeClient({ deleteOrder: vi.fn().mockRejectedValue(new Error('削除失敗')) });
      const service = new OrderConfirmationService(client);

      await expect(service.deleteOrder('pending-1', CORRELATION_ID, TENANT_ID, AUTH_HEADER)).rejects.toThrow('削除失敗');
    });
  });

  describe('revokeOrder', () => {
    const body: RevokeOrderRequest = { reason: '投薬不要のため', revokedBy: '田中 医師' };

    it('正常(EVT_ORD076_13): Client が UpstreamOrder を返した場合、order が含まれる', async () => {
      const client = makeClient({ revokeOrder: vi.fn().mockResolvedValue(MOCK_REVOKED_ORDER) });
      const service = new OrderConfirmationService(client);

      const result = await service.revokeOrder('confirmed-1', body, CORRELATION_ID, TENANT_ID, AUTH_HEADER);

      expect(result.order).toBeDefined();
    });

    it('正常: revokeOrder は Client に orderId・revokedBy・reason・ヘッダーを渡して呼び出す', async () => {
      const mockRevoke = vi.fn().mockResolvedValue(MOCK_REVOKED_ORDER);
      const client = makeClient({ revokeOrder: mockRevoke });
      const service = new OrderConfirmationService(client);

      await service.revokeOrder('confirmed-1', body, CORRELATION_ID, TENANT_ID, AUTH_HEADER);

      expect(mockRevoke).toHaveBeenCalledWith('confirmed-1', '田中 医師', '投薬不要のため', CORRELATION_ID, TENANT_ID, AUTH_HEADER);
    });

    it('正常: transformOrder が orderStatus CANCELLED を cancelled にマッピングする', async () => {
      const client = makeClient({ revokeOrder: vi.fn().mockResolvedValue(MOCK_REVOKED_ORDER) });
      const service = new OrderConfirmationService(client);

      const result = await service.revokeOrder('confirmed-1', body, CORRELATION_ID, TENANT_ID, AUTH_HEADER);

      expect(result.order.status).toBe('cancelled');
    });

    it('異常(エラー③): Client が例外を投げた場合、エラーを伝播させる', async () => {
      const client = makeClient({ revokeOrder: vi.fn().mockRejectedValue(new Error('取り消し失敗')) });
      const service = new OrderConfirmationService(client);

      await expect(service.revokeOrder('confirmed-1', body, CORRELATION_ID, TENANT_ID, AUTH_HEADER)).rejects.toThrow('取り消し失敗');
    });
  });

  describe('getForms', () => {
    it('正常(EVT_ORD076_01): Client が UpstreamMedicalForm[] を返した場合、forms の件数が 1 になる', async () => {
      const client = makeClient({ fetchForms: vi.fn().mockResolvedValue([MOCK_FORM]) });
      const service = new OrderConfirmationService(client);

      const result = await service.getForms('P001', undefined, CORRELATION_ID, TENANT_ID, AUTH_HEADER);

      expect(result.forms).toHaveLength(1);
    });

    it('正常: getForms は Client に patientId・orderIds・ヘッダーを渡して呼び出す', async () => {
      const mockFetch = vi.fn().mockResolvedValue([MOCK_FORM]);
      const client = makeClient({ fetchForms: mockFetch });
      const service = new OrderConfirmationService(client);

      await service.getForms('P001', ['pending-1'], CORRELATION_ID, TENANT_ID, AUTH_HEADER);

      expect(mockFetch).toHaveBeenCalledWith('P001', ['pending-1'], CORRELATION_ID, TENANT_ID, AUTH_HEADER);
    });

    it('正常: getForms が formId を id にマッピングする', async () => {
      const client = makeClient({ fetchForms: vi.fn().mockResolvedValue([MOCK_FORM]) });
      const service = new OrderConfirmationService(client);

      const result = await service.getForms('P001', undefined, CORRELATION_ID, TENANT_ID, AUTH_HEADER);

      expect(result.forms.at(0)?.id).toBe('form-1');
    });

    it('正常: getForms が formName を name にマッピングする', async () => {
      const client = makeClient({ fetchForms: vi.fn().mockResolvedValue([MOCK_FORM]) });
      const service = new OrderConfirmationService(client);

      const result = await service.getForms('P001', undefined, CORRELATION_ID, TENANT_ID, AUTH_HEADER);

      expect(result.forms.at(0)?.name).toBe('処方指示書');
    });

    it('正常: getForms が formType PRESCRIPTION を PRESCRIPTION にマッピングする', async () => {
      const client = makeClient({ fetchForms: vi.fn().mockResolvedValue([MOCK_FORM]) });
      const service = new OrderConfirmationService(client);

      const result = await service.getForms('P001', undefined, CORRELATION_ID, TENANT_ID, AUTH_HEADER);

      expect(result.forms.at(0)?.type).toBe('PRESCRIPTION');
    });

    it('異常(エラー②): Client が例外を投げた場合、エラーを伝播させる', async () => {
      const client = makeClient({ fetchForms: vi.fn().mockRejectedValue(new Error('帳票取得失敗')) });
      const service = new OrderConfirmationService(client);

      await expect(service.getForms('P001', undefined, CORRELATION_ID, TENANT_ID, AUTH_HEADER)).rejects.toThrow('帳票取得失敗');
    });
  });

  describe('outputForms', () => {
    const body: OutputMedicalFormsRequest = { patientId: 'P001', formIds: ['form-1'] };

    it('正常(EVT_ORD076_10): Client が outputForms を返した場合、件数が 1 になる', async () => {
      const client = makeClient({ outputForms: vi.fn().mockResolvedValue([{ formId: 'form-1', pdfUrl: 'https://example.com/form-1.pdf' }]) });
      const service = new OrderConfirmationService(client);

      const result = await service.outputForms(body, CORRELATION_ID, TENANT_ID, AUTH_HEADER);

      expect(result.outputForms).toHaveLength(1);
    });

    it('正常: outputForms は Client に patientId・formIds・ヘッダーを渡して呼び出す', async () => {
      const mockOutput = vi.fn().mockResolvedValue([{ formId: 'form-1', pdfUrl: 'https://example.com/form-1.pdf' }]);
      const client = makeClient({ outputForms: mockOutput });
      const service = new OrderConfirmationService(client);

      await service.outputForms(body, CORRELATION_ID, TENANT_ID, AUTH_HEADER);

      expect(mockOutput).toHaveBeenCalledWith('P001', ['form-1'], CORRELATION_ID, TENANT_ID, AUTH_HEADER);
    });

    it('正常: outputForms が pdfUrl を含む結果を返す', async () => {
      const client = makeClient({ outputForms: vi.fn().mockResolvedValue([{ formId: 'form-1', pdfUrl: 'https://example.com/form-1.pdf' }]) });
      const service = new OrderConfirmationService(client);

      const result = await service.outputForms(body, CORRELATION_ID, TENANT_ID, AUTH_HEADER);

      expect(result.outputForms.at(0)?.pdfUrl).toBe('https://example.com/form-1.pdf');
    });

    it('異常(エラー②): Client が例外を投げた場合、エラーを伝播させる', async () => {
      const client = makeClient({ outputForms: vi.fn().mockRejectedValue(new Error('出力失敗')) });
      const service = new OrderConfirmationService(client);

      await expect(service.outputForms(body, CORRELATION_ID, TENANT_ID, AUTH_HEADER)).rejects.toThrow('出力失敗');
    });
  });

  describe('getOrderTypes', () => {
    it('正常(EVT_ORD076_03): Client が UpstreamOrderType[] を返した場合、orderTypes の件数が 1 になる', async () => {
      const client = makeClient({ fetchOrderTypes: vi.fn().mockResolvedValue([MOCK_ORDER_TYPE]) });
      const service = new OrderConfirmationService(client);

      const result = await service.getOrderTypes(CORRELATION_ID, TENANT_ID, AUTH_HEADER);

      expect(result.orderTypes).toHaveLength(1);
    });

    it('正常: getOrderTypes は Client にヘッダーを渡して呼び出す', async () => {
      const mockFetch = vi.fn().mockResolvedValue([MOCK_ORDER_TYPE]);
      const client = makeClient({ fetchOrderTypes: mockFetch });
      const service = new OrderConfirmationService(client);

      await service.getOrderTypes(CORRELATION_ID, TENANT_ID, AUTH_HEADER);

      expect(mockFetch).toHaveBeenCalledWith(CORRELATION_ID, TENANT_ID, AUTH_HEADER);
    });

    it('正常: getOrderTypes が id をマッピングする', async () => {
      const client = makeClient({ fetchOrderTypes: vi.fn().mockResolvedValue([MOCK_ORDER_TYPE]) });
      const service = new OrderConfirmationService(client);

      const result = await service.getOrderTypes(CORRELATION_ID, TENANT_ID, AUTH_HEADER);

      expect(result.orderTypes.at(0)?.id).toBe('prescription');
    });

    it('正常: getOrderTypes が name をマッピングする', async () => {
      const client = makeClient({ fetchOrderTypes: vi.fn().mockResolvedValue([MOCK_ORDER_TYPE]) });
      const service = new OrderConfirmationService(client);

      const result = await service.getOrderTypes(CORRELATION_ID, TENANT_ID, AUTH_HEADER);

      expect(result.orderTypes.at(0)?.name).toBe('処方オーダー');
    });

    it('正常: getOrderTypes が route をマッピングする', async () => {
      const client = makeClient({ fetchOrderTypes: vi.fn().mockResolvedValue([MOCK_ORDER_TYPE]) });
      const service = new OrderConfirmationService(client);

      const result = await service.getOrderTypes(CORRELATION_ID, TENANT_ID, AUTH_HEADER);

      expect(result.orderTypes.at(0)?.route).toBe('/orders/prescription');
    });

    it('異常(エラー②): Client が例外を投げた場合、エラーを伝播させる', async () => {
      const client = makeClient({ fetchOrderTypes: vi.fn().mockRejectedValue(new Error('種別取得失敗')) });
      const service = new OrderConfirmationService(client);

      await expect(service.getOrderTypes(CORRELATION_ID, TENANT_ID, AUTH_HEADER)).rejects.toThrow('種別取得失敗');
    });
  });
});
