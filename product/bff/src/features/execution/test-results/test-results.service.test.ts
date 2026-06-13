import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HttpException, HttpStatus } from '@nestjs/common';
import { TestResultsService } from './test-results.service';
import { TestResultsClient } from './test-results.client';
import { TestItemMasterService } from '@shared/master/test-item-master/test-item-master.service';
import type {
  BackendLockAcquireResponse,
  BackendTestResultsGetResponse,
  BackendUnitRecord,
  BackendModificationReasonRecord,
  BackendSaveResponse,
} from './types/backend.type';
import type { TestItemRecord } from '@/front_bff_shared/sample/master/types/test-item-master.api.response';

// ---- テスト用ヘルパー ----

const LOCK_RESPONSE: BackendLockAcquireResponse = {
  lockId: 'lock-001',
  lockedAt: '2026-04-22T10:00:00Z',
  expiresAt: '2026-04-22T10:30:00Z',
};

const TEST_RESULTS_RESPONSE: BackendTestResultsGetResponse = {
  orderUuid: 'order-001',
  hasConfirmedResults: false,
  testResults: [
    {
      itemCode: 'GLU', itemName: '血糖', resultValue: 95, unit: 'mg/dL',
      referenceValueDisplay: '70–110', lowerLimit: 70, upperLimit: 110,
      criticalLower: 50, criticalUpper: 500, previousResultValue: 90,
      hasPreviousResult: true, testDate: '2026-04-20', hasTestDate: true,
      isUserAdded: false,
    },
  ],
};

const UNITS_RESPONSE: BackendUnitRecord[] = [
  { code: 'mg/dL', name: 'mg/dL' },
  { code: '%', name: '%' },
];

const MASTER_BFF_ITEMS: TestItemRecord[] = [
  { code: 'GLU', name: '血糖', unit_id: 'mg/dL', lower_limit: 70, upper_limit: 110, critical_lower: 50, critical_upper: 500 },
  { code: 'HBA1C', name: 'HbA1c', unit_id: '%', lower_limit: null, upper_limit: null, critical_lower: null, critical_upper: null },
];

const MODIFICATION_REASONS: BackendModificationReasonRecord[] = [
  { code: 'INPUT_ERROR', name: '入力ミス' },
  { code: 'OTHER', name: 'その他' },
];

const SAVE_RESPONSE: BackendSaveResponse = {
  orderUuid: 'order-001',
  savedAt: '2026-04-22T11:00:00Z',
};

const JWT_USER = { sub: 'user-001', name: 'テスト医師' };
const CORRELATION_ID = 'corr-001';
const TENANT_ID = 'tenant-001';
const AUTH_HEADER = 'Bearer mock-token';

function makeClient(overrides: Partial<Record<keyof TestResultsClient, unknown>> = {}): TestResultsClient {
  return {
    acquireLock: vi.fn().mockResolvedValue(LOCK_RESPONSE),
    fetchTestResults: vi.fn().mockResolvedValue(TEST_RESULTS_RESPONSE),
    fetchUnits: vi.fn().mockResolvedValue(UNITS_RESPONSE),
    fetchModificationReasons: vi.fn().mockResolvedValue(MODIFICATION_REASONS),
    saveTestResults: vi.fn().mockResolvedValue(SAVE_RESPONSE),
    releaseLock: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  } as unknown as TestResultsClient;
}

function makeMasterService(overrides: Partial<Record<keyof TestItemMasterService, unknown>> = {}): TestItemMasterService {
  return {
    getTestItems: vi.fn().mockResolvedValue({ items: MASTER_BFF_ITEMS }),
    ...overrides,
  } as unknown as TestItemMasterService;
}

function makeService(client: TestResultsClient, masterService?: TestItemMasterService): TestResultsService {
  return new TestResultsService(client, masterService ?? makeMasterService());
}

// ---- テスト ----

describe('TestResultsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ========== getInitialData ==========
  describe('getInitialData', () => {
    it('正常: ロック取得・並列fetch・DTOマッピングが正しい', async () => {
      const client = makeClient();
      const service = makeService(client);

      const result = await service.getInitialData('order-001', CORRELATION_ID, TENANT_ID, JWT_USER, AUTH_HEADER);

      expect(result.orderUuid).toBe('order-001');
      expect(result.lockInfo.lockBy).toBe('SELF');
      expect(result.lockInfo.lockedAt).toBe(LOCK_RESPONSE.lockedAt);
      expect(result.lockInfo.lockedByUserId).toBe(JWT_USER.sub);
      expect(result.lockInfo.lockedByUserName).toBe(JWT_USER.name);
      expect(result.reasonRequired).toBe(false);
      expect(result.availableUnits).toEqual([
        { value: 'mg/dL', label: 'mg/dL' },
        { value: '%', label: '%' },
      ]);
      expect(result.testResults).toHaveLength(1);
      expect(client.acquireLock).toHaveBeenCalledWith('order-001', CORRELATION_ID, TENANT_ID, AUTH_HEADER);
      expect(client.fetchTestResults).toHaveBeenCalledWith('order-001', CORRELATION_ID, TENANT_ID, AUTH_HEADER);
      expect(client.fetchUnits).toHaveBeenCalledWith(CORRELATION_ID, TENANT_ID, AUTH_HEADER);
    });

    it('正常: reasonRequired が hasConfirmedResults から変換される（true）', async () => {
      const client = makeClient({
        fetchTestResults: vi.fn().mockResolvedValue({
          ...TEST_RESULTS_RESPONSE,
          hasConfirmedResults: true,
        }),
      });
      const service = makeService(client);

      const result = await service.getInitialData('order-001', CORRELATION_ID, TENANT_ID, JWT_USER, AUTH_HEADER);

      expect(result.reasonRequired).toBe(true);
    });

    it('異常: ロック取得 409 LOCK_CONFLICT → lockedByUserName 付きで 409 返却', async () => {
      const client = makeClient({
        acquireLock: vi.fn().mockRejectedValue(
          Object.assign(new Error('conflict'), {
            response: { status: 409, data: { errorCode: 'LOCK_CONFLICT', lockedByUserName: '別医師' } },
          }),
        ),
      });
      const service = makeService(client);

      await expect(service.getInitialData('order-001', CORRELATION_ID, TENANT_ID, JWT_USER, AUTH_HEADER)).rejects.toMatchObject({
        status: HttpStatus.CONFLICT,
        response: { type: 'CONFLICT', code: 'CONFLICT', lockedByUserName: '別医師' },
      });
    });

    it('異常: ロック取得 409 LOCK_EXPIRED → lockedByUserName なしで 409 返却', async () => {
      const client = makeClient({
        acquireLock: vi.fn().mockRejectedValue(
          Object.assign(new Error('expired'), {
            response: { status: 409, data: { errorCode: 'LOCK_EXPIRED' } },
          }),
        ),
      });
      const service = makeService(client);

      const err = await service.getInitialData('order-001', CORRELATION_ID, TENANT_ID, JWT_USER, AUTH_HEADER).catch(e => e) as HttpException;
      expect(err.getStatus()).toBe(HttpStatus.CONFLICT);
      expect((err.getResponse() as Record<string, unknown>)['lockedByUserName']).toBeUndefined();
    });

    it('異常: ロック取得 401 → 401 UNAUTHORIZED', async () => {
      const client = makeClient({
        acquireLock: vi.fn().mockRejectedValue(
          Object.assign(new Error('unauthorized'), { response: { status: 401 } }),
        ),
      });
      const service = makeService(client);

      await expect(service.getInitialData('order-001', CORRELATION_ID, TENANT_ID, JWT_USER, AUTH_HEADER)).rejects.toMatchObject({
        status: HttpStatus.UNAUTHORIZED,
        response: { type: 'AUTH_ERROR', code: 'UNAUTHORIZED' },
      });
    });

    it('異常: Promise.all（fetchTestResults）失敗 → normalizeError に委譲', async () => {
      const client = makeClient({
        fetchTestResults: vi.fn().mockRejectedValue(
          Object.assign(new Error('not found'), { response: { status: 404 } }),
        ),
      });
      const service = makeService(client);

      await expect(service.getInitialData('order-001', CORRELATION_ID, TENANT_ID, JWT_USER, AUTH_HEADER)).rejects.toMatchObject({
        status: HttpStatus.NOT_FOUND,
        response: { type: 'NOT_FOUND', code: 'NOT_FOUND' },
      });
    });

    it('異常: Promise.all（fetchUnits）失敗 → 500 SYSTEM_ERROR', async () => {
      const client = makeClient({
        fetchUnits: vi.fn().mockRejectedValue(new Error('unknown')),
      });
      const service = makeService(client);

      await expect(service.getInitialData('order-001', CORRELATION_ID, TENANT_ID, JWT_USER, AUTH_HEADER)).rejects.toMatchObject({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        response: { type: 'SYSTEM_ERROR', code: 'SYSTEM_ERROR' },
      });
    });

    it('異常: Promise.all（fetchTestResults）504 → 504 TIMEOUT', async () => {
      const client = makeClient({
        fetchTestResults: vi.fn().mockRejectedValue(
          Object.assign(new Error('timeout'), { response: { status: 504 } }),
        ),
      });
      const service = makeService(client);

      await expect(service.getInitialData('order-001', CORRELATION_ID, TENANT_ID, JWT_USER, AUTH_HEADER)).rejects.toMatchObject({
        status: HttpStatus.GATEWAY_TIMEOUT,
        response: { type: 'SYSTEM_ERROR', code: 'TIMEOUT' },
      });
    });
  });

  // ========== searchTestItems ==========
  describe('searchTestItems', () => {
    it('正常: TestItemOption にマッピングされる', async () => {
      const client = makeClient();
      const service = makeService(client);

      const result = await service.searchTestItems({}, CORRELATION_ID, TENANT_ID, AUTH_HEADER);

      expect(result.items).toHaveLength(2);
      const glu = result.items[0]!;
      expect(glu.itemCode).toBe('GLU');
      expect(glu.itemName).toBe('血糖');
      expect(glu.defaultUnit).toBe('mg/dL');
      expect(glu.referenceValueDisplay).toBe('70–110'); // U+2013 EN DASH
    });

    it('正常: lower_limit/upper_limit どちらかが null → referenceValueDisplay が null', async () => {
      const client = makeClient();
      const service = makeService(client);

      const result = await service.searchTestItems({}, CORRELATION_ID, TENANT_ID, AUTH_HEADER);

      const hba1c = result.items[1]!;
      expect(hba1c.referenceValueDisplay).toBeNull();
      expect(hba1c.lowerLimit).toBeNull();
      expect(hba1c.upperLimit).toBeNull();
    });

    it('正常: 0件でも items:[] を返す', async () => {
      const masterService = makeMasterService({ getTestItems: vi.fn().mockResolvedValue({ items: [] }) });
      const service = makeService(makeClient(), masterService);

      const result = await service.searchTestItems({}, CORRELATION_ID, TENANT_ID, AUTH_HEADER);
      expect(result.items).toEqual([]);
    });

    it('異常: TestItemMasterService が 504 HttpException → そのまま再スロー', async () => {
      const masterService = makeMasterService({
        getTestItems: vi.fn().mockRejectedValue(
          new HttpException({ type: 'SYSTEM_ERROR', code: 'TIMEOUT' }, HttpStatus.GATEWAY_TIMEOUT),
        ),
      });
      const service = makeService(makeClient(), masterService);

      await expect(service.searchTestItems({}, CORRELATION_ID, TENANT_ID, AUTH_HEADER)).rejects.toMatchObject({
        status: HttpStatus.GATEWAY_TIMEOUT,
        response: { type: 'SYSTEM_ERROR', code: 'TIMEOUT' },
      });
    });

    it('異常: TestItemMasterService が 502 HttpException → そのまま再スロー', async () => {
      const masterService = makeMasterService({
        getTestItems: vi.fn().mockRejectedValue(
          new HttpException({ type: 'SYSTEM_ERROR', code: 'BAD_GATEWAY' }, HttpStatus.BAD_GATEWAY),
        ),
      });
      const service = makeService(makeClient(), masterService);

      await expect(service.searchTestItems({}, CORRELATION_ID, TENANT_ID, AUTH_HEADER)).rejects.toMatchObject({
        status: HttpStatus.BAD_GATEWAY,
        response: { type: 'SYSTEM_ERROR', code: 'BAD_GATEWAY' },
      });
    });

    it('異常: TestItemMasterService が 500 HttpException → そのまま再スロー', async () => {
      const masterService = makeMasterService({
        getTestItems: vi.fn().mockRejectedValue(
          new HttpException({ type: 'SYSTEM_ERROR', code: 'SYSTEM_ERROR' }, HttpStatus.INTERNAL_SERVER_ERROR),
        ),
      });
      const service = makeService(makeClient(), masterService);

      await expect(service.searchTestItems({}, CORRELATION_ID, TENANT_ID, AUTH_HEADER)).rejects.toMatchObject({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        response: { type: 'SYSTEM_ERROR', code: 'SYSTEM_ERROR' },
      });
    });

    it('異常: TestItemMasterService が 401 HttpException → そのまま再スロー', async () => {
      const masterService = makeMasterService({
        getTestItems: vi.fn().mockRejectedValue(
          new HttpException({ type: 'AUTH_ERROR', code: 'UNAUTHORIZED' }, HttpStatus.UNAUTHORIZED),
        ),
      });
      const service = makeService(makeClient(), masterService);

      await expect(service.searchTestItems({}, CORRELATION_ID, TENANT_ID, AUTH_HEADER)).rejects.toMatchObject({
        status: HttpStatus.UNAUTHORIZED,
        response: { type: 'AUTH_ERROR', code: 'UNAUTHORIZED' },
      });
    });

    it('異常: TestItemMasterService が 403 HttpException → そのまま再スロー', async () => {
      const masterService = makeMasterService({
        getTestItems: vi.fn().mockRejectedValue(
          new HttpException({ type: 'AUTH_ERROR', code: 'FORBIDDEN' }, HttpStatus.FORBIDDEN),
        ),
      });
      const service = makeService(makeClient(), masterService);

      await expect(service.searchTestItems({}, CORRELATION_ID, TENANT_ID, AUTH_HEADER)).rejects.toMatchObject({
        status: HttpStatus.FORBIDDEN,
        response: { type: 'AUTH_ERROR', code: 'FORBIDDEN' },
      });
    });

    it('異常: 未知エラー（非 HttpException）→ 502 BAD_GATEWAY', async () => {
      const masterService = makeMasterService({
        getTestItems: vi.fn().mockRejectedValue(new Error('unexpected')),
      });
      const service = makeService(makeClient(), masterService);

      await expect(service.searchTestItems({}, CORRELATION_ID, TENANT_ID, AUTH_HEADER)).rejects.toMatchObject({
        status: HttpStatus.BAD_GATEWAY,
        response: { type: 'SYSTEM_ERROR', code: 'BAD_GATEWAY' },
      });
    });

    it('異常: ERR_NETWORK → 502 BAD_GATEWAY', async () => {
      const masterService = makeMasterService({
        getTestItems: vi.fn().mockRejectedValue(
          Object.assign(new Error('network'), { code: 'ERR_NETWORK' }),
        ),
      });
      const service = makeService(makeClient(), masterService);

      await expect(service.searchTestItems({}, CORRELATION_ID, TENANT_ID, AUTH_HEADER)).rejects.toMatchObject({
        status: HttpStatus.BAD_GATEWAY,
        response: { type: 'SYSTEM_ERROR', code: 'BAD_GATEWAY' },
      });
    });
  });

  // ========== getModificationReasons ==========
  describe('getModificationReasons', () => {
    it('正常: reasons を包んだレスポンスを返す', async () => {
      const client = makeClient();
      const service = makeService(client);

      const result = await service.getModificationReasons(CORRELATION_ID, TENANT_ID, AUTH_HEADER);

      expect(result).toEqual({
        reasons: [
          { code: 'INPUT_ERROR', label: '入力ミス' },
          { code: 'OTHER', label: 'その他' },
        ],
      });
    });

    it('異常: 404 → 404 NOT_FOUND', async () => {
      const client = makeClient({
        fetchModificationReasons: vi.fn().mockRejectedValue(
          Object.assign(new Error('not found'), { response: { status: 404 } }),
        ),
      });
      const service = makeService(client);

      await expect(service.getModificationReasons(CORRELATION_ID, TENANT_ID, AUTH_HEADER)).rejects.toMatchObject({
        status: HttpStatus.NOT_FOUND,
        response: { type: 'NOT_FOUND', code: 'NOT_FOUND' },
      });
    });

    it('異常: 500 → 500 SYSTEM_ERROR', async () => {
      const client = makeClient({
        fetchModificationReasons: vi.fn().mockRejectedValue(
          Object.assign(new Error('internal'), { response: { status: 500 } }),
        ),
      });
      const service = makeService(client);

      await expect(service.getModificationReasons(CORRELATION_ID, TENANT_ID, AUTH_HEADER)).rejects.toMatchObject({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        response: { type: 'SYSTEM_ERROR', code: 'SYSTEM_ERROR' },
      });
    });

    it('異常: 504 → 504 TIMEOUT', async () => {
      const client = makeClient({
        fetchModificationReasons: vi.fn().mockRejectedValue(
          Object.assign(new Error('timeout'), { response: { status: 504 } }),
        ),
      });
      const service = makeService(client);

      await expect(service.getModificationReasons(CORRELATION_ID, TENANT_ID, AUTH_HEADER)).rejects.toMatchObject({
        status: HttpStatus.GATEWAY_TIMEOUT,
        response: { type: 'SYSTEM_ERROR', code: 'TIMEOUT' },
      });
    });
  });

  // ========== saveTestResults ==========
  describe('saveTestResults', () => {
    const SAVE_BODY = {
      testResults: [
        { itemCode: 'GLU', resultValue: 95, unit: 'mg/dL' },
      ],
    };

    it('正常: 保存成功後にロック解放（fire-and-forget）を呼ぶ', async () => {
      const client = makeClient();
      const service = makeService(client);

      const result = await service.saveTestResults('order-001', SAVE_BODY, CORRELATION_ID, TENANT_ID, AUTH_HEADER);

      expect(result).toEqual({ orderUuid: 'order-001', savedAt: SAVE_RESPONSE.savedAt });
      // X-Correlation-ID は releaseLock に渡さない（バックエンドが [FromHeader] で未宣言）
      expect(client.releaseLock).toHaveBeenCalledWith('order-001', TENANT_ID, AUTH_HEADER);
    });

    it('正常: modificationReason 付きで保存できる', async () => {
      const client = makeClient();
      const service = makeService(client);

      const body = {
        ...SAVE_BODY,
        modificationReason: { reasonCode: 'INPUT_ERROR' },
      };
      const result = await service.saveTestResults('order-001', body, CORRELATION_ID, TENANT_ID, AUTH_HEADER);

      expect(result.orderUuid).toBe('order-001');
      expect(client.releaseLock).toHaveBeenCalledWith('order-001', TENANT_ID, AUTH_HEADER);
      expect(client.saveTestResults).toHaveBeenCalledWith(
        'order-001',
        body.testResults,
        body.modificationReason,
        CORRELATION_ID,
        TENANT_ID,
        AUTH_HEADER,
      );
    });

    it('異常: 400 VALIDATION_DELETE → 400 BUSINESS_ERROR/VALIDATION_DELETE', async () => {
      const client = makeClient({
        saveTestResults: vi.fn().mockRejectedValue(
          Object.assign(new Error('delete error'), {
            response: { status: 400, data: { errorCode: 'VALIDATION_DELETE' } },
          }),
        ),
      });
      const service = makeService(client);

      await expect(service.saveTestResults('order-001', SAVE_BODY, CORRELATION_ID, TENANT_ID, AUTH_HEADER)).rejects.toMatchObject({
        status: HttpStatus.BAD_REQUEST,
        response: { type: 'BUSINESS_ERROR', code: 'VALIDATION_DELETE' },
      });
    });

    it('異常: 400 その他 → 400 BUSINESS_ERROR/VALIDATION_FORMAT', async () => {
      const client = makeClient({
        saveTestResults: vi.fn().mockRejectedValue(
          Object.assign(new Error('format error'), {
            response: { status: 400, data: { errorCode: 'UNKNOWN_CODE' } },
          }),
        ),
      });
      const service = makeService(client);

      await expect(service.saveTestResults('order-001', SAVE_BODY, CORRELATION_ID, TENANT_ID, AUTH_HEADER)).rejects.toMatchObject({
        status: HttpStatus.BAD_REQUEST,
        response: { type: 'BUSINESS_ERROR', code: 'VALIDATION_FORMAT' },
      });
    });

    it('異常: 409 LOCK_CONFLICT → lockedByUserName 付きで 409 返却', async () => {
      const client = makeClient({
        saveTestResults: vi.fn().mockRejectedValue(
          Object.assign(new Error('conflict'), {
            response: { status: 409, data: { errorCode: 'LOCK_CONFLICT', lockedByUserName: '別医師' } },
          }),
        ),
      });
      const service = makeService(client);

      await expect(service.saveTestResults('order-001', SAVE_BODY, CORRELATION_ID, TENANT_ID, AUTH_HEADER)).rejects.toMatchObject({
        status: HttpStatus.CONFLICT,
        response: { type: 'CONFLICT', code: 'CONFLICT', lockedByUserName: '別医師' },
      });
    });

    it('異常: 409 LOCK_EXPIRED → lockedByUserName なしで 409 返却', async () => {
      const client = makeClient({
        saveTestResults: vi.fn().mockRejectedValue(
          Object.assign(new Error('expired'), {
            response: { status: 409, data: { errorCode: 'LOCK_EXPIRED' } },
          }),
        ),
      });
      const service = makeService(client);

      const err = await service.saveTestResults('order-001', SAVE_BODY, CORRELATION_ID, TENANT_ID, AUTH_HEADER).catch(e => e) as HttpException;
      expect(err.getStatus()).toBe(HttpStatus.CONFLICT);
      expect((err.getResponse() as Record<string, unknown>)['lockedByUserName']).toBeUndefined();
    });

    it('異常: 401 → 401 UNAUTHORIZED', async () => {
      const client = makeClient({
        saveTestResults: vi.fn().mockRejectedValue(
          Object.assign(new Error('unauthorized'), { response: { status: 401 } }),
        ),
      });
      const service = makeService(client);

      await expect(service.saveTestResults('order-001', SAVE_BODY, CORRELATION_ID, TENANT_ID, AUTH_HEADER)).rejects.toMatchObject({
        status: HttpStatus.UNAUTHORIZED,
        response: { type: 'AUTH_ERROR', code: 'UNAUTHORIZED' },
      });
    });

    it('異常: 403 → 403 FORBIDDEN', async () => {
      const client = makeClient({
        saveTestResults: vi.fn().mockRejectedValue(
          Object.assign(new Error('forbidden'), { response: { status: 403 } }),
        ),
      });
      const service = makeService(client);

      await expect(service.saveTestResults('order-001', SAVE_BODY, CORRELATION_ID, TENANT_ID, AUTH_HEADER)).rejects.toMatchObject({
        status: HttpStatus.FORBIDDEN,
        response: { type: 'AUTH_ERROR', code: 'FORBIDDEN' },
      });
    });

    it('異常: タイムアウト ECONNABORTED → 504 TIMEOUT', async () => {
      const client = makeClient({
        saveTestResults: vi.fn().mockRejectedValue(
          Object.assign(new Error('timeout'), { code: 'ECONNABORTED' }),
        ),
      });
      const service = makeService(client);

      await expect(service.saveTestResults('order-001', SAVE_BODY, CORRELATION_ID, TENANT_ID, AUTH_HEADER)).rejects.toMatchObject({
        status: HttpStatus.GATEWAY_TIMEOUT,
        response: { type: 'SYSTEM_ERROR', code: 'TIMEOUT' },
      });
    });

    it('異常: ERR_NETWORK → 502 BAD_GATEWAY', async () => {
      const client = makeClient({
        saveTestResults: vi.fn().mockRejectedValue(
          Object.assign(new Error('network'), { code: 'ERR_NETWORK' }),
        ),
      });
      const service = makeService(client);

      await expect(service.saveTestResults('order-001', SAVE_BODY, CORRELATION_ID, TENANT_ID, AUTH_HEADER)).rejects.toMatchObject({
        status: HttpStatus.BAD_GATEWAY,
        response: { type: 'SYSTEM_ERROR', code: 'BAD_GATEWAY' },
      });
    });

    it('異常: 404 → 404 NOT_FOUND', async () => {
      const client = makeClient({
        saveTestResults: vi.fn().mockRejectedValue(
          Object.assign(new Error('not found'), { response: { status: 404 } }),
        ),
      });
      const service = makeService(client);

      await expect(service.saveTestResults('order-001', SAVE_BODY, CORRELATION_ID, TENANT_ID, AUTH_HEADER)).rejects.toMatchObject({
        status: HttpStatus.NOT_FOUND,
        response: { type: 'NOT_FOUND', code: 'NOT_FOUND' },
      });
    });

    it('異常: 保存失敗時はロック解放を呼ばない', async () => {
      const client = makeClient({
        saveTestResults: vi.fn().mockRejectedValue(
          Object.assign(new Error('server error'), { response: { status: 500 } }),
        ),
      });
      const service = makeService(client);

      await service.saveTestResults('order-001', SAVE_BODY, CORRELATION_ID, TENANT_ID, AUTH_HEADER).catch(() => {});

      expect(client.releaseLock).not.toHaveBeenCalled();
    });
  });

});
