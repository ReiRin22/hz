import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HttpException, HttpStatus } from '@nestjs/common';
import { TestItemMasterService } from './test-item-master.service';
import { TestItemMasterClient } from './test-item-master.client';
import type { TestItemRecord, TestItemListResponse } from '@/front_bff_shared/sample/master/types/test-item-master.api.response';

const MOCK_ITEMS: TestItemRecord[] = [
  { code: 'GLU', name: '血糖', unit_id: 'mg/dL', lower_limit: 70, upper_limit: 110, critical_lower: 50, critical_upper: 500 },
  { code: 'HBA1C', name: 'HbA1c', unit_id: '%', lower_limit: null, upper_limit: null, critical_lower: null, critical_upper: null },
];

const MOCK_RESPONSE: TestItemListResponse = { items: MOCK_ITEMS };
const CORRELATION_ID = 'corr-001';
const TENANT_ID = 'tenant-001';
const AUTH_HEADER = 'Bearer mock-token';

function makeClient(overrides: Partial<TestItemMasterClient> = {}): TestItemMasterClient {
  return {
    fetchTestItems: vi.fn().mockResolvedValue(MOCK_RESPONSE),
    ...overrides,
  } as unknown as TestItemMasterClient;
}

function makeService(client: TestItemMasterClient): TestItemMasterService {
  return new TestItemMasterService(client);
}

describe('TestItemMasterService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTestItems', () => {
    it('正常: items を包んだ TestItemListResponse を返す', async () => {
      const client = makeClient();
      const service = makeService(client);

      const result = await service.getTestItems({}, CORRELATION_ID, TENANT_ID, AUTH_HEADER);

      expect(result).toEqual({ items: MOCK_ITEMS });
      expect(client.fetchTestItems).toHaveBeenCalledWith({}, CORRELATION_ID, TENANT_ID, AUTH_HEADER);
    });

    it('正常: 検索条件を渡すと client に転送される', async () => {
      const client = makeClient({ fetchTestItems: vi.fn().mockResolvedValue({ items: [MOCK_ITEMS[0]] }) });
      const service = makeService(client);

      const result = await service.getTestItems({ itemName: '血糖', itemCode: 'GLU' }, CORRELATION_ID, TENANT_ID, AUTH_HEADER);

      expect(result.items).toHaveLength(1);
      expect(client.fetchTestItems).toHaveBeenCalledWith({ itemName: '血糖', itemCode: 'GLU' }, CORRELATION_ID, TENANT_ID, AUTH_HEADER);
    });

    it('正常: 0件の場合 items:[] を返す（404にならない）', async () => {
      const client = makeClient({ fetchTestItems: vi.fn().mockResolvedValue({ items: [] }) });
      const service = makeService(client);

      const result = await service.getTestItems({ itemName: '存在しない項目' }, CORRELATION_ID, TENANT_ID, AUTH_HEADER);

      expect(result).toEqual({ items: [] });
    });

    it('異常: ECONNABORTED → 504 TIMEOUT', async () => {
      const err = Object.assign(new Error('timeout'), { code: 'ECONNABORTED' });
      const client = makeClient({ fetchTestItems: vi.fn().mockRejectedValue(err) });
      const service = makeService(client);

      await expect(service.getTestItems({}, CORRELATION_ID, TENANT_ID, AUTH_HEADER)).rejects.toMatchObject({
        status: HttpStatus.GATEWAY_TIMEOUT,
        response: { type: 'SYSTEM_ERROR', code: 'TIMEOUT' },
      });
    });

    it('異常: response.status 401 → 401 UNAUTHORIZED', async () => {
      const err = Object.assign(new Error('unauthorized'), { response: { status: 401 } });
      const client = makeClient({ fetchTestItems: vi.fn().mockRejectedValue(err) });
      const service = makeService(client);

      await expect(service.getTestItems({}, CORRELATION_ID, TENANT_ID, AUTH_HEADER)).rejects.toMatchObject({
        status: HttpStatus.UNAUTHORIZED,
        response: { type: 'AUTH_ERROR', code: 'UNAUTHORIZED' },
      });
    });

    it('異常: response.status 403 → 403 FORBIDDEN', async () => {
      const err = Object.assign(new Error('forbidden'), { response: { status: 403 } });
      const client = makeClient({ fetchTestItems: vi.fn().mockRejectedValue(err) });
      const service = makeService(client);

      await expect(service.getTestItems({}, CORRELATION_ID, TENANT_ID, AUTH_HEADER)).rejects.toMatchObject({
        status: HttpStatus.FORBIDDEN,
        response: { type: 'AUTH_ERROR', code: 'FORBIDDEN' },
      });
    });

    it('異常: response.status 500 → 500 SYSTEM_ERROR', async () => {
      const err = Object.assign(new Error('server error'), { response: { status: 500 } });
      const client = makeClient({ fetchTestItems: vi.fn().mockRejectedValue(err) });
      const service = makeService(client);

      await expect(service.getTestItems({}, CORRELATION_ID, TENANT_ID, AUTH_HEADER)).rejects.toMatchObject({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        response: { type: 'SYSTEM_ERROR', code: 'SYSTEM_ERROR' },
      });
    });

    it('異常: response.status 502 → 502 BAD_GATEWAY', async () => {
      const err = Object.assign(new Error('bad gateway'), { response: { status: 502 } });
      const client = makeClient({ fetchTestItems: vi.fn().mockRejectedValue(err) });
      const service = makeService(client);

      await expect(service.getTestItems({}, CORRELATION_ID, TENANT_ID, AUTH_HEADER)).rejects.toMatchObject({
        status: HttpStatus.BAD_GATEWAY,
        response: { type: 'SYSTEM_ERROR', code: 'BAD_GATEWAY' },
      });
    });

    it('異常: response.status 504 → 504 TIMEOUT', async () => {
      const err = Object.assign(new Error('timeout'), { response: { status: 504 } });
      const client = makeClient({ fetchTestItems: vi.fn().mockRejectedValue(err) });
      const service = makeService(client);

      await expect(service.getTestItems({}, CORRELATION_ID, TENANT_ID, AUTH_HEADER)).rejects.toMatchObject({
        status: HttpStatus.GATEWAY_TIMEOUT,
        response: { type: 'SYSTEM_ERROR', code: 'TIMEOUT' },
      });
    });

    it('異常: ERR_NETWORK → 502 BAD_GATEWAY（master-domain-service 接続不可）', async () => {
      const err = Object.assign(new Error('network'), { code: 'ERR_NETWORK' });
      const client = makeClient({ fetchTestItems: vi.fn().mockRejectedValue(err) });
      const service = makeService(client);

      await expect(service.getTestItems({}, CORRELATION_ID, TENANT_ID, AUTH_HEADER)).rejects.toMatchObject({
        status: HttpStatus.BAD_GATEWAY,
        response: { type: 'SYSTEM_ERROR', code: 'BAD_GATEWAY' },
      });
    });

    it('異常: 未知エラー → 500 SYSTEM_ERROR', async () => {
      const err = new Error('unknown');
      const client = makeClient({ fetchTestItems: vi.fn().mockRejectedValue(err) });
      const service = makeService(client);

      await expect(service.getTestItems({}, CORRELATION_ID, TENANT_ID, AUTH_HEADER)).rejects.toMatchObject({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        response: { type: 'SYSTEM_ERROR', code: 'SYSTEM_ERROR' },
      });
    });
  });
});
