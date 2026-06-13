import type { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { useRightSideMenuStore } from '../../stores/use-right-side-menu.store';
import { RightSideMenu } from '../../components/organisms/RightSideMenu';
import type { GetRightSideMenuItemsResponse } from '@/front_bff_shared/types/response/right-side-menu.response.type';

const BASE_URL = 'http://localhost:3001/bff';

const SAMPLE_ITEMS: GetRightSideMenuItemsResponse = {
  items: [
    { id: 'item-1', label: '受付一覧', iconKey: 'list', visible: true, sortOrder: 1 },
    { id: 'item-2', label: '院内掲示板', iconKey: 'board', visible: true, sortOrder: 2 },
    { id: 'item-3', label: '伝言メモ', iconKey: 'memo', visible: true, sortOrder: 3 },
  ],
};

const COMMON_HANDLERS = [
  http.get(`${BASE_URL}/right-side-menu-items`, () =>
    HttpResponse.json(SAMPLE_ITEMS)
  ),
];

const meta = {
  title: '16_ui-common/01_menu-header/01_right-sidemenu/organisms/RightSideMenu',
  component: RightSideMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    msw: { handlers: COMMON_HANDLERS },
  },
} satisfies Meta<typeof RightSideMenu>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Collapsed: Story = {
  decorators: [
    (Story) => {
      useRightSideMenuStore.getState().reset();
      useRightSideMenuStore.getState().toggleCollapse();
      return <Story />;
    },
  ],
};

export const ApiError: Story = {
  decorators: [
    (Story) => {
      useRightSideMenuStore.getState().reset();
      return <Story />;
    },
  ],
  parameters: {
    msw: {
      handlers: [
        http.get(`${BASE_URL}/right-side-menu-items`, () =>
          HttpResponse.json({ message: 'サーバーエラー' }, { status: 500 })
        ),
      ],
    },
  },
};
