import type { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { MenuOrganism } from '../../components/organisms/MenuOrganism';
import type { MenuItemResponse } from '@/front_bff_shared/features/ui-common/menu-header/menu/types/responses/menu.response';

const BASE_URL = 'http://localhost:3001/bff';

const MOCK_MENU_ITEMS: MenuItemResponse[] = [
  { id: '1', title: '患者基本情報', iconName: 'User', type: 'normal', visible: true, isFavorite: true, sortOrder: 1 },
  { id: '2', title: 'スケジュール', iconName: 'Calendar', type: 'normal', visible: true, isFavorite: false, sortOrder: 2 },
  { id: '3', title: 'カルテ記録', iconName: 'FileText', type: 'normal', visible: true, isFavorite: false, sortOrder: 3 },
  {
    id: '9',
    title: '部門',
    iconName: 'Building',
    type: 'department',
    visible: true,
    isFavorite: false,
    sortOrder: 9,
    children: [
      { id: '9-1', title: '臨床検査科', iconName: 'Building', type: 'departmentChild', visible: true, isFavorite: false, sortOrder: 1, url: '/dept-instruction/lab-instruction', parentId: '9' },
    ],
  },
];

export const commonHandlers = [
  http.get(`${BASE_URL}/menu-items`, () =>
    HttpResponse.json({ items: MOCK_MENU_ITEMS })
  ),
];

export const getMenuItemsErrorHandlers = [
  http.get(`${BASE_URL}/menu-items`, () =>
    HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  ),
];

const meta = {
  title: '16_ui-common/01_menu-header/01_menu/organisms/MenuOrganism',
  component: MenuOrganism,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    msw: { handlers: commonHandlers },
  },
} satisfies Meta<typeof MenuOrganism>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MenuFetchError: Story = {
  parameters: {
    msw: { handlers: getMenuItemsErrorHandlers },
  },
};
