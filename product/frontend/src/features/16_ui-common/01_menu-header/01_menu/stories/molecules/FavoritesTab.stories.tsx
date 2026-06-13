import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Settings, User, Calendar, FileText } from 'lucide-react';
import { FavoritesTab } from '../../components/molecules/FavoritesTab';

const mockMenuItems = [
  { id: '1', title: '患者基本情報', icon: User, visible: true, isFavorite: true, type: 'normal' as const },
  { id: '2', title: '患者検索', icon: Calendar, visible: true, isFavorite: false, type: 'normal' as const },
  { id: '3', title: '診療録', icon: FileText, visible: true, isFavorite: true, type: 'normal' as const },
];

const meta = {
  title: '16_ui-common/01_menu-header/01_menu/molecules/FavoritesTab',
  component: FavoritesTab,
  tags: ['autodocs'],
  argTypes: {
    onToggleFavorite: { action: 'favorite-toggled' },
  },
} satisfies Meta<typeof FavoritesTab>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { tempMenuItems: mockMenuItems, onToggleFavorite: fn() },
};

export const AllFavorites: Story = {
  args: {
    tempMenuItems: mockMenuItems.map((item) => ({ ...item, isFavorite: true })),
    onToggleFavorite: fn(),
  },
};

export const NoneFavorites: Story = {
  args: {
    tempMenuItems: mockMenuItems.map((item) => ({ ...item, isFavorite: false })),
    onToggleFavorite: fn(),
  },
};
