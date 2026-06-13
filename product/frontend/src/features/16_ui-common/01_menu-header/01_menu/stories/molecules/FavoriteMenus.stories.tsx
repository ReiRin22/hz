import type { Meta, StoryObj } from '@storybook/react';
import { Settings, User, Calendar } from 'lucide-react';
import { FavoriteMenus } from '../../components/molecules/FavoriteMenus';

const blueTheme = { name: 'ブルー', value: 'blue', primary: '#3B82F6', secondary: '#DBEAFE' };
const blackTheme = { name: 'ブラック', value: 'black', primary: '#9CA3AF', secondary: '#0D0D0D' };

const mockFavorites = [
  { id: '1', title: '患者基本情報', icon: User, visible: true, isFavorite: true, type: 'normal' as const, url: '/patients' },
  { id: '2', title: '患者検索', icon: Calendar, visible: true, isFavorite: true, type: 'normal' as const, url: '/search' },
  { id: '3', title: '診療録', icon: Settings, visible: true, isFavorite: true, type: 'normal' as const, url: '/records' },
];

const meta = {
  title: '16_ui-common/01_menu-header/01_menu/molecules/FavoriteMenus',
  component: FavoriteMenus,
  tags: ['autodocs'],
} satisfies Meta<typeof FavoriteMenus>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { favorites: mockFavorites, theme: blueTheme },
};

export const WithFavorites: Story = {
  args: { favorites: mockFavorites, theme: blueTheme },
};

export const Empty: Story = {
  args: { favorites: [], theme: blueTheme },
};

export const BlackTheme: Story = {
  args: { favorites: mockFavorites, theme: blackTheme },
};
