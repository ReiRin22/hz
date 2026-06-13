import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getMenuItems } from '../api/getMenuItems.api';
import { axiosClient } from '@/shared/plugins/axiosClient';
import type { GetMenuItemsResponse } from '@/front_bff_shared/features/ui-common/menu-header/menu/types/responses/menu.response';

vi.mock('@/shared/plugins/axiosClient', () => ({
  axiosClient: { get: vi.fn() },
}));

const mockGet = vi.mocked(axiosClient.get);

const MOCK_RESPONSE: GetMenuItemsResponse = {
  items: [
    {
      id: '1',
      title: '患者基本情報',
      iconName: 'User',
      type: 'normal',
      visible: true,
      isFavorite: false,
      sortOrder: 1,
    },
  ],
};

describe('getMenuItems', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('axiosClient.get が正常応答を返した場合、items 配列を含むオブジェクトを返す', async () => {
    mockGet.mockResolvedValue({ data: MOCK_RESPONSE });

    const result = await getMenuItems();

    expect(result.items[0].id).toBe('1');
  });

  it('axiosClient.get が例外を投げた場合、そのエラーを伝播させる', async () => {
    mockGet.mockRejectedValue(new Error('Network Error'));

    await expect(getMenuItems()).rejects.toThrow('Network Error');
  });
});
