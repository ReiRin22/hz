import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RightSideMenuClient } from '../right-side-menu.client';
import { axiosClient } from '@shared/plugins/bffAxiosClient';
import type { UpstreamRightSideMenuItem } from '../types/right-side-menu.type';

vi.mock('@shared/plugins/bffAxiosClient', () => ({
  axiosClient: { get: vi.fn() },
}));

const mockGet = vi.mocked(axiosClient.get);

const MOCK_ITEM: UpstreamRightSideMenuItem = {
  id: '1',
  label: '病棟マップ',
  iconKey: 'map',
  visible: true,
  sortOrder: 1,
};

describe('RightSideMenuClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetchItems: axiosClient.get を "/api/v1/right-side-menu/items" で呼び出す', async () => {
    mockGet.mockResolvedValue({ data: { items: [MOCK_ITEM] } });
    const client = new RightSideMenuClient();

    await client.fetchItems();

    expect(mockGet).toHaveBeenCalledWith('/api/v1/right-side-menu/items');
  });

  it('fetchItems: axiosClient.get が正常応答を返した場合、items 配列を返す', async () => {
    mockGet.mockResolvedValue({ data: { items: [MOCK_ITEM] } });
    const client = new RightSideMenuClient();

    const result = await client.fetchItems();

    expect(result[0]?.id).toBe('1');
  });

  it('fetchItems: axiosClient.get が例外を投げた場合、エラーを伝播させる', async () => {
    mockGet.mockRejectedValue(new Error('Network Error'));
    const client = new RightSideMenuClient();

    await expect(client.fetchItems()).rejects.toThrow('Network Error');
  });
});
