import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MenuController } from '../menu.controller';
import { MenuService } from '../menu.service';
import type { GetMenuItemsResponse } from '../types/menu.api.response';

function makeService(overrides: Partial<MenuService> = {}): MenuService {
  return Object.assign(Object.create(MenuService.prototype) as MenuService, {
    getMenuItems: vi.fn(),
    ...overrides,
  });
}

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

describe('MenuController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /menu-items: MenuService が正常応答を返した場合、そのレスポンスをそのまま返す', async () => {
    const service = makeService({ getMenuItems: vi.fn().mockResolvedValue(MOCK_RESPONSE) });
    const controller = new MenuController(service);

    const result = await controller.getMenuItems();

    expect(result.items[0]!.id).toBe('1');
  });

  it('GET /menu-items: MenuService が例外を投げた場合、エラーを伝播させる', async () => {
    const service = makeService({ getMenuItems: vi.fn().mockRejectedValue(new Error('service error')) });
    const controller = new MenuController(service);

    await expect(controller.getMenuItems()).rejects.toThrow('service error');
  });
});
