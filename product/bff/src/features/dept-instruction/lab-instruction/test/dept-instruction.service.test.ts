/**
 * DeptInstructionService テスト
 *
 * テストケースの根拠: DEP002 臨床検査科指示受け 設計書
 *   - 指示受け一覧取得: 検体/生理/病理/細菌検査オーダー一覧を返す
 *   - ステータス更新: 7段階（検体）/ 3段階（生理・病理・細菌）のステータス遷移
 *   - 3点チェック: 患者確認・オーダー確認・アレルギー確認
 *   - 実施者入力: 実施者・証人・実施場所の記録
 *   - 医事会計連携: 検体受領済・結果入力済トリガーで発火
 *   - エラー: 予期しないエラーが発生しました。管理者に連絡してください。
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HttpException } from '@nestjs/common';
import { DeptInstructionService } from '../dept-instruction.service';
import { DeptInstructionClient } from '../dept-instruction.client';
import type {
  UpstreamGetDeptInstructionsResponse,
  UpstreamDeptInstructionOrder,
  UpstreamUpdateStatusResponse,
  UpstreamThreePointCheckResponse,
  UpstreamImplementerResponse,
  UpstreamBillingLinkResponse,
} from '../types/dept-instruction.type';

const MOCK_CORRELATION_ID = 'corr-001';
const MOCK_TENANT_ID = 'tenant-001';
const MOCK_AUTH_HEADER = 'Bearer mock-token';

function makeClient(overrides: Partial<DeptInstructionClient> = {}): DeptInstructionClient {
  const client = Object.create(DeptInstructionClient.prototype) as DeptInstructionClient;
  Object.assign(client, {
    fetchDeptInstructions: vi.fn(),
    updateStatus: vi.fn(),
    postThreePointCheck: vi.fn(),
    postImplementer: vi.fn(),
    postBillingLink: vi.fn(),
    ...overrides,
  });
  return client;
}

const MOCK_UPSTREAM_ORDER: UpstreamDeptInstructionOrder = {
  id: 'order-001',
  status: 'received',
  patientId: 'P001',
  patientName: '山田太郎',
  patientKana: 'ヤマダタロウ',
  gender: 'male',
  birthDate: '1960-01-01',
  age: 65,
  orderType: 'specimen',
  content: '血算（CBC）',
  hasAllergies: false,
  location: '1病棟',
  department: '内科',
  receivedAt: '2026-05-12T08:00:00Z',
};

const MOCK_UPSTREAM_LIST: UpstreamGetDeptInstructionsResponse = {
  orders: [MOCK_UPSTREAM_ORDER],
  total: 1,
  page: 1,
  pageSize: 20,
};

const MOCK_UPSTREAM_STATUS: UpstreamUpdateStatusResponse = {
  orderId: 'order-001',
  newStatus: 'accepted',
  updatedAt: '2026-05-12T09:00:00Z',
};

const MOCK_UPSTREAM_THREE_POINT: UpstreamThreePointCheckResponse = {
  orderId: 'order-001',
  checkedAt: '2026-05-12T09:05:00Z',
};

const MOCK_UPSTREAM_IMPLEMENTER: UpstreamImplementerResponse = {
  orderId: 'order-001',
  implementedAt: '2026-05-12T10:00:00Z',
  newStatus: 'completed',
};

const MOCK_UPSTREAM_BILLING: UpstreamBillingLinkResponse = {
  orderId: 'order-001',
  billingLinkedAt: '2026-05-12T10:05:00Z',
  success: true,
};

describe('DeptInstructionService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getDeptInstructions', () => {
    it('正常: Client が UpstreamGetDeptInstructionsResponse を返した場合、orders の件数が 1 になる', async () => {
      const client = makeClient({ fetchDeptInstructions: vi.fn().mockResolvedValue(MOCK_UPSTREAM_LIST) });
      const service = new DeptInstructionService(client);

      const result = await service.getDeptInstructions({ dept: 'lab' }, MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);

      expect(result.orders).toHaveLength(1);
    });

    it('正常: transformOrder が patientId をマッピングする', async () => {
      const client = makeClient({ fetchDeptInstructions: vi.fn().mockResolvedValue(MOCK_UPSTREAM_LIST) });
      const service = new DeptInstructionService(client);

      const result = await service.getDeptInstructions({ dept: 'lab' }, MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);

      expect(result.orders.at(0)?.patientId).toBe('P001');
    });

    it('正常: transformOrder が patientName をマッピングする', async () => {
      const client = makeClient({ fetchDeptInstructions: vi.fn().mockResolvedValue(MOCK_UPSTREAM_LIST) });
      const service = new DeptInstructionService(client);

      const result = await service.getDeptInstructions({ dept: 'lab' }, MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);

      expect(result.orders.at(0)?.patientName).toBe('山田太郎');
    });

    it('正常: transformOrder が hasAllergies をマッピングする', async () => {
      const client = makeClient({ fetchDeptInstructions: vi.fn().mockResolvedValue(MOCK_UPSTREAM_LIST) });
      const service = new DeptInstructionService(client);

      const result = await service.getDeptInstructions({ dept: 'lab' }, MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);

      expect(result.orders.at(0)?.hasAllergies).toBe(false);
    });

    it('正常: pageSize がマッピングされる', async () => {
      const client = makeClient({ fetchDeptInstructions: vi.fn().mockResolvedValue(MOCK_UPSTREAM_LIST) });
      const service = new DeptInstructionService(client);

      const result = await service.getDeptInstructions({ dept: 'lab' }, MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);

      expect(result.pageSize).toBe(20);
    });

    it('正常: statusHistory が含まれる場合、updatedBy にマッピングされる', async () => {
      const orderWithHistory: UpstreamDeptInstructionOrder = {
        ...MOCK_UPSTREAM_ORDER,
        statusHistory: [{ status: 'accepted', timestamp: '2026-05-12T09:00:00Z', updatedBy: 'nurse1' }],
      };
      const client = makeClient({
        fetchDeptInstructions: vi.fn().mockResolvedValue({ ...MOCK_UPSTREAM_LIST, orders: [orderWithHistory] }),
      });
      const service = new DeptInstructionService(client);

      const result = await service.getDeptInstructions({ dept: 'lab' }, MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);

      expect(result.orders.at(0)?.statusHistory?.at(0)?.updatedBy).toBe('nurse1');
    });

    it('正常: Client が空 orders を返した場合、orders が空配列になる', async () => {
      const client = makeClient({
        fetchDeptInstructions: vi.fn().mockResolvedValue({ ...MOCK_UPSTREAM_LIST, orders: [], total: 0 }),
      });
      const service = new DeptInstructionService(client);

      const result = await service.getDeptInstructions({ dept: 'lab' }, MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);

      expect(result.orders).toEqual([]);
    });

    it('異常: Client が例外を投げた場合、HttpException に変換して伝播させる', async () => {
      const client = makeClient({ fetchDeptInstructions: vi.fn().mockRejectedValue(new Error('network error')) });
      const service = new DeptInstructionService(client);

      await expect(service.getDeptInstructions({ dept: 'lab' }, MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER)).rejects.toBeInstanceOf(HttpException);
    });

    it('異常: Client が HttpException を投げた場合、そのまま伝播させる', async () => {
      const err = new HttpException({ type: 'SYSTEM_ERROR', code: 'SYSTEM_ERROR' }, 500);
      const client = makeClient({ fetchDeptInstructions: vi.fn().mockRejectedValue(err) });
      const service = new DeptInstructionService(client);

      await expect(service.getDeptInstructions({ dept: 'lab' }, MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER)).rejects.toBe(err);
    });
  });

  describe('updateStatus', () => {
    it('正常: Client が UpstreamUpdateStatusResponse を返した場合、orderId がマッピングされる', async () => {
      const client = makeClient({ updateStatus: vi.fn().mockResolvedValue(MOCK_UPSTREAM_STATUS) });
      const service = new DeptInstructionService(client);

      const result = await service.updateStatus(
        { orderId: 'order-001', newStatus: 'accepted', updatedBy: 'nurse1', timestamp: '2026-05-12T09:00:00Z' },
        MOCK_CORRELATION_ID,
        MOCK_TENANT_ID,
        MOCK_AUTH_HEADER,
      );

      expect(result.orderId).toBe('order-001');
    });

    it('正常: newStatus がマッピングされる', async () => {
      const client = makeClient({ updateStatus: vi.fn().mockResolvedValue(MOCK_UPSTREAM_STATUS) });
      const service = new DeptInstructionService(client);

      const result = await service.updateStatus(
        { orderId: 'order-001', newStatus: 'accepted', updatedBy: 'nurse1', timestamp: '2026-05-12T09:00:00Z' },
        MOCK_CORRELATION_ID,
        MOCK_TENANT_ID,
        MOCK_AUTH_HEADER,
      );

      expect(result.newStatus).toBe('accepted');
    });

    it('正常: Client に orderId と body（orderId 除く）が渡る', async () => {
      const mockFn = vi.fn().mockResolvedValue(MOCK_UPSTREAM_STATUS);
      const client = makeClient({ updateStatus: mockFn });
      const service = new DeptInstructionService(client);

      await service.updateStatus(
        { orderId: 'order-001', newStatus: 'accepted', updatedBy: 'nurse1', timestamp: '2026-05-12T09:00:00Z' },
        MOCK_CORRELATION_ID,
        MOCK_TENANT_ID,
        MOCK_AUTH_HEADER,
      );

      const [orderId, body] = mockFn.mock.calls[0] as [string, Record<string, unknown>, ...unknown[]];
      expect(orderId).toBe('order-001');
      expect(body).not.toHaveProperty('orderId');
    });

    it('異常: Client が例外を投げた場合、HttpException に変換して伝播させる', async () => {
      const client = makeClient({ updateStatus: vi.fn().mockRejectedValue(new Error('update error')) });
      const service = new DeptInstructionService(client);

      await expect(
        service.updateStatus({ orderId: 'order-001', newStatus: 'accepted', updatedBy: 'nurse1', timestamp: '' }, MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER),
      ).rejects.toBeInstanceOf(HttpException);
    });
  });

  describe('postThreePointCheck', () => {
    it('正常: Client が UpstreamThreePointCheckResponse を返した場合、orderId がマッピングされる', async () => {
      const client = makeClient({ postThreePointCheck: vi.fn().mockResolvedValue(MOCK_UPSTREAM_THREE_POINT) });
      const service = new DeptInstructionService(client);

      const result = await service.postThreePointCheck(
        { orderId: 'order-001', patientConfirmed: true, orderConfirmed: true, allergyConfirmed: true, checkedBy: 'nurse1', timestamp: '2026-05-12T09:05:00Z' },
        MOCK_CORRELATION_ID,
        MOCK_TENANT_ID,
        MOCK_AUTH_HEADER,
      );

      expect(result.orderId).toBe('order-001');
    });

    it('正常: checkedAt がマッピングされる', async () => {
      const client = makeClient({ postThreePointCheck: vi.fn().mockResolvedValue(MOCK_UPSTREAM_THREE_POINT) });
      const service = new DeptInstructionService(client);

      const result = await service.postThreePointCheck(
        { orderId: 'order-001', patientConfirmed: true, orderConfirmed: true, allergyConfirmed: true, checkedBy: 'nurse1', timestamp: '2026-05-12T09:05:00Z' },
        MOCK_CORRELATION_ID,
        MOCK_TENANT_ID,
        MOCK_AUTH_HEADER,
      );

      expect(result.checkedAt).toBe('2026-05-12T09:05:00Z');
    });

    it('異常: Client が例外を投げた場合、HttpException に変換して伝播させる', async () => {
      const client = makeClient({ postThreePointCheck: vi.fn().mockRejectedValue(new Error('check error')) });
      const service = new DeptInstructionService(client);

      await expect(
        service.postThreePointCheck({ orderId: 'order-001', patientConfirmed: true, orderConfirmed: true, allergyConfirmed: true, checkedBy: 'nurse1', timestamp: '' }, MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER),
      ).rejects.toBeInstanceOf(HttpException);
    });
  });

  describe('postImplementer', () => {
    it('正常: Client が UpstreamImplementerResponse を返した場合、newStatus がマッピングされる', async () => {
      const client = makeClient({ postImplementer: vi.fn().mockResolvedValue(MOCK_UPSTREAM_IMPLEMENTER) });
      const service = new DeptInstructionService(client);

      const result = await service.postImplementer(
        { orderId: 'order-001', implementer: 'nurse1', implementedAt: '2026-05-12T10:00:00Z' },
        MOCK_CORRELATION_ID,
        MOCK_TENANT_ID,
        MOCK_AUTH_HEADER,
      );

      expect(result.newStatus).toBe('completed');
    });

    it('正常: implementedAt がマッピングされる', async () => {
      const client = makeClient({ postImplementer: vi.fn().mockResolvedValue(MOCK_UPSTREAM_IMPLEMENTER) });
      const service = new DeptInstructionService(client);

      const result = await service.postImplementer(
        { orderId: 'order-001', implementer: 'nurse1', implementedAt: '2026-05-12T10:00:00Z' },
        MOCK_CORRELATION_ID,
        MOCK_TENANT_ID,
        MOCK_AUTH_HEADER,
      );

      expect(result.implementedAt).toBe('2026-05-12T10:00:00Z');
    });

    it('異常: Client が例外を投げた場合、HttpException に変換して伝播させる', async () => {
      const client = makeClient({ postImplementer: vi.fn().mockRejectedValue(new Error('implementer error')) });
      const service = new DeptInstructionService(client);

      await expect(
        service.postImplementer({ orderId: 'order-001', implementer: 'nurse1', implementedAt: '' }, MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER),
      ).rejects.toBeInstanceOf(HttpException);
    });
  });

  describe('postBillingLink', () => {
    it('正常: Client が UpstreamBillingLinkResponse を返した場合、success が true になる', async () => {
      const client = makeClient({ postBillingLink: vi.fn().mockResolvedValue(MOCK_UPSTREAM_BILLING) });
      const service = new DeptInstructionService(client);

      const result = await service.postBillingLink(
        { orderId: 'order-001', triggerStatus: 'accepted', timestamp: '2026-05-12T10:05:00Z' },
        MOCK_CORRELATION_ID,
        MOCK_TENANT_ID,
        MOCK_AUTH_HEADER,
      );

      expect(result.success).toBe(true);
    });

    it('正常: billingLinkedAt がマッピングされる', async () => {
      const client = makeClient({ postBillingLink: vi.fn().mockResolvedValue(MOCK_UPSTREAM_BILLING) });
      const service = new DeptInstructionService(client);

      const result = await service.postBillingLink(
        { orderId: 'order-001', triggerStatus: 'accepted', timestamp: '2026-05-12T10:05:00Z' },
        MOCK_CORRELATION_ID,
        MOCK_TENANT_ID,
        MOCK_AUTH_HEADER,
      );

      expect(result.billingLinkedAt).toBe('2026-05-12T10:05:00Z');
    });

    it('異常: Client が例外を投げた場合、HttpException に変換して伝播させる', async () => {
      const client = makeClient({ postBillingLink: vi.fn().mockRejectedValue(new Error('billing error')) });
      const service = new DeptInstructionService(client);

      await expect(
        service.postBillingLink({ orderId: 'order-001', triggerStatus: 'accepted', timestamp: '' }, MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER),
      ).rejects.toBeInstanceOf(HttpException);
    });
  });
});
