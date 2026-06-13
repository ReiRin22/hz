/**
 * DeptInstructionController テスト
 *
 * テストケースの根拠: DEP002 臨床検査科指示受け 設計書
 *   - GET /deptInstructions: 指示受け一覧取得
 *   - PATCH /:orderId/status: ステータス更新
 *   - POST /:orderId/threePointCheck: 3点チェック
 *   - POST /:orderId/implementer: 実施者入力
 *   - POST /:orderId/billingLink: 医事会計連携
 *   - エラー: 予期しないエラーが発生しました。管理者に連絡してください。
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HttpException, HttpStatus } from '@nestjs/common';
import { DeptInstructionController } from '../dept-instruction.controller';
import { DeptInstructionService } from '../dept-instruction.service';
import type { GetDeptInstructionsResponse, UpdateDeptInstructionStatusResponse, PostThreePointCheckResponse, PostImplementerResponse, PostBillingLinkResponse } from '../types/dept-instruction.api.response';

const MOCK_CORRELATION_ID = 'corr-001';
const MOCK_TENANT_ID = 'tenant-001';
const MOCK_AUTH_HEADER = 'Bearer mock-token';

function makeService(overrides: Partial<DeptInstructionService> = {}): DeptInstructionService {
  const service = Object.create(DeptInstructionService.prototype) as DeptInstructionService;
  Object.assign(service, {
    getDeptInstructions: vi.fn(),
    updateStatus: vi.fn(),
    postThreePointCheck: vi.fn(),
    postImplementer: vi.fn(),
    postBillingLink: vi.fn(),
    ...overrides,
  });
  return service;
}

const MOCK_ORDER = {
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

const MOCK_LIST_RESPONSE: GetDeptInstructionsResponse = {
  orders: [MOCK_ORDER],
  total: 1,
  page: 1,
  pageSize: 20,
};

const MOCK_STATUS_RESPONSE: UpdateDeptInstructionStatusResponse = {
  orderId: 'order-001',
  newStatus: 'accepted',
  updatedAt: '2026-05-12T09:00:00Z',
};

const MOCK_THREE_POINT_RESPONSE: PostThreePointCheckResponse = {
  orderId: 'order-001',
  checkedAt: '2026-05-12T09:05:00Z',
};

const MOCK_IMPLEMENTER_RESPONSE: PostImplementerResponse = {
  orderId: 'order-001',
  implementedAt: '2026-05-12T10:00:00Z',
  newStatus: 'completed',
};

const MOCK_BILLING_RESPONSE: PostBillingLinkResponse = {
  orderId: 'order-001',
  billingLinkedAt: '2026-05-12T10:05:00Z',
  success: true,
};

describe('DeptInstructionController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getDeptInstructions', () => {
    it('正常: Service が GetDeptInstructionsResponse を返した場合、そのまま返す', async () => {
      const service = makeService({ getDeptInstructions: vi.fn().mockResolvedValue(MOCK_LIST_RESPONSE) });
      const controller = new DeptInstructionController(service);

      const result = await controller.getDeptInstructions(
        { dept: 'lab' },
        MOCK_CORRELATION_ID,
        MOCK_TENANT_ID,
        MOCK_AUTH_HEADER,
      );

      expect(result).toEqual(MOCK_LIST_RESPONSE);
    });

    it('正常: correlationId が undefined の場合、UUID が自動生成されて Service に渡る', async () => {
      const mockFn = vi.fn().mockResolvedValue(MOCK_LIST_RESPONSE);
      const service = makeService({ getDeptInstructions: mockFn });
      const controller = new DeptInstructionController(service);

      await controller.getDeptInstructions({ dept: 'lab' }, undefined, undefined, undefined);

      const [, correlationId] = mockFn.mock.calls[0] as [unknown, string, ...unknown[]];
      expect(correlationId).toBeTruthy();
    });

    it('異常: Service が HttpException を投げた場合、そのまま伝播する', async () => {
      const err = new HttpException({ type: 'SYSTEM_ERROR', code: 'SYSTEM_ERROR' }, HttpStatus.INTERNAL_SERVER_ERROR);
      const service = makeService({ getDeptInstructions: vi.fn().mockRejectedValue(err) });
      const controller = new DeptInstructionController(service);

      await expect(
        controller.getDeptInstructions({ dept: 'lab' }, MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER),
      ).rejects.toBeInstanceOf(HttpException);
    });
  });

  describe('updateStatus', () => {
    it('正常: Service が UpdateDeptInstructionStatusResponse を返した場合、そのまま返す', async () => {
      const service = makeService({ updateStatus: vi.fn().mockResolvedValue(MOCK_STATUS_RESPONSE) });
      const controller = new DeptInstructionController(service);

      const result = await controller.updateStatus(
        'order-001',
        { newStatus: 'accepted', updatedBy: 'nurse1', timestamp: '2026-05-12T09:00:00Z' },
        MOCK_CORRELATION_ID,
        MOCK_TENANT_ID,
        MOCK_AUTH_HEADER,
      );

      expect(result).toEqual(MOCK_STATUS_RESPONSE);
    });

    it('正常: orderId が body に合成されて Service に渡る', async () => {
      const mockFn = vi.fn().mockResolvedValue(MOCK_STATUS_RESPONSE);
      const service = makeService({ updateStatus: mockFn });
      const controller = new DeptInstructionController(service);

      await controller.updateStatus(
        'order-001',
        { newStatus: 'accepted', updatedBy: 'nurse1', timestamp: '2026-05-12T09:00:00Z' },
        MOCK_CORRELATION_ID,
        MOCK_TENANT_ID,
        MOCK_AUTH_HEADER,
      );

      const [body] = mockFn.mock.calls[0] as [{ orderId: string }, ...unknown[]];
      expect(body.orderId).toBe('order-001');
    });

    it('異常: Service が HttpException を投げた場合、そのまま伝播する', async () => {
      const err = new HttpException({ type: 'SYSTEM_ERROR', code: 'SYSTEM_ERROR' }, HttpStatus.INTERNAL_SERVER_ERROR);
      const service = makeService({ updateStatus: vi.fn().mockRejectedValue(err) });
      const controller = new DeptInstructionController(service);

      await expect(
        controller.updateStatus('order-001', { newStatus: 'accepted', updatedBy: 'nurse1', timestamp: '2026-05-12T09:00:00Z' }, MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER),
      ).rejects.toBeInstanceOf(HttpException);
    });
  });

  describe('postThreePointCheck', () => {
    it('正常: Service が PostThreePointCheckResponse を返した場合、そのまま返す', async () => {
      const service = makeService({ postThreePointCheck: vi.fn().mockResolvedValue(MOCK_THREE_POINT_RESPONSE) });
      const controller = new DeptInstructionController(service);

      const result = await controller.postThreePointCheck(
        'order-001',
        { patientConfirmed: true, orderConfirmed: true, allergyConfirmed: true, checkedBy: 'nurse1', timestamp: '2026-05-12T09:05:00Z' },
        MOCK_CORRELATION_ID,
        MOCK_TENANT_ID,
        MOCK_AUTH_HEADER,
      );

      expect(result).toEqual(MOCK_THREE_POINT_RESPONSE);
    });

    it('異常: Service が HttpException を投げた場合、そのまま伝播する', async () => {
      const err = new HttpException({ type: 'SYSTEM_ERROR', code: 'SYSTEM_ERROR' }, HttpStatus.INTERNAL_SERVER_ERROR);
      const service = makeService({ postThreePointCheck: vi.fn().mockRejectedValue(err) });
      const controller = new DeptInstructionController(service);

      await expect(
        controller.postThreePointCheck('order-001', { patientConfirmed: true, orderConfirmed: true, allergyConfirmed: true, checkedBy: 'nurse1', timestamp: '2026-05-12T09:05:00Z' }, MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER),
      ).rejects.toBeInstanceOf(HttpException);
    });
  });

  describe('postImplementer', () => {
    it('正常: Service が PostImplementerResponse を返した場合、そのまま返す', async () => {
      const service = makeService({ postImplementer: vi.fn().mockResolvedValue(MOCK_IMPLEMENTER_RESPONSE) });
      const controller = new DeptInstructionController(service);

      const result = await controller.postImplementer(
        'order-001',
        { implementer: 'nurse1', implementedAt: '2026-05-12T10:00:00Z' },
        MOCK_CORRELATION_ID,
        MOCK_TENANT_ID,
        MOCK_AUTH_HEADER,
      );

      expect(result).toEqual(MOCK_IMPLEMENTER_RESPONSE);
    });

    it('異常: Service が HttpException を投げた場合、そのまま伝播する', async () => {
      const err = new HttpException({ type: 'SYSTEM_ERROR', code: 'SYSTEM_ERROR' }, HttpStatus.INTERNAL_SERVER_ERROR);
      const service = makeService({ postImplementer: vi.fn().mockRejectedValue(err) });
      const controller = new DeptInstructionController(service);

      await expect(
        controller.postImplementer('order-001', { implementer: 'nurse1', implementedAt: '2026-05-12T10:00:00Z' }, MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER),
      ).rejects.toBeInstanceOf(HttpException);
    });
  });

  describe('postBillingLink', () => {
    it('正常: Service が PostBillingLinkResponse を返した場合、そのまま返す', async () => {
      const service = makeService({ postBillingLink: vi.fn().mockResolvedValue(MOCK_BILLING_RESPONSE) });
      const controller = new DeptInstructionController(service);

      const result = await controller.postBillingLink(
        'order-001',
        { triggerStatus: 'accepted', timestamp: '2026-05-12T10:05:00Z' },
        MOCK_CORRELATION_ID,
        MOCK_TENANT_ID,
        MOCK_AUTH_HEADER,
      );

      expect(result).toEqual(MOCK_BILLING_RESPONSE);
    });

    it('異常: Service が HttpException を投げた場合、そのまま伝播する', async () => {
      const err = new HttpException({ type: 'SYSTEM_ERROR', code: 'SYSTEM_ERROR' }, HttpStatus.INTERNAL_SERVER_ERROR);
      const service = makeService({ postBillingLink: vi.fn().mockRejectedValue(err) });
      const controller = new DeptInstructionController(service);

      await expect(
        controller.postBillingLink('order-001', { triggerStatus: 'accepted', timestamp: '2026-05-12T10:05:00Z' }, MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER),
      ).rejects.toBeInstanceOf(HttpException);
    });
  });
});
