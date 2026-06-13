import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MenuClient } from '../menu.client';
import { axiosClient } from '@shared/plugins/bffAxiosClient';
import type { UpstreamMenuItem } from '../types/menu.type';

vi.mock('@shared/plugins/bffAxiosClient', () => ({
  axiosClient: { get: vi.fn() },
}));

const mockGet = vi.mocked(axiosClient.get);

const MOCK_ITEM: UpstreamMenuItem = {
  id: '1',
  title: '患者基本情報',
  iconName: 'User',
  type: 'normal',
  visible: true,
  isFavorite: false,
  sortOrder: 1,
};

describe('MenuClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetchMenuItems: axiosClient.get を "/api/v1/menu/items" で呼び出す', async () => {
    mockGet.mockResolvedValue({ data: { items: [MOCK_ITEM] } });
    const client = new MenuClient();

    await client.fetchMenuItems();

    expect(mockGet).toHaveBeenCalledWith('/api/v1/menu/items');
  });

  it('fetchMenuItems: axiosClient.get が正常応答を返した場合、items 配列を返す', async () => {
    mockGet.mockResolvedValue({ data: { items: [MOCK_ITEM] } });
    const client = new MenuClient();

    const result = await client.fetchMenuItems();

    expect(result[0]?.id).toBe('1');
  });

  it('fetchMenuItems: axiosClient.get が例外を投げた場合、エラーを伝播させる', async () => {
    mockGet.mockRejectedValue(new Error('Network Error'));
    const client = new MenuClient();

    await expect(client.fetchMenuItems()).rejects.toThrow('Network Error');
  });
});
