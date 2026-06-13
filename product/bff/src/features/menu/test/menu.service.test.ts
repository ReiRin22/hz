import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MenuService } from '../menu.service';
import { MenuClient } from '../menu.client';
import type { UpstreamMenuItem } from '../types/menu.type';

function makeClient(overrides: Partial<MenuClient> = {}): MenuClient {
  return Object.assign(Object.create(MenuClient.prototype) as MenuClient, {
    fetchMenuItems: vi.fn(),
    ...overrides,
  });
}

const MOCK_ITEM: UpstreamMenuItem = {
  id: '1',
  title: '患者基本情報',
  iconName: 'User',
  type: 'normal',
  visible: true,
  isFavorite: false,
  sortOrder: 1,
};

describe('MenuService', () => {
  let service: MenuService;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getMenuItems: MenuClient が正常応答を返した場合、{ items: [...] } 形式で返す', async () => {
    const client = makeClient({ fetchMenuItems: vi.fn().mockResolvedValue([MOCK_ITEM]) });
    service = new MenuService(client);

    const result = await service.getMenuItems();

    expect(result.items[0]!.id).toBe('1');
  });

  it('getMenuItems: MenuClient が空配列を返した場合、{ items: [] } を返す', async () => {
    const client = makeClient({ fetchMenuItems: vi.fn().mockResolvedValue([]) });
    service = new MenuService(client);

    const result = await service.getMenuItems();

    expect(result).toEqual({ items: [] });
  });

  it('getMenuItems: MenuClient が例外を投げた場合、エラーを伝播させる', async () => {
    const client = makeClient({ fetchMenuItems: vi.fn().mockRejectedValue(new Error('BE unreachable')) });
    service = new MenuService(client);

    await expect(service.getMenuItems()).rejects.toThrow('BE unreachable');
  });
});
