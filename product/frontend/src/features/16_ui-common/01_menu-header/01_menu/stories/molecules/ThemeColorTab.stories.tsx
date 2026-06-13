import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ThemeColorTab } from '../../components/molecules/ThemeColorTab';

const blueTheme = { name: 'ブルー', value: 'blue', primary: '#3B82F6', secondary: '#DBEAFE' };
const greenTheme = { name: 'グリーン', value: 'green', primary: '#10B981', secondary: '#D1FAE5' };
const blackTheme = { name: 'ブラック', value: 'black', primary: '#9CA3AF', secondary: '#0D0D0D' };

const meta = {
  title: '16_ui-common/01_menu-header/01_menu/molecules/ThemeColorTab',
  component: ThemeColorTab,
  tags: ['autodocs'],
  argTypes: {
    onThemeSelect: { action: 'theme-selected' },
  },
} satisfies Meta<typeof ThemeColorTab>;
export default meta;
type Story = StoryObj<typeof meta>;

export const BlueSelected: Story = {
  args: { tempTheme: blueTheme, onThemeSelect: fn() },
};

export const GreenSelected: Story = {
  args: { tempTheme: greenTheme, onThemeSelect: fn() },
};

export const BlackSelected: Story = {
  args: { tempTheme: blackTheme, onThemeSelect: fn() },
};
