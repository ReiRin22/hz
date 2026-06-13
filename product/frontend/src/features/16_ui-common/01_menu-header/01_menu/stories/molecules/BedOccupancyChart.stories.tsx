import type { Meta, StoryObj } from '@storybook/react';
import { BedOccupancyChart } from '../../components/molecules/BedOccupancyChart';

const blueTheme = { name: 'ブルー', value: 'blue', primary: '#3B82F6', secondary: '#DBEAFE' };
const blackTheme = { name: 'ブラック', value: 'black', primary: '#9CA3AF', secondary: '#0D0D0D' };

const meta = {
  title: '16_ui-common/01_menu-header/01_menu/molecules/BedOccupancyChart',
  component: BedOccupancyChart,
  tags: ['autodocs'],
} satisfies Meta<typeof BedOccupancyChart>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { theme: blueTheme },
};

export const BlackTheme: Story = {
  args: { theme: blackTheme },
};

export const NoTheme: Story = {
  args: {},
};
