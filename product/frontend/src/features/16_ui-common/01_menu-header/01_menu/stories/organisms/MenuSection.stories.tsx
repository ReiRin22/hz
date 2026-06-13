import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { http, HttpResponse } from 'msw';
import { MenuSection } from '../../components/organisms/MenuSection';

const blueTheme = { name: 'ブルー', value: 'blue', primary: '#3B82F6', secondary: '#DBEAFE' };
const blackTheme = { name: 'ブラック', value: 'black', primary: '#9CA3AF', secondary: '#0D0D0D' };

const mockMenuItems = [
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
  http.get('/bff/menu-items', () =>
    HttpResponse.json({ items: mockMenuItems })
  ),
];

export const getMenuItemsErrorHandlers = [
  http.get('/bff/menu-items', () =>
    HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  ),
];

const meta = {
  title: '16_ui-common/01_menu-header/01_menu/organisms/MenuSection',
  component: MenuSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    msw: { handlers: commonHandlers },
  },
  argTypes: {
    onThemeChange: { action: 'theme-changed' },
    onSettingsOpenChange: { action: 'settings-open-changed' },
  },
} satisfies Meta<typeof MenuSection>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    theme: blueTheme,
    onThemeChange: fn(),
    isSettingsOpen: false,
    onSettingsOpenChange: fn(),
  },
};

export const SettingsOpen: Story = {
  args: {
    theme: blueTheme,
    onThemeChange: fn(),
    isSettingsOpen: true,
    onSettingsOpenChange: fn(),
  },
};

export const BlackTheme: Story = {
  args: {
    theme: blackTheme,
    onThemeChange: fn(),
    isSettingsOpen: false,
    onSettingsOpenChange: fn(),
  },
};

export const MenuFetchError: Story = {
  parameters: {
    msw: { handlers: getMenuItemsErrorHandlers },
  },
  args: {
    theme: blueTheme,
    onThemeChange: fn(),
    isSettingsOpen: false,
    onSettingsOpenChange: fn(),
  },
};
