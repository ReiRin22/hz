/**
 * SpecimenOrdersService テスト
 *
 * テストケースの根拠: 個別機能設計書_検体検査オーダ.xlsx ORD023 オーダー設定シート
 *   - 4.3 履歴タブ: 過去検査名・診察日・検体種別を含む一覧
 *   - 4.3 セットタブ: セット名・含まれる検査項目の一覧
 *   - 5.1-1: 履歴タブから項目を選択 → 過去の検査項目がオーダー候補パネルに追加される
 *   - 5.2-3: [セット]を選択 → 検査項目のセットを表示
 *   - 5.1-5: 確定へ進む押下 → オーダー送信処理を実行し、反映する
 *   - DoD: 確定後にオーダーIDがパネルに表示される
 *   - エラー①: 検査連携システムとの通信障害により、オーダーを確定できません。
 *   - エラー②: 予期しないエラーが発生しました。管理者に連絡してください。
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HttpException } from '@nestjs/common';
import { SpecimenOrdersService } from '../specimen-orders.service';
import { SpecimenOrdersClient } from '../specimen-orders.client';
import type {
  UpstreamSpecimenHistoryItem,
  UpstreamSpecimenSet,
  UpstreamConfirmedSpecimenOrder,
} from '../types/specimen-orders.type';
import type { ConfirmSpecimenOrdersRequest } from '../types/specimen-orders.api.request';

const MOCK_CORRELATION_ID = 'corr-001';
const MOCK_TENANT_ID = 'tenant-001';
const MOCK_AUTH_HEADER = 'Bearer mock-token';

function makeClient(overrides: Partial<SpecimenOrdersClient> = {}): SpecimenOrdersClient {
  const client = Object.create(SpecimenOrdersClient.prototype) as SpecimenOrdersClient;
  Object.assign(client, {
    fetchSpecimenHistory: vi.fn(),
    fetchSpecimenSets: vi.fn(),
    fetchSpecimenItems: vi.fn(),
    confirmSpecimenOrders: vi.fn(),
    ...overrides,
  });
  return client;
}

const MOCK_HISTORY_ITEM: UpstreamSpecimenHistoryItem = {
  id: 'item-001',
  date: '2026-05-01',
  testName: '血算（CBC）',
  orderCode: 'CBC',
  specimenType: 'blood',
  status: 'confirmed',
  confirmedAt: '2026-05-01T10:00:00Z',
  confirmedBy: 'doc1',
};

const MOCK_SET: UpstreamSpecimenSet = {
  id: 'labset-1',
  name: '基本血液検査セット',
  description: '基本的な血液検査項目',
  setType: 'hospital',
  items: [MOCK_HISTORY_ITEM],
};

const MOCK_CONFIRMED: UpstreamConfirmedSpecimenOrder = {
  id: 'ORDER-001',
  testName: '血算（CBC）',
  orderCode: 'CBC',
  specimenType: 'blood',
  status: 'pending',
  confirmedAt: '2026-05-01T10:00:00Z',
  confirmedBy: 'doc1',
};

const MOCK_REQUEST: ConfirmSpecimenOrdersRequest = {
  items: [{ specimenType: 'blood', orderCode: 'CBC', testName: '血算（CBC）' }],
  confirmedBy: 'doc1',
};

describe('SpecimenOrdersService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getSpecimenHistory', () => {
    it('正常: Client が UpstreamSpecimenHistoryItem[] を返した場合、history の件数が 1 になる', async () => {
      const client = makeClient({ fetchSpecimenHistory: vi.fn().mockResolvedValue([MOCK_HISTORY_ITEM]) });
      const service = new SpecimenOrdersService(client);

      const result = await service.getSpecimenHistory('P001', MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);

      expect(result.history).toHaveLength(1);
    });

    it('正常: getSpecimenHistory は Client に patientId とヘッダーを渡して呼び出す', async () => {
      const mockFetch = vi.fn().mockResolvedValue([MOCK_HISTORY_ITEM]);
      const client = makeClient({ fetchSpecimenHistory: mockFetch });
      const service = new SpecimenOrdersService(client);

      await service.getSpecimenHistory('P001', MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);

      expect(mockFetch).toHaveBeenCalledWith('P001', MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);
    });

    it('正常(4.3 履歴タブ): transformHistoryItem が id を id にマッピングする', async () => {
      const client = makeClient({ fetchSpecimenHistory: vi.fn().mockResolvedValue([MOCK_HISTORY_ITEM]) });
      const service = new SpecimenOrdersService(client);

      const result = await service.getSpecimenHistory('P001', MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);

      expect(result.history.at(0)?.id).toBe('item-001');
    });

    it('正常(4.3 履歴タブ): transformHistoryItem が date を date にマッピングする', async () => {
      const client = makeClient({ fetchSpecimenHistory: vi.fn().mockResolvedValue([MOCK_HISTORY_ITEM]) });
      const service = new SpecimenOrdersService(client);

      const result = await service.getSpecimenHistory('P001', MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);

      expect(result.history.at(0)?.date).toBe('2026-05-01');
    });

    it('正常(4.3 履歴タブ): transformHistoryItem が testName を保持する', async () => {
      const client = makeClient({ fetchSpecimenHistory: vi.fn().mockResolvedValue([MOCK_HISTORY_ITEM]) });
      const service = new SpecimenOrdersService(client);

      const result = await service.getSpecimenHistory('P001', MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);

      expect(result.history.at(0)?.testName).toBe('血算（CBC）');
    });

    it('正常(4.3 履歴タブ): transformHistoryItem が specimenType を保持する', async () => {
      const client = makeClient({ fetchSpecimenHistory: vi.fn().mockResolvedValue([MOCK_HISTORY_ITEM]) });
      const service = new SpecimenOrdersService(client);

      const result = await service.getSpecimenHistory('P001', MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);

      expect(result.history.at(0)?.specimenType).toBe('blood');
    });

    it('正常: Client が空配列を返した場合、history が空配列になる', async () => {
      const client = makeClient({ fetchSpecimenHistory: vi.fn().mockResolvedValue([]) });
      const service = new SpecimenOrdersService(client);

      const result = await service.getSpecimenHistory('P001', MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);

      expect(result.history).toEqual([]);
    });

    it('異常(エラー①②): Client が例外を投げた場合、HttpException に変換して伝播させる', async () => {
      const client = makeClient({ fetchSpecimenHistory: vi.fn().mockRejectedValue(new Error('client error')) });
      const service = new SpecimenOrdersService(client);

      await expect(service.getSpecimenHistory('P001', MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER)).rejects.toBeInstanceOf(HttpException);
    });
  });

  describe('getSpecimenSets', () => {
    it('正常(5.2-3): Client が UpstreamSpecimenSet[] を返した場合、specimenSets の件数が 1 になる', async () => {
      const client = makeClient({ fetchSpecimenSets: vi.fn().mockResolvedValue([MOCK_SET]) });
      const service = new SpecimenOrdersService(client);

      const result = await service.getSpecimenSets('hospital', MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);

      expect(result.specimenSets).toHaveLength(1);
    });

    it('正常: getSpecimenSets は Client に setType とヘッダーを渡して呼び出す', async () => {
      const mockFetch = vi.fn().mockResolvedValue([MOCK_SET]);
      const client = makeClient({ fetchSpecimenSets: mockFetch });
      const service = new SpecimenOrdersService(client);

      await service.getSpecimenSets('hospital', MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);

      expect(mockFetch).toHaveBeenCalledWith('hospital', MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);
    });

    it('正常(4.3 セットタブ): transformSet が id を id にマッピングする', async () => {
      const client = makeClient({ fetchSpecimenSets: vi.fn().mockResolvedValue([MOCK_SET]) });
      const service = new SpecimenOrdersService(client);

      const result = await service.getSpecimenSets('hospital', MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);

      expect(result.specimenSets.at(0)?.id).toBe('labset-1');
    });

    it('正常(4.3 セットタブ): transformSet が name を name にマッピングする', async () => {
      const client = makeClient({ fetchSpecimenSets: vi.fn().mockResolvedValue([MOCK_SET]) });
      const service = new SpecimenOrdersService(client);

      const result = await service.getSpecimenSets('hospital', MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);

      expect(result.specimenSets.at(0)?.name).toBe('基本血液検査セット');
    });

    it('正常(4.3 セットタブ): transformSet が items を items に変換し id を id にマッピングする', async () => {
      const client = makeClient({ fetchSpecimenSets: vi.fn().mockResolvedValue([MOCK_SET]) });
      const service = new SpecimenOrdersService(client);

      const result = await service.getSpecimenSets('hospital', MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);

      expect(result.specimenSets.at(0)?.items.at(0)?.id).toBe('item-001');
    });

    it('異常(エラー①②): Client が例外を投げた場合、HttpException に変換して伝播させる', async () => {
      const client = makeClient({ fetchSpecimenSets: vi.fn().mockRejectedValue(new Error('sets error')) });
      const service = new SpecimenOrdersService(client);

      await expect(service.getSpecimenSets('hospital', MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER)).rejects.toBeInstanceOf(HttpException);
    });
  });

  describe('getSpecimenItems', () => {
    it('正常: Client が UpstreamSpecimenItem[] を返した場合、items の件数が 1 になる', async () => {
      const mockItem: import('../types/specimen-orders.type').UpstreamSpecimenItem = {
        code: 'CBC',
        name: '血算（CBC）',
        specimenType: 'blood',
        category: '血液検査',
      };
      const client = makeClient({ fetchSpecimenItems: vi.fn().mockResolvedValue([mockItem]) });
      const service = new SpecimenOrdersService(client);

      const result = await service.getSpecimenItems(MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);

      expect(result.items).toHaveLength(1);
    });

    it('正常: getSpecimenItems は Client にヘッダーを渡して呼び出す', async () => {
      const mockFetch = vi.fn().mockResolvedValue([]);
      const client = makeClient({ fetchSpecimenItems: mockFetch });
      const service = new SpecimenOrdersService(client);

      await service.getSpecimenItems(MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);

      expect(mockFetch).toHaveBeenCalledWith(MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);
    });

    it('異常: Client が例外を投げた場合、HttpException に変換して伝播させる', async () => {
      const client = makeClient({ fetchSpecimenItems: vi.fn().mockRejectedValue(new Error('items error')) });
      const service = new SpecimenOrdersService(client);

      await expect(service.getSpecimenItems(MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER)).rejects.toBeInstanceOf(HttpException);
    });
  });

  describe('confirmSpecimenOrders', () => {
    it('正常(5.1-5): Client が UpstreamConfirmedSpecimenOrder[] を返した場合、confirmedOrders の件数が 1 になる', async () => {
      const client = makeClient({ confirmSpecimenOrders: vi.fn().mockResolvedValue([MOCK_CONFIRMED]) });
      const service = new SpecimenOrdersService(client);

      const result = await service.confirmSpecimenOrders('P001', MOCK_REQUEST, MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);

      expect(result.confirmedOrders).toHaveLength(1);
    });

    it('正常: confirmSpecimenOrders は Client に patientId・body・ヘッダーを渡して呼び出す', async () => {
      const mockConfirm = vi.fn().mockResolvedValue([MOCK_CONFIRMED]);
      const client = makeClient({ confirmSpecimenOrders: mockConfirm });
      const service = new SpecimenOrdersService(client);

      await service.confirmSpecimenOrders('P001', MOCK_REQUEST, MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);

      expect(mockConfirm).toHaveBeenCalledWith('P001', MOCK_REQUEST, MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);
    });

    it('正常(DoD): transformConfirmedOrder が id を id にマッピングする', async () => {
      const client = makeClient({ confirmSpecimenOrders: vi.fn().mockResolvedValue([MOCK_CONFIRMED]) });
      const service = new SpecimenOrdersService(client);

      const result = await service.confirmSpecimenOrders('P001', MOCK_REQUEST, MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);

      expect(result.confirmedOrders.at(0)?.id).toBe('ORDER-001');
    });

    it('正常: transformConfirmedOrder が orderStatus にかかわらず status を "confirmed" に固定する', async () => {
      const client = makeClient({ confirmSpecimenOrders: vi.fn().mockResolvedValue([MOCK_CONFIRMED]) });
      const service = new SpecimenOrdersService(client);

      const result = await service.confirmSpecimenOrders('P001', MOCK_REQUEST, MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER);

      expect(result.confirmedOrders.at(0)?.status).toBe('confirmed');
    });

    it('異常(エラー①②): Client が例外を投げた場合、HttpException に変換して伝播させる', async () => {
      const client = makeClient({ confirmSpecimenOrders: vi.fn().mockRejectedValue(new Error('confirm error')) });
      const service = new SpecimenOrdersService(client);

      await expect(service.confirmSpecimenOrders('P001', MOCK_REQUEST, MOCK_CORRELATION_ID, MOCK_TENANT_ID, MOCK_AUTH_HEADER)).rejects.toBeInstanceOf(HttpException);
    });
  });
});
