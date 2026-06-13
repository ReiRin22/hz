import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { User, Calendar, Settings, FileText } from 'lucide-react';
import { MenuVisibilityTab } from '../../components/molecules/MenuVisibilityTab';

const mockMenuItems = [
  { id: '1', title: '患者基本情報', icon: User, visible: true, isFavorite: true, type: 'normal' as const },
  { id: '2', title: '患者検索', icon: Calendar, visible: true, isFavorite: false, type: 'normal' as const },
  { id: '3', title: '診療録', icon: FileText, visible: false, isFavorite: false, type: 'normal' as const },
  { id: '4', title: '設定', icon: Settings, visible: true, isFavorite: false, type: 'normal' as const },
];

const meta = {
  title: '16_ui-common/01_menu-header/01_menu/molecules/MenuVisibilityTab',
  component: MenuVisibilityTab,
  tags: ['autodocs'],
  argTypes: {
    onToggleVisibility: { action: 'visibility-toggled' },
    onMoveUp: { action: 'moved-up' },
    onMoveDown: { action: 'moved-down' },
    onMoveChildUp: { action: 'child-moved-up' },
    onMoveChildDown: { action: 'child-moved-down' },
  },
} satisfies Meta<typeof MenuVisibilityTab>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tempMenuItems: mockMenuItems,
    onToggleVisibility: fn(),
    onMoveUp: fn(),
    onMoveDown: fn(),
    onMoveChildUp: fn(),
    onMoveChildDown: fn(),
  },
};

export const AllVisible: Story = {
  args: {
    tempMenuItems: mockMenuItems.map((item) => ({ ...item, visible: true })),
    onToggleVisibility: fn(),
    onMoveUp: fn(),
    onMoveDown: fn(),
    onMoveChildUp: fn(),
    onMoveChildDown: fn(),
  },
};
