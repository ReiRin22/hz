import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useMenuItems } from '../hooks/useMenuItems';
import * as api from '../api/getMenuItems.api';

vi.mock('../api/getMenuItems.api');

const mockGetMenuItems = vi.mocked(api.getMenuItems);

const MOCK_ITEM = {
  id: '1',
  title: '患者基本情報',
  iconName: 'User',
  type: 'normal' as const,
  visible: true,
  isFavorite: false,
  sortOrder: 1,
};

describe('useMenuItems', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('初期状態では loading が true で items は空配列である', () => {
    mockGetMenuItems.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useMenuItems());

    expect(result.current.loading).toBe(true);
    expect(result.current.items).toEqual([]);
  });

  it('getMenuItems が正常応答を返した場合、loading が false になる', async () => {
    mockGetMenuItems.mockResolvedValue({ items: [MOCK_ITEM] });

    const { result } = renderHook(() => useMenuItems());

    await waitFor(() => expect(result.current.loading).toBe(false), { timeout: 3000 });
  });

  it('getMenuItems が正常応答を返した場合、items が取得したデータに更新される', async () => {
    mockGetMenuItems.mockResolvedValue({ items: [MOCK_ITEM] });

    const { result } = renderHook(() => useMenuItems());

    await waitFor(() => expect(result.current.items.length).toBe(1), { timeout: 3000 });
    expect(result.current.items[0].id).toBe('1');
  });

  it('getMenuItems がエラーを返した場合、error が設定される', async () => {
    mockGetMenuItems.mockRejectedValue(new Error('fetch failed'));

    const { result } = renderHook(() => useMenuItems());

    await waitFor(() => expect(result.current.error).toBeInstanceOf(Error), { timeout: 3000 });
  });

  it('getMenuItems がエラーを返した場合、loading が false になる', async () => {
    mockGetMenuItems.mockRejectedValue(new Error('fetch failed'));

    const { result } = renderHook(() => useMenuItems());

    await waitFor(() => expect(result.current.loading).toBe(false), { timeout: 3000 });
  });
});
