import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RightSideMenuService } from '../right-side-menu.service';
import { RightSideMenuClient } from '../right-side-menu.client';
import type { UpstreamRightSideMenuItem } from '../types/right-side-menu.type';

function makeClient(overrides: Partial<RightSideMenuClient> = {}): RightSideMenuClient {
  return Object.assign(Object.create(RightSideMenuClient.prototype) as RightSideMenuClient, {
    fetchItems: vi.fn(),
    ...overrides,
  });
}

const MOCK_ITEM: UpstreamRightSideMenuItem = {
  id: '1',
  label: '病棟マップ',
  iconKey: 'map',
  visible: true,
  sortOrder: 1,
};

describe('RightSideMenuService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getItems: RightSideMenuClient が正常応答を返した場合、{ items: [...] } 形式で返す', async () => {
    const client = makeClient({ fetchItems: vi.fn().mockResolvedValue([MOCK_ITEM]) });
    const service = new RightSideMenuService(client);

    const result = await service.getItems();

    expect(result.items[0]?.id).toBe('1');
  });

  it('getItems: RightSideMenuClient が空配列を返した場合、{ items: [] } を返す', async () => {
    const client = makeClient({ fetchItems: vi.fn().mockResolvedValue([]) });
    const service = new RightSideMenuService(client);

    const result = await service.getItems();

    expect(result).toEqual({ items: [] });
  });

  it('getItems: RightSideMenuClient が例外を投げた場合、エラーを伝播させる', async () => {
    const client = makeClient({ fetchItems: vi.fn().mockRejectedValue(new Error('BE unreachable')) });
    const service = new RightSideMenuService(client);

    await expect(service.getItems()).rejects.toThrow('BE unreachable');
  });
});
