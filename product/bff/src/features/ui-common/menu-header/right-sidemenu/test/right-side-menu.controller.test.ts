import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RightSideMenuController } from '../right-side-menu.controller';
import { RightSideMenuService } from '../right-side-menu.service';
import type { GetRightSideMenuItemsResponse } from '../types/right-side-menu.api.response';

const MOCK_RESPONSE: GetRightSideMenuItemsResponse = {
  items: [
    { id: '1', label: '病棟マップ', iconKey: 'map', visible: true, sortOrder: 1 },
    { id: '2', label: '受診者一覧', iconKey: 'list', visible: true, sortOrder: 2 },
    { id: '3', label: '院内掲示板', iconKey: 'board', visible: true, sortOrder: 3 },
    { id: '4', label: '伝言メモ', iconKey: 'memo', visible: true, sortOrder: 4 },
    { id: '5', label: 'システム設定', iconKey: 'settings', visible: true, sortOrder: 5 },
  ],
};

function makeService(overrides: Partial<Pick<RightSideMenuService, 'getItems'>> = {}): RightSideMenuService {
  return Object.assign(Object.create(RightSideMenuService.prototype) as RightSideMenuService, {
    getItems: vi.fn(),
    ...overrides,
  });
}

describe('RightSideMenuController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getItems: service が正常応答を返した場合、5項目を含むレスポンスを返す', async () => {
    const service = makeService({ getItems: vi.fn().mockResolvedValue(MOCK_RESPONSE) });
    const controller = new RightSideMenuController(service);

    const result = await controller.getItems();

    expect(result.items).toHaveLength(5);
  });

  it('getItems: service が例外を投げた場合、エラーを伝播させる', async () => {
    const service = makeService({ getItems: vi.fn().mockRejectedValue(new Error('BE unreachable')) });
    const controller = new RightSideMenuController(service);

    await expect(controller.getItems()).rejects.toThrow('BE unreachable');
  });
});
