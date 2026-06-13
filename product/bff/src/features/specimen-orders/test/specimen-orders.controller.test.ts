/**
 * SpecimenOrdersController テスト
 *
 * テストケースの根拠: 個別機能設計書_検体検査オーダ.xlsx ORD023 オーダー設定シート
 *   - 5.1-1: 履歴タブから項目を選択 → 過去の検査項目がオーダー候補パネルに追加される
 *   - 5.2-3: [セット]を選択 → 検査項目のセットを表示
 *   - 5.1-5: 確定へ進む押下 → オーダー送信処理を実行し、反映する
 *   - エラー①: 検査連携システムとの通信障害により、オーダーを確定できません。
 *   - エラー②: 予期しないエラーが発生しました。管理者に連絡してください。
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SpecimenHistoryController, SpecimenSetsController, SpecimenItemsMasterController } from '../specimen-orders.controller';
import { SpecimenOrdersService } from '../specimen-orders.service';
import type {
  GetSpecimenHistoryResponse,
  GetSpecimenSetsResponse,
  GetSpecimenItemsResponse,
  ConfirmSpecimenOrdersResponse,
} from '../types/specimen-orders.api.response';
import type { ConfirmSpecimenOrdersRequest } from '../types/specimen-orders.api.request';

const MOCK_CORRELATION_ID = 'corr-001';
const MOCK_TENANT_ID = 'tenant-001';
const MOCK_AUTH_HEADER = 'Bearer mock-token';

function makeService(overrides: Partial<SpecimenOrdersService> = {}): SpecimenOrdersService {
  const service = Object.create(SpecimenOrdersService.prototype) as SpecimenOrdersService;
  Object.assign(service, {
    getSpecimenHistory: vi.fn(),
    getSpecimenSets: vi.fn(),
    getSpecimenItems: vi.fn(),
    confirmSpecimenOrders: vi.fn(),
    ...overrides,
  });
  return service;
}

const MOCK_ITEMS_RESPONSE: GetSpecimenItemsResponse = {
  items: [{ code: 'CBC', name: '血算（CBC）', specimenType: 'blood', category: '血液検査' }],
};

// spec 4.3 履歴タブ: 過去検査名・診察日・検体種別を含む履歴
const MOCK_HISTORY_RESPONSE: GetSpecimenHistoryResponse = {
  history: [
    {
      id: 'history-001',
      date: '2026-05-01',
      testName: '血算（CBC）',
      orderCode: 'CBC',
      specimenType: 'blood',
      status: 'confirmed',
      confirmedAt: '2026-05-01T10:00:00Z',
      confirmedBy: 'doc1',
    },
  ],
};

// spec 4.3 セットタブ: セット名・含まれる検査項目
const MOCK_SETS_RESPONSE: GetSpecimenSetsResponse = {
  specimenSets: [
    {
      id: 'labset-1',
      name: '基本血液検査セット',
      description: '基本的な血液検査項目',
      setType: 'hospital',
      items: [],
    },
  ],
};

// spec DoD: オーダーIDがパネルに表示される
const MOCK_CONFIRM_RESPONSE: ConfirmSpecimenOrdersResponse = {
  confirmedOrders: [
    {
      id: 'ORDER-001',
      testName: '血算（CBC）',
      orderCode: 'CBC',
      specimenType: 'blood',
      status: 'confirmed',
      confirmedAt: '2026-05-01T10:00:00Z',
      confirmedBy: 'doc1',
    },
  ],
};

const MOCK_CONFIRM_REQUEST: ConfirmSpecimenOrdersRequest = {
  items: [{ specimenType: 'blood', orderCode: 'CBC', testName: '血算（CBC）' }],
  confirmedBy: 'doc1',
};

describe('SpecimenHistoryController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 5.1-1: 履歴タブから項目選択のためのデータ提供
  it('正常(5.1-1): GET /specimen-history が患者の検査履歴一覧を返す', async () => {
    const service = makeService({ getSpecimenHistory: vi.fn().mockResolvedValue(MOCK_HISTORY_RESPONSE) });
    const controller = new SpecimenHistoryController(service);

    const result = await controller.getSpecimenHistory('P001', MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);

    expect(result.history).toHaveLength(1);
  });

  it('正常: getSpecimenHistory は Service にヘッダーを渡して呼び出す', async () => {
    const mockGet = vi.fn().mockResolvedValue(MOCK_HISTORY_RESPONSE);
    const service = makeService({ getSpecimenHistory: mockGet });
    const controller = new SpecimenHistoryController(service);

    await controller.getSpecimenHistory('P001', MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);

    expect(mockGet).toHaveBeenCalledWith('P001', MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);
  });

  // 5.1-5: 確定へ進む押下でオーダー送信
  it('正常(5.1-5): POST /specimen-orders が確定済みオーダーを返す', async () => {
    const service = makeService({ confirmSpecimenOrders: vi.fn().mockResolvedValue(MOCK_CONFIRM_RESPONSE) });
    const controller = new SpecimenHistoryController(service);

    const result = await controller.confirmSpecimenOrders('P001', MOCK_CONFIRM_REQUEST, MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);

    expect(result.confirmedOrders).toHaveLength(1);
  });

  // DoD: 確定後にオーダーIDがパネルに表示される
  it('正常(DoD): POST /specimen-orders のレスポンスにオーダーIDが含まれる', async () => {
    const service = makeService({ confirmSpecimenOrders: vi.fn().mockResolvedValue(MOCK_CONFIRM_RESPONSE) });
    const controller = new SpecimenHistoryController(service);

    const result = await controller.confirmSpecimenOrders('P001', MOCK_CONFIRM_REQUEST, MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);

    expect(result.confirmedOrders.at(0)?.id).toBe('ORDER-001');
  });

  // エラー①: 検査連携システムとの通信障害
  it('異常(エラー①): 検査履歴取得時に Service がエラーを投げた場合、エラーを伝播させる', async () => {
    const service = makeService({ getSpecimenHistory: vi.fn().mockRejectedValue(new Error('通信障害')) });
    const controller = new SpecimenHistoryController(service);

    await expect(controller.getSpecimenHistory('P001', MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER)).rejects.toThrow('通信障害');
  });

  // エラー①②: オーダー確定時のエラー伝播
  it('異常(エラー①②): オーダー確定時に Service がエラーを投げた場合、エラーを伝播させる', async () => {
    const service = makeService({ confirmSpecimenOrders: vi.fn().mockRejectedValue(new Error('通信障害')) });
    const controller = new SpecimenHistoryController(service);

    await expect(controller.confirmSpecimenOrders('P001', MOCK_CONFIRM_REQUEST, MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER)).rejects.toThrow('通信障害');
  });
});

describe('SpecimenItemsMasterController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('正常: GET /specimen-items が検体項目一覧を返す', async () => {
    const service = makeService({ getSpecimenItems: vi.fn().mockResolvedValue(MOCK_ITEMS_RESPONSE) });
    const controller = new SpecimenItemsMasterController(service);

    const result = await controller.getSpecimenItems(MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);

    expect(result.items).toHaveLength(1);
  });

  it('正常: getSpecimenItems は Service にヘッダーを渡して呼び出す', async () => {
    const mockGet = vi.fn().mockResolvedValue(MOCK_ITEMS_RESPONSE);
    const service = makeService({ getSpecimenItems: mockGet });
    const controller = new SpecimenItemsMasterController(service);

    await controller.getSpecimenItems(MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);

    expect(mockGet).toHaveBeenCalledWith(MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);
  });

  it('異常(エラー①②): Service がエラーを投げた場合、エラーを伝播させる', async () => {
    const service = makeService({ getSpecimenItems: vi.fn().mockRejectedValue(new Error('通信障害')) });
    const controller = new SpecimenItemsMasterController(service);

    await expect(controller.getSpecimenItems(MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER)).rejects.toThrow('通信障害');
  });
});

describe('SpecimenSetsController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 5.2-3: [セット]選択時のデータ提供
  it('正常(5.2-3): GET /specimen-sets が検体セット一覧を返す', async () => {
    const service = makeService({ getSpecimenSets: vi.fn().mockResolvedValue(MOCK_SETS_RESPONSE) });
    const controller = new SpecimenSetsController(service);

    const result = await controller.getSpecimenSets('hospital', MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);

    expect(result.specimenSets).toHaveLength(1);
  });

  it('正常: getSpecimenSets は Service に setType とヘッダーを渡して呼び出す', async () => {
    const mockGet = vi.fn().mockResolvedValue(MOCK_SETS_RESPONSE);
    const service = makeService({ getSpecimenSets: mockGet });
    const controller = new SpecimenSetsController(service);

    await controller.getSpecimenSets('hospital', MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);

    expect(mockGet).toHaveBeenCalledWith('hospital', MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);
  });

  // エラー①②: セット取得時のエラー伝播
  it('異常(エラー①②): Service がエラーを投げた場合、エラーを伝播させる', async () => {
    const service = makeService({ getSpecimenSets: vi.fn().mockRejectedValue(new Error('通信障害')) });
    const controller = new SpecimenSetsController(service);

    await expect(controller.getSpecimenSets('hospital', MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER)).rejects.toThrow('通信障害');
  });
});
