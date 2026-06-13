import type { Meta, StoryObj } from '@storybook/react';
import { User, Calendar, Building, Settings, FileText, Search } from 'lucide-react';
import { MenuItemList } from '../../components/molecules/MenuItemList';

const blueTheme = { name: 'ブルー', value: 'blue', primary: '#3B82F6', secondary: '#DBEAFE' };
const blackTheme = { name: 'ブラック', value: 'black', primary: '#9CA3AF', secondary: '#0D0D0D' };

const mockItems = [
  { id: '1', title: '患者基本情報', icon: User, visible: true, isFavorite: false, type: 'normal' as const, url: '/patients' },
  { id: '2', title: '患者検索', icon: Search, visible: true, isFavorite: false, type: 'normal' as const, url: '/search' },
  { id: '3', title: '診療録', icon: FileText, visible: true, isFavorite: false, type: 'normal' as const, url: '/records' },
  {
    id: '9',
    title: '診療科',
    icon: Building,
    visible: true,
    isFavorite: false,
    type: 'department' as const,
    children: [
      { id: '9-1', title: '内科', icon: Building, visible: true, isFavorite: false, type: 'departmentChild' as const, url: '/dept/naika', parentId: '9' },
      { id: '9-2', title: '臨床検査科', icon: Building, visible: true, isFavorite: false, type: 'departmentChild' as const, url: '/dept-instruction/lab-instruction', parentId: '9' },
      { id: '9-3', title: '放射線科', icon: Building, visible: true, isFavorite: false, type: 'departmentChild' as const, url: '/dept-instruction/radiology', parentId: '9' },
    ],
  },
  { id: '10', title: '設定', icon: Settings, visible: true, isFavorite: false, type: 'normal' as const },
];

const meta = {
  title: '16_ui-common/01_menu-header/01_menu/molecules/MenuItemList',
  component: MenuItemList,
  tags: ['autodocs'],
} satisfies Meta<typeof MenuItemList>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { items: mockItems, theme: blueTheme },
};

export const HiddenItems: Story = {
  args: {
    items: mockItems.map((item, idx) => idx === 1 ? { ...item, visible: false } : item),
    theme: blueTheme,
  },
};

export const Empty: Story = {
  args: { items: [], theme: blueTheme },
};

export const BlackTheme: Story = {
  args: { items: mockItems, theme: blackTheme },
};
